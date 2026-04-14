extends Node

## Manages elder hiring. Each elder automates one cultivation hall.

# --- Signals ---
signal elder_hired(elder_id: int)

# --- State ---
# elders[elder_id] = {hired: bool}
var elders: Dictionary = {}

# --- Elder config data (mirrors elderConfigs.ts) ---
# Each entry: {id, name, title, hall_id, cost}
const ELDER_CONFIGS: Array[Dictionary] = [
	{id=1,  name="Elder Qin",            title="Qi Master",            hall_id=1,  cost=1000.0},
	{id=2,  name="Master Iron Fist",     title="Body Cultivator",      hall_id=2,  cost=15000.0},
	{id=3,  name="Grandmaster Huo",      title="Pill Saint",           hall_id=3,  cost=100000.0},
	{id=4,  name="Formation Sage Wei",   title="Array Master",         hall_id=4,  cost=750000.0},
	{id=5,  name="Beast Tamer Liu",      title="Spirit Beast Master",  hall_id=5,  cost=5000000.0},
	{id=6,  name="Talisman Master Xu",   title="Inscription Sage",     hall_id=6,  cost=35000000.0},
	{id=7,  name="Sword Saint Jian",     title="Sword Immortal",       hall_id=7,  cost=250000000.0},
	{id=8,  name="Lightning Elder Zhao", title="Tribulation Sovereign", hall_id=8,  cost=1750000000.0},
	{id=9,  name="Void Walker Chen",     title="Void Sage",            hall_id=9,  cost=12500000000.0},
	{id=10, name="Soul Sage Bai",        title="Soul Cultivator",      hall_id=10, cost=87500000000.0},
	{id=11, name="Celestial Scribe Lin", title="Celestial Recorder",   hall_id=11, cost=625000000000.0},
	{id=12, name="Dao Ancestor",         title="Dao Progenitor",       hall_id=12, cost=5000000000000.0},
]


func _ready() -> void:
	init_elders()


# --- Config helpers ---

func _get_config(elder_id: int) -> Dictionary:
	for cfg: Dictionary in ELDER_CONFIGS:
		if cfg.id == elder_id:
			return cfg
	return {}


# --- Initialization ---

func init_elders() -> void:
	elders.clear()
	for cfg: Dictionary in ELDER_CONFIGS:
		elders[cfg.id] = {"hired": false}


# --- Hire ---

func hire_elder(elder_id: int) -> bool:
	var slot: Dictionary = elders.get(elder_id, {})
	if slot.is_empty() or slot.hired:
		return false

	var cfg: Dictionary = _get_config(elder_id)
	if cfg.is_empty():
		return false

	if not can_afford_elder(elder_id):
		return false

	if not GameManager.spend_spirit_stones(cfg.cost):
		return false

	slot.hired = true

	# Automate the corresponding hall
	var hall: Dictionary = HallManager.halls.get(cfg.hall_id, {})
	if not hall.is_empty():
		hall.is_automated = true

	elder_hired.emit(elder_id)
	return true


func can_afford_elder(elder_id: int) -> bool:
	var slot: Dictionary = elders.get(elder_id, {})
	if slot.is_empty() or slot.hired:
		return false
	var cfg: Dictionary = _get_config(elder_id)
	if cfg.is_empty():
		return false
	return GameManager.spirit_stones >= cfg.cost


func is_hired(elder_id: int) -> bool:
	var slot: Dictionary = elders.get(elder_id, {})
	if slot.is_empty():
		return false
	return slot.hired


# --- Ascension reset ---

func reset_for_ascension() -> void:
	for elder_id: int in elders:
		elders[elder_id].hired = false
