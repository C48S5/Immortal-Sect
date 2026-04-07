extends Control

const ACCENT_GOLD := Color(0.85, 0.7, 0.3)
const CARD_BG := Color(0.14, 0.12, 0.17)
const TEXT_BRIGHT := Color(0.95, 0.9, 0.8)
const TEXT_DIM := Color(0.6, 0.55, 0.5)
const RARE_COLOR := Color(0.3, 0.5, 0.9)
const EPIC_COLOR := Color(0.6, 0.3, 0.8)
const LEGENDARY_COLOR := Color(0.9, 0.65, 0.2)

const RARITY_COLORS := {
	"common": TEXT_DIM,
	"uncommon": Color(0.3, 0.7, 0.4),
	"rare": RARE_COLOR,
	"epic": EPIC_COLOR,
	"legendary": LEGENDARY_COLOR,
}

var pull_1_btn: Button
var pull_10_btn: Button
var lbl_pity: Label
var lbl_dc_balance: Label
var roster_container: VBoxContainer
var roster_cards: Array[Dictionary] = []


func _ready() -> void:
	_build_ui()


func _build_ui() -> void:
	var vbox := VBoxContainer.new()
	vbox.set_anchors_preset(Control.PRESET_FULL_RECT)
	vbox.add_theme_constant_override("separation", 10)
	add_child(vbox)

	var title := Label.new()
	title.text = "Disciple Recruitment"
	title.add_theme_font_size_override("font_size", 20)
	title.add_theme_color_override("font_color", ACCENT_GOLD)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vbox.add_child(title)

	_build_gacha_section(vbox)
	_build_roster_section(vbox)


func _build_gacha_section(parent: VBoxContainer) -> void:
	var panel := _make_card()
	parent.add_child(panel)
	var margin := panel.get_child(0)

	var gacha_vbox := VBoxContainer.new()
	gacha_vbox.add_theme_constant_override("separation", 8)
	margin.add_child(gacha_vbox)

	var header := Label.new()
	header.text = "Heavenly Recruitment Banner"
	header.add_theme_color_override("font_color", TEXT_BRIGHT)
	header.add_theme_font_size_override("font_size", 16)
	header.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	gacha_vbox.add_child(header)

	var balance_hbox := HBoxContainer.new()
	balance_hbox.alignment = BoxContainer.ALIGNMENT_CENTER
	balance_hbox.add_theme_constant_override("separation", 8)
	gacha_vbox.add_child(balance_hbox)

	var dc_lbl := Label.new()
	dc_lbl.text = "Disciple Coins:"
	dc_lbl.add_theme_color_override("font_color", TEXT_DIM)
	balance_hbox.add_child(dc_lbl)

	lbl_dc_balance = Label.new()
	lbl_dc_balance.text = "0"
	lbl_dc_balance.add_theme_color_override("font_color", ACCENT_GOLD)
	lbl_dc_balance.add_theme_font_size_override("font_size", 16)
	balance_hbox.add_child(lbl_dc_balance)

	var btn_hbox := HBoxContainer.new()
	btn_hbox.alignment = BoxContainer.ALIGNMENT_CENTER
	btn_hbox.add_theme_constant_override("separation", 12)
	gacha_vbox.add_child(btn_hbox)

	pull_1_btn = Button.new()
	pull_1_btn.text = "Pull x1 (100 DC)"
	pull_1_btn.custom_minimum_size = Vector2(140, 38)
	_style_gacha_button(pull_1_btn)
	pull_1_btn.pressed.connect(_on_pull.bind(1))
	btn_hbox.add_child(pull_1_btn)

	pull_10_btn = Button.new()
	pull_10_btn.text = "Pull x10 (900 DC)"
	pull_10_btn.custom_minimum_size = Vector2(150, 38)
	_style_gacha_button(pull_10_btn)
	pull_10_btn.pressed.connect(_on_pull.bind(10))
	btn_hbox.add_child(pull_10_btn)

	lbl_pity = Label.new()
	lbl_pity.text = "Pity: 0/90"
	lbl_pity.add_theme_color_override("font_color", TEXT_DIM)
	lbl_pity.add_theme_font_size_override("font_size", 11)
	lbl_pity.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	gacha_vbox.add_child(lbl_pity)


func _build_roster_section(parent: VBoxContainer) -> void:
	var header := Label.new()
	header.text = "Disciple Roster"
	header.add_theme_font_size_override("font_size", 16)
	header.add_theme_color_override("font_color", TEXT_BRIGHT)
	parent.add_child(header)

	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	parent.add_child(scroll)

	roster_container = VBoxContainer.new()
	roster_container.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	roster_container.add_theme_constant_override("separation", 4)
	scroll.add_child(roster_container)

	var empty_lbl := Label.new()
	empty_lbl.name = "EmptyLabel"
	empty_lbl.text = "No disciples recruited yet. Pull from the banner above!"
	empty_lbl.add_theme_color_override("font_color", TEXT_DIM)
	empty_lbl.add_theme_font_size_override("font_size", 12)
	empty_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	roster_container.add_child(empty_lbl)


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


