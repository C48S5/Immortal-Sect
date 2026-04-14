extends Node

## Manages HDP (Heavenly Dao Points), ascension, and prestige shop.

# --- Signals ---
signal ascension_performed
signal hdp_changed

# --- Constants ---
const HDP_DIVISOR: float = 44440000000.0  # 44.44 Billion

# --- State ---
var total_hdp: int = 0
var spent_hdp: int = 0
var hdp_shop_purchases: Dictionary = {}  # item_id -> purchase_count
var total_revenue_this_run: float = 0.0

# Ascension history
var ascension_count: int = 0
var best_hdp: int = 0
var fastest_ascension: float = INF  # seconds


# --- Revenue tracking ---

func add_revenue(amount: float) -> void:
	total_revenue_this_run += amount


# --- HDP calculations ---

func can_ascend() -> bool:
	return get_hdp_preview() > 0


func get_hdp_preview() -> int:
	if total_revenue_this_run < HDP_DIVISOR:
		return 0
	var ratio: float = total_revenue_this_run / HDP_DIVISOR
	return int(floor(sqrt(ratio)))


func get_hdp_multiplier() -> float:
	var unspent: int = total_hdp - spent_hdp
	if unspent < 0:
		unspent = 0
	return 1.0 + unspent * 0.02


# --- Spending ---

func spend_hdp(amount: int) -> bool:
	var available: int = total_hdp - spent_hdp
	if available < amount:
		return false
	spent_hdp += amount
	hdp_changed.emit()
	return true


func purchase_hdp_shop_item(item_id: String, cost: int) -> bool:
	if not spend_hdp(cost):
		return false
	if hdp_shop_purchases.has(item_id):
		hdp_shop_purchases[item_id] += 1
	else:
		hdp_shop_purchases[item_id] = 1
	return true


# --- Ascension ---

func perform_ascension(run_duration: float) -> void:
	if not can_ascend():
		return

	var hdp_earned: int = get_hdp_preview()

	total_hdp += hdp_earned
	ascension_count += 1
	best_hdp = max(best_hdp, hdp_earned)
	fastest_ascension = min(fastest_ascension, run_duration)

	# Reset run revenue
	total_revenue_this_run = 0.0

	# Reset GameManager currencies (SS + AE reset; HDP/DC/HS persist)
	GameManager.ascend(hdp_earned)

	# Reset halls
	HallManager.reset_for_ascension()

	# Reset elders
	ElderManager.reset_for_ascension()

	# Clear alchemy buffs
	AlchemyManager.clear_buffs()

	# Reset Dao Path spell
	DaoPathManager.reset_spell()

	hdp_changed.emit()
	ascension_performed.emit()


# --- Ascension reset (resets only run-tracking data) ---

func reset_for_ascension() -> void:
	total_revenue_this_run = 0.0
