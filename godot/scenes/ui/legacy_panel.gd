extends Control

const ACCENT_GOLD := Color(0.85, 0.7, 0.3)
const CARD_BG := Color(0.14, 0.12, 0.17)
const TEXT_BRIGHT := Color(0.95, 0.9, 0.8)
const TEXT_DIM := Color(0.6, 0.55, 0.5)
const LEGACY_COLOR := Color(0.4, 0.7, 0.9)
const QR_COLOR := Color(0.5, 0.8, 0.6)

const FRAGMENT_DATA := [
	{"name": "Fragment of the First Patriarch", "bonus": "+10% all revenue per level"},
	{"name": "Dao Seed of Eternity", "bonus": "+5% cycle speed per level"},
	{"name": "Celestial Jade Shard", "bonus": "+20% click power per level"},
	{"name": "Primordial Spirit Essence", "bonus": "+15% elder efficiency per level"},
	{"name": "Heaven's Will Remnant", "bonus": "+25% HDP gain per level"},
]

const QR_SHOP_DATA := [
	{"name": "Qi Amplification", "cost": 100, "effect": "+50% SS for 300s"},
	{"name": "Temporal Acceleration", "cost": 200, "effect": "2x cycle speed for 300s"},
	{"name": "Spirit Surge", "cost": 150, "effect": "+100% click power for 300s"},
	{"name": "Golden Luck", "cost": 500, "effect": "Guaranteed rare+ on next pull"},
]

var lbl_legacy_power: Label
var lbl_global_mult: Label
var lbl_qr_balance: Label
var fragment_cards: Array[Dictionary] = []
var qr_shop_cards: Array[Dictionary] = []


func _ready() -> void:
	_build_ui()


func _build_ui() -> void:
	var vbox := VBoxContainer.new()
	vbox.set_anchors_preset(Control.PRESET_FULL_RECT)
	vbox.add_theme_constant_override("separation", 10)
	add_child(vbox)

	var title := Label.new()
	title.text = "Ancient Legacy"
	title.add_theme_font_size_override("font_size", 20)
	title.add_theme_color_override("font_color", LEGACY_COLOR)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vbox.add_child(title)

	_build_overview(vbox)

	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	vbox.add_child(scroll)

	var scroll_vbox := VBoxContainer.new()
	scroll_vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll_vbox.add_theme_constant_override("separation", 8)
	scroll.add_child(scroll_vbox)

	_build_fragments(scroll_vbox)
	_build_qr_shop(scroll_vbox)


func _build_overview(parent: VBoxContainer) -> void:
	var panel := _make_card()
	parent.add_child(panel)
	var margin := panel.get_child(0)

	var hbox := HBoxContainer.new()
	hbox.add_theme_constant_override("separation", 24)
	hbox.alignment = BoxContainer.ALIGNMENT_CENTER
	margin.add_child(hbox)

	var lp_vbox := VBoxContainer.new()
	lp_vbox.add_theme_constant_override("separation", 2)
	hbox.add_child(lp_vbox)

	var lp_label := Label.new()
	lp_label.text = "Legacy Power"
	lp_label.add_theme_color_override("font_color", TEXT_DIM)
	lp_label.add_theme_font_size_override("font_size", 11)
	lp_vbox.add_child(lp_label)

	lbl_legacy_power = Label.new()
	lbl_legacy_power.text = "0"
	lbl_legacy_power.add_theme_color_override("font_color", LEGACY_COLOR)
	lbl_legacy_power.add_theme_font_size_override("font_size", 18)
	lp_vbox.add_child(lbl_legacy_power)

	var gm_vbox := VBoxContainer.new()
	gm_vbox.add_theme_constant_override("separation", 2)
	hbox.add_child(gm_vbox)

	var gm_label := Label.new()
	gm_label.text = "Global Multiplier"
	gm_label.add_theme_color_override("font_color", TEXT_DIM)
	gm_label.add_theme_font_size_override("font_size", 11)
	gm_vbox.add_child(gm_label)

	lbl_global_mult = Label.new()
	lbl_global_mult.text = "x1.00"
	lbl_global_mult.add_theme_color_override("font_color", ACCENT_GOLD)
	lbl_global_mult.add_theme_font_size_override("font_size", 18)
	gm_vbox.add_child(lbl_global_mult)

	var qr_vbox := VBoxContainer.new()
	qr_vbox.add_theme_constant_override("separation", 2)
	hbox.add_child(qr_vbox)

	var qr_label := Label.new()
	qr_label.text = "Qi Remnants"
	qr_label.add_theme_color_override("font_color", TEXT_DIM)
	qr_label.add_theme_font_size_override("font_size", 11)
	qr_vbox.add_child(qr_label)

	lbl_qr_balance = Label.new()
	lbl_qr_balance.text = "0"
	lbl_qr_balance.add_theme_color_override("font_color", QR_COLOR)
	lbl_qr_balance.add_theme_font_size_override("font_size", 18)
	qr_vbox.add_child(lbl_qr_balance)


func _build_fragments(parent: VBoxContainer) -> void:
	var header := Label.new()
	header.text = "Legacy Fragments"
	header.add_theme_color_override("font_color", LEGACY_COLOR)
	header.add_theme_font_size_override("font_size", 15)
	parent.add_child(header)

	for i in range(FRAGMENT_DATA.size()):
		var card := _create_fragment_card(i)
		parent.add_child(card["panel"])
		fragment_cards.append(card)


