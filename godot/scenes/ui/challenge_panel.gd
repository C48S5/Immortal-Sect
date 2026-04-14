extends Control

const ACCENT_GOLD := Color(0.85, 0.7, 0.3)
const CARD_BG := Color(0.14, 0.12, 0.17)
const TEXT_BRIGHT := Color(0.95, 0.9, 0.8)
const TEXT_DIM := Color(0.6, 0.55, 0.5)
const ACTIVE_COLOR := Color(0.8, 0.5, 0.2)
const COMPLETED_COLOR := Color(0.3, 0.8, 0.4)
const LOCKED_COLOR := Color(0.4, 0.35, 0.3)

const CHALLENGE_DATA := [
	{"name": "Mortal Tribulation", "restriction": "No elders", "target": "Reach 10K SS", "reward": "+5% all revenue"},
	{"name": "Spirit Tribulation", "restriction": "Only 3 halls", "target": "Reach 100K SS", "reward": "+10% all revenue"},
	{"name": "Core Tribulation", "restriction": "No alchemy", "target": "Reach 1M SS", "reward": "+15% all revenue"},
	{"name": "Nascent Tribulation", "restriction": "Half cycle speed", "target": "Reach 10M SS", "reward": "+20% all revenue"},
	{"name": "Void Tribulation", "restriction": "No Dao path", "target": "Reach 100M SS", "reward": "+25% all revenue"},
	{"name": "Heaven Tribulation", "restriction": "No clicking", "target": "Reach 1B SS", "reward": "+30% all revenue"},
	{"name": "Immortal Tribulation", "restriction": "1 hall only", "target": "Reach 10B SS", "reward": "+50% all revenue"},
	{"name": "Divine Tribulation", "restriction": "No upgrades past Lv10", "target": "Reach 100B SS", "reward": "x2 all revenue"},
	{"name": "Dao Tribulation", "restriction": "All restrictions", "target": "Reach 1T SS", "reward": "x3 all revenue"},
	{"name": "Chaos Tribulation", "restriction": "Inverse costs", "target": "Reach 10T SS", "reward": "x5 click power"},
	{"name": "Primordial Tribulation", "restriction": "No mandates", "target": "Reach 100T SS", "reward": "x5 all revenue"},
	{"name": "Origin Tribulation", "restriction": "Everything disabled", "target": "Reach 1Q SS", "reward": "x10 all revenue"},
]

var challenge_cards: Array[Dictionary] = []


func _ready() -> void:
	_build_ui()


func _build_ui() -> void:
	var vbox := VBoxContainer.new()
	vbox.set_anchors_preset(Control.PRESET_FULL_RECT)
	vbox.add_theme_constant_override("separation", 8)
	add_child(vbox)

	var title := Label.new()
	title.text = "Tribulation Challenges"
	title.add_theme_font_size_override("font_size", 20)
	title.add_theme_color_override("font_color", ACCENT_GOLD)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vbox.add_child(title)

	var desc := Label.new()
	desc.text = "Overcome restrictions for permanent bonuses"
	desc.add_theme_font_size_override("font_size", 12)
	desc.add_theme_color_override("font_color", TEXT_DIM)
	desc.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vbox.add_child(desc)

	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	vbox.add_child(scroll)

	var list := VBoxContainer.new()
	list.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	list.add_theme_constant_override("separation", 6)
	scroll.add_child(list)

	for i in range(CHALLENGE_DATA.size()):
		var card := _create_challenge_card(i)
		list.add_child(card["panel"])
		challenge_cards.append(card)


func _create_challenge_card(idx: int) -> Dictionary:
	var data: Dictionary = CHALLENGE_DATA[idx]
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
	margin.add_theme_constant_override("margin_top", 8)
	margin.add_theme_constant_override("margin_bottom", 8)
	panel.add_child(margin)

	var hbox := HBoxContainer.new()
	hbox.add_theme_constant_override("separation", 12)
	margin.add_child(hbox)

	var info := VBoxContainer.new()
	info.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	info.add_theme_constant_override("separation", 2)
	hbox.add_child(info)

	var name_lbl := Label.new()
	name_lbl.text = data["name"]
	name_lbl.add_theme_color_override("font_color", TEXT_BRIGHT)
	name_lbl.add_theme_font_size_override("font_size", 14)
	info.add_child(name_lbl)

	var restriction_lbl := Label.new()
	restriction_lbl.text = "Restriction: " + data["restriction"]
	restriction_lbl.add_theme_color_override("font_color", ACTIVE_COLOR)
	restriction_lbl.add_theme_font_size_override("font_size", 11)
	info.add_child(restriction_lbl)

	var target_lbl := Label.new()
	target_lbl.text = "Target: " + data["target"]
	target_lbl.add_theme_color_override("font_color", TEXT_DIM)
	target_lbl.add_theme_font_size_override("font_size", 11)
	info.add_child(target_lbl)

	var reward_lbl := Label.new()
	reward_lbl.text = "Reward: " + data["reward"]
	reward_lbl.add_theme_color_override("font_color", ACCENT_GOLD)
	reward_lbl.add_theme_font_size_override("font_size", 11)
	info.add_child(reward_lbl)

	var right_vbox := VBoxContainer.new()
	right_vbox.add_theme_constant_override("separation", 4)
	hbox.add_child(right_vbox)

	var status_lbl := Label.new()
	status_lbl.text = "Locked"
	status_lbl.add_theme_color_override("font_color", LOCKED_COLOR)
	status_lbl.add_theme_font_size_override("font_size", 12)
	status_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	right_vbox.add_child(status_lbl)

	var progress_bar := ProgressBar.new()
	progress_bar.min_value = 0.0
	progress_bar.max_value = 1.0
	progress_bar.value = 0.0
	progress_bar.show_percentage = false
	progress_bar.custom_minimum_size = Vector2(80, 10)
	progress_bar.visible = false
	_style_progress(progress_bar)
	right_vbox.add_child(progress_bar)

	var enter_btn := Button.new()
	enter_btn.text = "Enter"
	enter_btn.custom_minimum_size = Vector2(70, 28)
	_style_button(enter_btn)
	enter_btn.pressed.connect(_on_enter.bind(idx))
	right_vbox.add_child(enter_btn)

	var exit_btn := Button.new()
	exit_btn.text = "Exit"
	exit_btn.custom_minimum_size = Vector2(70, 28)
	exit_btn.visible = false
	_style_exit_button(exit_btn)
	exit_btn.pressed.connect(_on_exit.bind(idx))
	right_vbox.add_child(exit_btn)

	return {
		"panel": panel, "status_lbl": status_lbl, "progress_bar": progress_bar,
		"enter_btn": enter_btn, "exit_btn": exit_btn, "idx": idx,
	}


