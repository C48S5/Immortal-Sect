extends Control

const ACCENT_GOLD := Color(0.85, 0.7, 0.3)
const BG_DARK := Color(0.08, 0.06, 0.1)
const PANEL_BG := Color(0.12, 0.1, 0.15)
const TEXT_BRIGHT := Color(0.95, 0.9, 0.8)
const TEXT_DIM := Color(0.6, 0.55, 0.5)
const MEDITATE_COLOR := Color(0.15, 0.4, 0.25)
const MEDITATE_HOVER := Color(0.2, 0.5, 0.3)

var meditate_btn: Button
var meditate_label: Label
var hall_container: VBoxContainer
var hall_cards: Array = []
var buy_mode: int = 1
var buy_buttons: Array[Button] = []

const HALL_CARD_SCRIPT := preload("res://scenes/ui/hall_card.gd")


func _ready() -> void:
	_build_ui()


func _build_ui() -> void:
	var vbox := VBoxContainer.new()
	vbox.set_anchors_preset(Control.PRESET_FULL_RECT)
	vbox.add_theme_constant_override("separation", 8)
	add_child(vbox)

	_build_header(vbox)
	_build_meditate_section(vbox)
	_build_buy_mode_bar(vbox)
	_build_hall_list(vbox)


func _build_header(parent: VBoxContainer) -> void:
	var title := Label.new()
	title.text = "Immortal Sect"
	title.add_theme_font_size_override("font_size", 22)
	title.add_theme_color_override("font_color", ACCENT_GOLD)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	parent.add_child(title)

	var subtitle := Label.new()
	subtitle.text = "Cultivate your spirit, build your sect, ascend to immortality"
	subtitle.add_theme_font_size_override("font_size", 12)
	subtitle.add_theme_color_override("font_color", TEXT_DIM)
	subtitle.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	parent.add_child(subtitle)


func _build_meditate_section(parent: VBoxContainer) -> void:
	var center := CenterContainer.new()
	center.custom_minimum_size.y = 80
	parent.add_child(center)

	var med_vbox := VBoxContainer.new()
	med_vbox.add_theme_constant_override("separation", 4)
	center.add_child(med_vbox)

	meditate_btn = Button.new()
	meditate_btn.text = "  Meditate  "
	meditate_btn.custom_minimum_size = Vector2(220, 52)
	_style_meditate_button()
	meditate_btn.pressed.connect(_on_meditate_pressed)
	med_vbox.add_child(meditate_btn)

	meditate_label = Label.new()
	meditate_label.text = "+1 Spirit Stone per click"
	meditate_label.add_theme_font_size_override("font_size", 11)
	meditate_label.add_theme_color_override("font_color", TEXT_DIM)
	meditate_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	med_vbox.add_child(meditate_label)


func _style_meditate_button() -> void:
	var normal := StyleBoxFlat.new()
	normal.bg_color = MEDITATE_COLOR
	normal.border_width_bottom = 3
	normal.border_width_left = 1
	normal.border_width_right = 1
	normal.border_width_top = 1
	normal.border_color = ACCENT_GOLD * Color(1, 1, 1, 0.5)
	normal.corner_radius_top_left = 8
	normal.corner_radius_top_right = 8
	normal.corner_radius_bottom_left = 8
	normal.corner_radius_bottom_right = 8
	normal.content_margin_left = 16
	normal.content_margin_right = 16

	var hover := normal.duplicate()
	hover.bg_color = MEDITATE_HOVER

	var pressed := normal.duplicate()
	pressed.bg_color = MEDITATE_COLOR * Color(0.8, 0.8, 0.8, 1.0)
	pressed.border_width_bottom = 1
	pressed.content_margin_top = 2

	meditate_btn.add_theme_stylebox_override("normal", normal)
	meditate_btn.add_theme_stylebox_override("hover", hover)
	meditate_btn.add_theme_stylebox_override("pressed", pressed)
	meditate_btn.add_theme_font_size_override("font_size", 18)
	meditate_btn.add_theme_color_override("font_color", ACCENT_GOLD)
	meditate_btn.add_theme_color_override("font_hover_color", Color.WHITE)


