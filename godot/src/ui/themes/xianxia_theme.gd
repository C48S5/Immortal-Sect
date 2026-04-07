class_name XianxiaTheme
extends RefCounted

## Color palette for the Xianxia cultivation theme.

const BG_DARK := Color("0d0f1a")
const BG_PANEL := Color("141729")
const BG_CARD := Color("1a1f3a")
const BG_CARD_HOVER := Color("222850")

const ACCENT_TEAL := Color("00e5c8")
const ACCENT_CYAN := Color("00bcd4")
const ACCENT_GOLD := Color("ffd700")
const ACCENT_PURPLE := Color("9b59b6")
const ACCENT_RED := Color("e74c3c")
const ACCENT_GREEN := Color("2ecc71")
const ACCENT_BLUE := Color("3498db")

const TEXT_PRIMARY := Color("e8e6e3")
const TEXT_SECONDARY := Color("8b8fa3")
const TEXT_GOLD := Color("ffd700")
const TEXT_MUTED := Color("555a6e")

const BORDER_SUBTLE := Color("2a2f4a")
const BORDER_HIGHLIGHT := Color("00e5c8")

const ELEMENT_FIRE := Color("ff6b35")
const ELEMENT_WATER := Color("4fc3f7")
const ELEMENT_WOOD := Color("66bb6a")
const ELEMENT_METAL := Color("b0bec5")
const ELEMENT_EARTH := Color("d4a574")
const ELEMENT_NEUTRAL := Color("9b9b9b")

static func get_element_color(element: String) -> Color:
	match element:
		"fire": return ELEMENT_FIRE
		"water": return ELEMENT_WATER
		"wood": return ELEMENT_WOOD
		"metal": return ELEMENT_METAL
		"earth": return ELEMENT_EARTH
	return ELEMENT_NEUTRAL

static func get_rarity_color(rarity: String) -> Color:
	match rarity:
		"common": return TEXT_SECONDARY
		"uncommon": return ACCENT_GREEN
		"rare": return ACCENT_BLUE
		"epic": return ACCENT_PURPLE
		"legendary": return ACCENT_GOLD
	return TEXT_PRIMARY

static func create_theme() -> Theme:
	var theme := Theme.new()

	var default_font := SystemFont.new()
	default_font.font_names = PackedStringArray(["Noto Sans", "Arial", "sans-serif"])
	theme.default_font = default_font
	theme.default_font_size = 14

	var panel_style := StyleBoxFlat.new()
	panel_style.bg_color = BG_PANEL
	panel_style.corner_radius_top_left = 8
	panel_style.corner_radius_top_right = 8
	panel_style.corner_radius_bottom_left = 8
	panel_style.corner_radius_bottom_right = 8
	panel_style.content_margin_left = 12
	panel_style.content_margin_right = 12
	panel_style.content_margin_top = 8
	panel_style.content_margin_bottom = 8
	theme.set_stylebox("panel", "PanelContainer", panel_style)

	var btn_normal := StyleBoxFlat.new()
	btn_normal.bg_color = Color("1e2440")
	btn_normal.corner_radius_top_left = 6
	btn_normal.corner_radius_top_right = 6
	btn_normal.corner_radius_bottom_left = 6
	btn_normal.corner_radius_bottom_right = 6
	btn_normal.border_width_bottom = 2
	btn_normal.border_width_top = 2
	btn_normal.border_width_left = 2
	btn_normal.border_width_right = 2
	btn_normal.border_color = BORDER_SUBTLE
	btn_normal.content_margin_left = 16
	btn_normal.content_margin_right = 16
	btn_normal.content_margin_top = 8
	btn_normal.content_margin_bottom = 8
	theme.set_stylebox("normal", "Button", btn_normal)

	var btn_hover := btn_normal.duplicate()
	btn_hover.bg_color = BG_CARD_HOVER
	btn_hover.border_color = ACCENT_TEAL
	theme.set_stylebox("hover", "Button", btn_hover)

	var btn_pressed := btn_normal.duplicate()
	btn_pressed.bg_color = Color("0a0e1a")
	btn_pressed.border_color = ACCENT_CYAN
	theme.set_stylebox("pressed", "Button", btn_pressed)

	theme.set_color("font_color", "Button", TEXT_PRIMARY)
	theme.set_color("font_hover_color", "Button", ACCENT_TEAL)
	theme.set_color("font_pressed_color", "Button", ACCENT_CYAN)

	theme.set_color("font_color", "Label", TEXT_PRIMARY)

	return theme
