extends Node
## Manages daily missions — 3 random tasks refreshed each calendar day,
## plus a daily check-in reward.  See GDD Section 15.1.

signal missions_refreshed
signal mission_completed(config_id: String)

## Array of { config_id: String, progress: float, target: float,
##            completed: bool, claimed: bool, mission_type: String,
##            reward_rt: int, reward_ae: int, description: String }
var missions: Array = []

var last_refresh_date: String = ""
var daily_check_in_claimed: bool = false

const MISSIONS_PER_DAY: int = 3
const DAILY_CHECK_IN_RT: int = 300

const MISSION_POOL: Array = [
	{ "config_id": "catch_treasures",    "mission_type": "catch_treasure",  "target": 10.0,  "reward_rt": 100, "reward_ae": 20,  "description": "Catch 10 Heavenly Treasures" },
	{ "config_id": "level_halls_50",     "mission_type": "level_hall",      "target": 50.0,  "reward_rt": 120, "reward_ae": 25,  "description": "Buy 50 hall levels" },
	{ "config_id": "craft_pills_3",      "mission_type": "craft_pill",      "target": 3.0,   "reward_rt": 80,  "reward_ae": 30,  "description": "Craft 3 pills" },
	{ "config_id": "earn_ss_1m",         "mission_type": "earn_ss",         "target": 1e6,   "reward_rt": 100, "reward_ae": 15,  "description": "Earn 1M Spirit Stones" },
	{ "config_id": "hire_elder",         "mission_type": "hire_elder",      "target": 1.0,   "reward_rt": 100, "reward_ae": 10,  "description": "Hire an Elder" },
	{ "config_id": "push_realm_floor",   "mission_type": "push_floor",     "target": 3.0,   "reward_rt": 150, "reward_ae": 40,  "description": "Clear 3 Secret Realm floors" },
	{ "config_id": "use_dao_spell",      "mission_type": "use_spell",      "target": 2.0,   "reward_rt": 80,  "reward_ae": 10,  "description": "Use Dao Path spell 2 times" },
	{ "config_id": "reach_milestone",    "mission_type": "reach_milestone", "target": 3.0,   "reward_rt": 120, "reward_ae": 20,  "description": "Reach 3 milestones" },
	{ "config_id": "collect_idle_realm", "mission_type": "collect_idle",    "target": 1.0,   "reward_rt": 80,  "reward_ae": 15,  "description": "Collect Secret Realm idle rewards" },
	{ "config_id": "pull_disciple",      "mission_type": "pull_disciple",   "target": 3.0,   "reward_rt": 100, "reward_ae": 10,  "description": "Summon 3 disciples" },
]


func _ready() -> void:
	refresh_if_needed()


func refresh_if_needed() -> void:
	var today: String = _get_today_string()
	if today == last_refresh_date:
		return

	last_refresh_date = today
	daily_check_in_claimed = false
	missions.clear()

	var pool: Array = MISSION_POOL.duplicate()
	pool.shuffle()

	var count: int = mini(MISSIONS_PER_DAY, pool.size())
	for i: int in range(count):
		var def: Dictionary = pool[i]
		missions.append({
			"config_id": def["config_id"],
			"mission_type": def["mission_type"],
			"progress": 0.0,
			"target": def["target"],
			"completed": false,
			"claimed": false,
			"reward_rt": def["reward_rt"],
			"reward_ae": def["reward_ae"],
			"description": def["description"],
		})

	missions_refreshed.emit()


func add_progress(mission_type: String, amount: float) -> void:
	for i: int in range(missions.size()):
		var m: Dictionary = missions[i]
		if m["mission_type"] != mission_type:
			continue
		if m["completed"]:
			continue

		m["progress"] = minf(m["progress"] + amount, m["target"])
		if m["progress"] >= m["target"]:
			m["completed"] = true
			mission_completed.emit(m["config_id"])


func claim_mission(index: int) -> bool:
	if index < 0 or index >= missions.size():
		return false

	var m: Dictionary = missions[index]
	if not m["completed"] or m["claimed"]:
		return false

	m["claimed"] = true
	GameManager.add_recruitment_tokens(m["reward_rt"])
	GameManager.add_alchemy_essence(m["reward_ae"])
	return true


func claim_daily_check_in() -> bool:
	refresh_if_needed()
	if daily_check_in_claimed:
		return false

	daily_check_in_claimed = true
	GameManager.add_recruitment_tokens(DAILY_CHECK_IN_RT)
	return true


func _get_today_string() -> String:
	var dt: Dictionary = Time.get_datetime_dict_from_system()
	return "%04d-%02d-%02d" % [dt["year"], dt["month"], dt["day"]]


func get_save_data() -> Dictionary:
	return {
		"missions": missions.duplicate(true),
		"last_refresh_date": last_refresh_date,
		"daily_check_in_claimed": daily_check_in_claimed,
	}


func load_save_data(data: Dictionary) -> void:
	missions = data.get("missions", []).duplicate(true)
	last_refresh_date = data.get("last_refresh_date", "")
	daily_check_in_claimed = data.get("daily_check_in_claimed", false)
