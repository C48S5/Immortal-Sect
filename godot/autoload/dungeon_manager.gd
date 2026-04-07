extends Node
## Manages the five Secret Realms — idle farming, push attempts, key
## regeneration, and floor progression.  See GDD Disciple System Section 5.

signal realm_updated(realm_id: int)

## realm_id -> { highest_floor_ever, highest_floor_this_run,
##   idle_farming_disciple_ids: Array, uncollected_idle_hours: float,
##   realm_keys: int, last_key_regen_timestamp: float }
var realms: Dictionary = {}

const TOTAL_REALMS: int = 5
const MAX_IDLE_HOURS: float = 12.0
const MAX_KEYS: int = 10
const KEY_REGEN_SECONDS: float = 14400.0  # 4 hours
const FLOORS_PER_REALM: int = 100

const IDLE_REWARD_TABLE: Array = [
	{ "floor": 10,  "ss_per_hour": 500.0,  "rt_per_hour": 10.0, "ae_per_hour": 2.0 },
	{ "floor": 25,  "ss_per_hour": 5000.0, "rt_per_hour": 25.0, "ae_per_hour": 10.0 },
	{ "floor": 50,  "ss_per_hour": 1e5,    "rt_per_hour": 50.0, "ae_per_hour": 50.0 },
	{ "floor": 75,  "ss_per_hour": 1e7,    "rt_per_hour": 100.0,"ae_per_hour": 200.0 },
	{ "floor": 100, "ss_per_hour": 1e9,    "rt_per_hour": 200.0,"ae_per_hour": 1000.0 },
]

const ENEMY_SCALING: Dictionary = {
	"base_hp": 100.0,
	"hp_growth": 1.08,
	"base_atk": 20.0,
	"atk_growth": 1.07,
	"base_def": 15.0,
	"def_growth": 1.06,
}


func _ready() -> void:
	init_realms()


func init_realms() -> void:
	realms.clear()
	for id: int in range(1, TOTAL_REALMS + 1):
		realms[id] = {
			"highest_floor_ever": 0,
			"highest_floor_this_run": 0,
			"idle_farming_disciple_ids": [],
			"uncollected_idle_hours": 0.0,
			"realm_keys": MAX_KEYS,
			"last_key_regen_timestamp": Time.get_unix_time_from_system(),
		}


func push_floor(realm_id: int) -> Dictionary:
	if not realms.has(realm_id):
		return { "success": false, "reason": "invalid_realm" }

	var realm: Dictionary = realms[realm_id]
	if realm["realm_keys"] <= 0:
		return { "success": false, "reason": "no_keys" }

	var next_floor: int = realm["highest_floor_this_run"] + 1
	if next_floor > FLOORS_PER_REALM:
		return { "success": false, "reason": "max_floor" }

	realm["realm_keys"] -= 1

	var enemy_power: float = _calc_enemy_power(next_floor)
	var team_power: float = _calc_team_power(realm_id)
	var success: bool = team_power >= enemy_power

	var result: Dictionary = {
		"success": success,
		"floor": next_floor,
		"enemy_power": enemy_power,
		"team_power": team_power,
	}

	if success:
		realm["highest_floor_this_run"] = next_floor
		if next_floor > realm["highest_floor_ever"]:
			realm["highest_floor_ever"] = next_floor
		result["rewards"] = _get_push_rewards(next_floor)
	else:
		result["rewards"] = {}

	realm_updated.emit(realm_id)
	return result


func collect_idle_rewards(realm_id: int) -> Dictionary:
	if not realms.has(realm_id):
		return {}

	var realm: Dictionary = realms[realm_id]
	var hours: float = realm["uncollected_idle_hours"]
	if hours <= 0.0:
		return {}

	var highest: int = realm["highest_floor_ever"]
	var rates: Dictionary = _get_idle_rates(highest)

	var rewards: Dictionary = {
		"spirit_stones": rates.get("ss_per_hour", 0.0) * hours,
		"recruitment_tokens": rates.get("rt_per_hour", 0.0) * hours,
		"alchemy_essence": rates.get("ae_per_hour", 0.0) * hours,
	}

	realm["uncollected_idle_hours"] = 0.0
	realm_updated.emit(realm_id)
	return rewards


