extends ScrollContainer

var content: VBoxContainer
var hdp_label: Label
var earnings_label: Label
var hdp_gain_label: Label
var hdp_mult_label: Label
var ascend_button: Button
var ascension_count_label: Label
var stats_container: VBoxContainer

func _ready() -> void:
	size_flags_horizontal = Control.SIZE_EXPAND_FILL
	size_flags_vertical = Control.SIZE_EXPAND_FILL

	content = VBoxContainer.new()
	content.add_theme_constant_override("separation", 12)
	content.size_flags_horizontal = Control.SIZE_EXPAND_FILL

	var title := Label.new()
	title.text = "Ascension"
	title.add_theme_color_override("font_color", XianxiaTheme.ACCENT_GOLD)
	title.add_theme_font_size_override("font_size", 22)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(title)

	var desc := Label.new()
	desc.text = "Ascend to gain Heavenly Dao Points (HDP).\nEach unspent HDP gives +2% permanent income.\nHalls, Elders, and Spirit Stones reset."
	desc.add_theme_color_override("font_color", XianxiaTheme.TEXT_SECONDARY)
	desc.add_theme_font_size_override("font_size", 12)
	desc.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	desc.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	content.add_child(desc)

	hdp_label = Label.new()
	hdp_label.add_theme_color_override("font_color", XianxiaTheme.ACCENT_PURPLE)
	hdp_label.add_theme_font_size_override("font_size", 18)
	hdp_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(hdp_label)

	hdp_mult_label = Label.new()
	hdp_mult_label.add_theme_color_override("font_color", XianxiaTheme.ACCENT_GOLD)
	hdp_mult_label.add_theme_font_size_override("font_size", 14)
	hdp_mult_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(hdp_mult_label)

	var sep := HSeparator.new()
	content.add_child(sep)

	earnings_label = Label.new()
	earnings_label.add_theme_color_override("font_color", XianxiaTheme.TEXT_PRIMARY)
	earnings_label.add_theme_font_size_override("font_size", 14)
	earnings_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(earnings_label)

	hdp_gain_label = Label.new()
	hdp_gain_label.add_theme_color_override("font_color", XianxiaTheme.ACCENT_GREEN)
	hdp_gain_label.add_theme_font_size_override("font_size", 16)
	hdp_gain_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(hdp_gain_label)

	ascend_button = Button.new()
	ascend_button.text = "ASCEND"
	ascend_button.add_theme_font_size_override("font_size", 20)
	ascend_button.pressed.connect(_on_ascend)
	var ascend_style := StyleBoxFlat.new()
	ascend_style.bg_color = Color("3d1a00")
	ascend_style.corner_radius_top_left = 8
	ascend_style.corner_radius_top_right = 8
	ascend_style.corner_radius_bottom_left = 8
	ascend_style.corner_radius_bottom_right = 8
	ascend_style.border_width_bottom = 2
	ascend_style.border_width_top = 2
	ascend_style.border_width_left = 2
	ascend_style.border_width_right = 2
	ascend_style.border_color = XianxiaTheme.ACCENT_GOLD
	ascend_style.content_margin_top = 12
	ascend_style.content_margin_bottom = 12
	ascend_button.add_theme_stylebox_override("normal", ascend_style)
	ascend_button.add_theme_color_override("font_color", XianxiaTheme.ACCENT_GOLD)
	content.add_child(ascend_button)

	ascension_count_label = Label.new()
	ascension_count_label.add_theme_color_override("font_color", XianxiaTheme.TEXT_MUTED)
	ascension_count_label.add_theme_font_size_override("font_size", 12)
	ascension_count_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(ascension_count_label)

	var sep2 := HSeparator.new()
	content.add_child(sep2)

	var stats_title := Label.new()
	stats_title.text = "Run Statistics"
	stats_title.add_theme_color_override("font_color", XianxiaTheme.TEXT_PRIMARY)
	stats_title.add_theme_font_size_override("font_size", 16)
	content.add_child(stats_title)

	stats_container = VBoxContainer.new()
	stats_container.add_theme_constant_override("separation", 4)
	content.add_child(stats_container)

	add_child(content)

func _on_ascend() -> void:
	if GameManager.can_ascend():
		GameManager.perform_ascension()

func _process(_delta: float) -> void:
	hdp_label.text = "Heavenly Dao Points: %d" % GameManager.hdp
	var mult := GameManager._get_hdp_multiplier()
	hdp_mult_label.text = "Income Multiplier: x%.2f" % mult
	earnings_label.text = "This Run Earnings: %s SS" % GameManager.total_earnings_this_run.format()

	var gain := GameManager.get_hdp_on_ascension()
	if gain > 0:
		hdp_gain_label.text = "Ascend for +%d HDP" % gain
		hdp_gain_label.add_theme_color_override("font_color", XianxiaTheme.ACCENT_GREEN)
		ascend_button.disabled = false
	else:
		hdp_gain_label.text = "Need more earnings to Ascend"
		hdp_gain_label.add_theme_color_override("font_color", XianxiaTheme.TEXT_MUTED)
		ascend_button.disabled = true

	ascension_count_label.text = "Total Ascensions: %d" % GameManager.ascension_count

	for child in stats_container.get_children():
		child.queue_free()

	var unlocked := 0
	var total_levels := 0
	var elders := 0
	for hall_id in GameManager.hall_states:
		var s: Dictionary = GameManager.hall_states[hall_id]
		if s.unlocked:
			unlocked += 1
		total_levels += s.level
	for eid in GameManager.elder_hired:
		if GameManager.elder_hired[eid]:
			elders += 1

	_add_stat("Halls Unlocked: %d / 12" % unlocked)
	_add_stat("Total Hall Levels: %d" % total_levels)
	_add_stat("Elders Hired: %d / 12" % elders)
	_add_stat("Play Time: %s" % _format_time(GameManager.total_play_time))

func _add_stat(text: String) -> void:
	var lbl := Label.new()
	lbl.text = text
	lbl.add_theme_color_override("font_color", XianxiaTheme.TEXT_SECONDARY)
	lbl.add_theme_font_size_override("font_size", 12)
	stats_container.add_child(lbl)

func _format_time(seconds: float) -> String:
	var hrs := int(seconds) / 3600
	var mins := (int(seconds) % 3600) / 60
	var secs := int(seconds) % 60
	if hrs > 0:
		return "%dh %dm %ds" % [hrs, mins, secs]
	elif mins > 0:
		return "%dm %ds" % [mins, secs]
	return "%ds" % secs
