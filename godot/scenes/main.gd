extends Control

const TAB_NAMES: Array[String] = [
	"Sect", "Elders", "Alchemy", "Dao Path", "Challenges",
	"Ascension", "Mandates", "HDP Shop", "Disciples",
	"Dungeons", "Legacy", "Missions", "Settings"
]

const BG_COLOR := Color(0.08, 0.06, 0.1)
const SIDEBAR_COLOR := Color(0.1, 0.08, 0.13)
const ACCENT_GOLD := Color(0.85, 0.7, 0.3)
const TEXT_DIM := Color(0.6, 0.55, 0.5)

var currency_bar: PanelContainer
var sidebar: VBoxContainer
var content_area: PanelContainer
var content_container: Control
var panels: Dictionary = {}
var tab_buttons: Array[Button] = []
var active_tab: String = "Sect"

var tick_timer: Timer
var ui_timer: Timer


func _ready() -> void:
	_apply_background()
	_build_ui()
	_init_managers()
	_setup_timers()
	_switch_tab("Sect")


func _apply_background() -> void:
	var bg := StyleBoxFlat.new()
	bg.bg_color = BG_COLOR
	add_theme_stylebox_override("panel", bg)


func _build_ui() -> void:
	var root_vbox := VBoxContainer.new()
	root_vbox.set_anchors_preset(Control.PRESET_FULL_RECT)
	root_vbox.add_theme_constant_override("separation", 0)
	add_child(root_vbox)

	_build_currency_bar(root_vbox)
	_build_main_content(root_vbox)


func _build_currency_bar(parent: VBoxContainer) -> void:
	var CurrencyBarScript := preload("res://scenes/ui/currency_bar.gd")
	currency_bar = PanelContainer.new()
	currency_bar.set_script(CurrencyBarScript)
	currency_bar.custom_minimum_size.y = 48
	parent.add_child(currency_bar)


func _build_main_content(parent: VBoxContainer) -> void:
	var hbox := HBoxContainer.new()
	hbox.size_flags_vertical = Control.SIZE_EXPAND_FILL
	hbox.add_theme_constant_override("separation", 0)
	parent.add_child(hbox)

	_build_sidebar(hbox)
	_build_content_area(hbox)
	_build_panels()


func _build_sidebar(parent: HBoxContainer) -> void:
	var sidebar_panel := PanelContainer.new()
	sidebar_panel.custom_minimum_size.x = 160
	var sb := StyleBoxFlat.new()
	sb.bg_color = SIDEBAR_COLOR
	sb.border_width_right = 1
	sb.border_color = ACCENT_GOLD * Color(1, 1, 1, 0.3)
	sidebar_panel.add_theme_stylebox_override("panel", sb)
	parent.add_child(sidebar_panel)

	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	sidebar_panel.add_child(scroll)

	sidebar = VBoxContainer.new()
	sidebar.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	sidebar.add_theme_constant_override("separation", 2)
	scroll.add_child(sidebar)

	for tab_name in TAB_NAMES:
		var btn := Button.new()
		btn.text = tab_name
		btn.alignment = HORIZONTAL_ALIGNMENT_LEFT
		btn.custom_minimum_size.y = 36
		btn.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		_style_tab_button(btn, false)
		btn.pressed.connect(_on_tab_pressed.bind(tab_name))
		sidebar.add_child(btn)
		tab_buttons.append(btn)


func _style_tab_button(btn: Button, active: bool) -> void:
	var normal := StyleBoxFlat.new()
	var hover := StyleBoxFlat.new()
	var pressed := StyleBoxFlat.new()

	if active:
		normal.bg_color = ACCENT_GOLD * Color(1, 1, 1, 0.2)
		normal.border_width_left = 3
		normal.border_color = ACCENT_GOLD
	else:
		normal.bg_color = Color.TRANSPARENT
	normal.content_margin_left = 12
	normal.content_margin_right = 8

	hover.bg_color = ACCENT_GOLD * Color(1, 1, 1, 0.1)
	hover.content_margin_left = 12
	hover.content_margin_right = 8

	pressed.bg_color = ACCENT_GOLD * Color(1, 1, 1, 0.25)
	pressed.content_margin_left = 12
	pressed.content_margin_right = 8

	btn.add_theme_stylebox_override("normal", normal)
	btn.add_theme_stylebox_override("hover", hover)
	btn.add_theme_stylebox_override("pressed", pressed)
	btn.add_theme_color_override("font_color", ACCENT_GOLD if active else TEXT_DIM)
	btn.add_theme_color_override("font_hover_color", ACCENT_GOLD)


