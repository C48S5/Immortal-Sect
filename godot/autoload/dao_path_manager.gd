extends Node

## Manages Dao Path selection, passive bonuses, and active spells.

# --- Signals ---
signal path_changed
signal spell_activated
signal spell_ended

# --- State ---
var selected_path_id: int = -1  # -1 means no path selected
var spell_active: bool = false
var spell_remaining_duration: float = 0.0
var spell_cooldown_remaining: float = 0.0

## Computed spell effects, recalculated each tick while spell is active.
var spell_effects: Dictionary = {
	"global_multiplier": 1.0,
	"hall_multipliers": {},   # hall_id -> float
	"ae_multiplier": 1.0,
	"treasure_rate_multiplier": 1.0,
}

# --- Dao Path configs (mirrors daoPathConfigs.ts) ---
const DAO_PATH_CONFIGS: Array[Dictionary] = [
	{
		id = 1, name = "Sword Dao",
		boosted_hall_ids = [1, 7], hall_multiplier = 3.0,
		passive_value = 0.10, passive_description = "+10% crit chance on Heavenly Treasures",
		spell_name = "Sword Storm", spell_duration = 45, spell_cooldown = 180,
	},
	{
		id = 2, name = "Alchemy Dao",
		boosted_hall_ids = [3, 5], hall_multiplier = 3.0,
		passive_value = 0.20, passive_description = "-20% alchemy crafting time",
		spell_name = "Golden Core Overflow", spell_duration = 60, spell_cooldown = 240,
	},
	{
		id = 3, name = "Formation Dao",
		boosted_hall_ids = [4, 6], hall_multiplier = 3.0,
		passive_value = 0.05, passive_description = "-5% all hall costs",
		spell_name = "Barrier Seal", spell_duration = 90, spell_cooldown = 300,
	},
	{
		id = 4, name = "Body Dao",
		boosted_hall_ids = [2, 8], hall_multiplier = 3.0,
		passive_value = 0.25, passive_description = "+25% offline earnings",
		spell_name = "Heavenly Tribulation", spell_duration = 10, spell_cooldown = 300,
	},
	{
		id = 5, name = "Spirit Dao",
		boosted_hall_ids = [9, 10, 11], hall_multiplier = 2.5,
		passive_value = 1.0, passive_description = "+1 Heavenly Treasure per minute",
		spell_name = "Beast Stampede", spell_duration = 45, spell_cooldown = 360,
	},
]


# --- Config helpers ---

func _get_path_config(path_id: int) -> Dictionary:
	for cfg: Dictionary in DAO_PATH_CONFIGS:
		if cfg.id == path_id:
			return cfg
	return {}


# --- Path selection ---

func select_path(path_id: int) -> void:
	var cfg: Dictionary = _get_path_config(path_id)
	if cfg.is_empty():
		return
	selected_path_id = path_id
	spell_active = false
	spell_remaining_duration = 0.0
	spell_cooldown_remaining = 0.0
	_reset_spell_effects()
	GameManager.active_dao_path = path_id
	path_changed.emit()


# --- Spell activation ---

func activate_spell() -> bool:
	if selected_path_id < 0:
		return false
	if spell_active:
		return false
	if spell_cooldown_remaining > 0.0:
		return false

	var cfg: Dictionary = _get_path_config(selected_path_id)
	if cfg.is_empty():
		return false

	spell_active = true
	spell_remaining_duration = float(cfg.spell_duration)
	spell_activated.emit()
	return true


# --- Spell tick ---

func tick_spell(delta: float) -> void:
	if not spell_active and spell_cooldown_remaining <= 0.0:
		return

	if spell_active and spell_remaining_duration > 0.0:
		spell_remaining_duration = max(0.0, spell_remaining_duration - delta)
		if spell_remaining_duration <= 0.0:
			spell_active = false
			var cfg: Dictionary = _get_path_config(selected_path_id)
			if not cfg.is_empty():
				spell_cooldown_remaining = float(cfg.spell_cooldown)
			_reset_spell_effects()
			spell_ended.emit()
			return

	if not spell_active and spell_cooldown_remaining > 0.0:
		spell_cooldown_remaining = max(0.0, spell_cooldown_remaining - delta)
		return

	if spell_active:
		compute_spell_effects()


func compute_spell_effects() -> void:
	_reset_spell_effects()
	if not spell_active or selected_path_id < 0:
		return

	var cfg: Dictionary = _get_path_config(selected_path_id)
	if cfg.is_empty():
		return

	var hall_count: int = 12

	match selected_path_id:
		1:
			# Sword Storm: random hall gets x3-x10
			var hall_id: int = randi_range(1, hall_count)
			var mult: float = float(randi_range(3, 10))
			spell_effects.hall_multipliers[hall_id] = mult
		2:
			# Golden Core Overflow: AE generation x3
			spell_effects.ae_multiplier = 3.0
		3:
			# Barrier Seal: ramp from x1 to x4 over duration
			var total_dur: float = float(cfg.spell_duration)
			var elapsed: float = total_dur - spell_remaining_duration
			var progress: float = clampf(elapsed / total_dur, 0.0, 1.0)
			var mult: float = 1.0 + 3.0 * progress
			var locked_hall: int = randi_range(1, hall_count)
			spell_effects.hall_multipliers[locked_hall] = mult
		4:
			# Heavenly Tribulation: 50% x10, 50% x0-then-x5
			var total_dur: float = float(cfg.spell_duration)
			var elapsed: float = total_dur - spell_remaining_duration
			var lucky: bool = randf() >= 0.5
			if lucky:
				spell_effects.global_multiplier = 10.0
			else:
				spell_effects.global_multiplier = 0.0 if elapsed < 5.0 else 5.0
		5:
			# Beast Stampede: treasure spawn rate x5
			spell_effects.treasure_rate_multiplier = 5.0


func _reset_spell_effects() -> void:
	spell_effects = {
		"global_multiplier": 1.0,
		"hall_multipliers": {},
		"ae_multiplier": 1.0,
		"treasure_rate_multiplier": 1.0,
	}


# --- Passive bonus ---

func get_passive_bonus() -> Dictionary:
	if selected_path_id < 0:
		return {}
	var cfg: Dictionary = _get_path_config(selected_path_id)
	if cfg.is_empty():
		return {}
	return {
		"path_id": cfg.id,
		"value": cfg.passive_value,
		"description": cfg.passive_description,
	}


## Returns the Dao Path hall multiplier for revenue calculation.
func get_dao_path_multiplier(hall_id: int) -> float:
	if selected_path_id < 0:
		return 1.0
	var cfg: Dictionary = _get_path_config(selected_path_id)
	if cfg.is_empty():
		return 1.0
	var boosted: Array = cfg.boosted_hall_ids
	if boosted.has(hall_id):
		return cfg.hall_multiplier
	return 1.0


# --- Reset ---

func reset_spell() -> void:
	spell_active = false
	spell_remaining_duration = 0.0
	spell_cooldown_remaining = 0.0
	_reset_spell_effects()
