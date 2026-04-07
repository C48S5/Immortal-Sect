extends Node
## Manages the gacha disciple roster — summoning, assignment, death, and
## hall bonus calculation.  See GDD Disciple System doc.

signal disciple_pulled(config_id: String)
signal roster_changed

## Array of disciple instances:
## { instance_id: int, config_id: String, assigned_hall_id: int,
##   alive: bool, absorbed_abilities: Array, deployed_realm_id: int,
##   injured: bool, injury_heals_at: float }
var roster: Array = []

var total_pulls: int = 0
var pulls_since_pity: int = 0

var _next_instance_id: int = 1

const SINGLE_PULL_COST: int = 300
const TEN_PULL_COST: int = 2700
const PITY_THRESHOLD: int = 50
const SPARK_THRESHOLD: int = 300

const PULL_RATES: Dictionary = {
	"common":    0.52,
	"uncommon":  0.25,
	"rare":      0.15,
	"epic":      0.06,
	"legendary": 0.02,
}

const RARITY_MULT: Dictionary = {
	"common":    1.05,
	"uncommon":  1.12,
	"rare":      1.25,
	"epic":      1.50,
	"legendary": 2.00,
}

const QI_RESIDUE_ON_DEATH: Dictionary = {
	"common":    1,
	"uncommon":  3,
	"rare":      0,
	"epic":      0,
	"legendary": 0,
}

const MAX_DISCIPLE_BONUS: float = 5.0


func _ready() -> void:
	pass


func pull_single() -> Dictionary:
	if not _can_afford_pull(SINGLE_PULL_COST):
		return {}
	GameManager.spend_recruitment_tokens(SINGLE_PULL_COST)
	var disciple: Dictionary = _execute_pull()
	return disciple


func pull_ten() -> Array:
	if not _can_afford_pull(TEN_PULL_COST):
		return []
	GameManager.spend_recruitment_tokens(TEN_PULL_COST)

	var results: Array = []
	var has_rare_plus: bool = false
	for i: int in range(10):
		var disciple: Dictionary = _execute_pull()
		results.append(disciple)
		var rarity: String = _get_rarity_for_config(disciple.get("config_id", ""))
		if rarity in ["rare", "epic", "legendary"]:
			has_rare_plus = true

	if not has_rare_plus and results.size() > 0:
		var idx: int = randi() % results.size()
		_remove_from_roster(results[idx]["instance_id"])
		var guaranteed: Dictionary = _create_disciple(_roll_rarity_minimum("rare"))
		results[idx] = guaranteed

	return results


func assign_to_hall(instance_id: int, hall_id: int) -> void:
	for i: int in range(roster.size()):
		if roster[i]["instance_id"] == instance_id:
			roster[i]["assigned_hall_id"] = hall_id
			roster_changed.emit()
			return


func kill_disciple(instance_id: int) -> void:
	for i: int in range(roster.size()):
		if roster[i]["instance_id"] != instance_id:
			continue
		var disciple: Dictionary = roster[i]
		disciple["alive"] = false

		var config_id: String = disciple.get("config_id", "")
		var rarity: String = _get_rarity_for_config(config_id)

		var qr: int = QI_RESIDUE_ON_DEATH.get(rarity, 0)
		if qr > 0:
			GameManager.add_qi_residue(qr)

		if rarity in ["rare", "epic", "legendary"]:
			var fragment: Dictionary = _create_legacy_fragment(disciple, rarity)
			LegacyManager.add_fragment(fragment)

		roster.remove_at(i)
		roster_changed.emit()
		return


func get_disciple_bonus_for_hall(hall_id: int) -> float:
	var assigned: Dictionary = _get_assigned_disciple(hall_id)
	if assigned.is_empty():
		return 1.0

	var config_id: String = assigned.get("config_id", "")
	var rarity: String = _get_rarity_for_config(config_id)
	var rarity_mult: float = RARITY_MULT.get(rarity, 1.0)
	var element_match: float = _calc_element_match(config_id, hall_id)

	var bonus: float = rarity_mult * element_match
	return minf(bonus, MAX_DISCIPLE_BONUS)


# ── Internal helpers ──────────────────────────────────────────────────

func _can_afford_pull(cost: int) -> bool:
	return GameManager.get_recruitment_tokens() >= cost


