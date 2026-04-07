extends PanelContainer

const ACCENT_GOLD := Color(0.85, 0.7, 0.3)
const BAR_BG := Color(0.12, 0.1, 0.15)
const TEXT_BRIGHT := Color(0.95, 0.9, 0.8)
const TEXT_DIM := Color(0.6, 0.55, 0.5)

var lbl_ss: Label
var lbl_ss_rate: Label
var lbl_hdp: Label
var lbl_ae: Label
var lbl_rt: Label
var lbl_hs: Label
var lbl_dc: Label
var lbl_qr: Label

var currency_labels: Dictionary = {}


func _ready() -> void:
	_apply_style()
	_build_ui()


func _apply_style() -> void:
	var sb := StyleBoxFlat.new()
	sb.bg_color = BAR_BG
	sb.border_width_bottom = 1
	sb.border_color = ACCENT_GOLD * Color(1, 1, 1, 0.4)
	sb.content_margin_left = 16
	sb.content_margin_right = 16
	sb.content_margin_top = 6
	sb.content_margin_bottom = 6
	add_theme_stylebox_override("panel", sb)


func _build_ui() -> void:
	var hbox := HBoxContainer.new()
	hbox.add_theme_constant_override("separation", 24)
	hbox.alignment = BoxContainer.ALIGNMENT_CENTER
	add_child(hbox)

	lbl_ss = _add_currency_pair(hbox, "Spirit Stones", "0")
	lbl_ss_rate = _add_rate_label(hbox)

	lbl_hdp = _add_currency_pair(hbox, "HDP", "0")
	lbl_ae = _add_currency_pair(hbox, "AE", "0")
	lbl_rt = _add_currency_pair(hbox, "RT", "0")
	lbl_hs = _add_currency_pair(hbox, "HS", "0")
	lbl_dc = _add_currency_pair(hbox, "DC", "0")
	lbl_qr = _add_currency_pair(hbox, "QR", "0")

	currency_labels = {
		"ss": lbl_ss, "ss_rate": lbl_ss_rate,
		"hdp": lbl_hdp, "ae": lbl_ae, "rt": lbl_rt,
		"hs": lbl_hs, "dc": lbl_dc, "qr": lbl_qr,
	}


func _add_currency_pair(parent: HBoxContainer, label_text: String, initial_value: String) -> Label:
	var container := HBoxContainer.new()
	container.add_theme_constant_override("separation", 6)
	parent.add_child(container)

	var name_lbl := Label.new()
	name_lbl.text = label_text + ":"
	name_lbl.add_theme_color_override("font_color", TEXT_DIM)
	name_lbl.add_theme_font_size_override("font_size", 13)
	container.add_child(name_lbl)

	var val_lbl := Label.new()
	val_lbl.text = initial_value
	val_lbl.add_theme_color_override("font_color", ACCENT_GOLD)
	val_lbl.add_theme_font_size_override("font_size", 14)
	container.add_child(val_lbl)

	return val_lbl


func _add_rate_label(parent: HBoxContainer) -> Label:
	var lbl := Label.new()
	lbl.text = "(+0/s)"
	lbl.add_theme_color_override("font_color", TEXT_DIM)
	lbl.add_theme_font_size_override("font_size", 12)
	parent.add_child(lbl)
	return lbl


func update() -> void:
	if not has_node("/root/GameManager"):
		_update_placeholder()
		return
	var gm := get_node("/root/GameManager")
	if gm.has_method("get_spirit_stones"):
		lbl_ss.text = _format(gm.get_spirit_stones())
	if gm.has_method("get_ss_per_second"):
		lbl_ss_rate.text = "(+" + _format(gm.get_ss_per_second()) + "/s)"
	if gm.has_method("get_hdp"):
		lbl_hdp.text = _format(gm.get_hdp())
	if gm.has_method("get_alchemy_essence"):
		lbl_ae.text = _format(gm.get_alchemy_essence())
	if gm.has_method("get_realm_tokens"):
		lbl_rt.text = _format(gm.get_realm_tokens())
	if gm.has_method("get_hero_souls"):
		lbl_hs.text = _format(gm.get_hero_souls())
	if gm.has_method("get_dungeon_coins"):
		lbl_dc.text = _format(gm.get_dungeon_coins())
	if gm.has_method("get_qi_remnants"):
		lbl_qr.text = _format(gm.get_qi_remnants())


func _update_placeholder() -> void:
	lbl_ss.text = "0"
	lbl_ss_rate.text = "(+0/s)"


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
		else:
			return str(snapped(value, 0.01))
	return str(value)
