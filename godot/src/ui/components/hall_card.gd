extends PanelContainer

var hall_id: int = 0
var name_label: Label
var level_label: Label
var revenue_label: Label
var cost_label: Label
var progress_bar: ProgressBar
var buy_button: Button
var buy_10_button: Button
var buy_max_button: Button
var elder_button: Button
var elder_label: Label
var rps_label: Label

func _ready() -> void:
	custom_minimum_size = Vector2(0, 120)

func setup(id: int) -> void:
	hall_id = id
	var config := GameData.get_hall_config(hall_id)
	if config.is_empty():
		return
	_build_ui(config)
	EventBus.hall_leveled.connect(_on_hall_leveled)
	EventBus.elder_hired.connect(_on_elder_hired)

func _build_ui(config: Dictionary) -> void:
	var style := StyleBoxFlat.new()
	style.bg_color = XianxiaTheme.BG_CARD
	style.corner_radius_top_left = 8
	style.corner_radius_top_right = 8
	style.corner_radius_bottom_left = 8
	style.corner_radius_bottom_right = 8
	style.border_width_left = 3
	style.border_color = XianxiaTheme.get_element_color(config.element)
	style.content_margin_left = 12
	style.content_margin_right = 12
	style.content_margin_top = 8
	style.content_margin_bottom = 8
	add_theme_stylebox_override("panel", style)

	var vbox := VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 4)

	var top_row := HBoxContainer.new()
	name_label = Label.new()
	name_label.text = config.name
	name_label.add_theme_color_override("font_color", XianxiaTheme.TEXT_PRIMARY)
	name_label.add_theme_font_size_override("font_size", 16)
	name_label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	top_row.add_child(name_label)

	level_label = Label.new()
	level_label.text = "Lv. 0"
	level_label.add_theme_color_override("font_color", XianxiaTheme.ACCENT_GOLD)
	level_label.add_theme_font_size_override("font_size", 16)
	top_row.add_child(level_label)
	vbox.add_child(top_row)

	var info_row := HBoxContainer.new()
	revenue_label = Label.new()
	revenue_label.text = "Revenue: 0/cycle"
	revenue_label.add_theme_color_override("font_color", XianxiaTheme.TEXT_SECONDARY)
	revenue_label.add_theme_font_size_override("font_size", 12)
	revenue_label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	info_row.add_child(revenue_label)

	rps_label = Label.new()
	rps_label.text = "0/s"
	rps_label.add_theme_color_override("font_color", XianxiaTheme.ACCENT_CYAN)
	rps_label.add_theme_font_size_override("font_size", 12)
	info_row.add_child(rps_label)
	vbox.add_child(info_row)

	progress_bar = ProgressBar.new()
	progress_bar.custom_minimum_size = Vector2(0, 8)
	progress_bar.max_value = 1.0
	progress_bar.value = 0.0
	progress_bar.show_percentage = false
	var bar_bg := StyleBoxFlat.new()
	bar_bg.bg_color = Color("0d0f1a")
	bar_bg.corner_radius_top_left = 4
	bar_bg.corner_radius_top_right = 4
	bar_bg.corner_radius_bottom_left = 4
	bar_bg.corner_radius_bottom_right = 4
	progress_bar.add_theme_stylebox_override("background", bar_bg)
	var bar_fill := StyleBoxFlat.new()
	bar_fill.bg_color = XianxiaTheme.get_element_color(config.element)
	bar_fill.corner_radius_top_left = 4
	bar_fill.corner_radius_top_right = 4
	bar_fill.corner_radius_bottom_left = 4
	bar_fill.corner_radius_bottom_right = 4
	progress_bar.add_theme_stylebox_override("fill", bar_fill)
	vbox.add_child(progress_bar)

	var button_row := HBoxContainer.new()
	button_row.add_theme_constant_override("separation", 6)

	buy_button = _create_btn("Buy x1")
	buy_button.pressed.connect(func(): GameManager.buy_hall(hall_id, 1))
	button_row.add_child(buy_button)

	buy_10_button = _create_btn("x10")
	buy_10_button.pressed.connect(func(): GameManager.buy_hall(hall_id, 10))
	button_row.add_child(buy_10_button)

	buy_max_button = _create_btn("Max")
	buy_max_button.pressed.connect(_buy_max)
	button_row.add_child(buy_max_button)

	cost_label = Label.new()
	cost_label.text = "Cost: 0"
	cost_label.add_theme_color_override("font_color", XianxiaTheme.TEXT_SECONDARY)
	cost_label.add_theme_font_size_override("font_size", 11)
	cost_label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	cost_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	button_row.add_child(cost_label)

	vbox.add_child(button_row)

	var elder_row := HBoxContainer.new()
	var elder_config := GameData.get_elder_for_hall(hall_id)
	if not elder_config.is_empty():
		elder_button = _create_btn("Hire %s" % elder_config.name)
		elder_button.pressed.connect(func(): GameManager.hire_elder(elder_config.id))
		elder_row.add_child(elder_button)

		elder_label = Label.new()
		elder_label.add_theme_color_override("font_color", XianxiaTheme.TEXT_SECONDARY)
		elder_label.add_theme_font_size_override("font_size", 11)
		elder_label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		elder_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
		elder_row.add_child(elder_label)
	vbox.add_child(elder_row)

	add_child(vbox)

