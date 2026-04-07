extends Node

## Static game data - all hall, elder, milestone, dao path, alchemy, and challenge configs.

const BN = preload("res://src/core/big_number.gd")

var hall_configs: Array[Dictionary] = []
var elder_configs: Array[Dictionary] = []
var milestone_configs: Dictionary = {}
var sect_harmony_configs: Array[Dictionary] = []
var dao_path_configs: Array[Dictionary] = []
var alchemy_configs: Array[Dictionary] = []
var challenge_configs: Array[Dictionary] = []

func _ready() -> void:
	_init_hall_configs()
	_init_elder_configs()
	_init_milestone_configs()
	_init_sect_harmony_configs()
	_init_dao_path_configs()
	_init_alchemy_configs()
	_init_challenge_configs()

func _init_hall_configs() -> void:
	hall_configs = [
		_hall(1, "Qi Gathering Pavilion", 4, 1.07, 1.0, 0.08, "neutral",
			"The foundation of any sect. Disciples gather ambient qi here."),
		_hall(2, "Body Tempering Dojo", 26, 1.15, 3.0, 0.49, "earth",
			"A brutal training ground where cultivators forge their physical vessels."),
		_hall(3, "Alchemy Furnace Chamber", 182, 1.13, 6.0, 3.25, "fire",
			"Pill refinement hall. Generates Alchemy Essence alongside Spirit Stones."),
		_hall(4, "Formation Array Hall", 1274, 1.12, 12.0, 20.55, "earth",
			"Masters of protective and offensive formations reduce costs for the sect."),
		_hall(5, "Spirit Beast Garden", 8918, 1.11, 24.0, 120.51, "wood",
			"A menagerie of spiritual beasts that generate resources."),
		_hall(6, "Talisman Inscription Studio", 62426, 1.10, 36.0, 725.88, "metal",
			"Calligraphers inscribe powerful talismans."),
		_hall(7, "Sword Refinement Peak", 436982, 1.11, 48.0, 4459, "metal",
			"The highest peak where sword cultivators hone their blades."),
		_hall(8, "Tribulation Lightning Tower", 3058874, 1.10, 96.0, 20951, "fire",
			"A tower that harnesses tribulation lightning for breakthroughs."),
		_hall(9, "Void Meditation Sanctum", 21412118, 1.09, 192.0, 88480, "water",
			"A pocket dimension where time flows differently."),
		_hall(10, "Soul Tempering Pagoda", 149884826, 1.09, 384.0, 345357, "water",
			"A pagoda that tempers the soul."),
		_hall(11, "Celestial Inscription Library", 1124136195, 1.08, 512.0, 2000242, "wood",
			"An ancient library containing celestial inscriptions."),
		_hall(12, "Dao Comprehension Throne", 8993089560.0, 1.07, 768.0, 10993997, "neutral",
			"The seat of ultimate enlightenment."),
	]

func _hall(id: int, name: String, base_cost: float, coeff: float,
		cycle_s: float, base_rev: float, element: String, desc: String) -> Dictionary:
	return {
		"id": id, "name": name,
		"base_cost": BN.new(base_cost),
		"coefficient": coeff,
		"cycle_seconds": cycle_s,
		"base_revenue": BN.new(base_rev),
		"element": element,
		"description": desc
	}

func _init_elder_configs() -> void:
	elder_configs = [
		_elder(1, "Elder Qin", "Qi Master", 1, 1000),
		_elder(2, "Master Iron Fist", "Body Cultivator", 2, 15000),
		_elder(3, "Grandmaster Huo", "Pill Saint", 3, 100000),
		_elder(4, "Formation Sage Wei", "Array Master", 4, 750000),
		_elder(5, "Beast Tamer Liu", "Spirit Beast Master", 5, 5e6),
		_elder(6, "Talisman Master Xu", "Inscription Sage", 6, 35e6),
		_elder(7, "Sword Saint Jian", "Sword Immortal", 7, 250e6),
		_elder(8, "Lightning Elder Zhao", "Tribulation Sovereign", 8, 1.75e9),
		_elder(9, "Void Walker Chen", "Void Sage", 9, 12.5e9),
		_elder(10, "Soul Sage Bai", "Soul Cultivator", 10, 87.5e9),
		_elder(11, "Celestial Scribe Lin", "Celestial Recorder", 11, 625e9),
		_elder(12, "Dao Ancestor", "Dao Progenitor", 12, 5e12),
	]

func _elder(id: int, n: String, title: String, hall_id: int, cost: float) -> Dictionary:
	return {"id": id, "name": n, "title": title, "hall_id": hall_id, "cost": BN.new(cost)}

