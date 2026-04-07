extends PanelContainer

var ss_label: Label
var hdp_label: Label
var ae_label: Label
var rps_label: Label

func _ready() -> void:
	var hbox := HBoxContainer.new()
	hbox.add_theme_constant_override("separation", 24)

	ss_label = _create_currency_display("Spirit Stones", XianxiaTheme.ACCENT_GOLD)
	hdp_label = _create_currency_display("HDP", XianxiaTheme.ACCENT_PURPLE)
	ae_label = _create_currency_display("Alchemy Essence", XianxiaTheme.ACCENT_GREEN)
	rps_label = _create_currency_display("Income/s", XianxiaTheme.ACCENT_CYAN)

	hbox.add_child(ss_label)
	hbox.add_child(rps_label)
	hbox.add_child(hdp_label)
	hbox.add_child(ae_label)
	add_child(hbox)

	var style := StyleBoxFlat.new()
	style.bg_color = Color("0a0d18")
	style.content_margin_left = 16
	style.content_margin_right = 16
	style.content_margin_top = 8
	style.content_margin_bottom = 8
	style.corner_radius_bottom_left = 8
	style.corner_radius_bottom_right = 8
	add_theme_stylebox_override("panel", style)

	EventBus.spirit_stones_changed.connect(_on_ss_changed)

func _create_currency_display(label_text: String, color: Color) -> Label:
	var lbl := Label.new()
	lbl.text = "%s: 0" % label_text
	lbl.add_theme_color_override("font_color", color)
	lbl.add_theme_font_size_override("font_size", 16)
	return lbl

func _process(_delta: float) -> void:
	ss_label.text = "Spirit Stones: %s" % GameManager.spirit_stones.format()
	rps_label.text = "Income/s: %s" % GameManager.get_total_revenue_per_second().format()
	hdp_label.text = "HDP: %d" % GameManager.hdp
	ae_label.text = "AE: %.0f" % GameManager.alchemy_essence

func _on_ss_changed(_amount) -> void:
	pass