func _execute_pull() -> Dictionary:
	total_pulls += 1
	pulls_since_pity += 1

	var rarity: String = _roll_rarity()

	if pulls_since_pity >= PITY_THRESHOLD:
		if rarity not in ["epic", "legendary"]:
			rarity = "epic"

	if rarity in ["epic", "legendary"]:
		pulls_since_pity = 0

	var disciple: Dictionary = _create_disciple(rarity)
	disciple_pulled.emit(disciple["config_id"])
	return disciple


func _roll_rarity() -> String:
	var roll: float = randf()
	var cumulative: float = 0.0
	for r: String in ["legendary", "epic", "rare", "uncommon", "common"]:
		cumulative += PULL_RATES[r]
		if roll <= cumulative:
			return r
	return "common"


func _roll_rarity_minimum(min_rarity: String) -> String:
	var eligible: Array = []
	var found: bool = false
	for r: String in ["common", "uncommon", "rare", "epic", "legendary"]:
		if r == min_rarity:
			found = true
		if found:
			eligible.append(r)

	if eligible.is_empty():
		return min_rarity

	var total_weight: float = 0.0
	for r: String in eligible:
		total_weight += PULL_RATES[r]

	var roll: float = randf() * total_weight
	var cumulative: float = 0.0
	for r: String in eligible:
		cumulative += PULL_RATES[r]
		if roll <= cumulative:
			return r
	return min_rarity


func _create_disciple(rarity: String) -> Dictionary:
	var config_id: String = _pick_config_for_rarity(rarity)
	var disciple: Dictionary = {
		"instance_id": _next_instance_id,
		"config_id": config_id,
		"assigned_hall_id": 0,
		"alive": true,
		"absorbed_abilities": [],
		"deployed_realm_id": 0,
		"injured": false,
		"injury_heals_at": 0.0,
	}
	_next_instance_id += 1
	roster.append(disciple)
	roster_changed.emit()
	return disciple


func _pick_config_for_rarity(rarity: String) -> String:
	if not GameData.has_method("get_disciples_by_rarity"):
		return rarity + "_default"
	var pool: Array = GameData.get_disciples_by_rarity(rarity)
	if pool.is_empty():
		return rarity + "_default"
	return pool[randi() % pool.size()]


func _get_assigned_disciple(hall_id: int) -> Dictionary:
	for d: Dictionary in roster:
		if d["assigned_hall_id"] == hall_id and d["alive"]:
			return d
	return {}


func _get_rarity_for_config(config_id: String) -> String:
	if GameData.has_method("get_disciple_rarity"):
		return GameData.get_disciple_rarity(config_id)
	for rarity: String in PULL_RATES:
		if config_id.begins_with(rarity):
			return rarity
	return "common"


func _calc_element_match(config_id: String, hall_id: int) -> float:
	if not GameData.has_method("get_disciple_element"):
		return 1.0
	if not GameData.has_method("get_hall_element"):
		return 1.0
	var disciple_element: String = GameData.get_disciple_element(config_id)
	var hall_element: String = GameData.get_hall_element(hall_id)

	if hall_element == "neutral":
		return 1.25
	if disciple_element == hall_element:
		return 2.0
	return 1.0


func _remove_from_roster(instance_id: int) -> void:
	for i: int in range(roster.size()):
		if roster[i]["instance_id"] == instance_id:
			roster.remove_at(i)
			return


func _create_legacy_fragment(disciple: Dictionary, rarity: String) -> Dictionary:
	var lp_values: Dictionary = { "rare": 1, "epic": 10, "legendary": 50 }
	var fragment_types: Dictionary = { "rare": "minor", "epic": "major", "legendary": "mythic" }
	return {
		"config_id": disciple.get("config_id", ""),
		"fragment_type": fragment_types.get(rarity, "minor"),
		"legacy_power_value": lp_values.get(rarity, 1),
		"assigned_hall_id": disciple.get("assigned_hall_id", 0),
	}


func get_save_data() -> Dictionary:
	return {
		"roster": roster.duplicate(true),
		"total_pulls": total_pulls,
		"pulls_since_pity": pulls_since_pity,
		"_next_instance_id": _next_instance_id,
	}


func load_save_data(data: Dictionary) -> void:
	roster = data.get("roster", []).duplicate(true)
	total_pulls = data.get("total_pulls", 0)
	pulls_since_pity = data.get("pulls_since_pity", 0)
	_next_instance_id = data.get("_next_instance_id", 1)
	roster_changed.emit()
