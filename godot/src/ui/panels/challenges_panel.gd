extends ScrollContainer

var content: VBoxContainer
var active_challenge_label: Label
var challenge_progress_label: Label
var abandon_button: Button

func _ready() -> void:
	size_flags_horizontal = Control.SIZE_EXPAND_FILL
	size_flags_vertical = Control.SIZE_EXPAND_FILL

	content = VBoxContainer.new()
	content.add_theme_constant_override("separation", 10)
	content.size_flags_horizontal = Control.SIZE_EXPAND_FILL

	var title := Label.new()
	title.text = "Tribulation Challenges"
	title.add_theme_color_override("font_color", XianxiaTheme.ACCENT_RED)
	title.add_theme_font_size_override("font_size", 20)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(title)

	var desc := Label.new()
	desc.text = "Complete challenges with restrictions for permanent bonuses."
	desc.add_theme_color_override("font_color", XianxiaTheme.TEXT_SECONDARY)
	desc.add_theme_font_size_override("font_size", 12)
	desc.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	desc.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	content.add_child(desc)

	active_challenge_label = Label.new()
	active_challenge_label.add_theme_color_override("font_color", XianxiaTheme.ACCENT_RED)
	active_challenge_label.add_theme_font_size_override("font_size", 14)
	active_challenge_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(active_challenge_label)

	challenge_progress_label = Label.new()
	challenge_progress_label.add_theme_color_override("font_color", XianxiaTheme.TEXT_SECONDARY)
	challenge_progress_label.add_theme_font_size_override("font_size", 12)
	challenge_progress_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(challenge_progress_label)

	abandon_button = Button.new()
	abandon_button.text = "Abandon Challenge"
	abandon_button.add_theme_font_size_override("font_size", 12)
	abandon_button.pressed.connect(func(): GameManager.abandon_challenge())
	abandon_button.visible = false
	content.add_child(abandon_button)

	var sep := HSeparator.new()
	content.add_child(sep)

	for ch in GameData.challenge_configs:
		var card := _create_challenge_card(ch)
		content.add_child(card)

	add_child(content)

func _create_challenge_card(config: Dictionary) -> PanelContainer:
	var panel := PanelContainer.new()
	var style := StyleBoxFlat.new()
	style.bg_color = XianxiaTheme.BG_CARD
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_left = 6
	style.corner_radius_bottom_right = 6
	style.content_margin_left = 10
	style.content_margin_right = 10
	style.content_margin_top = 8
	style.content_margin_bottom = 8
	panel.add_theme_stylebox_override("panel", style)
	panel.set_meta("challenge_id", config.id)

	var vbox := VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 4)

	var top := HBoxContainer.new()
	var name_lbl := Label.new()
	name_lbl.text = config.name
	name_lbl.add_theme_color_override("font_color", XianxiaTheme.ACCENT_RED)
	name_lbl.add_theme_font_size_override("font_size", 14)
	name_lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	top.add_child(name_lbl)

	var status_lbl := Label.new()
	status_lbl.set_meta("status_label", true)
	status_lbl.add_theme_font_size_override("font_size", 12)
	top.add_child(status_lbl)
	vbox.add_child(top)

	var restrict := Label.new()
	restrict.text = "Restriction: %s" % config.restriction
	restrict.add_theme_color_override("font_color", XianxiaTheme.TEXT_SECONDARY)
	restrict.add_theme_font_size_override("font_size", 11)
	restrict.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	vbox.add_child(restrict)

	var target_lbl := Label.new()
	target_lbl.text = "Target: %s SS" % config.target_earnings.format()
	target_lbl.add_theme_color_override("font_color", XianxiaTheme.TEXT_MUTED)
	target_lbl.add_theme_font_size_override("font_size", 11)
	vbox.add_child(target_lbl)

	var reward := Label.new()
	reward.text = "Reward: %s" % config.reward_description
	reward.add_theme_color_override("font_color", XianxiaTheme.ACCENT_GOLD)
	reward.add_theme_font_size_override("font_size", 11)
	reward.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	vbox.add_child(reward)

	var start_btn := Button.new()
	start_btn.text = "Start Challenge"
	start_btn.add_theme_font_size_override("font_size", 12)
	var ch_id: int = config.id
	start_btn.pressed.connect(func(): GameManager.start_challenge(ch_id))
	start_btn.set_meta("start_button", true)
	vbox.add_child(start_btn)

	panel.add_child(vbox)
	return panel

func _process(_delta: float) -> void:
	if GameManager.active_challenge_id > 0:
		var ch = GameData.get_challenge(GameManager.active_challenge_id)
		active_challenge_label.text = "Active: %s" % ch.name
		var progress = GameManager.challenge_earnings.format()
		var target_str = ch.target_earnings.format()
		challenge_progress_label.text = "%s / %s SS" % [progress, target_str]
		abandon_button.visible = true
	else:
		active_challenge_label.text = "No active challenge"
		challenge_progress_label.text = ""
		abandon_button.visible = false

	for child in content.get_children():
		if child is PanelContainer and child.has_meta("challenge_id"):
			var ch_id: int = child.get_meta("challenge_id")
			var completed: bool = GameManager.challenge_completed.get(ch_id, false)
			var vbox := child.get_child(0)
			for node in vbox.get_children():
				if node is HBoxContainer:
					for sub in node.get_children():
						if sub is Label and sub.has_meta("status_label"):
							if completed:
								sub.text = "COMPLETED"
								sub.add_theme_color_override("font_color", XianxiaTheme.ACCENT_GREEN)
							elif GameManager.active_challenge_id == ch_id:
								sub.text = "ACTIVE"
								sub.add_theme_color_override("font_color", XianxiaTheme.ACCENT_GOLD)
							else:
								sub.text = ""
				if node is Button and node.has_meta("start_button"):
					node.disabled = completed or GameManager.active_challenge_id > 0
					if completed:
						node.text = "Completed"
