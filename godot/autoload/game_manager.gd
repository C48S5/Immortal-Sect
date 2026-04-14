extends Node

## Central game state manager for Immortal Sect.
## Holds all currency balances, meta state, and settings.

# --- Signals ---
signal currencies_changed
signal settings_changed

# --- Currencies ---
var spirit_stones: float = 0.0
var hdp: int = 0
var dao_crystals: int = 0
var heavenly_seals: int = 0
var alchemy_essence: float = 0.0
var recruitment_tokens: int = 0
var qi_residue: int = 0
var legacy_power: float = 0.0

# --- Meta ---
var last_save_time: float = 0.0
var last_tick_time: float = 0.0
var total_play_time: float = 0.0
var ascension_count: int = 0
var active_dao_path: int = -1  # -1 means no path selected

# --- Settings ---
var sound_enabled: bool = true
var notation_style: String = "standard"


func _ready() -> void:
	last_save_time = Time.get_unix_time_from_system()
	last_tick_time = Time.get_unix_time_from_system()


func _process(delta: float) -> void:
	total_play_time += delta


# --- Currency helpers ---

func add_spirit_stones(amount: float) -> void:
	spirit_stones += amount
	currencies_changed.emit()


func spend_spirit_stones(amount: float) -> bool:
	if spirit_stones < amount:
		return false
	spirit_stones -= amount
	currencies_changed.emit()
	return true


func add_hdp(amount: int) -> void:
	hdp += amount
	currencies_changed.emit()


func add_ae(amount: float) -> void:
	alchemy_essence += amount
	currencies_changed.emit()


## The tap / meditate mechanic — awards 1 spirit stone per click.
func meditate() -> void:
	add_spirit_stones(1.0)


## Perform an ascension: earn HDP, reset run-scoped currencies.
func ascend(hdp_earned: int) -> void:
	spirit_stones = 0.0
	alchemy_essence = 0.0
	hdp += hdp_earned
	ascension_count += 1
	currencies_changed.emit()


## Full hard reset (new game).
func reset() -> void:
	spirit_stones = 0.0
	hdp = 0
	dao_crystals = 0
	heavenly_seals = 0
	alchemy_essence = 0.0
	recruitment_tokens = 0
	qi_residue = 0
	legacy_power = 0.0
	last_save_time = Time.get_unix_time_from_system()
	last_tick_time = Time.get_unix_time_from_system()
	total_play_time = 0.0
	ascension_count = 0
	active_dao_path = -1
	sound_enabled = true
	notation_style = "standard"
	currencies_changed.emit()
	settings_changed.emit()


func update_settings(new_sound_enabled: bool, new_notation_style: String) -> void:
	sound_enabled = new_sound_enabled
	notation_style = new_notation_style
	settings_changed.emit()
