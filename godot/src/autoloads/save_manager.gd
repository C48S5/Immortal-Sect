extends Node

const SAVE_PATH := "user://cultivation_sect_save.json"

func save_game() -> void:
	var data := GameManager.get_save_data()
	var json_str := JSON.stringify(data)
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(json_str)
		file.close()
		EventBus.game_saved.emit()

func load_game() -> bool:
	if not FileAccess.file_exists(SAVE_PATH):
		return false
	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if not file:
		return false
	var json_str := file.get_as_text()
	file.close()
	var json := JSON.new()
	var err := json.parse(json_str)
	if err != OK:
		return false
	var data: Dictionary = json.data
	GameManager.load_save_data(data)
	return true

func delete_save() -> void:
	if FileAccess.file_exists(SAVE_PATH):
		DirAccess.remove_absolute(SAVE_PATH)

func has_save() -> bool:
	return FileAccess.file_exists(SAVE_PATH)
