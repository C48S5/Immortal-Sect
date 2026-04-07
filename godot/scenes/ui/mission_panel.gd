extends Control

const ACCENT_GOLD := Color(0.85, 0.7, 0.3)
const CARD_BG := Color(0.14, 0.12, 0.17)
const TEXT_BRIGHT := Color(0.95, 0.9, 0.8)
const TEXT_DIM := Color(0.6, 0.55, 0.5)
const MISSION_COMPLETE := Color(0.3, 0.8, 0.4)
const CHECKIN_COLOR := Color(0.4, 0.6, 0.9)

const DAILY_MISSIONS := [
	{"name": "Diligent Cultivator", "desc": "Meditate 100 times", "reward": "500 SS"},
	{"name": "Hall Overseer", "desc": "Buy 10 hall upgrades", "reward": "1,000 SS"},
	{"name": "Realm Explorer", "desc": "Push 5 dungeon floors", "reward": "50 DC"},
]

var checkin_btn: Button
var lbl_checkin_status: Label
var mission_cards: Array[Dictionary] = []


func _ready() -> void:
	_build_ui()


func _build_ui() -> void:
	var vbox := VBoxContainer.new()
	vbox.set_anchors_preset(Control.PRESET_FULL_RECT)
	vbox.add_theme_constant_override("separation", 10)
	add_child(vbox)

	var title := Label.new()
	title.text = "Daily Missions"
	title.add_theme_font_size_override("font_size", 20)
	title.add_theme_color_override("font_color", ACCENT_GOLD)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vbox.add_child(title)

	_build_checkin(vbox)
	_build_missions(vbox)


func _build_checkin(parent: VBoxContainer) -> void:
	var panel := _make_card()
	parent.add_child(panel)
	var margin := panel.get_child(0)

	var hbox := HBoxContainer.new()
	hbox.add_theme_constant_override("separation", 12)
	margin.add_child(hbox)

	var info := VBoxContainer.new()
	info.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	info.add_theme_constant_override("separation", 4)
	hbox.add_child(info)

	var header := Label.new()
	header.text = "Daily Check-In"
	header.add_theme_color_override("font_color", CHECKIN_COLOR)
	header.add_theme_font_size_override("font_size", 16)
	info.add_child(header)

	lbl_checkin_status = Label.new()
	lbl_checkin_status.text = "Check in daily for bonus rewards!"
	lbl_checkin_status.add_theme_color_override("font_color", TEXT_DIM)
	lbl_checkin_status.add_theme_font_size_override("font_size", 12)
	info.add_child(lbl_checkin_status)

	checkin_btn = Button.new()
	checkin_btn.text = "Check In"
	checkin_btn.custom_minimum_size = Vector2(100, 38)
	_style_checkin_button()
	checkin_btn.pressed.connect(_on_checkin)
	hbox.add_child(checkin_btn)


func _build_missions(parent: VBoxContainer) -> void:
	var header := Label.new()
	header.text = "Today's Missions"
	header.add_theme_font_size_override("font_size", 15)
	header.add_theme_color_override("font_color", TEXT_BRIGHT)
	parent.add_child(header)

	for i in range(DAILY_MISSIONS.size()):
		var card := _create_mission_card(i)
		parent.add_child(card["panel"])
		mission_cards.append(card)


func _create_mission_card(idx: int) -> Dictionary:
	var data: Dictionary = DAILY_MISSIONS[idx]
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

	var vbox := VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 6)
	margin.add_child(vbox)

	var top_row := HBoxContainer.new()
	top_row.add_theme_constant_override("separation", 8)
	vbox.add_child(top_row)

	var name_lbl := Label.new()
	name_lbl.text = data["name"]
	name_lbl.add_theme_color_override("font_color", TEXT_BRIGHT)
	name_lbl.add_theme_font_size_override("font_size", 14)
	name_lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	top_row.add_child(name_lbl)

	var reward_lbl := Label.new()
	reward_lbl.text = "Reward: " + data["reward"]
	reward_lbl.add_theme_color_override("font_color", ACCENT_GOLD)
	reward_lbl.add_theme_font_size_override("font_size", 12)
	top_row.add_child(reward_lbl)

	var desc_lbl := Label.new()
	desc_lbl.text = data["desc"]
	desc_lbl.add_theme_color_override("font_color", TEXT_DIM)
	desc_lbl.add_theme_font_size_override("font_size", 12)
	vbox.add_child(desc_lbl)

	var bottom_row := HBoxContainer.new()
	bottom_row.add_theme_constant_override("separation", 8)
	vbox.add_child(bottom_row)

	var progress_bar := ProgressBar.new()
	progress_bar.min_value = 0.0
	progress_bar.max_value = 1.0
	progress_bar.value = 0.0
	progress_bar.show_percentage = false
	progress_bar.custom_minimum_size = Vector2(0, 12)
	progress_bar.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_style_progress(progress_bar)
	bottom_row.add_child(progress_bar)

	var progress_lbl := Label.new()
	progress_lbl.text = "0%"
	progress_lbl.add_theme_color_override("font_color", TEXT_DIM)
	progress_lbl.add_theme_font_size_override("font_size", 11)
	progress_lbl.custom_minimum_size.x = 40
	progress_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	bottom_row.add_child(progress_lbl)

	var claim_btn := Button.new()
	claim_btn.text = "Claim"
	claim_btn.custom_minimum_size = Vector2(65, 28)
	claim_btn.visible = false
	_style_claim_button(claim_btn)
	claim_btn.pressed.connect(_on_claim.bind(idx))
	bottom_row.add_child(claim_btn)

	return {
		"panel": panel, "progress_bar": progress_bar, "progress_lbl": progress_lbl,
		"claim_btn": claim_btn, "idx": idx,
	}


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