func _create_fragment_card(idx: int) -> Dictionary:
	var data: Dictionary = FRAGMENT_DATA[idx]
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
	name_lbl.add_theme_font_size_override("font_size", 13)
	info.add_child(name_lbl)

	var bonus_lbl := Label.new()
	bonus_lbl.text = data["bonus"]
	bonus_lbl.add_theme_color_override("font_color", LEGACY_COLOR)
	bonus_lbl.add_theme_font_size_override("font_size", 11)
	info.add_child(bonus_lbl)

	var level_lbl := Label.new()
	level_lbl.text = "Level: 0"
	level_lbl.add_theme_color_override("font_color", TEXT_DIM)
	level_lbl.add_theme_font_size_override("font_size", 11)
	info.add_child(level_lbl)

	var upgrade_btn := Button.new()
	upgrade_btn.text = "Upgrade"
	upgrade_btn.custom_minimum_size = Vector2(75, 28)
	_style_button(upgrade_btn, LEGACY_COLOR)
	upgrade_btn.pressed.connect(_on_upgrade_fragment.bind(idx))
	hbox.add_child(upgrade_btn)

	return {"panel": panel, "level_lbl": level_lbl, "idx": idx}


func _build_qr_shop(parent: VBoxContainer) -> void:
	var sep := HSeparator.new()
	parent.add_child(sep)

	var header := Label.new()
	header.text = "Qi Remnant Shop"
	header.add_theme_color_override("font_color", QR_COLOR)
	header.add_theme_font_size_override("font_size", 15)
	parent.add_child(header)

	for i in range(QR_SHOP_DATA.size()):
		var card := _create_qr_card(i)
		parent.add_child(card["panel"])
		qr_shop_cards.append(card)


func _create_qr_card(idx: int) -> Dictionary:
	var data: Dictionary = QR_SHOP_DATA[idx]
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
	name_lbl.add_theme_font_size_override("font_size", 13)
	info.add_child(name_lbl)

	var effect_lbl := Label.new()
	effect_lbl.text = data["effect"]
	effect_lbl.add_theme_color_override("font_color", QR_COLOR)
	effect_lbl.add_theme_font_size_override("font_size", 11)
	info.add_child(effect_lbl)

	var cost_lbl := Label.new()
	cost_lbl.text = "%d QR" % data["cost"]
	cost_lbl.add_theme_color_override("font_color", TEXT_DIM)
	cost_lbl.add_theme_font_size_override("font_size", 11)
	info.add_child(cost_lbl)

	var buy_btn := Button.new()
	buy_btn.text = "Buy"
	buy_btn.custom_minimum_size = Vector2(60, 28)
	_style_button(buy_btn, QR_COLOR)
	buy_btn.pressed.connect(_on_buy_qr.bind(idx))
	hbox.add_child(buy_btn)

	return {"panel": panel, "idx": idx}


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
	margin.add_theme_constant_override("margin_left", 14)
	margin.add_theme_constant_override("margin_right", 14)
	margin.add_theme_constant_override("margin_top", 10)
	margin.add_theme_constant_override("margin_bottom", 10)
	panel.add_child(margin)

	return panel


func _style_button(btn: Button, color: Color) -> void:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color * Color(1, 1, 1, 0.2)
	sb.corner_radius_top_left = 4
	sb.corner_radius_top_right = 4
	sb.corner_radius_bottom_left = 4
	sb.corner_radius_bottom_right = 4
	btn.add_theme_stylebox_override("normal", sb)
	btn.add_theme_color_override("font_color", color)
	btn.add_theme_font_size_override("font_size", 11)


func _on_upgrade_fragment(idx: int) -> void:
	if has_node("/root/LegacyManager") and get_node("/root/LegacyManager").has_method("upgrade_fragment"):
		get_node("/root/LegacyManager").upgrade_fragment(idx)


func _on_buy_qr(idx: int) -> void:
	if has_node("/root/LegacyManager") and get_node("/root/LegacyManager").has_method("buy_qr_buff"):
		get_node("/root/LegacyManager").buy_qr_buff(idx)


func update() -> void:
	if not has_node("/root/LegacyManager"):
		return
	var lm := get_node("/root/LegacyManager")

	if lm.has_method("get_legacy_power"):
		lbl_legacy_power.text = _format(lm.get_legacy_power())

	if lm.has_method("get_global_multiplier"):
		lbl_global_mult.text = "x%.2f" % lm.get_global_multiplier()

	if lm.has_method("get_qi_remnants"):
		lbl_qr_balance.text = _format(lm.get_qi_remnants())

	for card in fragment_cards:
		var idx: int = card["idx"]
		if lm.has_method("get_fragment_level"):
			card["level_lbl"].text = "Level: %d" % lm.get_fragment_level(idx)


func _format(value) -> String:
	if value is float or value is int:
		if value >= 1_000_000:
			return "%.2fM" % (value / 1_000_000.0)
		elif value >= 1_000:
			return "%.2fK" % (value / 1_000.0)
		return str(snapped(value, 0.1))
	return str(value)
