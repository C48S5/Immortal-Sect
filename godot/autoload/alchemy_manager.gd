extends Node

## Manages alchemy crafting, active pill buffs, and buff multipliers.

# --- Signals ---
signal buffs_changed

# --- State ---
# Array of {item_id: int, remaining_seconds: float, multiplier: float, affected_hall_ids: Array[int]}
var active_buffs: Array[Dictionary] = []

# --- Alchemy item configs (mirrors alchemyConfigs.ts) ---
const ALCHEMY_ITEM_CONFIGS: Array[Dictionary] = [
	{id=1,  name="Qi Condensation Pill",      ae_cost=10,  duration=60,  multiplier=2.0,   affected_hall_ids=[1, 2, 3]},
	{id=2,  name="Body Tempering Pill",        ae_cost=25,  duration=120, multiplier=3.0,   affected_hall_ids=[2]},
	{id=3,  name="Spirit Enhancement Pill",    ae_cost=50,  duration=180, multiplier=2.0,   affected_hall_ids=[4, 5, 6]},
	{id=4,  name="Sword Qi Pill",              ae_cost=100, duration=300, multiplier=3.0,   affected_hall_ids=[7]},
	{id=5,  name="Lightning Resistance Pill",  ae_cost=75,  duration=300, multiplier=3.0,   affected_hall_ids=[8]},
	{id=6,  name="Void Essence Pill",          ae_cost=200, duration=600, multiplier=3.0,   affected_hall_ids=[9]},
	{id=7,  name="Soul Strengthening Pill",    ae_cost=200, duration=300, multiplier=2.5,   affected_hall_ids=[10, 11]},
	{id=8,  name="Dao Comprehension Pill",     ae_cost=350, duration=600, multiplier=4.0,   affected_hall_ids=[12]},
	{id=9,  name="Heavenly Fortune Pill",      ae_cost=400, duration=600, multiplier=2.5,   affected_hall_ids=[]},
	{id=10, name="Universal Cultivation Pill", ae_cost=500, duration=900, multiplier=2.0,   affected_hall_ids=[1,2,3,4,5,6,7,8,9,10,11,12]},
]


# --- Config helper ---

func _get_item_config(item_id: int) -> Dictionary:
	for cfg: Dictionary in ALCHEMY_ITEM_CONFIGS:
		if cfg.id == item_id:
			return cfg
	return {}


# --- Buff management ---

func add_buff(buff_dict: Dictionary) -> void:
	active_buffs.append(buff_dict)
	buffs_changed.emit()


func tick_buffs(delta: float) -> void:
	var changed: bool = false
	var i: int = active_buffs.size() - 1
	while i >= 0:
		active_buffs[i].remaining_seconds -= delta
		changed = true
		if active_buffs[i].remaining_seconds <= 0.0:
			active_buffs.remove_at(i)
		i -= 1
	if changed:
		buffs_changed.emit()


func get_alchemy_multiplier(hall_id: int) -> float:
	var mult: float = 1.0
	for buff: Dictionary in active_buffs:
		if buff.remaining_seconds <= 0.0:
			continue
		var affected: Array = buff.affected_hall_ids
		if affected.is_empty() or affected.has(hall_id):
			mult *= buff.multiplier
	return mult


# --- Crafting ---

func craft_item(item_id: int) -> bool:
	var cfg: Dictionary = _get_item_config(item_id)
	if cfg.is_empty():
		return false

	if GameManager.alchemy_essence < cfg.ae_cost:
		return false

	GameManager.alchemy_essence -= cfg.ae_cost
	GameManager.currencies_changed.emit()

	var buff: Dictionary = {
		"item_id": cfg.id,
		"remaining_seconds": float(cfg.duration),
		"multiplier": cfg.multiplier,
		"affected_hall_ids": cfg.affected_hall_ids.duplicate(),
	}
	add_buff(buff)
	return true


func clear_buffs() -> void:
	active_buffs.clear()
	buffs_changed.emit()
