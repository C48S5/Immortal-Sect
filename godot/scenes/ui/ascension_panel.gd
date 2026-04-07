extends Control

const ACCENT_GOLD := Color(0.85, 0.7, 0.3)
const CARD_BG := Color(0.14, 0.12, 0.17)
const TEXT_BRIGHT := Color(0.95, 0.9, 0.8)
const TEXT_DIM := Color(0.6, 0.55, 0.5)
const ASCEND_COLOR := Color(0.6, 0.3, 0.8)

var lbl_hdp_preview: Label
var lbl_hdp_current: Label
var lbl_hdp_multiplier: Label
var lbl_ascension_count: Label
var lbl_best_hdp: Label
var lbl_fastest: Label
var ascend_btn: Button
var ascend_confirm: ConfirmationDialog


func _ready() -> void:
	_build_ui()


func _build_ui() -> void:
	var vbox := VBoxContainer.new()
	vbox.set_anchors_preset(Control.PRESET_FULL_RECT)
	vbox.add_theme_constant_override("separation", 12)
	add_child(vbox)

	var title := Label.new()
	title.text = "Heavenly Ascension"
	title.add_theme_font_size_override("font_size", 20)
	title.add_theme_color_override("font_color", ASCEND_COLOR)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vbox.add_child(title)

	var desc := Label.new()
	desc.text = "Reset your progress to earn Heaven-Defying Points (HDP)\nHDP provide permanent multipliers to all production"
	desc.add_theme_font_size_override("font_size", 12)
	desc.add_theme_color_override("font_color", TEXT_DIM)
	desc.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	desc.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	vbox.add_child(desc)

	_build_preview_card(vbox)
	_build_ascend_button(vbox)
	_build_history_card(vbox)


func _build_preview_card(parent: VBoxContainer) -> void:
	var panel := _make_card()
	parent.add_child(panel)
	var margin := panel.get_child(0)

	var info := VBoxContainer.new()
	info.add_theme_constant_override("separation", 6)
	margin.add_child(info)

	var header := Label.new()
	header.text = "Ascension Preview"
	header.add_theme_color_override("font_color", TEXT_BRIGHT)
	header.add_theme_font_size_override("font_size", 16)
	info.add_child(header)

	lbl_hdp_current = Label.new()
	lbl_hdp_current.text = "Current HDP: 0"
	lbl_hdp_current.add_theme_color_override("font_color", TEXT_DIM)
	info.add_child(lbl_hdp_current)

	lbl_hdp_preview = Label.new()
	lbl_hdp_preview.text = "HDP on Ascension: +0"
	lbl_hdp_preview.add_theme_color_override("font_color", ASCEND_COLOR)
	lbl_hdp_preview.add_theme_font_size_override("font_size", 18)
	info.add_child(lbl_hdp_preview)

	lbl_hdp_multiplier = Label.new()
	lbl_hdp_multiplier.text = "Current Multiplier: x1.00"
	lbl_hdp_multiplier.add_theme_color_override("font_color", ACCENT_GOLD)
	info.add_child(lbl_hdp_multiplier)


func _build_ascend_button(parent: VBoxContainer) -> void:
	var center := CenterContainer.new()
	parent.add_child(center)

	ascend_btn = Button.new()
	ascend_btn.text = "  Ascend  "
	ascend_btn.custom_minimum_size = Vector2(200, 48)

	var sb := StyleBoxFlat.new()
	sb.bg_color = ASCEND_COLOR * Color(1, 1, 1, 0.3)
	sb.corner_radius_top_left = 8
	sb.corner_radius_top_right = 8
	sb.corner_radius_bottom_left = 8
	sb.corner_radius_bottom_right = 8
	sb.border_width_bottom = 3
	sb.border_color = ASCEND_COLOR
	ascend_btn.add_theme_stylebox_override("normal", sb)
	ascend_btn.add_theme_color_override("font_color", Color.WHITE)
	ascend_btn.add_theme_font_size_override("font_size", 18)
	ascend_btn.pressed.connect(_on_ascend_pressed)
	center.add_child(ascend_btn)

	ascend_confirm = ConfirmationDialog.new()
	ascend_confirm.dialog_text = "Are you sure you want to Ascend?\nAll halls, elders, and currencies will be reset.\nYou will keep your HDP and HDP shop upgrades."
	ascend_confirm.confirmed.connect(_on_ascend_confirmed)
	add_child(ascend_confirm)


func _build_history_card(parent: VBoxContainer) -> void:
	var panel := _make_card()
	parent.add_child(panel)
	var margin := panel.get_child(0)

	var info := VBoxContainer.new()
	info.add_theme_constant_override("separation", 4)
	margin.add_child(info)

	var header := Label.new()
	header.text = "Ascension History"
	header.add_theme_color_override("font_color", TEXT_BRIGHT)
	header.add_theme_font_size_override("font_size", 15)
	info.add_child(header)

	lbl_ascension_count = Label.new()
	lbl_ascension_count.text = "Total Ascensions: 0"
	lbl_ascension_count.add_theme_color_override("font_color", TEXT_DIM)
	info.add_child(lbl_ascension_count)

	lbl_best_hdp = Label.new()
	lbl_best_hdp.text = "Best HDP Earned: 0"
	lbl_best_hdp.add_theme_color_override("font_color", TEXT_DIM)
	info.add_child(lbl_best_hdp)

	lbl_fastest = Label.new()
	lbl_fastest.text = "Fastest Ascension: —"
	lbl_fastest.add_theme_color_override("font_color", TEXT_DIM)
	info.add_child(lbl_fastest)


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
	margin.add_theme_constant_override("margin_left", 12)
	margin.add_theme_constant_override("margin_right", 12)
	margin.add_theme_constant_override("margin_top", 10)
	margin.add_theme_constant_override("margin_bottom", 10)
	panel.add_child(margin)

	return panel


func _on_ascend_pressed() -> void:
	ascend_confirm.popup_centered()


func _on_ascend_confirmed() -> void:
	if has_node("/root/GameManager") and get_node("/root/GameManager").has_method("ascend"):
		get_node("/root/GameManager").ascend()


func update() -> void:
	if not has_node("/root/GameManager"):
		return
	var gm := get_node("/root/GameManager")

	if gm.has_method("get_hdp"):
		lbl_hdp_current.text = "Current HDP: %s" % _format(gm.get_hdp())

	if gm.has_method("get_hdp_preview"):
		lbl_hdp_preview.text = "HDP on Ascension: +%s" % _format(gm.get_hdp_preview())

	if gm.has_method("get_hdp_multiplier"):
		lbl_hdp_multiplier.text = "Current Multiplier: x%.2f" % gm.get_hdp_multiplier()

	if gm.has_method("get_ascension_count"):
		lbl_ascension_count.text = "Total Ascensions: %d" % gm.get_ascension_count()

	if gm.has_method("get_best_hdp"):
		lbl_best_hdp.text = "Best HDP Earned: %s" % _format(gm.get_best_hdp())

	if gm.has_method("get_fastest_ascension"):
		var t: float = gm.get_fastest_ascension()
		if t > 0:
			lbl_fastest.text = "Fastest Ascension: %d:%02d:%02d" % [int(t) / 3600, (int(t) % 3600) / 60, int(t) % 60]
		else:
			lbl_fastest.text = "Fastest Ascension: —"


func _format(value) -> String:
	if value is float or value is int:
		if value >= 1_000_000:
			return "%.2fM" % (value / 1_000_000.0)
		elif value >= 1_000:
			return "%.2fK" % (value / 1_000.0)
		return str(snapped(value, 0.1))
	return str(value)
