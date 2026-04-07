extends Node

## Core game state and simulation loop.

# Preload BigNumber to avoid class_name registration ordering issues
const BN = preload("res://src/core/big_number.gd")

# -- Currencies --
var spirit_stones = null
var hdp: int = 0
var hdp_spent: int = 0
var dao_crystals: int = 0
var heavenly_seals: int = 0
var alchemy_essence: float = 0.0

# -- Hall state --
var hall_states: Dictionary = {}

# -- Elder state --
var elder_hired: Dictionary = {}

# -- Milestone tracking --
var active_milestones: Dictionary = {}

# -- Dao Path --
var selected_dao_path: int = -1
var spell_active: bool = false
var spell_timer: float = 0.0
var spell_cooldown_timer: float = 0.0
var spell_hall_multipliers: Dictionary = {}

# -- Alchemy buffs --
var active_buffs: Array[Dictionary] = []

# -- Challenge state --
var challenge_completed: Dictionary = {}
var active_challenge_id: int = -1
var challenge_earnings = null

# -- Prestige/Ascension tracking --
var total_earnings_this_run = null
var ascension_count: int = 0
var total_play_time: float = 0.0
var last_save_time: float = 0.0

# -- Automation --
var auto_buy_unlocked: bool = false
var auto_hire_unlocked: bool = false

# -- Simulation --
const TICK_RATE := 20.0
const TICK_DELTA := 1.0 / TICK_RATE
var tick_accumulator: float = 0.0
var render_counter: int = 0
const RENDER_EVERY := 5

# -- Treasure --
var treasure_timer: float = 0.0
var treasure_interval: float = 45.0

func _ready() -> void:
	spirit_stones = BN.new(0)
	challenge_earnings = BN.new(0)
	total_earnings_this_run = BN.new(0)
	_init_hall_states()
	_init_elder_states()
	_init_challenge_states()

func _init_hall_states() -> void:
	for i in range(1, 13):
		hall_states[i] = {
			"level": 0,
			"unlocked": i == 1,
			"cycle_progress": 0.0,
			"milestone_speed_mult": 1.0,
			"milestone_profit_mult": 1.0,
			"assigned_elder_id": -1,
		}

func _init_elder_states() -> void:
	for i in range(1, 13):
		elder_hired[i] = false

func _init_challenge_states() -> void:
	for i in range(1, 13):
		challenge_completed[i] = false

func _process(delta: float) -> void:
	total_play_time += delta
	tick_accumulator += delta
	while tick_accumulator >= TICK_DELTA:
		tick_accumulator -= TICK_DELTA
		_simulation_tick(TICK_DELTA)
		render_counter += 1
	if render_counter >= RENDER_EVERY:
		render_counter = 0
		_render_tick()
	_update_treasure(delta)
	_auto_save_check(delta)

func _simulation_tick(dt: float) -> void:
	_tick_hall_cycles(dt)
	_tick_buffs(dt)
	_tick_spell(dt)
	_tick_alchemy_generation(dt)

func _render_tick() -> void:
	EventBus.spirit_stones_changed.emit(spirit_stones)

func _tick_hall_cycles(dt: float) -> void:
	for hall_id in hall_states:
		var state: Dictionary = hall_states[hall_id]
		if state.level <= 0 or not state.unlocked:
			continue
		if not _is_hall_active_in_challenge(hall_id):
			continue
		var cycle_time = get_effective_cycle_seconds(hall_id)
		if cycle_time <= 0:
			continue
		state.cycle_progress += dt / cycle_time
		while state.cycle_progress >= 1.0:
			state.cycle_progress -= 1.0
			var revenue = calculate_hall_revenue(hall_id)
			_earn_spirit_stones(revenue, hall_id)

