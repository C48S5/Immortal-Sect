extends PanelContainer

## Shown when returning from offline to display earnings.

var earnings: BigNumber
var duration: float

func setup(earned: BigNumber, dur: float) -> void:
	earnings = earned
	duration = dur

func _ready() -> void:
	var style := StyleBoxFlat.new()
	style.bg_color = Color(0.05, 0.07, 0.15, 0.95)
	style.corner_radius_top_left = 12
	style.corner_radius_top_right = 12
	style.corner_radius_bottom_left = 12
	style.corner_radius_bottom_right = 12
	style.border_width_bottom = 2
	style.border_width_top = 2
	style.border_width_left = 2
	style.border_width_right = 2
	style.border_color = XianxiaTheme.ACCENT_PURPLE
	style.content_margin_left = 40
	style.content_margin_right = 40
	style.content_margin_top = 30
	style.content_margin_bottom = 30
	add_theme_stylebox_override("panel", style)

	var vbox := VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 16)

	var title := Label.new()
	title.text = "Closed Cultivation Complete"
	title.add_theme_color_override("font_color", XianxiaTheme.ACCENT_PURPLE)
	title.add_theme_font_size_override("font_size", 22)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vbox.add_child(title)

	var dur_lbl := Label.new()
	var hrs := int(duration) / 3600
	var mins := (int(duration) % 3600) / 60
	dur_lbl.text = "Your sect cultivated for %dh %dm in closed meditation." % [hrs, mins]
	dur_lbl.add_theme_color_override("font_color", XianxiaTheme.TEXT_SECONDARY)
	dur_lbl.add_theme_font_size_override("font_size", 14)
	dur_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	dur_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	vbox.add_child(dur_lbl)

	if earnings:
		var earn_lbl := Label.new()
		earn_lbl.text = "+%s Spirit Stones" % earnings.format()
		earn_lbl.add_theme_color_override("font_color", XianxiaTheme.ACCENT_GOLD)
		earn_lbl.add_theme_font_size_override("font_size", 20)
		earn_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		vbox.add_child(earn_lbl)

	var dismiss_btn := Button.new()
	dismiss_btn.text = "Continue Cultivation"
	dismiss_btn.add_theme_font_size_override("font_size", 16)
	dismiss_btn.pressed.connect(queue_free)
	vbox.add_child(dismiss_btn)

	add_child(vbox)

	set_anchors_and_offsets_preset(Control.PRESET_CENTER)
