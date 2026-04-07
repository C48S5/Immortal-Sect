extends Node

## Manages all 12 cultivation halls: levels, cycles, revenue.

# --- Signals ---
signal hall_updated(hall_id: int)
signal halls_changed

# --- State ---
# halls[hall_id] = {level, cycle_progress, is_automated, is_unlocked,
#                   speed_multiplier, profit_multiplier}
var halls: Dictionary = {}

## Buy-mode: 1, 10, 100, or -1 for max.
var buy_mode: int = 1

# --- Hall config data (mirrors hallConfigs.ts) ---
# Each entry: {id, name, base_cost, coefficient, cycle_seconds, base_revenue}
const HALL_CONFIGS: Array[Dictionary] = [
	{id=1,  name="Qi Gathering Pavilion",        base_cost=4.0,           coefficient=1.07, cycle_seconds=1,   base_revenue=0.08},
	{id=2,  name="Body Tempering Dojo",           base_cost=26.0,          coefficient=1.15, cycle_seconds=3,   base_revenue=0.49},
	{id=3,  name="Alchemy Furnace Chamber",       base_cost=182.0,         coefficient=1.13, cycle_seconds=6,   base_revenue=3.25},
	{id=4,  name="Formation Array Hall",          base_cost=1274.0,        coefficient=1.12, cycle_seconds=12,  base_revenue=20.55},
	{id=5,  name="Spirit Beast Garden",           base_cost=8918.0,        coefficient=1.11, cycle_seconds=24,  base_revenue=120.51},
	{id=6,  name="Talisman Inscription Studio",   base_cost=62426.0,       coefficient=1.10, cycle_seconds=36,  base_revenue=725.88},
	{id=7,  name="Sword Refinement Peak",         base_cost=436982.0,      coefficient=1.11, cycle_seconds=48,  base_revenue=4459.0},
	{id=8,  name="Tribulation Lightning Tower",   base_cost=3058874.0,     coefficient=1.10, cycle_seconds=96,  base_revenue=20951.0},
	{id=9,  name="Void Meditation Sanctum",       base_cost=21412118.0,    coefficient=1.09, cycle_seconds=192, base_revenue=88480.0},
	{id=10, name="Soul Tempering Pagoda",         base_cost=149884826.0,   coefficient=1.09, cycle_seconds=384, base_revenue=345357.0},
	{id=11, name="Celestial Inscription Library", base_cost=1124136195.0,  coefficient=1.08, cycle_seconds=512, base_revenue=2000242.0},
	{id=12, name="Dao Comprehension Throne",      base_cost=8993089560.0,  coefficient=1.07, cycle_seconds=768, base_revenue=10993997.0},
]


func _ready() -> void:
	init_halls()


# --- Initialization ---

func init_halls() -> void:
	halls.clear()
	for cfg: Dictionary in HALL_CONFIGS:
		halls[cfg.id] = {
			"level": 0,
			"cycle_progress": 0.0,
			"is_automated": false,
			"is_unlocked": cfg.id == 1,
			"speed_multiplier": 1.0,
			"profit_multiplier": 1.0,
		}
	halls_changed.emit()


# --- Config helpers ---

func _get_config(hall_id: int) -> Dictionary:
	for cfg: Dictionary in HALL_CONFIGS:
		if cfg.id == hall_id:
			return cfg
	return {}


# --- Cost math (geometric series, mirrors BigNumber.ts) ---

func _bulk_cost(base_cost: float, coeff: float, owned: int, buying: int) -> float:
	if buying <= 0:
		return 0.0
	if coeff == 1.0:
		return base_cost * buying
	return base_cost * pow(coeff, owned) * (pow(coeff, buying) - 1.0) / (coeff - 1.0)


func _max_affordable(base_cost: float, coeff: float, owned: int, budget: float) -> int:
	if budget < _bulk_cost(base_cost, coeff, owned, 1):
		return 0
	var lo: int = 1
	var hi: int = 2
	while _bulk_cost(base_cost, coeff, owned, hi) <= budget:
		hi *= 2
		if hi > 1_000_000_000:
			break
	while lo < hi:
		var mid: int = (lo + hi + 1) / 2
		if _bulk_cost(base_cost, coeff, owned, mid) <= budget:
			lo = mid
		else:
			hi = mid - 1
	return lo