func _init_milestone_configs() -> void:
	milestone_configs[1] = _parse_milestones([
		[25,"speed",2], [50,"speed",2], [100,"speed",2], [150,"profit",2],
		[200,"speed",2], [250,"profit",2], [300,"speed",2], [350,"profit",3],
		[400,"speed",2], [500,"profit",4], [600,"profit",4], [700,"profit",4],
		[800,"profit",5], [900,"profit",5], [1000,"profit",10],
		[1250,"profit",10], [1500,"profit",20], [2000,"profit",50],
		[2500,"profit",100], [3000,"profit",200],
	])
	milestone_configs[2] = _parse_milestones([
		[25,"speed",2], [50,"speed",2], [100,"speed",2], [200,"profit",2],
		[300,"speed",2], [400,"allProfit",2], [500,"profit",3],
		[600,"allProfit",2], [800,"allProfit",2], [1000,"allProfit",3],
		[1200,"profit",4], [1500,"allProfit",5], [2000,"allProfit",10],
		[2500,"allProfit",25], [3000,"allProfit",50],
	])
	milestone_configs[3] = _parse_milestones([
		[25,"speed",2], [50,"speed",2], [75,"speed",2], [100,"speed",2],
		[150,"profit",2], [200,"profit",2], [300,"speed",2], [400,"profit",3],
		[500,"speed",2], [600,"profit",4], [800,"profit",5], [1000,"profit",10],
		[1250,"profit",10], [1500,"profit",20], [2000,"profit",50],
	])
	for hall_id in range(4, 13):
		milestone_configs[hall_id] = _parse_milestones([
			[25,"speed",2], [50,"speed",2], [100,"speed",2], [200,"profit",2],
			[300,"speed",2], [400,"profit",3], [500,"profit",4],
			[600,"profit",4], [800,"profit",5], [1000,"profit",10],
			[1500,"profit",20], [2000,"profit",50],
		])

func _parse_milestones(arr: Array) -> Array[Dictionary]:
	var result: Array[Dictionary] = []
	for m in arr:
		result.append({
			"level": m[0],
			"effect_type": m[1],
			"multiplier": m[2],
		})
	return result

func _init_sect_harmony_configs() -> void:
	sect_harmony_configs = [
		{"min_level": 25, "multiplier": 2},
		{"min_level": 50, "multiplier": 2},
		{"min_level": 100, "multiplier": 3},
		{"min_level": 200, "multiplier": 5},
		{"min_level": 400, "multiplier": 10},
		{"min_level": 600, "multiplier": 20},
		{"min_level": 1000, "multiplier": 50},
	]

func _init_dao_path_configs() -> void:
	dao_path_configs = [
		{
			"id": 1, "name": "Sword Dao",
			"boosted_hall_ids": [1, 7], "hall_multiplier": 3,
			"passive_desc": "+10% crit chance on Heavenly Treasures",
			"passive_value": 0.10,
			"spell_name": "Sword Storm", "spell_duration": 45, "spell_cooldown": 180,
			"spell_desc": "For 45s, every 3s a random hall receives x3-x10 income. 180s cooldown.",
		},
		{
			"id": 2, "name": "Alchemy Dao",
			"boosted_hall_ids": [3, 5], "hall_multiplier": 3,
			"passive_desc": "-20% alchemy crafting time",
			"passive_value": 0.20,
			"spell_name": "Golden Core Overflow", "spell_duration": 60, "spell_cooldown": 240,
			"spell_desc": "For 60s, AE generation is tripled. 240s cooldown.",
		},
		{
			"id": 3, "name": "Formation Dao",
			"boosted_hall_ids": [4, 6], "hall_multiplier": 3,
			"passive_desc": "-5% all hall costs",
			"passive_value": 0.05,
			"spell_name": "Barrier Seal", "spell_duration": 90, "spell_cooldown": 300,
			"spell_desc": "Lock 1 hall for 90s. Income ramps x1 to x4. 300s cooldown.",
		},
		{
			"id": 4, "name": "Body Dao",
			"boosted_hall_ids": [2, 8], "hall_multiplier": 3,
			"passive_desc": "+25% offline earnings",
			"passive_value": 0.25,
			"spell_name": "Heavenly Tribulation", "spell_duration": 10, "spell_cooldown": 300,
			"spell_desc": "50% chance: x10 all income for 10s. 50% chance: x0 for 5s then x5 for 5s.",
		},
		{
			"id": 5, "name": "Spirit Dao",
			"boosted_hall_ids": [9, 10, 11], "hall_multiplier": 2.5,
			"passive_desc": "+1 Heavenly Treasure per minute",
			"passive_value": 1,
			"spell_name": "Beast Stampede", "spell_duration": 45, "spell_cooldown": 360,
			"spell_desc": "For 45s, Heavenly Treasure spawn rate is x5. 360s cooldown.",
		},
	]

