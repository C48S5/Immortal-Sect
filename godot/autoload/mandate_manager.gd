extends Node
## Manages Heavenly Mandate — permanent per-hall multipliers that survive
## Ascension.  Each hall has an independent upgrade slot (levels 0-4).
## Costs Heavenly Seals.  See GDD Section 12.

signal mandate_upgraded(hall_id: int)

## hall_id -> current level (0 = not purchased, max 4)
var slots: Dictionary = {}

const TOTAL_HALLS: int = 12


func _ready() -> void:
	init_slots()


func init_slots() -> void:
	slots.clear()
	for id: int in range(1, TOTAL_HALLS + 1):
		slots[id] = 0


func upgrade_mandate(hall_id: int) -> void:
	if hall_id < 1 or hall_id > TOTAL_HALLS:
		return
	if not can_afford_upgrade(hall_id):
		return

	var current_level: int = slots[hall_id]
	if current_level >= GameData.MANDATE_CONFIG["max_level"]:
		return

	var cost: int = _get_upgrade_cost(current_level)
	GameManager.spend_heavenly_seals(cost)
	slots[hall_id] += 1
	mandate_upgraded.emit(hall_id)


func get_mandate_multiplier(hall_id: int) -> float:
	if not slots.has(hall_id):
		return 1.0
	var level: int = slots[hall_id]
	if level <= 0:
		return 1.0
	var levels_data: Array = GameData.MANDATE_CONFIG.get("levels", [])
	if level > levels_data.size():
		return 1.0
	return levels_data[level - 1].get("multiplier", 1.0)


func can_afford_upgrade(hall_id: int) -> bool:
	if not slots.has(hall_id):
		return false
	var current_level: int = slots[hall_id]
	if current_level >= GameData.MANDATE_CONFIG["max_level"]:
		return false
	var cost: int = _get_upgrade_cost(current_level)
	return GameManager.get_heavenly_seals() >= cost


func _get_upgrade_cost(current_level: int) -> int:
	var levels_data: Array = GameData.MANDATE_CONFIG.get("levels", [])
	if current_level >= levels_data.size():
		return 999999
	return levels_data[current_level].get("seal_cost", 999999)


func get_save_data() -> Dictionary:
	return slots.duplicate()


func load_save_data(data: Dictionary) -> void:
	for key: Variant in data:
		var id: int = int(key)
		if slots.has(id):
			slots[id] = int(data[key])