# --- Buy ---

func buy_hall(hall_id: int, count: int) -> void:
	if count <= 0:
		return
	var hall: Dictionary = halls.get(hall_id, {})
	if hall.is_empty() or not hall.is_unlocked:
		return
	hall.level += count
	hall_updated.emit(hall_id)
	halls_changed.emit()


func buy_with_mode(hall_id: int) -> void:
	var hall: Dictionary = halls.get(hall_id, {})
	if hall.is_empty() or not hall.is_unlocked:
		return
	var cfg: Dictionary = _get_config(hall_id)
	if cfg.is_empty():
		return

	var budget: float = GameManager.spirit_stones
	var count: int

	if buy_mode == -1:
		count = _max_affordable(cfg.base_cost, cfg.coefficient, hall.level, budget)
	else:
		count = buy_mode
		var check_cost: float = _bulk_cost(cfg.base_cost, cfg.coefficient, hall.level, count)
		if budget < check_cost:
			return

	if count <= 0:
		return

	var cost: float = _bulk_cost(cfg.base_cost, cfg.coefficient, hall.level, count)
	if not GameManager.spend_spirit_stones(cost):
		return

	# Auto-unlock on first purchase
	if not hall.is_unlocked:
		hall.is_unlocked = true

	buy_hall(hall_id, count)


# --- Cycle tick (main game loop driver) ---

func tick_cycles(delta: float) -> void:
	for hall_id: int in halls:
		var hall: Dictionary = halls[hall_id]
		if not hall.is_unlocked or hall.level <= 0:
			continue
		# Only tick if automated or a manual cycle was started
		if not hall.is_automated and hall.cycle_progress == 0.0:
			continue

		var cfg: Dictionary = _get_config(hall_id)
		if cfg.is_empty():
			continue

		var effective_cycle: float = cfg.cycle_seconds / hall.speed_multiplier
		if effective_cycle <= 0.0:
			effective_cycle = 0.01

		var progress_increment: float = delta / effective_cycle
		hall.cycle_progress += progress_increment

		if hall.cycle_progress >= 1.0:
			var revenue: float = get_revenue(hall_id)
			GameManager.add_spirit_stones(revenue)
			PrestigeManager.add_revenue(revenue)
			# Automated halls loop; manual halls stop
			if hall.is_automated:
				hall.cycle_progress -= 1.0
			else:
				hall.cycle_progress = 0.0
			hall_updated.emit(hall_id)

	halls_changed.emit()


# --- Revenue calculation (full multiplier chain) ---

func get_revenue(hall_id: int) -> float:
	var hall: Dictionary = halls.get(hall_id, {})
	if hall.is_empty() or hall.level <= 0:
		return 0.0
	var cfg: Dictionary = _get_config(hall_id)
	if cfg.is_empty():
		return 0.0

	var rev: float = cfg.base_revenue * hall.level * hall.profit_multiplier

	# HDP multiplier
	var hdp_mult: float = PrestigeManager.get_hdp_multiplier()
	rev *= hdp_mult

	# Mandate multiplier (stub — MandateManager not in scope yet)
	var mandate_mult: float = 1.0
	if has_node("/root/MandateManager"):
		var mm: Node = get_node("/root/MandateManager")
		if mm.has_method("get_mandate_multiplier"):
			mandate_mult = mm.get_mandate_multiplier(hall_id)
	rev *= mandate_mult

	# Dao Path passive: boosted halls get hallMultiplier
	var dao_path_mult: float = DaoPathManager.get_dao_path_multiplier(hall_id)
	rev *= dao_path_mult

	# Alchemy buffs
	var alchemy_mult: float = AlchemyManager.get_alchemy_multiplier(hall_id)
	rev *= alchemy_mult

	# Disciple bonus (stub — DiscipleManager not in scope yet)
	var disciple_mult: float = 1.0
	if has_node("/root/DiscipleManager"):
		var dm: Node = get_node("/root/DiscipleManager")
		if dm.has_method("get_disciple_bonus"):
			disciple_mult = dm.get_disciple_bonus(hall_id)
	rev *= disciple_mult

	# Legacy Power: 1 + log10(1 + LP) * 0.5
	var lp: float = GameManager.legacy_power
	var legacy_mult: float = 1.0
	if lp > 0.0:
		legacy_mult = 1.0 + log(1.0 + lp) / log(10.0) * 0.5
	rev *= legacy_mult

	# Challenge reward multiplier (stub — ChallengeManager not in scope yet)
	var challenge_mult: float = 1.0
	if has_node("/root/ChallengeManager"):
		var cm: Node = get_node("/root/ChallengeManager")
		if cm.has_method("get_challenge_multiplier"):
			challenge_mult = cm.get_challenge_multiplier(hall_id)
	rev *= challenge_mult

	# Spell effects
	var spell_mult: float = DaoPathManager.spell_effects.global_multiplier
	var hall_spell_mult: float = DaoPathManager.spell_effects.hall_multipliers.get(hall_id, 1.0)
	rev *= spell_mult * hall_spell_mult

	# QR shop multiplier (stub — LegacyManager not in scope yet)
	var qr_mult: float = 1.0
	if has_node("/root/LegacyManager"):
		var lm: Node = get_node("/root/LegacyManager")
		if lm.has_method("get_qr_shop_multiplier"):
			qr_mult = lm.get_qr_shop_multiplier(hall_id)
	rev *= qr_mult

	return rev