func _earn_spirit_stones(amount, source_hall_id: int = -1) -> void:
	spirit_stones = spirit_stones.add(amount)
	total_earnings_this_run = total_earnings_this_run.add(amount)
	if active_challenge_id > 0:
		challenge_earnings = challenge_earnings.add(amount)
		_check_challenge_completion()
	if source_hall_id > 0:
		EventBus.hall_cycle_completed.emit(source_hall_id, amount)

func _tick_buffs(dt: float) -> void:
	var i := active_buffs.size() - 1
	while i >= 0:
		active_buffs[i].remaining -= dt
		if active_buffs[i].remaining <= 0:
			var buff_id: String = active_buffs[i].get("buff_id", "")
			active_buffs.remove_at(i)
			EventBus.buff_expired.emit(buff_id)
		i -= 1

func _tick_spell(dt: float) -> void:
	if spell_cooldown_timer > 0:
		spell_cooldown_timer -= dt
	if spell_active:
		spell_timer -= dt
		if spell_timer <= 0:
			spell_active = false
			spell_hall_multipliers.clear()
			EventBus.dao_spell_ended.emit(selected_dao_path)

func _tick_alchemy_generation(dt: float) -> void:
	var ae_per_sec = get_ae_per_second()
	if ae_per_sec > 0:
		alchemy_essence += ae_per_sec * dt

func _update_treasure(delta: float) -> void:
	if get_total_revenue_per_second().is_zero():
		return
	treasure_timer -= delta
	if treasure_timer <= 0:
		treasure_timer = treasure_interval + randf_range(-10, 10)
		EventBus.treasure_spawned.emit()

func _auto_save_check(delta: float) -> void:
	last_save_time += delta
	if last_save_time >= 30.0:
		last_save_time = 0.0
		SaveManager.save_game()

# ---------- Revenue Calculation ----------

func calculate_hall_revenue(hall_id: int):
	var config = GameData.get_hall_config(hall_id)
	var state: Dictionary = hall_states[hall_id]
	if config.is_empty() or state.level <= 0:
		return BN.zero()

	var revenue = config.base_revenue.mul(state.level)
	revenue = revenue.mul(state.milestone_profit_mult)
	revenue = revenue.mul(_get_hdp_multiplier())
	revenue = revenue.mul(_get_dao_path_multiplier(hall_id))
	revenue = revenue.mul(_get_alchemy_multiplier(hall_id))
	revenue = revenue.mul(_get_challenge_reward_multiplier(hall_id))
	revenue = revenue.mul(_get_sect_harmony_multiplier())
	if spell_active:
		var spell_mult: float = spell_hall_multipliers.get(hall_id, 1.0)
		revenue = revenue.mul(spell_mult)
	if active_challenge_id > 0:
		var ch = GameData.get_challenge(active_challenge_id)
		if ch.restriction == "All income divided by 10":
			revenue = revenue.div(10)
	return revenue

func get_effective_cycle_seconds(hall_id: int) -> float:
	var config = GameData.get_hall_config(hall_id)
	var state: Dictionary = hall_states[hall_id]
	if config.is_empty():
		return 1.0
	var cycle: float = config.cycle_seconds
	if state.milestone_speed_mult > 0:
		cycle /= state.milestone_speed_mult
	if state.assigned_elder_id > 0:
		cycle /= 2.0
	var challenge_speed = _get_challenge_speed_mult()
	if challenge_speed != 1.0:
		cycle /= challenge_speed
	return maxf(cycle, 0.01)

func get_hall_revenue_per_second(hall_id: int):
	var state: Dictionary = hall_states.get(hall_id, {})
	if state.is_empty() or state.level <= 0 or not state.unlocked:
		return BN.zero()
	return calculate_hall_revenue(hall_id).div(get_effective_cycle_seconds(hall_id))

func get_total_revenue_per_second():
	var total = BN.zero()
	for hall_id in hall_states:
		total = total.add(get_hall_revenue_per_second(hall_id))
	return total

func _get_hdp_multiplier() -> float:
	var unspent = hdp - hdp_spent
	return 1.0 + unspent * 0.02

