extends ScrollContainer

var content: VBoxContainer
var ae_label: Label
var ae_rate_label: Label
var buff_container: VBoxContainer

func _ready() -> void:
	size_flags_horizontal = Control.SIZE_EXPAND_FILL
	size_flags_vertical = Control.SIZE_EXPAND_FILL

	content = VBoxContainer.new()
	content.add_theme_constant_override("separation", 10)
	content.size_flags_horizontal = Control.SIZE_EXPAND_FILL

	var title := Label.new()
	title.text = "Alchemy"
	title.add_theme_color_override("font_color", XianxiaTheme.ACCENT_GREEN)
	title.add_theme_font_size_override("font_size", 20)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(title)

	ae_label = Label.new()
	ae_label.text = "Alchemy Essence: 0"
	ae_label.add_theme_color_override("font_color", XianxiaTheme.ACCENT_GREEN)
	ae_label.add_theme_font_size_override("font_size", 16)
	ae_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(ae_label)

	ae_rate_label = Label.new()
	ae_rate_label.text = "Generation: 0/s"
	ae_rate_label.add_theme_color_override("font_color", XianxiaTheme.TEXT_SECONDARY)
	ae_rate_label.add_theme_font_size_override("font_size", 12)
	ae_rate_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(ae_rate_label)

	var sep1 := HSeparator.new()
	content.add_child(sep1)

	var recipes_title := Label.new()
	recipes_title.text = "Recipes"
	recipes_title.add_theme_color_override("font_color", XianxiaTheme.TEXT_PRIMARY)
	recipes_title.add_theme_font_size_override("font_size", 16)
	content.add_child(recipes_title)

	for item in GameData.alchemy_configs:
		var card := _create_recipe_card(item)
		content.add_child(card)

	var sep2 := HSeparator.new()
	content.add_child(sep2)

	var buffs_title := Label.new()
	buffs_title.text = "Active Buffs"
	buffs_title.add_theme_color_override("font_color", XianxiaTheme.ACCENT_GOLD)
	buffs_title.add_theme_font_size_override("font_size", 16)
	content.add_child(buffs_title)

	buff_container = VBoxContainer.new()
	buff_container.add_theme_constant_override("separation", 4)
	content.add_child(buff_container)

	add_child(content)

func _create_recipe_card(config: Dictionary) -> PanelContainer:
	var panel := PanelContainer.new()
	var style := StyleBoxFlat.new()
	style.bg_color = XianxiaTheme.BG_CARD
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_left = 6
	style.corner_radius_bottom_right = 6
	style.content_margin_left = 10
	style.content_margin_right = 10
	style.content_margin_top = 6
	style.content_margin_bottom = 6
	panel.add_theme_stylebox_override("panel", style)

	var hbox := HBoxContainer.new()
	hbox.add_theme_constant_override("separation", 8)

	var info := VBoxContainer.new()
	info.size_flags_horizontal = Control.SIZE_EXPAND_FILL

	var name_lbl := Label.new()
	name_lbl.text = config.name
	name_lbl.add_theme_color_override("font_color", XianxiaTheme.TEXT_PRIMARY)
	name_lbl.add_theme_font_size_override("font_size", 14)
	info.add_child(name_lbl)

	var desc_lbl := Label.new()
	desc_lbl.text = "x%.1f income | %ds | Cost: %.0f AE" % [config.multiplier, int(config.duration_seconds), config.ae_cost]
	desc_lbl.add_theme_color_override("font_color", XianxiaTheme.TEXT_SECONDARY)
	desc_lbl.add_theme_font_size_override("font_size", 11)
	desc_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	info.add_child(desc_lbl)
	hbox.add_child(info)

	var craft_btn := Button.new()
	craft_btn.text = "Craft"
	craft_btn.add_theme_font_size_override("font_size", 12)
	var item_id: int = config.id
	var ae_cost: float = config.ae_cost
	craft_btn.pressed.connect(func(): GameManager.craft_alchemy(item_id))
	craft_btn.set_meta("item_id", item_id)
	craft_btn.set_meta("ae_cost", ae_cost)
	hbox.add_child(craft_btn)

	panel.add_child(hbox)
	return panel

func _process(_delta: float) -> void:
	ae_label.text = "Alchemy Essence: %.0f" % GameManager.alchemy_essence
	ae_rate_label.text = "Generation: %.2f/s" % GameManager.get_ae_per_second()

	for child in buff_container.get_children():
		child.queue_free()

	for buff in GameManager.active_buffs:
		var lbl := Label.new()
		var item := GameData.get_alchemy_item(buff.get("item_id", 0))
		var name_str: String = item.get("name", "Buff") if not item.is_empty() else "Buff"
		lbl.text = "%s: %.0fs remaining (x%.1f)" % [name_str, buff.remaining, buff.multiplier]
		lbl.add_theme_color_override("font_color", XianxiaTheme.ACCENT_GREEN)
		lbl.add_theme_font_size_override("font_size", 12)
		buff_container.add_child(lbl)

	if GameManager.active_buffs.is_empty():
		var lbl := Label.new()
		lbl.text = "No active buffs"
		lbl.add_theme_color_override("font_color", XianxiaTheme.TEXT_MUTED)
		lbl.add_theme_font_size_override("font_size", 12)
		buff_container.add_child(lbl)
