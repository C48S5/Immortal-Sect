extends Node
## Manages save / load for all game state.  Collects data from every
## manager autoload, serialises to JSON, writes to user:// directory.
## Auto-saves every 30 seconds.

signal game_saved
signal game_loaded

const SAVE_PATH: String = "user://immortal_sect_save.json"
const AUTO_SAVE_INTERVAL: float = 30.0

var auto_save_timer: float = 0.0


func _process(delta: float) -> void:
	auto_save_timer += delta
	if auto_save_timer >= AUTO_SAVE_INTERVAL:
		auto_save_timer = 0.0
		save_game()


func save_game() -> void:
	var data: Dictionary = _collect_save_data()
	var json_string: String = JSON.stringify(data, "\t")

	var file: FileAccess = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file == null:
		push_error("SaveManager: failed to open save file for writing: %s" % SAVE_PATH)
		return

	file.store_string(json_string)
	file.close()
	game_saved.emit()


func load_game() -> bool:
	if not FileAccess.file_exists(SAVE_PATH):
		return false

	var file: FileAccess = FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file == null:
		push_error("SaveManager: failed to open save file for reading: %s" % SAVE_PATH)
		return false

	var json_string: String = file.get_as_text()
	file.close()

	var json: JSON = JSON.new()
	var err: Error = json.parse(json_string)
	if err != OK:
		push_error("SaveManager: JSON parse error: %s" % json.get_error_message())
		return false

	var data: Variant = json.get_data()
	if data is Dictionary:
		_restore_save_data(data as Dictionary)
		game_loaded.emit()
		return true

	push_error("SaveManager: save data root is not a Dictionary")
	return false


func delete_save() -> void:
	if FileAccess.file_exists(SAVE_PATH):
		DirAccess.remove_absolute(SAVE_PATH)


func export_save() -> String:
	var data: Dictionary = _collect_save_data()
	return JSON.stringify(data, "\t")


func import_save(json_string: String) -> bool:
	var json: JSON = JSON.new()
	var err: Error = json.parse(json_string)
	if err != OK:
		push_error("SaveManager: import parse error: %s" % json.get_error_message())
		return false

	var data: Variant = json.get_data()
	if data is Dictionary:
		_restore_save_data(data as Dictionary)
		game_loaded.emit()
		return true
	return false


func _collect_save_data() -> Dictionary:
	var data: Dictionary = {
		"save_version": 1,
		"timestamp": Time.get_unix_time_from_system(),
	}

	if GameManager.has_method("get_save_data"):
		data["game_manager"] = GameManager.get_save_data()

	if HallManager.has_method("get_save_data"):
		data["hall_manager"] = HallManager.get_save_data()

	if ElderManager.has_method("get_save_data"):
		data["elder_manager"] = ElderManager.get_save_data()

	if PrestigeManager.has_method("get_save_data"):
		data["prestige_manager"] = PrestigeManager.get_save_data()

	if AlchemyManager.has_method("get_save_data"):
		data["alchemy_manager"] = AlchemyManager.get_save_data()

	if DaoPathManager.has_method("get_save_data"):
		data["dao_path_manager"] = DaoPathManager.get_save_data()

	if ChallengeManager.has_method("get_save_data"):
		data["challenge_manager"] = ChallengeManager.get_save_data()

	if MandateManager.has_method("get_save_data"):
		data["mandate_manager"] = MandateManager.get_save_data()

	if DiscipleManager.has_method("get_save_data"):
		data["disciple_manager"] = DiscipleManager.get_save_data()

	if DungeonManager.has_method("get_save_data"):
		data["dungeon_manager"] = DungeonManager.get_save_data()

	if LegacyManager.has_method("get_save_data"):
		data["legacy_manager"] = LegacyManager.get_save_data()

	if MissionManager.has_method("get_save_data"):
		data["mission_manager"] = MissionManager.get_save_data()

	return data


func _restore_save_data(data: Dictionary) -> void:
	if data.has("game_manager") and GameManager.has_method("load_save_data"):
		GameManager.load_save_data(data["game_manager"])

	if data.has("hall_manager") and HallManager.has_method("load_save_data"):
		HallManager.load_save_data(data["hall_manager"])

	if data.has("elder_manager") and ElderManager.has_method("load_save_data"):
		ElderManager.load_save_data(data["elder_manager"])

	if data.has("prestige_manager") and PrestigeManager.has_method("load_save_data"):
		PrestigeManager.load_save_data(data["prestige_manager"])

	if data.has("alchemy_manager") and AlchemyManager.has_method("load_save_data"):
		AlchemyManager.load_save_data(data["alchemy_manager"])

	if data.has("dao_path_manager") and DaoPathManager.has_method("load_save_data"):
		DaoPathManager.load_save_data(data["dao_path_manager"])

	if data.has("challenge_manager") and ChallengeManager.has_method("load_save_data"):
		ChallengeManager.load_save_data(data["challenge_manager"])

	if data.has("mandate_manager") and MandateManager.has_method("load_save_data"):
		MandateManager.load_save_data(data["mandate_manager"])

	if data.has("disciple_manager") and DiscipleManager.has_method("load_save_data"):
		DiscipleManager.load_save_data(data["disciple_manager"])

	if data.has("dungeon_manager") and DungeonManager.has_method("load_save_data"):
		DungeonManager.load_save_data(data["dungeon_manager"])

	if data.has("legacy_manager") and LegacyManager.has_method("load_save_data"):
		LegacyManager.load_save_data(data["legacy_manager"])

	if data.has("mission_manager") and MissionManager.has_method("load_save_data"):
		MissionManager.load_save_data(data["mission_manager"])