func _get_dao_path_multiplier(hall_id: int) -> float:
	if selected_dao_path < 0:
		return 1.0
	var path = GameData.get_dao_path(selected_dao_path)
	if path.is_empty():
		return 1.0
	if hall_id in path.boosted_hall_ids:
		return path.hall_multiplier
	return 1.0

func _get_alchemy_multiplier(hall_id: int) -> float:
	var mult := 1.0
	for buff in active_buffs:
		if buff.remaining > 0:
			var affected: Array = buff.get("affected_hall_ids", [])
			if affected.is_empty() or hall_id in affected:
				mult *= buff.multiplier
	return mult

func _get_challenge_reward_multiplier(hall_id: int) -> float:
	var mult := 1.0
	for ch_id in challenge_completed:
		if not challenge_completed[ch_id]:
			continue
		var config = GameData.get_challenge(ch_id)
		if config.is_empty():
			continue
		match config.reward_type:
			"allIncomeMult":
				mult *= config.reward_value
			"allSpeedMult":
				mult *= config.reward_value
			"hallProfitMult":
				if config.target_hall_id == hall_id or config.target_hall_id < 0:
					mult *= config.reward_value
	return mult

func _get_challenge_speed_mult() -> float:
	if active_challenge_id <= 0:
		return 1.0
	var ch = GameData.get_challenge(active_challenge_id)
	if ch.is_empty():
		return 1.0
	if ch.restriction == "All cycles x3 slower":
		return 1.0 / 3.0
	return 1.0

func _get_sect_harmony_multiplier() -> float:
	var mult := 1.0
	var min_level := 999999
	for hall_id in hall_states:
		var state: Dictionary = hall_states[hall_id]
		if not state.unlocked or state.level <= 0:
			return 1.0
		min_level = mini(min_level, state.level)
	if min_level <= 0:
		return 1.0
	for harmony in GameData.sect_harmony_configs:
		if min_level >= harmony.min_level:
			mult *= harmony.multiplier
	return mult

func _is_hall_active_in_challenge(hall_id: int) -> bool:
	if active_challenge_id <= 0:
		return true
	var ch = GameData.get_challenge(active_challenge_id)
	if ch.is_empty():
		return true
	match ch.restriction:
		"Only Hall 1 active":
			return hall_id == 1
		"Only Halls 1 and 7 active":
			return hall_id == 1 or hall_id == 7
		"Formation Hall disabled":
			return hall_id != 4
		"Spirit Garden only":
			return hall_id == 5
	return true

func _check_challenge_completion() -> void:
	if active_challenge_id <= 0:
		return
	var ch = GameData.get_challenge(active_challenge_id)
	if ch.is_empty():
		return
	if challenge_earnings.gte(ch.target_earnings):
		challenge_completed[active_challenge_id] = true
		EventBus.challenge_completed.emit(active_challenge_id)
		active_challenge_id = -1
		challenge_earnings = BN.zero()

# ---------- AE Generation ----------

func get_ae_per_second() -> float:
	var hall3_state: Dictionary = hall_states.get(3, {})
	if hall3_state.is_empty() or hall3_state.level <= 0:
		return 0.0
	return hall3_state.level * 0.01

# ---------- Hall Actions ----------

func buy_hall(hall_id: int, amount: int = 1) -> bool:
	var config = GameData.get_hall_config(hall_id)
	var state: Dictionary = hall_states.get(hall_id, {})
	if config.is_empty() or not state.unlocked:
		return false
	var cost = BN.bulk_cost(config.base_cost, config.coefficient, state.level, amount)
	if spirit_stones.lt(cost):
		return false
	spirit_stones = spirit_stones.sub(cost)
	state.level += amount
	_recompute_milestones(hall_id)
	_try_unlock_next_hall(hall_id)
	EventBus.hall_leveled.emit(hall_id, state.level)
	EventBus.spirit_stones_changed.emit(spirit_stones)
	return true

