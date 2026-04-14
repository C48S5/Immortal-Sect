extends Control

const ACCENT_GOLD := Color(0.85, 0.7, 0.3)
const CARD_BG := Color(0.14, 0.12, 0.17)
const TEXT_BRIGHT := Color(0.95, 0.9, 0.8)
const TEXT_DIM := Color(0.6, 0.55, 0.5)

const HALL_NAMES := [
	"Qi Gathering Pagoda", "Spirit Stone Mine", "Alchemy Pavilion",
	"Sword Training Hall", "Scripture Library", "Formation Tower",
	"Beast Taming Grounds", "Artifact Forge", "Celestial Observatory",
	"Tribulation Platform", "Void Sanctum", "Immortal Treasury"
]

var mandate_cards: Array[Dictionary] = []


func _ready() -> void:
	_build_ui()


func _build_ui() -> void:
	var vbox := VBoxContainer.new()
	vbox.set_anchors_preset(Control.PRESET_FULL_RECT)
	vbox.add_theme_constant_override("separation", 8)
	add_child(vbox)

	var title := Label.new()
	title.text = "Heavenly Mandates"
	title.add_theme_font_size_override("font_size", 20)
	title.add_theme_color_override("font_color", ACCENT_GOLD)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vbox.add_child(title)

	var desc := Label.new()
	desc.text = "Upgrade mandates to multiply hall revenue"
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

	for i in range(HALL_NAMES.size()):
		var card := _create_mandate_card(i)
		list.add_child(card["panel"])
		mandate_cards.append(card)


func _create_mandate_card(idx: int) -> Dictionary:
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
	name_lbl.text = HALL_NAMES[idx] + " Mandate"
	name_lbl.add_theme_color_override("font_color", TEXT_BRIGHT)
	name_lbl.add_theme_font_size_override("font_size", 14)
	info.add_child(name_lbl)

	var level_lbl := Label.new()
	level_lbl.text = "Level: 0"
	level_lbl.add_theme_color_override("font_color", TEXT_DIM)
	level_lbl.add_theme_font_size_override("font_size", 12)
	info.add_child(level_lbl)

	var mult_lbl := Label.new()
	mult_lbl.text = "Multiplier: x1.00"
	mult_lbl.add_theme_color_override("font_color", ACCENT_GOLD)
	mult_lbl.add_theme_font_size_override("font_size", 12)
	info.add_child(mult_lbl)

	var cost_lbl := Label.new()
	cost_lbl.text = "Cost: — SS"
	cost_lbl.add_theme_color_override("font_color", TEXT_DIM)
	cost_lbl.add_theme_font_size_override("font_size", 11)
	info.add_child(cost_lbl)

	var upgrade_btn := Button.new()
	upgrade_btn.text = "Upgrade"
	upgrade_btn.custom_minimum_size = Vector2(80, 32)
	_style_button(upgrade_btn)
	upgrade_btn.pressed.connect(_on_upgrade.bind(idx))
	hbox.add_child(upgrade_btn)

	return {
		"panel": panel, "level_lbl": level_lbl, "mult_lbl": mult_lbl,
		"cost_lbl": cost_lbl, "upgrade_btn": upgrade_btn, "idx": idx,
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


func _on_upgrade(idx: int) -> void:
	if has_node("/root/MandateManager") and get_node("/root/MandateManager").has_method("upgrade_mandate"):
		get_node("/root/MandateManager").upgrade_mandate(idx)


func update() -> void:
	if not has_node("/root/MandateManager"):
		return
	var mm := get_node("/root/MandateManager")

	for card in mandate_cards:
		var idx: int = card["idx"]
		if mm.has_method("get_mandate_level"):
			card["level_lbl"].text = "Level: %d" % mm.get_mandate_level(idx)
		if mm.has_method("get_mandate_multiplier"):
			card["mult_lbl"].text = "Multiplier: x%.2f" % mm.get_mandate_multiplier(idx)
		if mm.has_method("get_mandate_cost"):
			card["cost_lbl"].text = "Cost: %s SS" % _format(mm.get_mandate_cost(idx))


func _format(value) -> String:
	if value is float or value is int:
		if value >= 1_000_000:
			return "%.2fM" % (value / 1_000_000.0)
		elif value >= 1_000:
			return "%.2fK" % (value / 1_000.0)
		return str(snapped(value, 0.1))
	return str(value)
