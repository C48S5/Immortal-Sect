extends Control

const ACCENT_GOLD := Color(0.85, 0.7, 0.3)
const CARD_BG := Color(0.14, 0.12, 0.17)
const TEXT_BRIGHT := Color(0.95, 0.9, 0.8)
const TEXT_DIM := Color(0.6, 0.55, 0.5)
const DANGER_COLOR := Color(0.8, 0.2, 0.2)

var sound_toggle: CheckButton
var lbl_playtime: Label
var lbl_ascensions: Label
var export_field: TextEdit
var destroy_confirm: ConfirmationDialog


func _ready() -> void:
	_build_ui()


func _build_ui() -> void:
	var vbox := VBoxContainer.new()
	vbox.set_anchors_preset(Control.PRESET_FULL_RECT)
	vbox.add_theme_constant_override("separation", 12)
	add_child(vbox)

	var title := Label.new()
	title.text = "Settings"
	title.add_theme_font_size_override("font_size", 20)
	title.add_theme_color_override("font_color", ACCENT_GOLD)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vbox.add_child(title)

	_build_sound_section(vbox)
	_build_save_section(vbox)
	_build_export_section(vbox)
	_build_stats_section(vbox)
	_build_danger_section(vbox)


func _build_sound_section(parent: VBoxContainer) -> void:
	var panel := _make_card()
	parent.add_child(panel)
	var margin := panel.get_child(0)

	var hbox := HBoxContainer.new()
	hbox.add_theme_constant_override("separation", 12)
	margin.add_child(hbox)

	var lbl := Label.new()
	lbl.text = "Sound Effects"
	lbl.add_theme_color_override("font_color", TEXT_BRIGHT)
	lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	hbox.add_child(lbl)

	sound_toggle = CheckButton.new()
	sound_toggle.button_pressed = true
	sound_toggle.toggled.connect(_on_sound_toggled)
	hbox.add_child(sound_toggle)


func _build_save_section(parent: VBoxContainer) -> void:
	var panel := _make_card()
	parent.add_child(panel)
	var margin := panel.get_child(0)

	var vbox := VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 6)
	margin.add_child(vbox)

	var lbl := Label.new()
	lbl.text = "Save Management"
	lbl.add_theme_color_override("font_color", TEXT_BRIGHT)
	lbl.add_theme_font_size_override("font_size", 15)
	vbox.add_child(lbl)

	var hbox := HBoxContainer.new()
	hbox.add_theme_constant_override("separation", 8)
	vbox.add_child(hbox)

	var save_btn := Button.new()
	save_btn.text = "Save Game"
	save_btn.custom_minimum_size = Vector2(110, 34)
	_style_button(save_btn)
	save_btn.pressed.connect(_on_save)
	hbox.add_child(save_btn)

	var load_btn := Button.new()
	load_btn.text = "Load Game"
	load_btn.custom_minimum_size = Vector2(110, 34)
	_style_button(load_btn)
	load_btn.pressed.connect(_on_load)
	hbox.add_child(load_btn)


func _build_export_section(parent: VBoxContainer) -> void:
	var panel := _make_card()
	parent.add_child(panel)
	var margin := panel.get_child(0)

	var vbox := VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 6)
	margin.add_child(vbox)

	var lbl := Label.new()
	lbl.text = "Export / Import Save"
	lbl.add_theme_color_override("font_color", TEXT_BRIGHT)
	lbl.add_theme_font_size_override("font_size", 15)
	vbox.add_child(lbl)

	export_field = TextEdit.new()
	export_field.custom_minimum_size.y = 60
	export_field.placeholder_text = "Paste save data here to import..."
	var te_sb := StyleBoxFlat.new()
	te_sb.bg_color = Color(0.06, 0.05, 0.08)
	te_sb.corner_radius_top_left = 4
	te_sb.corner_radius_top_right = 4
	te_sb.corner_radius_bottom_left = 4
	te_sb.corner_radius_bottom_right = 4
	export_field.add_theme_stylebox_override("normal", te_sb)
	vbox.add_child(export_field)

	var hbox := HBoxContainer.new()
	hbox.add_theme_constant_override("separation", 8)
	vbox.add_child(hbox)

	var export_btn := Button.new()
	export_btn.text = "Export"
	export_btn.custom_minimum_size = Vector2(90, 30)
	_style_button(export_btn)
	export_btn.pressed.connect(_on_export)
	hbox.add_child(export_btn)

	var import_btn := Button.new()
	import_btn.text = "Import"
	import_btn.custom_minimum_size = Vector2(90, 30)
	_style_button(import_btn)
	import_btn.pressed.connect(_on_import)
	hbox.add_child(import_btn)