func _build_buy_mode_bar(parent: VBoxContainer) -> void:
	var hbox := HBoxContainer.new()
	hbox.add_theme_constant_override("separation", 6)
	hbox.alignment = BoxContainer.ALIGNMENT_CENTER
	parent.add_child(hbox)

	var lbl := Label.new()
	lbl.text = "Buy:"
	lbl.add_theme_color_override("font_color", TEXT_DIM)
	hbox.add_child(lbl)

	for mode in [1, 10, 100, -1]:
		var btn := Button.new()
		btn.text = "Max" if mode == -1 else "x%d" % mode
		btn.custom_minimum_size = Vector2(52, 28)
		btn.pressed.connect(_on_buy_mode.bind(mode))
		_style_buy_button(btn, mode == buy_mode)
		hbox.add_child(btn)
		buy_buttons.append(btn)


func _style_buy_button(btn: Button, active: bool) -> void:
	var sb := StyleBoxFlat.new()
	sb.corner_radius_top_left = 4
	sb.corner_radius_top_right = 4
	sb.corner_radius_bottom_left = 4
	sb.corner_radius_bottom_right = 4
	sb.content_margin_left = 8
	sb.content_margin_right = 8
	if active:
		sb.bg_color = ACCENT_GOLD * Color(1, 1, 1, 0.3)
		sb.border_width_bottom = 2
		sb.border_color = ACCENT_GOLD
	else:
		sb.bg_color = PANEL_BG
	btn.add_theme_stylebox_override("normal", sb)
	btn.add_theme_color_override("font_color", ACCENT_GOLD if active else TEXT_DIM)
	btn.add_theme_font_size_override("font_size", 12)


func _build_hall_list(parent: VBoxContainer) -> void:
	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	parent.add_child(scroll)

	hall_container = VBoxContainer.new()
	hall_container.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	hall_container.add_theme_constant_override("separation", 6)
	scroll.add_child(hall_container)

	_populate_halls()


func _populate_halls() -> void:
	for cfg in HallManager.HALL_CONFIGS:
		var card := PanelContainer.new()
		card.set_script(HALL_CARD_SCRIPT)
		hall_container.add_child(card)
		if card.has_method("setup"):
			card.setup(cfg.id, cfg.name, buy_mode)
		hall_cards.append(card)


func _on_meditate_pressed() -> void:
	if has_node("/root/GameManager"):
		get_node("/root/GameManager").meditate()
	_pulse_meditate()


func _pulse_meditate() -> void:
	var tween := create_tween()
	tween.tween_property(meditate_btn, "scale", Vector2(0.95, 0.95), 0.05)
	tween.tween_property(meditate_btn, "scale", Vector2(1.0, 1.0), 0.1)
	meditate_btn.pivot_offset = meditate_btn.size / 2.0


func _on_buy_mode(mode: int) -> void:
	buy_mode = mode
	var modes := [1, 10, 100, -1]
	for i in range(buy_buttons.size()):
		_style_buy_button(buy_buttons[i], modes[i] == mode)
	for card in hall_cards:
		if card.has_method("set_buy_mode"):
			card.set_buy_mode(mode)


func update() -> void:
	if has_node("/root/GameManager") and get_node("/root/GameManager").has_method("get_meditate_value"):
		var val = get_node("/root/GameManager").get_meditate_value()
		meditate_label.text = "+%s Spirit Stones per click" % _format(val)

	for card in hall_cards:
		if card.has_method("update"):
			card.update()


func _format(value) -> String:
	if has_node("/root/BigNumber") and get_node("/root/BigNumber").has_method("format_number"):
		return get_node("/root/BigNumber").format_number(value)
	if value is float or value is int:
		if value >= 1_000_000:
			return "%.2fM" % (value / 1_000_000.0)
		elif value >= 1_000:
			return "%.2fK" % (value / 1_000.0)
		return str(snapped(value, 0.1))
	return str(value)
