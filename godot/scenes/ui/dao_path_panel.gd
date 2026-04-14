extends Control

const ACCENT_GOLD := Color(0.85, 0.7, 0.3)
const CARD_BG := Color(0.14, 0.12, 0.17)
const CARD_SELECTED := Color(0.18, 0.15, 0.22)
const TEXT_BRIGHT := Color(0.95, 0.9, 0.8)
const TEXT_DIM := Color(0.6, 0.55, 0.5)
const SPELL_READY := Color(0.3, 0.8, 0.5)
const SPELL_COOLDOWN := Color(0.8, 0.3, 0.3)

const PATH_DATA := [
	{
		"name": "Path of the Sword",
		"passive": "+25% Sword Training Hall revenue",
		"spell": "Myriad Swords — 10x SS for 10s",
		"icon": "⚔",
	},
	{
		"name": "Path of Alchemy",
		"passive": "+25% Alchemy Pavilion revenue",
		"spell": "Golden Core Ignition — Free pills for 30s",
		"icon": "⚗",
	},
	{
		"name": "Path of Formation",
		"passive": "+25% Formation Tower revenue",
		"spell": "Grand Array — All halls +50% for 20s",
		"icon": "✦",
	},
	{
		"name": "Path of the Beast",
		"passive": "+25% Beast Taming revenue",
		"spell": "Spirit Beast Rampage — 5x click for 15s",
		"icon": "🐉",
	},
	{
		"name": "Path of the Void",
		"passive": "+10% all hall revenue",
		"spell": "Void Collapse — Instant 60s of SS production",
		"icon": "◎",
	},
]

var selected_path: int = -1
var path_cards: Array[Dictionary] = []
var spell_btn: Button
var spell_status: Label
var passive_lbl: Label
var spell_desc_lbl: Label


func _ready() -> void:
	_build_ui()


func _build_ui() -> void:
	var vbox := VBoxContainer.new()
	vbox.set_anchors_preset(Control.PRESET_FULL_RECT)
	vbox.add_theme_constant_override("separation", 10)
	add_child(vbox)

	var title := Label.new()
	title.text = "Dao Path"
	title.add_theme_font_size_override("font_size", 20)
	title.add_theme_color_override("font_color", ACCENT_GOLD)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vbox.add_child(title)

	var desc := Label.new()
	desc.text = "Choose your cultivation path for passive bonuses and a powerful spell"
	desc.add_theme_font_size_override("font_size", 12)
	desc.add_theme_color_override("font_color", TEXT_DIM)
	desc.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	desc.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	vbox.add_child(desc)

	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	vbox.add_child(scroll)

	var path_list := VBoxContainer.new()
	path_list.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	path_list.add_theme_constant_override("separation", 6)
	scroll.add_child(path_list)

	for i in range(PATH_DATA.size()):
		var card := _create_path_card(i)
		path_list.add_child(card["panel"])
		path_cards.append(card)

	var sep := HSeparator.new()
	vbox.add_child(sep)

	var spell_section := VBoxContainer.new()
	spell_section.add_theme_constant_override("separation", 6)
	vbox.add_child(spell_section)

	passive_lbl = Label.new()
	passive_lbl.text = "Select a path to see its passive bonus"
	passive_lbl.add_theme_color_override("font_color", TEXT_DIM)
	passive_lbl.add_theme_font_size_override("font_size", 13)
	passive_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	spell_section.add_child(passive_lbl)

	spell_desc_lbl = Label.new()
	spell_desc_lbl.text = ""
	spell_desc_lbl.add_theme_color_override("font_color", TEXT_BRIGHT)
	spell_desc_lbl.add_theme_font_size_override("font_size", 13)
	spell_desc_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	spell_section.add_child(spell_desc_lbl)

	var spell_center := CenterContainer.new()
	spell_section.add_child(spell_center)

	var spell_vbox := VBoxContainer.new()
	spell_vbox.add_theme_constant_override("separation", 4)
	spell_center.add_child(spell_vbox)

	spell_btn = Button.new()
	spell_btn.text = "Activate Spell"
	spell_btn.custom_minimum_size = Vector2(180, 40)
	spell_btn.disabled = true
	_style_spell_button()
	spell_btn.pressed.connect(_on_spell_pressed)
	spell_vbox.add_child(spell_btn)

	spell_status = Label.new()
	spell_status.text = "No path selected"
	spell_status.add_theme_color_override("font_color", TEXT_DIM)
	spell_status.add_theme_font_size_override("font_size", 11)
	spell_status.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	spell_vbox.add_child(spell_status)