func _build_stats_section(parent: VBoxContainer) -> void:
	var panel := _make_card()
	parent.add_child(panel)
	var margin := panel.get_child(0)

	var vbox := VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 4)
	margin.add_child(vbox)

	var lbl := Label.new()
	lbl.text = "Game Statistics"
	lbl.add_theme_color_override("font_color", TEXT_BRIGHT)
	lbl.add_theme_font_size_override("font_size", 15)
	vbox.add_child(lbl)

	lbl_playtime = Label.new()
	lbl_playtime.text = "Play Time: 0:00:00"
	lbl_playtime.add_theme_color_override("font_color", TEXT_DIM)
	vbox.add_child(lbl_playtime)

	lbl_ascensions = Label.new()
	lbl_ascensions.text = "Ascensions: 0"
	lbl_ascensions.add_theme_color_override("font_color", TEXT_DIM)
	vbox.add_child(lbl_ascensions)


func _build_danger_section(parent: VBoxContainer) -> void:
	var panel := _make_card()
	parent.add_child(panel)
	var margin := panel.get_child(0)

	var vbox := VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 6)
	margin.add_child(vbox)

	var lbl := Label.new()
	lbl.text = "Danger Zone"
	lbl.add_theme_color_override("font_color", DANGER_COLOR)
	lbl.add_theme_font_size_override("font_size", 15)
	vbox.add_child(lbl)

	var destroy_btn := Button.new()
	destroy_btn.text = "Destroy Sect (Full Reset)"
	destroy_btn.custom_minimum_size = Vector2(200, 34)
	var sb := StyleBoxFlat.new()
	sb.bg_color = DANGER_COLOR * Color(1, 1, 1, 0.2)
	sb.corner_radius_top_left = 4
	sb.corner_radius_top_right = 4
	sb.corner_radius_bottom_left = 4
	sb.corner_radius_bottom_right = 4
	sb.border_width_bottom = 2
	sb.border_color = DANGER_COLOR
	destroy_btn.add_theme_stylebox_override("normal", sb)
	destroy_btn.add_theme_color_override("font_color", DANGER_COLOR)
	destroy_btn.pressed.connect(_on_destroy_pressed)
	vbox.add_child(destroy_btn)

	destroy_confirm = ConfirmationDialog.new()
	destroy_confirm.dialog_text = "Are you sure you want to destroy your sect?\nThis will erase ALL progress permanently!"
	destroy_confirm.confirmed.connect(_on_destroy_confirmed)
	add_child(destroy_confirm)


func _make_card() -> PanelContainer:
	var panel := PanelContainer.new()
	var sb := StyleBoxFlat.new()
	sb.bg_color = CARD_BG
	sb.corner_radius_top_left = 6
	sb.corner_radius_top_right = 6
	sb.corner_radius_bottom_left = 6
	sb.corner_radius_bottom_right = 6
	panel.add_theme_stylebox_override("panel", sb)

	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 12)
	margin.add_theme_constant_override("margin_right", 12)
	margin.add_theme_constant_override("margin_top", 10)
	margin.add_theme_constant_override("margin_bottom", 10)
	panel.add_child(margin)

	return panel


func _style_button(btn: Button) -> void:
	var sb := StyleBoxFlat.new()
	sb.bg_color = ACCENT_GOLD * Color(1, 1, 1, 0.2)
	sb.corner_radius_top_left = 4
	sb.corner_radius_top_right = 4
	sb.corner_radius_bottom_left = 4
	sb.corner_radius_bottom_right = 4
	btn.add_theme_stylebox_override("normal", sb)
	btn.add_theme_color_override("font_color", ACCENT_GOLD)
	btn.add_theme_font_size_override("font_size", 12)


func _on_sound_toggled(enabled: bool) -> void:
	AudioServer.set_bus_mute(0, not enabled)


func _on_save() -> void:
	if has_node("/root/GameManager") and get_node("/root/GameManager").has_method("save_game"):
		get_node("/root/GameManager").save_game()


func _on_load() -> void:
	if has_node("/root/GameManager") and get_node("/root/GameManager").has_method("load_game"):
		get_node("/root/GameManager").load_game()


func _on_export() -> void:
	if has_node("/root/GameManager") and get_node("/root/GameManager").has_method("export_save"):
		export_field.text = get_node("/root/GameManager").export_save()


func _on_import() -> void:
	if has_node("/root/GameManager") and get_node("/root/GameManager").has_method("import_save"):
		get_node("/root/GameManager").import_save(export_field.text)


func _on_destroy_pressed() -> void:
	destroy_confirm.popup_centered()


func _on_destroy_confirmed() -> void:
	if has_node("/root/GameManager") and get_node("/root/GameManager").has_method("destroy_sect"):
		get_node("/root/GameManager").destroy_sect()


func update() -> void:
	if not has_node("/root/GameManager"):
		return
	var gm := get_node("/root/GameManager")

	if gm.has_method("get_play_time"):
		var t: float = gm.get_play_time()
		var hours := int(t) / 3600
		var minutes := (int(t) % 3600) / 60
		var seconds := int(t) % 60
		lbl_playtime.text = "Play Time: %d:%02d:%02d" % [hours, minutes, seconds]

	if gm.has_method("get_ascension_count"):
		lbl_ascensions.text = "Ascensions: %d" % gm.get_ascension_count()
