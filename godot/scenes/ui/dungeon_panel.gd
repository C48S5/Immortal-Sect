extends Control

const ACCENT_GOLD := Color(0.85, 0.7, 0.3)
const CARD_BG := Color(0.14, 0.12, 0.17)
const TEXT_BRIGHT := Color(0.95, 0.9, 0.8)
const TEXT_DIM := Color(0.6, 0.55, 0.5)
const DUNGEON_COLORS := [
	Color(0.3, 0.6, 0.4),
	Color(0.4, 0.4, 0.7),
	Color(0.7, 0.4, 0.3),
	Color(0.6, 0.5, 0.2),
	Color(0.5, 0.3, 0.6),
]

const REALM_DATA := [
	{"name": "Misty Spirit Caves", "element": "Water", "floors": 100},
	{"name": "Thunderpeak Ruins", "element": "Lightning", "floors": 100},
	{"name": "Infernal Abyss", "element": "Fire", "floors": 100},
	{"name": "Celestial Jade Palace", "element": "Earth", "floors": 100},
	{"name": "Void Boundary Rift", "element": "Void", "floors": 100},
]

var selected_realm: int = 0
var realm_tab_btns: Array[Button] = []
var lbl_floor: Label
var lbl_keys: Label
var lbl_key_regen: Label
var lbl_idle_rewards: Label
var push_btn: Button
var collect_btn: Button
var floor_progress: ProgressBar


func _ready() -> void:
	_build_ui()


func _build_ui() -> void:
	var vbox := VBoxContainer.new()
	vbox.set_anchors_preset(Control.PRESET_FULL_RECT)
	vbox.add_theme_constant_override("separation", 10)
	add_child(vbox)

	var title := Label.new()
	title.text = "Secret Realms"
	title.add_theme_font_size_override("font_size", 20)
	title.add_theme_color_override("font_color", ACCENT_GOLD)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vbox.add_child(title)

	_build_realm_tabs(vbox)
	_build_realm_info(vbox)
	_build_actions(vbox)


func _build_realm_tabs(parent: VBoxContainer) -> void:
	var hbox := HBoxContainer.new()
	hbox.add_theme_constant_override("separation", 4)
	hbox.alignment = BoxContainer.ALIGNMENT_CENTER
	parent.add_child(hbox)

	for i in range(REALM_DATA.size()):
		var btn := Button.new()
		btn.text = REALM_DATA[i]["name"].split(" ")[0]
		btn.custom_minimum_size = Vector2(0, 30)
		btn.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		btn.pressed.connect(_on_realm_tab.bind(i))
		_style_realm_tab(btn, i == selected_realm, i)
		hbox.add_child(btn)
		realm_tab_btns.append(btn)


func _style_realm_tab(btn: Button, active: bool, idx: int) -> void:
	var sb := StyleBoxFlat.new()
	var color: Color = DUNGEON_COLORS[idx] if idx < DUNGEON_COLORS.size() else ACCENT_GOLD
	sb.corner_radius_top_left = 4
	sb.corner_radius_top_right = 4
	sb.content_margin_left = 8
	sb.content_margin_right = 8
	if active:
		sb.bg_color = color * Color(1, 1, 1, 0.3)
		sb.border_width_bottom = 2
		sb.border_color = color
	else:
		sb.bg_color = Color(0.1, 0.08, 0.12)
	btn.add_theme_stylebox_override("normal", sb)
	btn.add_theme_color_override("font_color", color if active else TEXT_DIM)
	btn.add_theme_font_size_override("font_size", 11)


func _build_realm_info(parent: VBoxContainer) -> void:
	var panel := _make_card()
	parent.add_child(panel)
	var margin := panel.get_child(0)

	var info := VBoxContainer.new()
	info.add_theme_constant_override("separation", 6)
	margin.add_child(info)

	lbl_floor = Label.new()
	lbl_floor.text = "Current Floor: 1 / 100"
	lbl_floor.add_theme_color_override("font_color", TEXT_BRIGHT)
	lbl_floor.add_theme_font_size_override("font_size", 16)
	info.add_child(lbl_floor)

	floor_progress = ProgressBar.new()
	floor_progress.min_value = 0
	floor_progress.max_value = 100
	floor_progress.value = 1
	floor_progress.show_percentage = false
	floor_progress.custom_minimum_size.y = 12
	_style_progress(floor_progress)
	info.add_child(floor_progress)

	var keys_hbox := HBoxContainer.new()
	keys_hbox.add_theme_constant_override("separation", 16)
	info.add_child(keys_hbox)

	lbl_keys = Label.new()
	lbl_keys.text = "Keys: 5/5"
	lbl_keys.add_theme_color_override("font_color", ACCENT_GOLD)
	keys_hbox.add_child(lbl_keys)

	lbl_key_regen = Label.new()
	lbl_key_regen.text = "Next key: —"
	lbl_key_regen.add_theme_color_override("font_color", TEXT_DIM)
	lbl_key_regen.add_theme_font_size_override("font_size", 12)
	keys_hbox.add_child(lbl_key_regen)

	lbl_idle_rewards = Label.new()
	lbl_idle_rewards.text = "Idle Rewards: 0 SS"
	lbl_idle_rewards.add_theme_color_override("font_color", ACCENT_GOLD)
	lbl_idle_rewards.add_theme_font_size_override("font_size", 14)
	info.add_child(lbl_idle_rewards)