func _create_path_card(idx: int) -> Dictionary:
	var data: Dictionary = PATH_DATA[idx]
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

	var hbox := HBoxContainer.new()
	hbox.add_theme_constant_override("separation", 12)
	margin.add_child(hbox)

	var icon_lbl := Label.new()
	icon_lbl.text = data["icon"]
	icon_lbl.add_theme_font_size_override("font_size", 24)
	hbox.add_child(icon_lbl)

	var info := VBoxContainer.new()
	info.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	info.add_theme_constant_override("separation", 2)
	hbox.add_child(info)

	var name_lbl := Label.new()
	name_lbl.text = data["name"]
	name_lbl.add_theme_color_override("font_color", TEXT_BRIGHT)
	name_lbl.add_theme_font_size_override("font_size", 15)
	info.add_child(name_lbl)

	var passive := Label.new()
	passive.text = data["passive"]
	passive.add_theme_color_override("font_color", TEXT_DIM)
	passive.add_theme_font_size_override("font_size", 11)
	info.add_child(passive)

	var select_btn := Button.new()
	select_btn.text = "Select"
	select_btn.custom_minimum_size = Vector2(70, 32)
	_style_small_button(select_btn)
	select_btn.pressed.connect(_on_select_path.bind(idx))
	hbox.add_child(select_btn)

	return {"panel": panel, "select_btn": select_btn, "sb": sb, "idx": idx}


func _style_spell_button() -> void:
	var sb := StyleBoxFlat.new()
	sb.bg_color = ACCENT_GOLD * Color(1, 1, 1, 0.25)
	sb.corner_radius_top_left = 6
	sb.corner_radius_top_right = 6
	sb.corner_radius_bottom_left = 6
	sb.corner_radius_bottom_right = 6
	sb.border_width_bottom = 2
	sb.border_color = ACCENT_GOLD
	spell_btn.add_theme_stylebox_override("normal", sb)
	spell_btn.add_theme_color_override("font_color", ACCENT_GOLD)
	spell_btn.add_theme_font_size_override("font_size", 14)


func _style_small_button(btn: Button) -> void:
	var sb := StyleBoxFlat.new()
	sb.bg_color = ACCENT_GOLD * Color(1, 1, 1, 0.15)
	sb.corner_radius_top_left = 4
	sb.corner_radius_top_right = 4
	sb.corner_radius_bottom_left = 4
	sb.corner_radius_bottom_right = 4
	btn.add_theme_stylebox_override("normal", sb)
	btn.add_theme_color_override("font_color", ACCENT_GOLD)
	btn.add_theme_font_size_override("font_size", 12)


func _on_select_path(idx: int) -> void:
	selected_path = idx
	if has_node("/root/DaoPathManager") and get_node("/root/DaoPathManager").has_method("select_path"):
		get_node("/root/DaoPathManager").select_path(idx)
	_update_selection_visuals()


func _update_selection_visuals() -> void:
	for card in path_cards:
		var is_sel: bool = card["idx"] == selected_path
		card["sb"].bg_color = CARD_SELECTED if is_sel else CARD_BG
		card["sb"].border_width_left = 3 if is_sel else 0
		card["sb"].border_color = ACCENT_GOLD
		card["select_btn"].text = "Selected" if is_sel else "Select"

	if selected_path >= 0 and selected_path < PATH_DATA.size():
		var data: Dictionary = PATH_DATA[selected_path]
		passive_lbl.text = "Passive: " + data["passive"]
		spell_desc_lbl.text = "Spell: " + data["spell"]
		spell_btn.disabled = false
		spell_status.text = "Ready"
		spell_status.add_theme_color_override("font_color", SPELL_READY)
	else:
		passive_lbl.text = "Select a path to see its passive bonus"
		spell_desc_lbl.text = ""
		spell_btn.disabled = true
		spell_status.text = "No path selected"


func _on_spell_pressed() -> void:
	if has_node("/root/DaoPathManager") and get_node("/root/DaoPathManager").has_method("activate_spell"):
		get_node("/root/DaoPathManager").activate_spell()


func update() -> void:
	if not has_node("/root/DaoPathManager"):
		return
	var dpm := get_node("/root/DaoPathManager")

	if dpm.has_method("get_selected_path"):
		selected_path = dpm.get_selected_path()
		_update_selection_visuals()

	if dpm.has_method("get_spell_cooldown"):
		var cd: float = dpm.get_spell_cooldown()
		if cd > 0:
			spell_status.text = "Cooldown: %.1fs" % cd
			spell_status.add_theme_color_override("font_color", SPELL_COOLDOWN)
			spell_btn.disabled = true
		elif selected_path >= 0:
			spell_status.text = "Ready"
			spell_status.add_theme_color_override("font_color", SPELL_READY)
			spell_btn.disabled = false
