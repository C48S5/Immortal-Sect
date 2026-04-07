extends Control

const ACCENT_GOLD := Color(0.85, 0.7, 0.3)
const CARD_BG := Color(0.14, 0.12, 0.17)
const TEXT_BRIGHT := Color(0.95, 0.9, 0.8)
const TEXT_DIM := Color(0.6, 0.55, 0.5)
const PURCHASED_COLOR := Color(0.3, 0.8, 0.4)
const HDP_COLOR := Color(0.6, 0.3, 0.8)

const SHOP_DATA := [
	{"name": "Spiritual Roots Enhancement", "cost": 5, "effect": "+50% base click power"},
	{"name": "Meridian Expansion", "cost": 10, "effect": "+100% Hall 1-3 revenue"},
	{"name": "Golden Core Stabilization", "cost": 20, "effect": "Elders cost -25%"},
	{"name": "Nascent Soul Awakening", "cost": 50, "effect": "+200% all hall revenue"},
	{"name": "Domain Mastery", "cost": 100, "effect": "Dao Path spells last 2x longer"},
	{"name": "Heavenly Forge Blessing", "cost": 200, "effect": "Alchemy costs -50%"},
	{"name": "Celestial Treasury", "cost": 500, "effect": "Start with 10K SS after ascension"},
	{"name": "Void Perception", "cost": 1000, "effect": "Unlock auto-meditate (1 click/s)"},
	{"name": "Dao Enlightenment", "cost": 2500, "effect": "+500% all revenue"},
	{"name": "Immortal Decree", "cost": 5000, "effect": "x10 all production permanently"},
]

var lbl_hdp_balance: Label
var shop_cards: Array[Dictionary] = []


func _ready() -> void:
	_build_ui()


func _build_ui() -> void:
	var vbox := VBoxContainer.new()
	vbox.set_anchors_preset(Control.PRESET_FULL_RECT)
	vbox.add_theme_constant_override("separation", 10)
	add_child(vbox)

	var title := Label.new()
	title.text = "Heaven-Defying Point Shop"
	title.add_theme_font_size_override("font_size", 20)
	title.add_theme_color_override("font_color", HDP_COLOR)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vbox.add_child(title)

	var balance_hbox := HBoxContainer.new()
	balance_hbox.alignment = BoxContainer.ALIGNMENT_CENTER
	balance_hbox.add_theme_constant_override("separation", 8)
	vbox.add_child(balance_hbox)

	var bal_label := Label.new()
	bal_label.text = "Your HDP:"
	bal_label.add_theme_color_override("font_color", TEXT_DIM)
	balance_hbox.add_child(bal_label)

	lbl_hdp_balance = Label.new()
	lbl_hdp_balance.text = "0"
	lbl_hdp_balance.add_theme_color_override("font_color", HDP_COLOR)
	lbl_hdp_balance.add_theme_font_size_override("font_size", 18)
	balance_hbox.add_child(lbl_hdp_balance)

	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	vbox.add_child(scroll)

	var list := VBoxContainer.new()
	list.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	list.add_theme_constant_override("separation", 6)
	scroll.add_child(list)

	for i in range(SHOP_DATA.size()):
		var card := _create_shop_card(i)
		list.add_child(card["panel"])
		shop_cards.append(card)


func _create_shop_card(idx: int) -> Dictionary:
	var data: Dictionary = SHOP_DATA[idx]
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

	var effect_lbl := Label.new()
	effect_lbl.text = data["effect"]
	effect_lbl.add_theme_color_override("font_color", ACCENT_GOLD)
	effect_lbl.add_theme_font_size_override("font_size", 12)
	info.add_child(effect_lbl)

	var cost_lbl := Label.new()
	cost_lbl.text = "Cost: %d HDP" % data["cost"]
	cost_lbl.add_theme_color_override("font_color", HDP_COLOR)
	cost_lbl.add_theme_font_size_override("font_size", 11)
	info.add_child(cost_lbl)

	var right := VBoxContainer.new()
	right.add_theme_constant_override("separation", 4)
	hbox.add_child(right)

	var status_lbl := Label.new()
	status_lbl.text = ""
	status_lbl.add_theme_color_override("font_color", PURCHASED_COLOR)
	status_lbl.add_theme_font_size_override("font_size", 12)
	status_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	right.add_child(status_lbl)

	var buy_btn := Button.new()
	buy_btn.text = "Buy"
	buy_btn.custom_minimum_size = Vector2(70, 32)
	_style_button(buy_btn)
	buy_btn.pressed.connect(_on_buy.bind(idx))
	right.add_child(buy_btn)

	return {
		"panel": panel, "status_lbl": status_lbl, "buy_btn": buy_btn, "idx": idx,
	}


func _style_button(btn: Button) -> void:
	var sb := StyleBoxFlat.new()
	sb.bg_color = HDP_COLOR * Color(1, 1, 1, 0.25)
	sb.corner_radius_top_left = 4
	sb.corner_radius_top_right = 4
	sb.corner_radius_bottom_left = 4
	sb.corner_radius_bottom_right = 4
	sb.border_width_bottom = 1
	sb.border_color = HDP_COLOR
	btn.add_theme_stylebox_override("normal", sb)
	btn.add_theme_color_override("font_color", HDP_COLOR)
	btn.add_theme_font_size_override("font_size", 12)


func _on_buy(idx: int) -> void:
	if has_node("/root/GameManager") and get_node("/root/GameManager").has_method("buy_hdp_upgrade"):
		get_node("/root/GameManager").buy_hdp_upgrade(idx)


func update() -> void:
	if not has_node("/root/GameManager"):
		return
	var gm := get_node("/root/GameManager")

	if gm.has_method("get_hdp"):
		lbl_hdp_balance.text = str(gm.get_hdp())

	for card in shop_cards:
		var idx: int = card["idx"]
		if gm.has_method("is_hdp_upgrade_purchased") and gm.is_hdp_upgrade_purchased(idx):
			card["status_lbl"].text = "✓ Purchased"
			card["buy_btn"].visible = false
		else:
			card["status_lbl"].text = ""
			card["buy_btn"].visible = true
