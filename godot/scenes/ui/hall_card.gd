extends PanelContainer

const ACCENT_GOLD := Color(0.85, 0.7, 0.3)
const CARD_BG := Color(0.14, 0.12, 0.17)
const CARD_LOCKED := Color(0.1, 0.09, 0.12)
const TEXT_BRIGHT := Color(0.95, 0.9, 0.8)
const TEXT_DIM := Color(0.6, 0.55, 0.5)
const PROGRESS_BG := Color(0.08, 0.06, 0.1)
const ELEMENT_COLORS := {
	"fire": Color(0.9, 0.3, 0.2),
	"water": Color(0.2, 0.5, 0.9),
	"earth": Color(0.6, 0.5, 0.2),
	"wood": Color(0.2, 0.7, 0.3),
	"metal": Color(0.7, 0.7, 0.75),
	"neutral": Color(0.85, 0.7, 0.3),
}
const HALL_ELEMENTS := {
	1: "neutral", 2: "earth", 3: "fire", 4: "earth", 5: "wood",
	6: "metal", 7: "metal", 8: "fire", 9: "water", 10: "water",
	11: "wood", 12: "neutral",
}

var hall_id: int = -1
var hall_name: String = ""
var buy_mode: int = 1
var is_unlocked: bool = false

var lbl_name: Label
var lbl_level: Label
var lbl_revenue: Label
var lbl_cost: Label
var lbl_element: Label
var progress_bar: ProgressBar
var buy_btn: Button


func _ready() -> void:
	if hall_id >= 0:
		_build_ui()


func setup(id: int, h_name: String, mode: int) -> void:
	hall_id = id
	hall_name = h_name
	buy_mode = mode
	is_unlocked = (id == 0)
	_build_ui()


func _build_ui() -> void:
	_apply_card_style()

	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 12)
	margin.add_theme_constant_override("margin_right", 12)
	margin.add_theme_constant_override("margin_top", 8)
	margin.add_theme_constant_override("margin_bottom", 8)
	add_child(margin)

	var vbox := VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 4)
	margin.add_child(vbox)

	var top_row := HBoxContainer.new()
	top_row.add_theme_constant_override("separation", 8)
	vbox.add_child(top_row)

	lbl_element = Label.new()
	lbl_element.text = "◆"
	var elem: String = HALL_ELEMENTS.get(hall_id, "neutral")
	lbl_element.add_theme_color_override("font_color", ELEMENT_COLORS.get(elem, ACCENT_GOLD))
	lbl_element.add_theme_font_size_override("font_size", 16)
	top_row.add_child(lbl_element)

	lbl_name = Label.new()
	lbl_name.text = hall_name
	lbl_name.add_theme_color_override("font_color", TEXT_BRIGHT)
	lbl_name.add_theme_font_size_override("font_size", 15)
	lbl_name.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	top_row.add_child(lbl_name)

	lbl_level = Label.new()
	lbl_level.text = "Lv. 0"
	lbl_level.add_theme_color_override("font_color", ACCENT_GOLD)
	lbl_level.add_theme_font_size_override("font_size", 13)
	top_row.add_child(lbl_level)

	var mid_row := HBoxContainer.new()
	mid_row.add_theme_constant_override("separation", 12)
	vbox.add_child(mid_row)

	progress_bar = ProgressBar.new()
	progress_bar.min_value = 0.0
	progress_bar.max_value = 1.0
	progress_bar.value = 0.0
	progress_bar.show_percentage = false
	progress_bar.custom_minimum_size = Vector2(0, 14)
	progress_bar.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_style_progress_bar()
	mid_row.add_child(progress_bar)

	lbl_revenue = Label.new()
	lbl_revenue.text = "0 SS/cycle"
	lbl_revenue.add_theme_color_override("font_color", TEXT_DIM)
	lbl_revenue.add_theme_font_size_override("font_size", 11)
	lbl_revenue.custom_minimum_size.x = 100
	lbl_revenue.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	mid_row.add_child(lbl_revenue)

	var bottom_row := HBoxContainer.new()
	bottom_row.add_theme_constant_override("separation", 8)
	vbox.add_child(bottom_row)

	lbl_cost = Label.new()
	lbl_cost.text = "Cost: 0 SS"
	lbl_cost.add_theme_color_override("font_color", TEXT_DIM)
	lbl_cost.add_theme_font_size_override("font_size", 12)
	lbl_cost.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	bottom_row.add_child(lbl_cost)

	buy_btn = Button.new()
	buy_btn.text = "Buy x1"
	buy_btn.custom_minimum_size = Vector2(80, 28)
	_style_buy_button()
	buy_btn.pressed.connect(_on_buy_pressed)
	bottom_row.add_child(buy_btn)

	if not is_unlocked:
		modulate.a = 0.4


