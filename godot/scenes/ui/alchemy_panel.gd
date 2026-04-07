extends Control

const ACCENT_GOLD := Color(0.85, 0.7, 0.3)
const CARD_BG := Color(0.14, 0.12, 0.17)
const TEXT_BRIGHT := Color(0.95, 0.9, 0.8)
const TEXT_DIM := Color(0.6, 0.55, 0.5)
const BUFF_ACTIVE := Color(0.3, 0.7, 0.4)

const PILL_DATA := [
	{"name": "Qi Condensation Pill", "desc": "+50% SS for 60s", "unlock_hall": 3, "unlock_lvl": 1},
	{"name": "Spirit Refinement Pill", "desc": "+100% SS for 60s", "unlock_hall": 3, "unlock_lvl": 10},
	{"name": "Foundation Pill", "desc": "+200% SS for 120s", "unlock_hall": 3, "unlock_lvl": 25},
	{"name": "Core Formation Pill", "desc": "+500% SS for 120s", "unlock_hall": 3, "unlock_lvl": 50},
	{"name": "Nascent Soul Pill", "desc": "+1000% SS for 180s", "unlock_hall": 3, "unlock_lvl": 100},
	{"name": "Dao Comprehension Pill", "desc": "+2x click for 60s", "unlock_hall": 3, "unlock_lvl": 150},
	{"name": "Heaven Defying Pill", "desc": "+5000% SS for 300s", "unlock_hall": 3, "unlock_lvl": 250},
]

var lbl_ae_amount: Label
var pill_cards: Array[Dictionary] = []
var active_buffs_container: VBoxContainer


func _ready() -> void:
	_build_ui()


func _build_ui() -> void:
	var vbox := VBoxContainer.new()
	vbox.set_anchors_preset(Control.PRESET_FULL_RECT)
	vbox.add_theme_constant_override("separation", 8)
	add_child(vbox)

	var title := Label.new()
	title.text = "Alchemy Pavilion"
	title.add_theme_font_size_override("font_size", 20)
	title.add_theme_color_override("font_color", ACCENT_GOLD)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vbox.add_child(title)

	var ae_bar := HBoxContainer.new()
	ae_bar.alignment = BoxContainer.ALIGNMENT_CENTER
	ae_bar.add_theme_constant_override("separation", 8)
	vbox.add_child(ae_bar)

	var ae_label := Label.new()
	ae_label.text = "Alchemy Essence:"
	ae_label.add_theme_color_override("font_color", TEXT_DIM)
	ae_bar.add_child(ae_label)

	lbl_ae_amount = Label.new()
	lbl_ae_amount.text = "0"
	lbl_ae_amount.add_theme_color_override("font_color", ACCENT_GOLD)
	lbl_ae_amount.add_theme_font_size_override("font_size", 16)
	ae_bar.add_child(lbl_ae_amount)

	var buffs_title := Label.new()
	buffs_title.text = "Active Buffs"
	buffs_title.add_theme_font_size_override("font_size", 14)
	buffs_title.add_theme_color_override("font_color", BUFF_ACTIVE)
	vbox.add_child(buffs_title)

	active_buffs_container = VBoxContainer.new()
	active_buffs_container.add_theme_constant_override("separation", 4)
	vbox.add_child(active_buffs_container)

	var sep := HSeparator.new()
	sep.add_theme_constant_override("separation", 8)
	vbox.add_child(sep)

	var pills_title := Label.new()
	pills_title.text = "Craftable Pills"
	pills_title.add_theme_font_size_override("font_size", 14)
	pills_title.add_theme_color_override("font_color", TEXT_BRIGHT)
	vbox.add_child(pills_title)

	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	vbox.add_child(scroll)

	var pill_list := VBoxContainer.new()
	pill_list.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	pill_list.add_theme_constant_override("separation", 6)
	scroll.add_child(pill_list)

	for i in range(PILL_DATA.size()):
		var card := _create_pill_card(i)
		pill_list.add_child(card["panel"])
		pill_cards.append(card)


func _create_pill_card(idx: int) -> Dictionary:
	var data: Dictionary = PILL_DATA[idx]
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

	var info := VBoxContainer.new()
	info.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	info.add_theme_constant_override("separation", 2)
	hbox.add_child(info)

	var name_lbl := Label.new()
	name_lbl.text = data["name"]
	name_lbl.add_theme_color_override("font_color", TEXT_BRIGHT)
	name_lbl.add_theme_font_size_override("font_size", 14)
	info.add_child(name_lbl)

	var desc_lbl := Label.new()
	desc_lbl.text = data["desc"]
	desc_lbl.add_theme_color_override("font_color", TEXT_DIM)
	desc_lbl.add_theme_font_size_override("font_size", 11)
	info.add_child(desc_lbl)

	var cost_lbl := Label.new()
	cost_lbl.text = "Cost: — AE"
	cost_lbl.add_theme_color_override("font_color", TEXT_DIM)
	cost_lbl.add_theme_font_size_override("font_size", 11)
	info.add_child(cost_lbl)

	var craft_btn := Button.new()
	craft_btn.text = "Craft"
	craft_btn.custom_minimum_size = Vector2(70, 32)
	_style_button(craft_btn)
	craft_btn.pressed.connect(_on_craft.bind(idx))
	hbox.add_child(craft_btn)

	return {
		"panel": panel,
		"cost_lbl": cost_lbl,
		"craft_btn": craft_btn,
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


func _on_craft(idx: int) -> void:
	if has_node("/root/AlchemyManager") and get_node("/root/AlchemyManager").has_method("craft_pill"):
		get_node("/root/AlchemyManager").craft_pill(idx)


func update() -> void:
	if not has_node("/root/AlchemyManager"):
		return
	var am := get_node("/root/AlchemyManager")

	if am.has_method("get_alchemy_essence"):
		lbl_ae_amount.text = _format(am.get_alchemy_essence())

	for child in active_buffs_container.get_children():
		child.queue_free()

	if am.has_method("get_active_buffs"):
		var buffs: Array = am.get_active_buffs()
		for buff in buffs:
			var lbl := Label.new()
			lbl.text = "• %s — %.1fs remaining" % [str(buff.get("name", "Buff")), buff.get("time", 0.0)]
			lbl.add_theme_color_override("font_color", BUFF_ACTIVE)
			lbl.add_theme_font_size_override("font_size", 12)
			active_buffs_container.add_child(lbl)

	for card in pill_cards:
		var idx: int = card["idx"]
		if am.has_method("is_pill_unlocked"):
			card["panel"].visible = am.is_pill_unlocked(idx)
		if am.has_method("get_pill_cost"):
			card["cost_lbl"].text = "Cost: %s AE" % _format(am.get_pill_cost(idx))


func _format(value) -> String:
	if value is float or value is int:
		if value >= 1_000_000:
			return "%.2fM" % (value / 1_000_000.0)
		elif value >= 1_000:
			return "%.2fK" % (value / 1_000.0)
		return str(snapped(value, 0.1))
	return str(value)