func _style_progress(bar: ProgressBar) -> void:
	var bg := StyleBoxFlat.new()
	bg.bg_color = Color(0.08, 0.06, 0.1)
	bg.corner_radius_top_left = 3
	bg.corner_radius_top_right = 3
	bg.corner_radius_bottom_left = 3
	bg.corner_radius_bottom_right = 3
	bar.add_theme_stylebox_override("background", bg)

	var fill := StyleBoxFlat.new()
	fill.bg_color = ACCENT_GOLD * Color(1, 1, 1, 0.7)
	fill.corner_radius_top_left = 3
	fill.corner_radius_top_right = 3
	fill.corner_radius_bottom_left = 3
	fill.corner_radius_bottom_right = 3
	bar.add_theme_stylebox_override("fill", fill)


func _style_checkin_button() -> void:
	var sb := StyleBoxFlat.new()
	sb.bg_color = CHECKIN_COLOR * Color(1, 1, 1, 0.25)
	sb.corner_radius_top_left = 6
	sb.corner_radius_top_right = 6
	sb.corner_radius_bottom_left = 6
	sb.corner_radius_bottom_right = 6
	sb.border_width_bottom = 2
	sb.border_color = CHECKIN_COLOR
	checkin_btn.add_theme_stylebox_override("normal", sb)
	checkin_btn.add_theme_color_override("font_color", CHECKIN_COLOR)
	checkin_btn.add_theme_font_size_override("font_size", 14)


func _style_claim_button(btn: Button) -> void:
	var sb := StyleBoxFlat.new()
	sb.bg_color = MISSION_COMPLETE * Color(1, 1, 1, 0.25)
	sb.corner_radius_top_left = 4
	sb.corner_radius_top_right = 4
	sb.corner_radius_bottom_left = 4
	sb.corner_radius_bottom_right = 4
	btn.add_theme_stylebox_override("normal", sb)
	btn.add_theme_color_override("font_color", MISSION_COMPLETE)
	btn.add_theme_font_size_override("font_size", 11)


func _on_checkin() -> void:
	if has_node("/root/MissionManager") and get_node("/root/MissionManager").has_method("daily_checkin"):
		get_node("/root/MissionManager").daily_checkin()


func _on_claim(idx: int) -> void:
	if has_node("/root/MissionManager") and get_node("/root/MissionManager").has_method("claim_mission"):
		get_node("/root/MissionManager").claim_mission(idx)


func update() -> void:
	if not has_node("/root/MissionManager"):
		return
	var mm := get_node("/root/MissionManager")

	if mm.has_method("is_checked_in"):
		if mm.is_checked_in():
			checkin_btn.disabled = true
			checkin_btn.text = "Done"
			lbl_checkin_status.text = "Already checked in today!"
			lbl_checkin_status.add_theme_color_override("font_color", MISSION_COMPLETE)
		else:
			checkin_btn.disabled = false
			checkin_btn.text = "Check In"
			lbl_checkin_status.text = "Check in daily for bonus rewards!"

	for card in mission_cards:
		var idx: int = card["idx"]
		if mm.has_method("get_mission_progress"):
			var progress: float = mm.get_mission_progress(idx)
			card["progress_bar"].value = progress
			card["progress_lbl"].text = "%d%%" % int(progress * 100)
			if progress >= 1.0:
				card["progress_lbl"].add_theme_color_override("font_color", MISSION_COMPLETE)

		if mm.has_method("is_mission_claimable"):
			card["claim_btn"].visible = mm.is_mission_claimable(idx)

		if mm.has_method("is_mission_claimed") and mm.is_mission_claimed(idx):
			card["claim_btn"].visible = false
			card["progress_lbl"].text = "Claimed"
			card["progress_lbl"].add_theme_color_override("font_color", MISSION_COMPLETE)