func _init_alchemy_configs() -> void:
	alchemy_configs = [
		_alchemy(1, "Qi Condensation Pill", 10, 60, 2.0, [1,2,3], 50),
		_alchemy(2, "Body Tempering Pill", 25, 120, 3.0, [2], 100),
		_alchemy(3, "Spirit Enhancement Pill", 50, 180, 2.0, [4,5,6], 200),
		_alchemy(4, "Sword Qi Pill", 100, 300, 3.0, [7], 400),
		_alchemy(5, "Lightning Resistance Pill", 75, 300, 3.0, [8], 600),
		_alchemy(6, "Void Essence Pill", 200, 600, 3.0, [9], 1000),
		_alchemy(7, "Soul Strengthening Pill", 200, 300, 2.5, [10,11], 1500),
		_alchemy(8, "Dao Comprehension Pill", 350, 600, 4.0, [12], 2000),
		_alchemy(9, "Heavenly Fortune Pill", 400, 600, 2.5, [], 3000),
		_alchemy(10, "Universal Cultivation Pill", 500, 900, 2.0, [1,2,3,4,5,6,7,8,9,10,11,12], 5000),
	]

func _alchemy(id: int, n: String, ae_cost: float, dur: float,
		mult: float, halls: Array, unlock_lv: int) -> Dictionary:
	return {
		"id": id, "name": n, "ae_cost": ae_cost,
		"duration_seconds": dur, "multiplier": mult,
		"affected_hall_ids": halls, "unlock_level": unlock_lv
	}

func _init_challenge_configs() -> void:
	challenge_configs = [
		_challenge(1, "One Path", "Only Hall 1 active", 1e9, "x2 Hall 1 income permanent", "hallProfitMult", 2, 1),
		_challenge(2, "Poverty Sect", "No Elders allowed", 1e10, "-10% all Elder costs permanent", "elderCostReduction", 0.10, -1),
		_challenge(3, "Speed Trial", "All cycles x3 slower", 1e11, "x1.5 all speed permanent", "allSpeedMult", 1.5, -1),
		_challenge(4, "No Alchemy", "No crafting allowed", 5e11, "+50% AE generation permanent", "aeGenerationMult", 1.5, -1),
		_challenge(5, "Iron Wall", "Formation Hall disabled", 1e12, "-15% all costs permanent", "allCostReduction", 0.15, -1),
		_challenge(6, "Wild Beasts", "Spirit Garden only", 1e12, "x3 treasure value permanent", "treasureValueMult", 3, -1),
		_challenge(7, "Sword Only", "Only Halls 1 and 7 active", 5e13, "x2 Sword Peak income permanent", "hallProfitMult", 2, 7),
		_challenge(8, "Lightning Trial", "Random hall disabled each minute", 5e14, "+25% HDP gain permanent", "hdpGainMult", 1.25, -1),
		_challenge(9, "Void Meditation", "Offline only", 5e15, "x3 offline earnings permanent", "offlineEarningsMult", 3, -1),
		_challenge(10, "Soul Tempering", "All income divided by 10", 5e16, "x2 all income permanent", "allIncomeMult", 2, -1),
		_challenge(11, "Celestial Test", "No milestones active", 5e17, "x1.5 milestone multipliers permanent", "milestonePowerMult", 1.5, -1),
		_challenge(12, "Dao Heart Trial", "All restrictions combined", 1e18, "x5 all income permanent", "allIncomeMult", 5, -1),
	]

func _challenge(id: int, n: String, restriction: String, target: float,
		reward_desc: String, reward_type: String, reward_val: float, target_hall: int) -> Dictionary:
	return {
		"id": id, "name": n, "restriction": restriction,
		"target_earnings": BN.new(target), "reward_description": reward_desc,
		"reward_type": reward_type, "reward_value": reward_val,
		"target_hall_id": target_hall
	}

func get_hall_config(id: int) -> Dictionary:
	for h in hall_configs:
		if h.id == id:
			return h
	return {}

func get_elder_config(id: int) -> Dictionary:
	for e in elder_configs:
		if e.id == id:
			return e
	return {}

func get_elder_for_hall(hall_id: int) -> Dictionary:
	for e in elder_configs:
		if e.hall_id == hall_id:
			return e
	return {}

func get_milestones_for_hall(hall_id: int) -> Array:
	return milestone_configs.get(hall_id, [])

func get_dao_path(id: int) -> Dictionary:
	for p in dao_path_configs:
		if p.id == id:
			return p
	return {}

func get_alchemy_item(id: int) -> Dictionary:
	for a in alchemy_configs:
		if a.id == id:
			return a
	return {}

func get_challenge(id: int) -> Dictionary:
	for c in challenge_configs:
		if c.id == id:
			return c
	return {}