func get_hall_cost(hall_id: int, amount: int = 1):
	var config = GameData.get_hall_config(hall_id)
	var state: Dictionary = hall_states.get(hall_id, {})
	if config.is_empty():
		return BN.zero()
	return BN.bulk_cost(config.base_cost, config.coefficient, state.level, amount)

func get_max_affordable_halls(hall_id: int) -> int:
	var config = GameData.get_hall_config(hall_id)
	var state: Dictionary = hall_states.get(hall_id, {})
	if config.is_empty():
		return 0
	return BN.max_affordable(config.base_cost, config.coefficient, state.level, spirit_stones)

func _try_unlock_next_hall(current_hall_id: int) -> void:
	var next_id = current_hall_id + 1
	if next_id > 12:
		return
	var next_state: Dictionary = hall_states.get(next_id, {})
	if next_state.is_empty() or next_state.unlocked:
		return
	var next_config = GameData.get_hall_config(next_id)
	if next_config.is_empty():
		return
	if spirit_stones.gte(next_config.base_cost) or hall_states[current_hall_id].level >= 10:
		next_state.unlocked = true
		EventBus.hall_unlocked.emit(next_id)

func _recompute_milestones(hall_id: int) -> void:
	var state: Dictionary = hall_states[hall_id]
	var milestones = GameData.get_milestones_for_hall(hall_id)
	var speed_mult := 1.0
	var profit_mult := 1.0
	for m in milestones:
		if state.level >= m.level:
			match m.effect_type:
				"speed":
					speed_mult *= m.multiplier
				"profit":
					profit_mult *= m.multiplier
				"allProfit":
					profit_mult *= m.multiplier
	state.milestone_speed_mult = speed_mult
	state.milestone_profit_mult = profit_mult

# ---------- Elder Actions ----------

func hire_elder(elder_id: int) -> bool:
	var config = GameData.get_elder_config(elder_id)
	if config.is_empty():
		return false
	if elder_hired.get(elder_id, false):
		return false
	if spirit_stones.lt(config.cost):
		return false
	if not _is_elder_allowed_in_challenge():
		return false
	spirit_stones = spirit_stones.sub(config.cost)
	elder_hired[elder_id] = true
	hall_states[config.hall_id].assigned_elder_id = elder_id
	EventBus.elder_hired.emit(elder_id)
	EventBus.spirit_stones_changed.emit(spirit_stones)
	return true

func _is_elder_allowed_in_challenge() -> bool:
	if active_challenge_id <= 0:
		return true
	var ch = GameData.get_challenge(active_challenge_id)
	return ch.restriction != "No Elders allowed"

# ---------- Meditate (Active Tap) ----------

func do_meditate() -> void:
	var base = BN.new(1)
	var rps = get_total_revenue_per_second()
	if rps.gt(0):
		base = rps.mul(0.1).max_bn(BN.one())
	_earn_spirit_stones(base)
	EventBus.meditate_tapped.emit()

# ---------- Dao Path ----------

func select_dao_path(path_id: int) -> void:
	selected_dao_path = path_id
	EventBus.dao_path_selected.emit(path_id)

func activate_dao_spell() -> bool:
	if selected_dao_path < 0:
		return false
	if spell_active or spell_cooldown_timer > 0:
		return false
	var path = GameData.get_dao_path(selected_dao_path)
	if path.is_empty():
		return false
	spell_active = true
	spell_timer = path.spell_duration
	spell_cooldown_timer = path.spell_cooldown
	spell_hall_multipliers.clear()
	_apply_spell_effect(path)
	EventBus.dao_spell_activated.emit(selected_dao_path)
	return true