func tick_idle_farming(delta: float) -> void:
	var delta_hours: float = delta / 3600.0
	for id: int in realms:
		var realm: Dictionary = realms[id]
		if realm["idle_farming_disciple_ids"].size() > 0:
			realm["uncollected_idle_hours"] = minf(
				realm["uncollected_idle_hours"] + delta_hours,
				MAX_IDLE_HOURS
			)


func tick_key_regen(delta: float) -> void:
	var now: float = Time.get_unix_time_from_system()
	for id: int in realms:
		var realm: Dictionary = realms[id]
		if realm["realm_keys"] >= MAX_KEYS:
			realm["last_key_regen_timestamp"] = now
			continue

		var elapsed: float = now - realm["last_key_regen_timestamp"]
		var keys_to_add: int = int(elapsed / KEY_REGEN_SECONDS)
		if keys_to_add > 0:
			realm["realm_keys"] = mini(realm["realm_keys"] + keys_to_add, MAX_KEYS)
			realm["last_key_regen_timestamp"] = now - fmod(elapsed, KEY_REGEN_SECONDS)
			realm_updated.emit(id)


func _process(delta: float) -> void:
	tick_idle_farming(delta)
	tick_key_regen(delta)


# ── Helpers ───────────────────────────────────────────────────────────

func _calc_enemy_power(floor_num: int) -> float:
	var hp: float = ENEMY_SCALING["base_hp"] * pow(ENEMY_SCALING["hp_growth"], floor_num - 1)
	var atk: float = ENEMY_SCALING["base_atk"] * pow(ENEMY_SCALING["atk_growth"], floor_num - 1)
	var def: float = ENEMY_SCALING["base_def"] * pow(ENEMY_SCALING["def_growth"], floor_num - 1)
	return hp + atk * 2.0 + def


func _calc_team_power(realm_id: int) -> float:
	var realm: Dictionary = realms[realm_id]
	var total: float = 0.0
	for disciple_id: int in realm.get("idle_farming_disciple_ids", []):
		total += 100.0  # placeholder: integrate with DiscipleManager stats
	return total


func _get_idle_rates(highest_floor: int) -> Dictionary:
	var best: Dictionary = { "ss_per_hour": 0.0, "rt_per_hour": 0.0, "ae_per_hour": 0.0 }
	for entry: Dictionary in IDLE_REWARD_TABLE:
		if highest_floor >= entry["floor"]:
			best = entry
	return best


func _get_push_rewards(floor_num: int) -> Dictionary:
	var tier: int
	if floor_num <= 10:
		tier = 0
	elif floor_num <= 25:
		tier = 1
	elif floor_num <= 50:
		tier = 2
	elif floor_num <= 75:
		tier = 3
	else:
		tier = 4

	var reward_tiers: Array = [
		{ "ss": 1000.0,  "rt": 30,  "ae": 5 },
		{ "ss": 25000.0, "rt": 60,  "ae": 25 },
		{ "ss": 5e5,     "rt": 100, "ae": 100 },
		{ "ss": 5e7,     "rt": 150, "ae": 500 },
		{ "ss": 5e9,     "rt": 250, "ae": 2000 },
	]

	if tier >= reward_tiers.size():
		tier = reward_tiers.size() - 1
	return reward_tiers[tier]


func reset_run_progress() -> void:
	for id: int in realms:
		realms[id]["highest_floor_this_run"] = 0


func get_save_data() -> Dictionary:
	var save: Dictionary = {}
	for id: int in realms:
		save[id] = realms[id].duplicate(true)
	return save


func load_save_data(data: Dictionary) -> void:
	for key: Variant in data:
		var id: int = int(key)
		if realms.has(id):
			realms[id] = data[key].duplicate(true)
