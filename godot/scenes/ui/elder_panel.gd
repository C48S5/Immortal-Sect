extends Control

const ACCENT_GOLD := Color(0.85, 0.7, 0.3)
const PANEL_BG := Color(0.12, 0.1, 0.15)
const CARD_BG := Color(0.14, 0.12, 0.17)
const TEXT_BRIGHT := Color(0.95, 0.9, 0.8)
const TEXT_DIM := Color(0.6, 0.55, 0.5)
const HIRED_COLOR := Color(0.2, 0.6, 0.3)

const ELDER_DATA := [
	{"name": "Elder Feng", "title": "Wind Sage", "hall": 0},
	{"name": "Elder Shan", "title": "Stone Guardian", "hall": 1},
	{"name": "Elder Huo", "title": "Flame Alchemist", "hall": 2},
	{"name": "Elder Jian", "title": "Sword Saint", "hall": 3},
	{"name": "Elder Wen", "title": "Lore Keeper", "hall": 4},
	{"name": "Elder Zhen", "title": "Array Master", "hall": 5},
	{"name": "Elder Shou", "title": "Beast Whisperer", "hall": 6},
	{"name": "Elder Qi", "title": "Forge Master", "hall": 7},
	{"name": "Elder Xing", "title": "Star Reader", "hall": 8},
	{"name": "Elder Lei", "title": "Thunder Lord", "hall": 9},
	{"name": "Elder Xu", "title": "Void Walker", "hall": 10},
	{"name": "Elder Tian", "title": "Heaven's Hand", "hall": 11},
]

const HALL_NAMES := [
	"Qi Gathering Pagoda", "Spirit Stone Mine", "Alchemy Pavilion",
	"Sword Training Hall", "Scripture Library", "Formation Tower",
	"Beast Taming Grounds", "Artifact Forge", "Celestial Observatory",
	"Tribulation Platform", "Void Sanctum", "Immortal Treasury"
]

var elder_cards: Array[Dictionary] = []


func _ready() -> void:
	_build_ui()


func _build_ui() -> void:
	var vbox := VBoxContainer.new()
	vbox.set_anchors_preset(Control.PRESET_FULL_RECT)
	vbox.add_theme_constant_override("separation", 8)
	add_child(vbox)

	var title := Label.new()
	title.text = "Sect Elders"
	title.add_theme_font_size_override("font_size", 20)
	title.add_theme_color_override("font_color", ACCENT_GOLD)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vbox.add_child(title)

	var desc := Label.new()
	desc.text = "Hire elders to automate your halls"
	desc.add_theme_font_size_override("font_size", 12)
	desc.add_theme_color_override("font_color", TEXT_DIM)
	desc.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vbox.add_child(desc)

	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	vbox.add_child(scroll)

	var list := VBoxContainer.new()
	list.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	list.add_theme_constant_override("separation", 6)
	scroll.add_child(list)

	for i in range(ELDER_DATA.size()):
		var card := _create_elder_card(i)
		list.add_child(card["panel"])
		elder_cards.append(card)


func _create_elder_card(idx: int) -> Dictionary:
	var data: Dictionary = ELDER_DATA[idx]
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
	margin.add_theme_constant_override("margin_top", 8)
	margin.add_theme_constant_override("margin_bottom", 8)
	panel.add_child(margin)

	var hbox := HBoxContainer.new()
	hbox.add_theme_constant_override("separation", 12)
	margin.add_child(hbox)

	var info_vbox := VBoxContainer.new()
	info_vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	info_vbox.add_theme_constant_override("separation", 2)
	hbox.add_child(info_vbox)

	var name_lbl := Label.new()
	name_lbl.text = "%s — %s" % [data["name"], data["title"]]
	name_lbl.add_theme_color_override("font_color", TEXT_BRIGHT)
	name_lbl.add_theme_font_size_override("font_size", 14)
	info_vbox.add_child(name_lbl)

	var hall_lbl := Label.new()
	var hall_idx: int = data["hall"]
	hall_lbl.text = "Automates: %s" % HALL_NAMES[hall_idx]
	hall_lbl.add_theme_color_override("font_color", TEXT_DIM)
	hall_lbl.add_theme_font_size_override("font_size", 11)
	info_vbox.add_child(hall_lbl)

	var cost_lbl := Label.new()
	cost_lbl.text = "Cost: —"
	cost_lbl.add_theme_color_override("font_color", TEXT_DIM)
	cost_lbl.add_theme_font_size_override("font_size", 11)
	info_vbox.add_child(cost_lbl)

	var status_lbl := Label.new()
	status_lbl.text = ""
	status_lbl.add_theme_color_override("font_color", HIRED_COLOR)
	status_lbl.add_theme_font_size_override("font_size", 14)
	hbox.add_child(status_lbl)

	var hire_btn := Button.new()
	hire_btn.text = "Hire"
	hire_btn.custom_minimum_size = Vector2(70, 32)
	_style_button(hire_btn)
	hire_btn.pressed.connect(_on_hire.bind(idx))
	hbox.add_child(hire_btn)

	return {
		"panel": panel,
		"cost_lbl": cost_lbl,
		"status_lbl": status_lbl,
		"hire_btn": hire_btn,
		"idx": idx,
	}


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


func _on_hire(idx: int) -> void:
	if has_node("/root/ElderManager") and get_node("/root/ElderManager").has_method("hire_elder"):
		get_node("/root/ElderManager").hire_elder(idx)


func update() -> void:
	if not has_node("/root/ElderManager"):
		return
	var em := get_node("/root/ElderManager")

	for card in elder_cards:
		var idx: int = card["idx"]
		if em.has_method("is_elder_hired") and em.is_elder_hired(idx):
			card["status_lbl"].text = "✓ Hired"
			card["hire_btn"].visible = false
		else:
			card["status_lbl"].text = ""
			card["hire_btn"].visible = true

		if em.has_method("get_elder_cost"):
			card["cost_lbl"].text = "Cost: %s SS" % _format(em.get_elder_cost(idx))


func _format(value) -> String:
	if value is float or value is int:
		if value >= 1_000_000:
			return "%.2fM" % (value / 1_000_000.0)
		elif value >= 1_000:
			return "%.2fK" % (value / 1_000.0)
		return str(snapped(value, 0.1))
	return str(value)