func _apply_spell_effect(path: Dictionary) -> void:
	match path.id:
		1:
			for hall_id in hall_states:
				spell_hall_multipliers[hall_id] = randf_range(3.0, 10.0)
		2:
			pass
		3:
			var best_hall = 1
			var best_rev = BN.zero()
			for hall_id in hall_states:
				var rev = get_hall_revenue_per_second(hall_id)
				if rev.gt(best_rev):
					best_rev = rev
					best_hall = hall_id
			spell_hall_multipliers[best_hall] = 4.0
		4:
			var success = randf() < 0.5
			if success:
				for hall_id in hall_states:
					spell_hall_multipliers[hall_id] = 10.0
			else:
				for hall_id in hall_states:
					spell_hall_multipliers[hall_id] = 5.0
		5:
			treasure_timer = 0.1

# ---------- Alchemy ----------

func craft_alchemy(item_id: int) -> bool:
	if active_challenge_id > 0:
		var ch = GameData.get_challenge(active_challenge_id)
		if ch.restriction == "No crafting allowed":
			return false
	var config = GameData.get_alchemy_item(item_id)
	if config.is_empty():
		return false
	if alchemy_essence < config.ae_cost:
		return false
	alchemy_essence -= config.ae_cost
	var buff := {
		"buff_id": "alchemy_%d_%d" % [item_id, Time.get_ticks_msec()],
		"item_id": item_id,
		"multiplier": config.multiplier,
		"affected_hall_ids": config.affected_hall_ids,
		"remaining": config.duration_seconds,
		"duration": config.duration_seconds,
	}
	active_buffs.append(buff)
	EventBus.alchemy_crafted.emit(item_id)
	return true

# ---------- Challenges ----------

func start_challenge(challenge_id: int) -> bool:
	if active_challenge_id > 0:
		return false
	if challenge_completed.get(challenge_id, false):
		return false
	active_challenge_id = challenge_id
	challenge_earnings = BN.zero()
	EventBus.challenge_started.emit(challenge_id)
	return true

func abandon_challenge() -> void:
	if active_challenge_id > 0:
		active_challenge_id = -1
		challenge_earnings = BN.zero()

# ---------- Prestige / Ascension ----------

const HDP_DIVISOR := 44.44e9

func get_hdp_on_ascension() -> int:
	var earnings_f = total_earnings_this_run.to_float()
	if earnings_f < HDP_DIVISOR:
		return 0
	return int(floor(sqrt(earnings_f / HDP_DIVISOR)))

func can_ascend() -> bool:
	return get_hdp_on_ascension() > 0

func perform_ascension() -> void:
	var gained = get_hdp_on_ascension()
	if gained <= 0:
		return
	hdp += gained
	ascension_count += 1
	EventBus.ascension_started.emit()
	_reset_for_ascension()
	EventBus.ascension_completed.emit(gained)

func _reset_for_ascension() -> void:
	spirit_stones = BN.zero()
	total_earnings_this_run = BN.zero()
	alchemy_essence = 0.0
	active_buffs.clear()
	selected_dao_path = -1
	spell_active = false
	spell_timer = 0.0
	spell_cooldown_timer = 0.0
	spell_hall_multipliers.clear()
	active_challenge_id = -1
	challenge_earnings = BN.zero()
	_init_hall_states()
	_init_elder_states()

# ---------- Offline Earnings ----------

func calculate_offline_earnings(seconds: float):
	var max_seconds = minf(seconds, 72.0 * 3600.0)
	var rps = get_total_revenue_per_second()
	var efficiency := 0.5
	return rps.mul(max_seconds * efficiency)

# ---------- Serialization ----------