func _style_progress(bar: ProgressBar) -> void:
	var bg := StyleBoxFlat.new()
	bg.bg_color = Color(0.08, 0.06, 0.1)
	bg.corner_radius_top_left = 3
	bg.corner_radius_top_right = 3
	bg.corner_radius_bottom_left = 3
	bg.corner_radius_bottom_right = 3
	bar.add_theme_stylebox_override("background", bg)

	var fill := StyleBoxFlat.new()
	fill.bg_color = ACTIVE_COLOR
	fill.corner_radius_top_left = 3
	fill.corner_radius_top_right = 3
	fill.corner_radius_bottom_left = 3
	fill.corner_radius_bottom_right = 3
	bar.add_theme_stylebox_override("fill", fill)


func _style_button(btn: Button) -> void:
	var sb := StyleBoxFlat.new()
	sb.bg_color = ACCENT_GOLD * Color(1, 1, 1, 0.2)
	sb.corner_radius_top_left = 4
	sb.corner_radius_top_right = 4
	sb.corner_radius_bottom_left = 4
	sb.corner_radius_bottom_right = 4
	btn.add_theme_stylebox_override("normal", sb)
	btn.add_theme_color_override("font_color", ACCENT_GOLD)
	btn.add_theme_font_size_override("font_size", 12)


func _style_exit_button(btn: Button) -> void:
	var sb := StyleBoxFlat.new()
	sb.bg_color = Color(0.5, 0.2, 0.2, 0.3)
	sb.corner_radius_top_left = 4
	sb.corner_radius_top_right = 4
	sb.corner_radius_bottom_left = 4
	sb.corner_radius_bottom_right = 4
	btn.add_theme_stylebox_override("normal", sb)
	btn.add_theme_color_override("font_color", Color(0.9, 0.4, 0.4))
	btn.add_theme_font_size_override("font_size", 12)


func _on_enter(idx: int) -> void:
	if has_node("/root/ChallengeManager") and get_node("/root/ChallengeManager").has_method("enter_challenge"):
		get_node("/root/ChallengeManager").enter_challenge(idx)


func _on_exit(idx: int) -> void:
	if has_node("/root/ChallengeManager") and get_node("/root/ChallengeManager").has_method("exit_challenge"):
		get_node("/root/ChallengeManager").exit_challenge(idx)


func update() -> void:
	if not has_node("/root/ChallengeManager"):
		return
	var cm := get_node("/root/ChallengeManager")

	for card in challenge_cards:
		var idx: int = card["idx"]
		var status := "locked"
		if cm.has_method("get_challenge_status"):
			status = cm.get_challenge_status(idx)

		match status:
			"locked":
				card["status_lbl"].text = "🔒 Locked"
				card["status_lbl"].add_theme_color_override("font_color", LOCKED_COLOR)
				card["enter_btn"].visible = false
				card["exit_btn"].visible = false
				card["progress_bar"].visible = false
			"available":
				card["status_lbl"].text = "Available"
				card["status_lbl"].add_theme_color_override("font_color", TEXT_BRIGHT)
				card["enter_btn"].visible = true
				card["exit_btn"].visible = false
				card["progress_bar"].visible = false
			"active":
				card["status_lbl"].text = "⚡ Active"
				card["status_lbl"].add_theme_color_override("font_color", ACTIVE_COLOR)
				card["enter_btn"].visible = false
				card["exit_btn"].visible = true
				card["progress_bar"].visible = true
				if cm.has_method("get_challenge_progress"):
					card["progress_bar"].value = cm.get_challenge_progress(idx)
			"completed":
				card["status_lbl"].text = "✓ Completed"
				card["status_lbl"].add_theme_color_override("font_color", COMPLETED_COLOR)
				card["enter_btn"].visible = false
				card["exit_btn"].visible = false
				card["progress_bar"].visible = false
