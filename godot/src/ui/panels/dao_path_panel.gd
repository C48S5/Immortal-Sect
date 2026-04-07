extends ScrollContainer

var content: VBoxContainer
var path_buttons: Array[Button] = []
var spell_button: Button
var spell_status: Label
var path_info: Label

func _ready() -> void:
	size_flags_horizontal = Control.SIZE_EXPAND_FILL
	size_flags_vertical = Control.SIZE_EXPAND_FILL

	content = VBoxContainer.new()
	content.add_theme_constant_override("separation", 12)
	content.size_flags_horizontal = Control.SIZE_EXPAND_FILL

	var title := Label.new()
	title.text = "Dao Paths"
	title.add_theme_color_override("font_color", XianxiaTheme.ACCENT_PURPLE)
	title.add_theme_font_size_override("font_size", 20)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(title)

	var desc := Label.new()
	desc.text = "Choose a Dao Path to multiply specific hall incomes.\nYou can change paths each Ascension."
	desc.add_theme_color_override("font_color", XianxiaTheme.TEXT_SECONDARY)
	desc.add_theme_font_size_override("font_size", 12)
	desc.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	desc.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	content.add_child(desc)

	for path_config in GameData.dao_path_configs:
		var card := _create_path_card(path_config)
		content.add_child(card)

	var sep := HSeparator.new()
	content.add_child(sep)

	spell_button = Button.new()
	spell_button.text = "Activate Spell"
	spell_button.pressed.connect(_on_spell_pressed)
	spell_button.add_theme_font_size_override("font_size", 16)
	content.add_child(spell_button)

	spell_status = Label.new()
	spell_status.text = "No Dao Path selected"
	spell_status.add_theme_color_override("font_color", XianxiaTheme.TEXT_SECONDARY)
	spell_status.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(spell_status)

	path_info = Label.new()
	path_info.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	path_info.add_theme_color_override("font_color", XianxiaTheme.TEXT_SECONDARY)
	path_info.add_theme_font_size_override("font_size", 12)
	content.add_child(path_info)

	add_child(content)

func _create_path_card(config: Dictionary) -> PanelContainer:
	var panel := PanelContainer.new()
	var style := StyleBoxFlat.new()
	style.bg_color = XianxiaTheme.BG_CARD
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_left = 6
	style.corner_radius_bottom_right = 6
	style.content_margin_left = 12
	style.content_margin_right = 12
	style.content_margin_top = 8
	style.content_margin_bottom = 8
	panel.add_theme_stylebox_override("panel", style)

	var vbox := VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 4)

	var name_lbl := Label.new()
	name_lbl.text = config.name
	name_lbl.add_theme_color_override("font_color", XianxiaTheme.ACCENT_PURPLE)
	name_lbl.add_theme_font_size_override("font_size", 16)
	vbox.add_child(name_lbl)

	var halls_lbl := Label.new()
	var hall_names := []
	for hid in config.boosted_hall_ids:
		var hconfig := GameData.get_hall_config(hid)
		if not hconfig.is_empty():
			hall_names.append(hconfig.name)
	halls_lbl.text = "x%s: %s" % [str(config.hall_multiplier), ", ".join(hall_names)]
	halls_lbl.add_theme_color_override("font_color", XianxiaTheme.ACCENT_GOLD)
	halls_lbl.add_theme_font_size_override("font_size", 12)
	halls_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	vbox.add_child(halls_lbl)

	var passive_lbl := Label.new()
	passive_lbl.text = "Passive: %s" % config.passive_desc
	passive_lbl.add_theme_color_override("font_color", XianxiaTheme.TEXT_SECONDARY)
	passive_lbl.add_theme_font_size_override("font_size", 11)
	vbox.add_child(passive_lbl)

	var spell_lbl := Label.new()
	spell_lbl.text = "Spell: %s - %s" % [config.spell_name, config.spell_desc]
	spell_lbl.add_theme_color_override("font_color", XianxiaTheme.TEXT_MUTED)
	spell_lbl.add_theme_font_size_override("font_size", 11)
	spell_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	vbox.add_child(spell_lbl)

	var select_btn := Button.new()
	select_btn.text = "Select Path"
	select_btn.add_theme_font_size_override("font_size", 12)
	var path_id: int = config.id
	select_btn.pressed.connect(func(): GameManager.select_dao_path(path_id))
	path_buttons.append(select_btn)
	vbox.add_child(select_btn)

	panel.add_child(vbox)
	return panel

func _on_spell_pressed() -> void:
	GameManager.activate_dao_spell()

func _process(_delta: float) -> void:
	var has_path := GameManager.selected_dao_path > 0
	spell_button.disabled = not has_path or GameManager.spell_active or GameManager.spell_cooldown_timer > 0

	if GameManager.spell_active:
		spell_status.text = "Spell Active: %.0fs" % GameManager.spell_timer
		spell_status.add_theme_color_override("font_color", XianxiaTheme.ACCENT_GOLD)
	elif GameManager.spell_cooldown_timer > 0:
		spell_status.text = "Cooldown: %.0fs" % GameManager.spell_cooldown_timer
		spell_status.add_theme_color_override("font_color", XianxiaTheme.TEXT_MUTED)
	elif has_path:
		var path := GameData.get_dao_path(GameManager.selected_dao_path)
		spell_status.text = "Ready: %s" % path.spell_name
		spell_status.add_theme_color_override("font_color", XianxiaTheme.ACCENT_GREEN)
		spell_button.text = "Cast %s" % path.spell_name
	else:
		spell_status.text = "Select a Dao Path first"
		spell_status.add_theme_color_override("font_color", XianxiaTheme.TEXT_SECONDARY)

	for i in range(path_buttons.size()):
		var btn := path_buttons[i]
		var pid: int = GameData.dao_path_configs[i].id
		if pid == GameManager.selected_dao_path:
			btn.text = "Selected"
			btn.disabled = true
		else:
			btn.text = "Select Path"
			btn.disabled = false