func get_total_revenue_per_second() -> float:
	var total: float = 0.0
	for hall_id: int in halls:
		var hall: Dictionary = halls[hall_id]
		if not hall.is_unlocked or hall.level <= 0:
			continue
		var cfg: Dictionary = _get_config(hall_id)
		if cfg.is_empty():
			continue
		var rev_per_cycle: float = get_revenue(hall_id)
		var effective_cycle: float = cfg.cycle_seconds / hall.speed_multiplier
		if effective_cycle <= 0.0:
			continue
		total += rev_per_cycle / effective_cycle
	return total


# --- Manual cycle ---

func start_manual_cycle(hall_id: int) -> void:
	var hall: Dictionary = halls.get(hall_id, {})
	if hall.is_empty() or hall.level <= 0 or hall.is_automated or hall.cycle_progress > 0.0:
		return
	hall.cycle_progress = 0.001
	hall_updated.emit(hall_id)


# --- Buy mode ---

func set_buy_mode(mode: int) -> void:
	buy_mode = mode


# --- Unlock ---

func unlock_next_hall() -> void:
	for cfg: Dictionary in HALL_CONFIGS:
		var hall: Dictionary = halls.get(cfg.id, {})
		if hall.is_empty():
			continue
		if not hall.is_unlocked:
			hall.is_unlocked = true
			hall_updated.emit(cfg.id)
			halls_changed.emit()
			return


# --- Query helpers (used by UI) ---

func is_hall_unlocked(hall_id: int) -> bool:
	var hall: Dictionary = halls.get(hall_id, {})
	return not hall.is_empty() and hall.is_unlocked


func get_hall_level(hall_id: int) -> int:
	var hall: Dictionary = halls.get(hall_id, {})
	if hall.is_empty():
		return 0
	return hall.level


func get_hall_cycle_progress(hall_id: int) -> float:
	var hall: Dictionary = halls.get(hall_id, {})
	if hall.is_empty():
		return 0.0
	return hall.cycle_progress


func get_hall_revenue(hall_id: int) -> float:
	return get_revenue(hall_id)


func get_hall_cost(hall_id: int, count: int) -> float:
	var hall: Dictionary = halls.get(hall_id, {})
	if hall.is_empty():
		return 0.0
	var cfg: Dictionary = _get_config(hall_id)
	if cfg.is_empty():
		return 0.0
	return _bulk_cost(cfg.base_cost, cfg.coefficient, hall.level, count)


func set_automated(hall_id: int, automated: bool) -> void:
	var hall: Dictionary = halls.get(hall_id, {})
	if hall.is_empty():
		return
	hall.is_automated = automated
	hall_updated.emit(hall_id)


# --- Ascension reset ---

func reset_for_ascension() -> void:
	for hall_id: int in halls:
		var hall: Dictionary = halls[hall_id]
		hall.level = 0
		hall.cycle_progress = 0.0
		hall.is_automated = false
		hall.is_unlocked = (hall_id == 1)
		hall.speed_multiplier = 1.0
		hall.profit_multiplier = 1.0
	halls_changed.emit()