func get_save_data() -> Dictionary:
	var hall_save := {}
	for hall_id in hall_states:
		var s: Dictionary = hall_states[hall_id]
		hall_save[str(hall_id)] = {
			"level": s.level,
			"unlocked": s.unlocked,
			"cycle_progress": s.cycle_progress,
			"milestone_speed_mult": s.milestone_speed_mult,
			"milestone_profit_mult": s.milestone_profit_mult,
			"assigned_elder_id": s.assigned_elder_id,
		}
	var elder_save := {}
	for eid in elder_hired:
		elder_save[str(eid)] = elder_hired[eid]
	var challenge_save := {}
	for cid in challenge_completed:
		challenge_save[str(cid)] = challenge_completed[cid]
	var buff_save := []
	for buff in active_buffs:
		buff_save.append({
			"item_id": buff.item_id,
			"multiplier": buff.multiplier,
			"affected_hall_ids": buff.affected_hall_ids,
			"remaining": buff.remaining,
			"duration": buff.duration,
		})
	return {
		"spirit_stones": spirit_stones.to_dict(),
		"hdp": hdp,
		"hdp_spent": hdp_spent,
		"dao_crystals": dao_crystals,
		"heavenly_seals": heavenly_seals,
		"alchemy_essence": alchemy_essence,
		"halls": hall_save,
		"elders": elder_save,
		"selected_dao_path": selected_dao_path,
		"challenges_completed": challenge_save,
		"active_challenge_id": active_challenge_id,
		"challenge_earnings": challenge_earnings.to_dict(),
		"total_earnings": total_earnings_this_run.to_dict(),
		"ascension_count": ascension_count,
		"total_play_time": total_play_time,
		"active_buffs": buff_save,
		"timestamp": Time.get_unix_time_from_system(),
	}

func load_save_data(data: Dictionary) -> void:
	spirit_stones = BN.from_dict(data.get("spirit_stones", {"m":0,"e":0}))
	hdp = data.get("hdp", 0)
	hdp_spent = data.get("hdp_spent", 0)
	dao_crystals = data.get("dao_crystals", 0)
	heavenly_seals = data.get("heavenly_seals", 0)
	alchemy_essence = data.get("alchemy_essence", 0.0)
	selected_dao_path = data.get("selected_dao_path", -1)
	active_challenge_id = data.get("active_challenge_id", -1)
	challenge_earnings = BN.from_dict(data.get("challenge_earnings", {"m":0,"e":0}))
	total_earnings_this_run = BN.from_dict(data.get("total_earnings", {"m":0,"e":0}))
	ascension_count = data.get("ascension_count", 0)
	total_play_time = data.get("total_play_time", 0.0)

	var hall_save: Dictionary = data.get("halls", {})
	for key in hall_save:
		var hall_id = int(key)
		var s: Dictionary = hall_save[key]
		hall_states[hall_id] = {
			"level": s.get("level", 0),
			"unlocked": s.get("unlocked", false),
			"cycle_progress": s.get("cycle_progress", 0.0),
			"milestone_speed_mult": s.get("milestone_speed_mult", 1.0),
			"milestone_profit_mult": s.get("milestone_profit_mult", 1.0),
			"assigned_elder_id": s.get("assigned_elder_id", -1),
		}

	var elder_save: Dictionary = data.get("elders", {})
	for key in elder_save:
		elder_hired[int(key)] = elder_save[key]

	var challenge_save: Dictionary = data.get("challenges_completed", {})
	for key in challenge_save:
		challenge_completed[int(key)] = challenge_save[key]

	var buff_save: Array = data.get("active_buffs", [])
	active_buffs.clear()
	for b in buff_save:
		active_buffs.append({
			"buff_id": "loaded_%d" % Time.get_ticks_msec(),
			"item_id": b.get("item_id", 0),
			"multiplier": b.get("multiplier", 1.0),
			"affected_hall_ids": b.get("affected_hall_ids", []),
			"remaining": b.get("remaining", 0.0),
			"duration": b.get("duration", 0.0),
		})

	var saved_time: float = data.get("timestamp", 0.0)
	if saved_time > 0:
		var now = Time.get_unix_time_from_system()
		var offline_seconds = now - saved_time
		if offline_seconds > 5:
			var earnings = calculate_offline_earnings(offline_seconds)
			if earnings.gt(0):
				_earn_spirit_stones(earnings)
				EventBus.offline_earnings_calculated.emit(earnings, offline_seconds)

	for hall_id in hall_states:
		_recompute_milestones(hall_id)

	EventBus.game_loaded.emit()