func _build_actions(parent: VBoxContainer) -> void:
	var hbox := HBoxContainer.new()
	hbox.alignment = BoxContainer.ALIGNMENT_CENTER
	hbox.add_theme_constant_override("separation", 16)
	parent.add_child(hbox)

	push_btn = Button.new()
	push_btn.text = "Push Floor (1 Key)"
	push_btn.custom_minimum_size = Vector2(160, 40)
	_style_action_button(push_btn, ACCENT_GOLD)
	push_btn.pressed.connect(_on_push)
	hbox.add_child(push_btn)

	collect_btn = Button.new()
	collect_btn.text = "Collect Idle Rewards"
	collect_btn.custom_minimum_size = Vector2(170, 40)
	_style_action_button(collect_btn, Color(0.3, 0.7, 0.4))
	collect_btn.pressed.connect(_on_collect)
	hbox.add_child(collect_btn)


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
	margin.add_theme_constant_override("margin_left", 14)
	margin.add_theme_constant_override("margin_right", 14)
	margin.add_theme_constant_override("margin_top", 12)
	margin.add_theme_constant_override("margin_bottom", 12)
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
	fill.bg_color = DUNGEON_COLORS[0]
	fill.corner_radius_top_left = 3
	fill.corner_radius_top_right = 3
	fill.corner_radius_bottom_left = 3
	fill.corner_radius_bottom_right = 3
	bar.add_theme_stylebox_override("fill", fill)


func _style_action_button(btn: Button, color: Color) -> void:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color * Color(1, 1, 1, 0.2)
	sb.corner_radius_top_left = 6
	sb.corner_radius_top_right = 6
	sb.corner_radius_bottom_left = 6
	sb.corner_radius_bottom_right = 6
	sb.border_width_bottom = 2
	sb.border_color = color
	btn.add_theme_stylebox_override("normal", sb)
	btn.add_theme_color_override("font_color", color)
	btn.add_theme_font_size_override("font_size", 13)


func _on_realm_tab(idx: int) -> void:
	selected_realm = idx
	for i in range(realm_tab_btns.size()):
		_style_realm_tab(realm_tab_btns[i], i == idx, i)
	update()


func _on_push() -> void:
	if has_node("/root/DungeonManager") and get_node("/root/DungeonManager").has_method("push_floor"):
		get_node("/root/DungeonManager").push_floor(selected_realm)


func _on_collect() -> void:
	if has_node("/root/DungeonManager") and get_node("/root/DungeonManager").has_method("collect_idle"):
		get_node("/root/DungeonManager").collect_idle(selected_realm)


func update() -> void:
	if not has_node("/root/DungeonManager"):
		return
	var dm := get_node("/root/DungeonManager")

	if dm.has_method("get_realm_floor"):
		var floor_num: int = dm.get_realm_floor(selected_realm)
		var max_floors: int = REALM_DATA[selected_realm]["floors"]
		lbl_floor.text = "Current Floor: %d / %d" % [floor_num, max_floors]
		floor_progress.max_value = max_floors
		floor_progress.value = floor_num

	if dm.has_method("get_keys"):
		var keys: int = dm.get_keys(selected_realm)
		var max_keys: int = 5
		lbl_keys.text = "Keys: %d/%d" % [keys, max_keys]

	if dm.has_method("get_key_regen_time"):
		var t: float = dm.get_key_regen_time(selected_realm)
		if t > 0:
			lbl_key_regen.text = "Next key: %d:%02d" % [int(t) / 60, int(t) % 60]
		else:
			lbl_key_regen.text = "Next key: —"

	if dm.has_method("get_idle_rewards"):
		lbl_idle_rewards.text = "Idle Rewards: %s SS" % _format(dm.get_idle_rewards(selected_realm))


func _format(value) -> String:
	if value is float or value is int:
		if value >= 1_000_000_000:
			return "%.2fB" % (value / 1_000_000_000.0)
		elif value >= 1_000_000:
			return "%.2fM" % (value / 1_000_000.0)
		elif value >= 1_000:
			return "%.2fK" % (value / 1_000.0)
		return str(snapped(value, 0.1))
	return str(value)
