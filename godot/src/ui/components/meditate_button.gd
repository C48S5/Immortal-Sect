extends VBoxContainer

var button: Button
var label: Label
var pulse_tween: Tween

func _ready() -> void:
	alignment = BoxContainer.ALIGNMENT_CENTER

	button = Button.new()
	button.custom_minimum_size = Vector2(160, 160)
	button.text = "Meditate"
	button.pressed.connect(_on_pressed)
	button.add_theme_font_size_override("font_size", 22)

	var btn_style := StyleBoxFlat.new()
	btn_style.bg_color = Color("003d38")
	btn_style.corner_radius_top_left = 80
	btn_style.corner_radius_top_right = 80
	btn_style.corner_radius_bottom_left = 80
	btn_style.corner_radius_bottom_right = 80
	btn_style.border_width_bottom = 3
	btn_style.border_width_top = 3
	btn_style.border_width_left = 3
	btn_style.border_width_right = 3
	btn_style.border_color = XianxiaTheme.ACCENT_TEAL
	button.add_theme_stylebox_override("normal", btn_style)

	var btn_hover := btn_style.duplicate()
	btn_hover.bg_color = Color("005550")
	btn_hover.border_color = Color("00ffd4")
	button.add_theme_stylebox_override("hover", btn_hover)

	var btn_pressed := btn_style.duplicate()
	btn_pressed.bg_color = Color("002420")
	button.add_theme_stylebox_override("pressed", btn_pressed)

	button.add_theme_color_override("font_color", XianxiaTheme.ACCENT_TEAL)
	button.add_theme_color_override("font_hover_color", Color("00ffd4"))

	add_child(button)

	label = Label.new()
	label.text = "Tap to gather Qi"
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	label.add_theme_color_override("font_color", XianxiaTheme.TEXT_SECONDARY)
	label.add_theme_font_size_override("font_size", 12)
	add_child(label)

	_start_pulse()

func _start_pulse() -> void:
	if pulse_tween:
		pulse_tween.kill()
	pulse_tween = create_tween().set_loops()
	pulse_tween.tween_property(button, "modulate", Color(1.2, 1.2, 1.2), 1.0)
	pulse_tween.tween_property(button, "modulate", Color.WHITE, 1.0)

func _on_pressed() -> void:
	GameManager.do_meditate()
	_bounce_animation()

func _bounce_animation() -> void:
	var tween := create_tween()
	tween.tween_property(button, "scale", Vector2(0.9, 0.9), 0.05)
	tween.tween_property(button, "scale", Vector2(1.05, 1.05), 0.08)
	tween.tween_property(button, "scale", Vector2.ONE, 0.07)