func _create_btn(text: String) -> Button:
	var btn := Button.new()
	btn.text = text
	btn.add_theme_font_size_override("font_size", 12)
	return btn

func _buy_max() -> void:
	var max_count := GameManager.get_max_affordable_halls(hall_id)
	if max_count > 0:
		GameManager.buy_hall(hall_id, max_count)

func _process(_delta: float) -> void:
	var state: Dictionary = GameManager.hall_states.get(hall_id, {})
	if state.is_empty():
		return
	if not state.unlocked:
		visible = false
		return
	visible = true
	level_label.text = "Lv. %d" % state.level
	progress_bar.value = state.cycle_progress

	var cost = GameManager.get_hall_cost(hall_id, 1)
	cost_label.text = "Cost: %s" % cost.format()
	var affordable = GameManager.spirit_stones.gte(cost)
	buy_button.disabled = not affordable

	var cost10 = GameManager.get_hall_cost(hall_id, 10)
	buy_10_button.disabled = GameManager.spirit_stones.lt(cost10)

	var max_count = GameManager.get_max_affordable_halls(hall_id)
	buy_max_button.disabled = max_count <= 0
	if max_count > 0:
		buy_max_button.text = "x%d" % max_count

	if state.level > 0:
		var rev = GameManager.calculate_hall_revenue(hall_id)
		revenue_label.text = "Revenue: %s/cycle" % rev.format()
		var rps = GameManager.get_hall_revenue_per_second(hall_id)
		rps_label.text = "%s/s" % rps.format()
	else:
		revenue_label.text = "Not built yet"
		rps_label.text = ""

	if elder_button and elder_label:
		var elder_config := GameData.get_elder_for_hall(hall_id)
		if not elder_config.is_empty():
			if GameManager.elder_hired.get(elder_config.id, false):
				elder_button.visible = false
				elder_label.text = "%s (Active - 2x speed)" % elder_config.name
				elder_label.add_theme_color_override("font_color", XianxiaTheme.ACCENT_GOLD)
			else:
				elder_button.visible = true
				elder_button.disabled = GameManager.spirit_stones.lt(elder_config.cost)
				elder_label.text = "Cost: %s SS" % elder_config.cost.format()

func _on_hall_leveled(id: int, _new_level: int) -> void:
	if id == hall_id:
		_flash_border()

func _on_elder_hired(_id: int) -> void:
	pass

func _flash_border() -> void:
	var tween := create_tween()
	tween.tween_property(self, "modulate", Color(1.5, 1.5, 1.0), 0.1)
	tween.tween_property(self, "modulate", Color.WHITE, 0.2)
