extends Control

## Flying treasure that appears periodically. Tap for bonus income.

var speed: float = 150.0
var direction: Vector2 = Vector2.RIGHT
var treasure_button: Button
var value_mult: float = 1.0

func _ready() -> void:
	treasure_button = Button.new()
	treasure_button.text = "⚔️"
	treasure_button.add_theme_font_size_override("font_size", 28)
	treasure_button.custom_minimum_size = Vector2(48, 48)
	treasure_button.pressed.connect(_on_collected)
	var style := StyleBoxFlat.new()
	style.bg_color = Color(1, 0.85, 0, 0.2)
	style.corner_radius_top_left = 24
	style.corner_radius_top_right = 24
	style.corner_radius_bottom_left = 24
	style.corner_radius_bottom_right = 24
	style.border_width_bottom = 2
	style.border_width_top = 2
	style.border_width_left = 2
	style.border_width_right = 2
	style.border_color = XianxiaTheme.ACCENT_GOLD
	treasure_button.add_theme_stylebox_override("normal", style)
	treasure_button.add_theme_color_override("font_color", XianxiaTheme.ACCENT_GOLD)
	add_child(treasure_button)

	var icons := ["⚔️", "🔥", "💎", "🌟", "🐉"]
	treasure_button.text = icons[randi() % icons.size()]

	direction = Vector2(randf_range(-1, 1), randf_range(-1, 1)).normalized()
	speed = randf_range(80, 200)
	value_mult = randf_range(1.0, 5.0)

	position = Vector2(
		randf_range(50, 400),
		randf_range(50, 500)
	)

	var tween := create_tween().set_loops(3)
	tween.tween_property(self, "modulate:a", 0.5, 0.5)
	tween.tween_property(self, "modulate:a", 1.0, 0.5)

	get_tree().create_timer(8.0).timeout.connect(queue_free)

func _process(delta: float) -> void:
	position += direction * speed * delta
	var viewport_size := get_viewport_rect().size
	if position.x < 0 or position.x > viewport_size.x - 50:
		direction.x = -direction.x
	if position.y < 0 or position.y > viewport_size.y - 50:
		direction.y = -direction.y

func _on_collected() -> void:
	var rps = GameManager.get_total_revenue_per_second()
	var BN = preload("res://src/core/big_number.gd")
	var value = rps.mul(10.0 * value_mult).max_bn(BN.new(10))
	GameManager._earn_spirit_stones(value)
	EventBus.treasure_collected.emit(value)
	_show_value_popup(value)
	queue_free()

func _show_value_popup(value) -> void:
	var popup := Label.new()
	popup.text = "+%s SS" % value.format()
	popup.add_theme_color_override("font_color", XianxiaTheme.ACCENT_GOLD)
	popup.add_theme_font_size_override("font_size", 18)
	popup.position = position
	get_parent().add_child(popup)
	var tween := popup.create_tween()
	tween.tween_property(popup, "position:y", popup.position.y - 60, 1.0)
	tween.parallel().tween_property(popup, "modulate:a", 0.0, 1.0)
	tween.tween_callback(popup.queue_free)