func _build_content_area(parent: HBoxContainer) -> void:
	content_area = PanelContainer.new()
	content_area.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	content_area.size_flags_vertical = Control.SIZE_EXPAND_FILL
	var sb := StyleBoxFlat.new()
	sb.bg_color = BG_COLOR
	sb.content_margin_left = 12
	sb.content_margin_right = 12
	sb.content_margin_top = 8
	sb.content_margin_bottom = 8
	content_area.add_theme_stylebox_override("panel", sb)
	parent.add_child(content_area)

	content_container = Control.new()
	content_container.set_anchors_preset(Control.PRESET_FULL_RECT)
	content_container.mouse_filter = Control.MOUSE_FILTER_IGNORE
	content_area.add_child(content_container)


func _build_panels() -> void:
	var panel_scripts: Dictionary = {
		"Sect": preload("res://scenes/ui/sect_panel.gd"),
		"Elders": preload("res://scenes/ui/elder_panel.gd"),
		"Alchemy": preload("res://scenes/ui/alchemy_panel.gd"),
		"Dao Path": preload("res://scenes/ui/dao_path_panel.gd"),
		"Challenges": preload("res://scenes/ui/challenge_panel.gd"),
		"Ascension": preload("res://scenes/ui/ascension_panel.gd"),
		"Mandates": preload("res://scenes/ui/mandate_panel.gd"),
		"HDP Shop": preload("res://scenes/ui/hdp_shop_panel.gd"),
		"Disciples": preload("res://scenes/ui/disciple_panel.gd"),
		"Dungeons": preload("res://scenes/ui/dungeon_panel.gd"),
		"Legacy": preload("res://scenes/ui/legacy_panel.gd"),
		"Missions": preload("res://scenes/ui/mission_panel.gd"),
		"Settings": preload("res://scenes/ui/settings_panel.gd"),
	}

	for tab_name in TAB_NAMES:
		var panel: Control
		if panel_scripts.has(tab_name):
			panel = Control.new()
			panel.set_script(panel_scripts[tab_name])
		else:
			panel = _make_placeholder(tab_name)
		panel.set_anchors_preset(Control.PRESET_FULL_RECT)
		panel.visible = false
		content_container.add_child(panel)
		panels[tab_name] = panel


func _make_placeholder(tab_name: String) -> Control:
	var c := Control.new()
	var lbl := Label.new()
	lbl.text = tab_name + " — Coming Soon"
	lbl.add_theme_color_override("font_color", TEXT_DIM)
	lbl.set_anchors_preset(Control.PRESET_CENTER)
	c.add_child(lbl)
	return c


func _init_managers() -> void:
	if Engine.has_singleton("HallManager"):
		return
	for mgr_name in ["HallManager", "ElderManager", "AlchemyManager",
			"DaoPathManager", "ChallengeManager", "DungeonManager",
			"MandateManager", "DiscipleManager", "LegacyManager",
			"MissionManager", "GameManager"]:
		if has_node("/root/" + mgr_name):
			var mgr := get_node("/root/" + mgr_name)
			if mgr.has_method("init_halls"):
				mgr.init_halls()
			elif mgr.has_method("init_elders"):
				mgr.init_elders()
			elif mgr.has_method("init_data"):
				mgr.init_data()


func _setup_timers() -> void:
	tick_timer = Timer.new()
	tick_timer.wait_time = 0.05
	tick_timer.autostart = true
	tick_timer.timeout.connect(_on_tick_timer)
	add_child(tick_timer)

	ui_timer = Timer.new()
	ui_timer.wait_time = 0.25
	ui_timer.autostart = true
	ui_timer.timeout.connect(_on_ui_timer)
	add_child(ui_timer)


func _on_tick_timer() -> void:
	var dt := 0.05
	_call_manager("HallManager", "tick_cycles", [dt])
	_call_manager("AlchemyManager", "tick_buffs", [dt])
	_call_manager("DaoPathManager", "tick_spell", [dt])
	_call_manager("DungeonManager", "tick_idle_farming", [dt])
	_call_manager("DungeonManager", "tick_key_regen", [dt])


func _on_ui_timer() -> void:
	if currency_bar and currency_bar.has_method("update"):
		currency_bar.update()
	if panels.has(active_tab):
		var p = panels[active_tab]
		if p.has_method("update"):
			p.update()


func _call_manager(mgr_name: String, method: String, args: Array) -> void:
	if has_node("/root/" + mgr_name):
		var mgr := get_node("/root/" + mgr_name)
		if mgr.has_method(method):
			mgr.callv(method, args)


func _on_tab_pressed(tab_name: String) -> void:
	_switch_tab(tab_name)


func _switch_tab(tab_name: String) -> void:
	active_tab = tab_name
	for key in panels:
		panels[key].visible = (key == tab_name)
	for i in range(tab_buttons.size()):
		_style_tab_button(tab_buttons[i], TAB_NAMES[i] == tab_name)
	_on_ui_timer()