func _style_gacha_button(btn: Button) -> void:
	var sb := StyleBoxFlat.new()
	sb.bg_color = LEGENDARY_COLOR * Color(1, 1, 1, 0.2)
	sb.corner_radius_top_left = 6
	sb.corner_radius_top_right = 6
	sb.corner_radius_bottom_left = 6
	sb.corner_radius_bottom_right = 6
	sb.border_width_bottom = 2
	sb.border_color = LEGENDARY_COLOR
	btn.add_theme_stylebox_override("normal", sb)
	btn.add_theme_color_override("font_color", LEGENDARY_COLOR)
	btn.add_theme_font_size_override("font_size", 13)


func _on_pull(count: int) -> void:
	if has_node("/root/DiscipleManager") and get_node("/root/DiscipleManager").has_method("pull_disciples"):
		get_node("/root/DiscipleManager").pull_disciples(count)


func update() -> void:
	if not has_node("/root/DiscipleManager"):
		return
	var dm := get_node("/root/DiscipleManager")

	if dm.has_method("get_disciple_coins"):
		lbl_dc_balance.text = _format(dm.get_disciple_coins())

	if dm.has_method("get_pity_counter"):
		lbl_pity.text = "Pity: %d/90" % dm.get_pity_counter()

	if dm.has_method("get_roster"):
		_refresh_roster(dm.get_roster())


func _refresh_roster(roster: Array) -> void:
	for child in roster_container.get_children():
		child.queue_free()
	roster_cards.clear()

	if roster.is_empty():
		var lbl := Label.new()
		lbl.text = "No disciples recruited yet."
		lbl.add_theme_color_override("font_color", TEXT_DIM)
		roster_container.add_child(lbl)
		return

	for disciple in roster:
		var card := _create_disciple_card(disciple)
		roster_container.add_child(card["panel"])
		roster_cards.append(card)


func _create_disciple_card(disciple: Dictionary) -> Dictionary:
	var panel := PanelContainer.new()
	var sb := StyleBoxFlat.new()
	sb.bg_color = CARD_BG
	sb.corner_radius_top_left = 4
	sb.corner_radius_top_right = 4
	sb.corner_radius_bottom_left = 4
	sb.corner_radius_bottom_right = 4
	panel.add_theme_stylebox_override("panel", sb)

	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 10)
	margin.add_theme_constant_override("margin_right", 10)
	margin.add_theme_constant_override("margin_top", 6)
	margin.add_theme_constant_override("margin_bottom", 6)
	panel.add_child(margin)

	var hbox := HBoxContainer.new()
	hbox.add_theme_constant_override("separation", 10)
	margin.add_child(hbox)

	var name_lbl := Label.new()
	name_lbl.text = disciple.get("name", "Unknown")
	var rarity: String = disciple.get("rarity", "common")
	name_lbl.add_theme_color_override("font_color", RARITY_COLORS.get(rarity, TEXT_DIM))
	name_lbl.add_theme_font_size_override("font_size", 13)
	name_lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	hbox.add_child(name_lbl)

	var bonus_lbl := Label.new()
	bonus_lbl.text = disciple.get("bonus", "")
	bonus_lbl.add_theme_color_override("font_color", TEXT_DIM)
	bonus_lbl.add_theme_font_size_override("font_size", 11)
	hbox.add_child(bonus_lbl)

	var assign_btn := Button.new()
	assign_btn.text = "Assign" if not disciple.get("assigned", false) else "Dismiss"
	assign_btn.custom_minimum_size = Vector2(65, 26)
	_style_small_button(assign_btn)
	hbox.add_child(assign_btn)

	return {"panel": panel, "assign_btn": assign_btn}


func _style_small_button(btn: Button) -> void:
	var sb := StyleBoxFlat.new()
	sb.bg_color = ACCENT_GOLD * Color(1, 1, 1, 0.15)
	sb.corner_radius_top_left = 3
	sb.corner_radius_top_right = 3
	sb.corner_radius_bottom_left = 3
	sb.corner_radius_bottom_right = 3
	btn.add_theme_stylebox_override("normal", sb)
	btn.add_theme_color_override("font_color", ACCENT_GOLD)
	btn.add_theme_font_size_override("font_size", 11)


func _format(value) -> String:
	if value is float or value is int:
		if value >= 1_000_000:
			return "%.2fM" % (value / 1_000_000.0)
		elif value >= 1_000:
			return "%.2fK" % (value / 1_000.0)
		return str(snapped(value, 0.1))
	return str(value)
