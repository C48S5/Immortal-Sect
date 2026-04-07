extends ScrollContainer

var content: VBoxContainer

func _ready() -> void:
	size_flags_horizontal = Control.SIZE_EXPAND_FILL
	size_flags_vertical = Control.SIZE_EXPAND_FILL

	content = VBoxContainer.new()
	content.add_theme_constant_override("separation", 8)
	content.size_flags_horizontal = Control.SIZE_EXPAND_FILL

	var title := Label.new()
	title.text = "Cultivation Halls"
	title.add_theme_color_override("font_color", XianxiaTheme.ACCENT_TEAL)
	title.add_theme_font_size_override("font_size", 20)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(title)

	for i in range(1, 13):
		var card_script := preload("res://src/ui/components/hall_card.gd")
		var card := PanelContainer.new()
		card.set_script(card_script)
		card.setup(i)
		content.add_child(card)

	add_child(content)
