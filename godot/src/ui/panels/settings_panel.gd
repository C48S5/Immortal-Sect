extends ScrollContainer

var content: VBoxContainer

func _ready() -> void:
	size_flags_horizontal = Control.SIZE_EXPAND_FILL
	size_flags_vertical = Control.SIZE_EXPAND_FILL

	content = VBoxContainer.new()
	content.add_theme_constant_override("separation", 12)
	content.size_flags_horizontal = Control.SIZE_EXPAND_FILL

	var title := Label.new()
	title.text = "Settings"
	title.add_theme_color_override("font_color", XianxiaTheme.TEXT_PRIMARY)
	title.add_theme_font_size_override("font_size", 20)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(title)

	var save_btn := Button.new()
	save_btn.text = "Save Game"
	save_btn.add_theme_font_size_override("font_size", 14)
	save_btn.pressed.connect(func():
		SaveManager.save_game()
	)
	content.add_child(save_btn)

	var load_btn := Button.new()
	load_btn.text = "Load Game"
	load_btn.add_theme_font_size_override("font_size", 14)
	load_btn.pressed.connect(func():
		SaveManager.load_game()
	)
	content.add_child(load_btn)

	var sep1 := HSeparator.new()
	content.add_child(sep1)

	var reset_btn := Button.new()
	reset_btn.text = "DELETE SAVE (Hard Reset)"
	reset_btn.add_theme_font_size_override("font_size", 14)
	reset_btn.add_theme_color_override("font_color", XianxiaTheme.ACCENT_RED)
	reset_btn.pressed.connect(_on_reset)
	content.add_child(reset_btn)

	var sep2 := HSeparator.new()
	content.add_child(sep2)

	var about := Label.new()
	about.text = "Cultivation Sect Tycoon\nAn idle incremental game\nBuilt with Godot 4"
	about.add_theme_color_override("font_color", XianxiaTheme.TEXT_MUTED)
	about.add_theme_font_size_override("font_size", 12)
	about.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(about)

	add_child(content)

func _on_reset() -> void:
	SaveManager.delete_save()
	get_tree().reload_current_scene()
