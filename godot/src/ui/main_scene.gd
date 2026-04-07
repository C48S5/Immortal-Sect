extends Control

## Main game scene - assembles all UI panels with tab navigation.

var tab_buttons: Dictionary = {}
var panels: Dictionary = {}
var current_tab: String = "halls"
var treasure_layer: Control
var currency_bar_instance: PanelContainer

const TAB_ORDER := ["halls", "dao", "alchemy", "challenges", "prestige", "settings"]
const TAB_LABELS := {
	"halls": "Halls",
	"dao": "Dao Path",
	"alchemy": "Alchemy",
	"challenges": "Challenges",
	"prestige": "Ascension",
	"settings": "Settings"
}

func _ready() -> void:
	var bg_color := ColorRect.new()
	bg_color.color = XianxiaTheme.BG_DARK
	bg_color.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_child(bg_color)

	theme = XianxiaTheme.create_theme()

	var main_vbox := VBoxContainer.new()
	main_vbox.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	main_vbox.add_theme_constant_override("separation", 0)
	add_child(main_vbox)

	_build_currency_bar(main_vbox)

	var content_hbox := HBoxContainer.new()
	content_hbox.size_flags_vertical = Control.SIZE_EXPAND_FILL
	content_hbox.add_theme_constant_override("separation", 0)
	main_vbox.add_child(content_hbox)

	_build_left_column(content_hbox)
	_build_center_content(content_hbox)

	treasure_layer = Control.new()
	treasure_layer.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	treasure_layer.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(treasure_layer)

	EventBus.treasure_spawned.connect(_on_treasure_spawned)
	EventBus.offline_earnings_calculated.connect(_on_offline_return)
	EventBus.hall_unlocked.connect(_on_hall_unlocked)

	call_deferred("_load_game")

func _load_game() -> void:
	SaveManager.load_game()

func _build_currency_bar(parent: VBoxContainer) -> void:
	var bar_script := preload("res://src/ui/components/currency_bar.gd")
	currency_bar_instance = PanelContainer.new()
	currency_bar_instance.set_script(bar_script)
	parent.add_child(currency_bar_instance)

func _build_left_column(parent: HBoxContainer) -> void:
	var left := VBoxContainer.new()
	left.custom_minimum_size = Vector2(200, 0)
	left.add_theme_constant_override("separation", 0)

	var left_panel := PanelContainer.new()
	left_panel.size_flags_vertical = Control.SIZE_EXPAND_FILL
	var left_style := StyleBoxFlat.new()
	left_style.bg_color = XianxiaTheme.BG_PANEL
	left_style.content_margin_left = 0
	left_style.content_margin_right = 0
	left_style.content_margin_top = 8
	left_style.content_margin_bottom = 8
	left_panel.add_theme_stylebox_override("panel", left_style)

	var nav := VBoxContainer.new()
	nav.add_theme_constant_override("separation", 2)

	var meditate_script := preload("res://src/ui/components/meditate_button.gd")
	var meditate := VBoxContainer.new()
	meditate.set_script(meditate_script)
	meditate.custom_minimum_size = Vector2(0, 180)
	nav.add_child(meditate)

	var sep := HSeparator.new()
	nav.add_child(sep)

	for tab_key in TAB_ORDER:
		var btn := Button.new()
		btn.text = TAB_LABELS[tab_key]
		btn.add_theme_font_size_override("font_size", 14)
		btn.alignment = HORIZONTAL_ALIGNMENT_LEFT
		var tab: String = tab_key
		btn.pressed.connect(func(): _switch_tab(tab))
		tab_buttons[tab_key] = btn
		nav.add_child(btn)

	left_panel.add_child(nav)
	left.add_child(left_panel)
	parent.add_child(left)

func _build_center_content(parent: HBoxContainer) -> void:
	var center := PanelContainer.new()
	center.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	center.size_flags_vertical = Control.SIZE_EXPAND_FILL
	var center_style := StyleBoxFlat.new()
	center_style.bg_color = Color("0f1225")
	center_style.content_margin_left = 12
	center_style.content_margin_right = 12
	center_style.content_margin_top = 8
	center_style.content_margin_bottom = 8
	center.add_theme_stylebox_override("panel", center_style)

	var container := Control.new()
	container.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)

	var halls_panel_script := preload("res://src/ui/panels/halls_panel.gd")
	var halls_panel := ScrollContainer.new()
	halls_panel.set_script(halls_panel_script)
	halls_panel.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	panels["halls"] = halls_panel
	container.add_child(halls_panel)

	var dao_panel_script := preload("res://src/ui/panels/dao_path_panel.gd")
	var dao_panel := ScrollContainer.new()
	dao_panel.set_script(dao_panel_script)
	dao_panel.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	panels["dao"] = dao_panel
	container.add_child(dao_panel)

	var alchemy_panel_script := preload("res://src/ui/panels/alchemy_panel.gd")
	var alchemy_panel := ScrollContainer.new()
	alchemy_panel.set_script(alchemy_panel_script)
	alchemy_panel.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	panels["alchemy"] = alchemy_panel
	container.add_child(alchemy_panel)

	var challenges_panel_script := preload("res://src/ui/panels/challenges_panel.gd")
	var challenges_panel := ScrollContainer.new()
	challenges_panel.set_script(challenges_panel_script)
	challenges_panel.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	panels["challenges"] = challenges_panel
	container.add_child(challenges_panel)

	var prestige_panel_script := preload("res://src/ui/panels/prestige_panel.gd")
	var prestige_panel := ScrollContainer.new()
	prestige_panel.set_script(prestige_panel_script)
	prestige_panel.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	panels["prestige"] = prestige_panel
	container.add_child(prestige_panel)

	var settings_panel_script := preload("res://src/ui/panels/settings_panel.gd")
	var settings_panel := ScrollContainer.new()
	settings_panel.set_script(settings_panel_script)
	settings_panel.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	panels["settings"] = settings_panel
	container.add_child(settings_panel)

	center.add_child(container)
	parent.add_child(center)

	_switch_tab("halls")

func _switch_tab(tab_name: String) -> void:
	current_tab = tab_name
	for key in panels:
		panels[key].visible = (key == tab_name)
	for key in tab_buttons:
		var btn: Button = tab_buttons[key]
		if key == tab_name:
			btn.add_theme_color_override("font_color", XianxiaTheme.ACCENT_TEAL)
		else:
			btn.remove_theme_color_override("font_color")
	EventBus.tab_changed.emit(tab_name)

func _on_treasure_spawned() -> void:
	var treasure_script := preload("res://src/ui/components/heavenly_treasure.gd")
	var treasure := Control.new()
	treasure.set_script(treasure_script)
	treasure_layer.add_child(treasure)

func _on_offline_return(earned, dur: float) -> void:
	if dur < 60:
		return
	var popup_script := preload("res://src/ui/components/offline_return.gd")
	var popup := PanelContainer.new()
	popup.set_script(popup_script)
	popup.setup(earned, dur)
	popup.set_anchors_and_offsets_preset(Control.PRESET_CENTER)
	popup.custom_minimum_size = Vector2(400, 250)
	add_child(popup)

func _on_hall_unlocked(hall_id: int) -> void:
	if current_tab != "halls":
		tab_buttons["halls"].add_theme_color_override("font_color", XianxiaTheme.ACCENT_GOLD)