func _apply_card_style() -> void:
	var sb := StyleBoxFlat.new()
	sb.bg_color = CARD_BG if is_unlocked else CARD_LOCKED
	sb.corner_radius_top_left = 6
	sb.corner_radius_top_right = 6
	sb.corner_radius_bottom_left = 6
	sb.corner_radius_bottom_right = 6
	sb.border_width_left = 2
	var elem: String = HALL_ELEMENTS.get(hall_id, "neutral")
	sb.border_color = ELEMENT_COLORS.get(elem, ACCENT_GOLD) * Color(1, 1, 1, 0.4)
	add_theme_stylebox_override("panel", sb)


func _style_progress_bar() -> void:
	var bg := StyleBoxFlat.new()
	bg.bg_color = PROGRESS_BG
	bg.corner_radius_top_left = 3
	bg.corner_radius_top_right = 3
	bg.corner_radius_bottom_left = 3
	bg.corner_radius_bottom_right = 3
	progress_bar.add_theme_stylebox_override("background", bg)

	var fill := StyleBoxFlat.new()
	fill.bg_color = ACCENT_GOLD * Color(1, 1, 1, 0.7)
	fill.corner_radius_top_left = 3
	fill.corner_radius_top_right = 3
	fill.corner_radius_bottom_left = 3
	fill.corner_radius_bottom_right = 3
	progress_bar.add_theme_stylebox_override("fill", fill)


func _style_buy_button() -> void:
	var sb := StyleBoxFlat.new()
	sb.bg_color = ACCENT_GOLD * Color(1, 1, 1, 0.2)
	sb.corner_radius_top_left = 4
	sb.corner_radius_top_right = 4
	sb.corner_radius_bottom_left = 4
	sb.corner_radius_bottom_right = 4
	sb.border_width_bottom = 1
	sb.border_color = ACCENT_GOLD * Color(1, 1, 1, 0.5)
	buy_btn.add_theme_stylebox_override("normal", sb)
	buy_btn.add_theme_color_override("font_color", ACCENT_GOLD)
	buy_btn.add_theme_font_size_override("font_size", 12)


func set_buy_mode(mode: int) -> void:
	buy_mode = mode
	if buy_btn:
		buy_btn.text = "Buy Max" if mode == -1 else "Buy x%d" % mode


func _on_buy_pressed() -> void:
	if not is_unlocked:
		return
	if has_node("/root/HallManager"):
		var hm: Node = get_node("/root/HallManager")
		hm.set_buy_mode(buy_mode)
		if hm.has_method("buy_with_mode"):
			hm.buy_with_mode(hall_id)


func update() -> void:
	if not has_node("/root/HallManager"):
		return
	var hm := get_node("/root/HallManager")

	if hm.has_method("is_hall_unlocked"):
		var was_unlocked := is_unlocked
		is_unlocked = hm.is_hall_unlocked(hall_id)
		if is_unlocked and not was_unlocked:
			modulate.a = 1.0
			_apply_card_style()

	if hm.has_method("get_hall_level"):
		lbl_level.text = "Lv. %d" % hm.get_hall_level(hall_id)

	if hm.has_method("get_hall_cycle_progress"):
		progress_bar.value = hm.get_hall_cycle_progress(hall_id)

	if hm.has_method("get_hall_revenue"):
		lbl_revenue.text = "%s SS/cycle" % _format(hm.get_hall_revenue(hall_id))

	if hm.has_method("get_hall_cost"):
		var cost = hm.get_hall_cost(hall_id, buy_mode if buy_mode > 0 else 1)
		lbl_cost.text = "Cost: %s SS" % _format(cost)


func _format(value) -> String:
	if has_node("/root/BigNumber") and get_node("/root/BigNumber").has_method("format_number"):
		return get_node("/root/BigNumber").format_number(value)
	if value is float or value is int:
		if value >= 1_000_000_000:
			return "%.2fB" % (value / 1_000_000_000.0)
		elif value >= 1_000_000:
			return "%.2fM" % (value / 1_000_000.0)
		elif value >= 1_000:
			return "%.2fK" % (value / 1_000.0)
		return str(snapped(value, 0.1))
	return str(value)
