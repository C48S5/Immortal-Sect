extends Node
## Manages 12 Tribulation Challenges — modified Ascension runs with
## restrictions that award permanent bonuses on completion.

signal challenge_updated(challenge_id: int)

## challenge_id -> { completed: bool, active: bool, current_earnings: float }
var challenges: Dictionary = {}

const TOTAL_CHALLENGES: int = 12

# Challenge definitions: id -> { target: float, reward_type: String, reward_value: float, ... }
# Targets from GDD Section 8.2 (in raw float; use BigNumber for production).
const CHALLENGE_DEFS: Dictionary = {
	1:  { "name": "Scattered Qi",       "target": 1e12,  "reward": { "type": "allIncomeMult", "value": 2.0 } },
	2:  { "name": "Broken Body",        "target": 1e13,  "reward": { "type": "hallProfitMult", "hall_id": 2, "value": 3.0 } },
	3:  { "name": "Failed Refinement",  "target": 1e14,  "reward": { "type": "aeGenMult", "value": 1.5 } },
	4:  { "name": "Shattered Arrays",   "target": 1e15,  "reward": { "type": "sectHarmonyMult", "value": 2.0 } },
	5:  { "name": "Feral Beasts",       "target": 1e16,  "reward": { "type": "hallMilestoneMult", "hall_id": 5, "value": 2.0 } },
	6:  { "name": "Faded Inscriptions", "target": 1e17,  "reward": { "type": "talismanDurationMult", "value": 2.0 } },
	7:  { "name": "Dull Blade",         "target": 1e18,  "reward": { "type": "hallProfitMult", "hall_id": 7, "value": 5.0 } },
	8:  { "name": "Calm Skies",         "target": 1e19,  "reward": { "type": "freeSpeedDoubling", "value": 1.0 } },
	9:  { "name": "Anchored",           "target": 1e20,  "reward": { "type": "offlineEarningsMult", "value": 3.0 } },
	10: { "name": "Soulless",           "target": 1e21,  "reward": { "type": "daoPathMultBonus", "value": 0.5 } },
	11: { "name": "Blank Pages",        "target": 1e22,  "reward": { "type": "autobuyerSpeedMult", "value": 2.0 } },
	12: { "name": "Dao Severed",        "target": 1e23,  "reward": { "type": "hdpMult", "value": 2.0 } },
}


func _ready() -> void:
	init_challenges()


func init_challenges() -> void:
	challenges.clear()
	for id: int in range(1, TOTAL_CHALLENGES + 1):
		challenges[id] = {
			"completed": false,
			"active": false,
			"current_earnings": 0.0,
		}


func enter_challenge(challenge_id: int) -> void:
	if challenge_id < 1 or challenge_id > TOTAL_CHALLENGES:
		return
	if challenges[challenge_id]["completed"]:
		return
	if get_active_challenge() != -1:
		return

	challenges[challenge_id]["active"] = true
	challenges[challenge_id]["current_earnings"] = 0.0
	challenge_updated.emit(challenge_id)


func exit_challenge(challenge_id: int) -> void:
	if challenge_id < 1 or challenge_id > TOTAL_CHALLENGES:
		return
	challenges[challenge_id]["active"] = false
	challenge_updated.emit(challenge_id)


func add_challenge_earnings(amount: float) -> void:
	var active_id: int = get_active_challenge()
	if active_id == -1:
		return

	challenges[active_id]["current_earnings"] += amount

	var def: Dictionary = CHALLENGE_DEFS.get(active_id, {})
	var target: float = def.get("target", INF)

	if challenges[active_id]["current_earnings"] >= target:
		challenges[active_id]["completed"] = true
		challenges[active_id]["active"] = false
		challenge_updated.emit(active_id)


func get_active_challenge() -> int:
	for id: int in challenges:
		if challenges[id]["active"]:
			return id
	return -1


func is_completed(challenge_id: int) -> bool:
	if not challenges.has(challenge_id):
		return false
	return challenges[challenge_id]["completed"]


func get_reward_multiplier_for_hall(hall_id: int) -> float:
	var mult: float = 1.0
	for id: int in challenges:
		if not challenges[id]["completed"]:
			continue
		var def: Dictionary = CHALLENGE_DEFS.get(id, {})
		var reward: Dictionary = def.get("reward", {})
		var reward_type: String = reward.get("type", "")

		match reward_type:
			"hallProfitMult":
				if reward.get("hall_id", -1) == hall_id:
					mult *= reward.get("value", 1.0)
			"allIncomeMult":
				mult *= reward.get("value", 1.0)
	return mult


## Returns all completed challenge rewards as an array of dictionaries.
func get_all_completed_rewards() -> Array:
	var rewards: Array = []
	for id: int in challenges:
		if challenges[id]["completed"]:
			var def: Dictionary = CHALLENGE_DEFS.get(id, {})
			rewards.append(def.get("reward", {}))
	return rewards


func get_save_data() -> Dictionary:
	var save: Dictionary = {}
	for id: int in challenges:
		save[id] = challenges[id].duplicate()
	return save


func load_save_data(data: Dictionary) -> void:
	for key: Variant in data:
		var id: int = int(key)
		if challenges.has(id):
			challenges[id] = data[key].duplicate()
