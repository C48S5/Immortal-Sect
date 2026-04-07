extends Node
## Manages the Legacy Shrine and Qi Residue shop — permanent progression
## that persists across Ascensions.  See GDD Disciple System Section 6.

signal legacy_changed

## Legacy Fragments from Rare+ disciple deaths.
## Each: { config_id, fragment_type, legacy_power_value, assigned_hall_id }
var fragments: Array = []

## Legacy Techniques from Legendary deaths.
## Each: { config_id, technique_name, effect }
var techniques: Array = []

## Qi Residue shop: buff_id -> number of times purchased
var qr_shop_purchases: Dictionary = {}

const QR_SHOP: Dictionary = {
	"qi_condensation":        { "cost": 50,    "max": 20, "effect": "all_hall_income",   "value": 0.005 },
	"foundation_strengthening": { "cost": 150,  "max": 10, "effect": "ascension_hdp",    "value": 0.01 },
	"spirit_sense":           { "cost": 300,   "max": 10, "effect": "treasure_value",    "value": 0.02 },
	"root_purification":      { "cost": 500,   "max": 20, "effect": "disciple_stats",    "value": 0.01 },
	"karma_accumulation":     { "cost": 1000,  "max": 5,  "effect": "epic_plus_rate",    "value": 0.005 },
	"sect_foundation":        { "cost": 2500,  "max": 10, "effect": "ae_generation",     "value": 0.03 },
	"heavenly_fortune":       { "cost": 5000,  "max": 3,  "effect": "daily_realm_key",   "value": 1 },
	"dao_comprehension":      { "cost": 10000, "max": 5,  "effect": "dao_path_spell",    "value": 0.05 },
}


func _ready() -> void:
	pass


func add_fragment(fragment_dict: Dictionary) -> void:
	fragments.append(fragment_dict)
	legacy_changed.emit()


func add_technique(technique_dict: Dictionary) -> void:
	techniques.append(technique_dict)
	legacy_changed.emit()


func get_total_legacy_power() -> float:
	var total: float = 0.0
	for frag: Dictionary in fragments:
		total += frag.get("legacy_power_value", 0.0)
	return total


func get_global_legacy_multiplier() -> float:
	var total_power: float = get_total_legacy_power()
	return 1.0 + log(1.0 + total_power) / log(10.0) * 0.5


func buy_qr_shop_buff(buff_id: String) -> bool:
	if not QR_SHOP.has(buff_id):
		return false

	var def: Dictionary = QR_SHOP[buff_id]
	var current_count: int = qr_shop_purchases.get(buff_id, 0)
	if current_count >= def["max"]:
		return false

	var cost: int = def["cost"]
	if GameManager.get_qi_residue() < cost:
		return false

	GameManager.spend_qi_residue(cost)
	qr_shop_purchases[buff_id] = current_count + 1
	legacy_changed.emit()
	return true


func get_qr_buff_value(buff_id: String) -> float:
	if not QR_SHOP.has(buff_id):
		return 0.0
	var count: int = qr_shop_purchases.get(buff_id, 0)
	return QR_SHOP[buff_id]["value"] * count


func get_qr_buff_purchases(buff_id: String) -> int:
	return qr_shop_purchases.get(buff_id, 0)


func get_hall_legacy_bonus(hall_id: int) -> float:
	var bonus: float = 0.0
	for frag: Dictionary in fragments:
		if frag.get("fragment_type", "") == "minor":
			if frag.get("assigned_hall_id", 0) == hall_id:
				bonus += 0.01
			elif frag.get("assigned_hall_id", 0) == 0:
				bonus += 0.005
	return bonus


func get_save_data() -> Dictionary:
	return {
		"fragments": fragments.duplicate(true),
		"techniques": techniques.duplicate(true),
		"qr_shop_purchases": qr_shop_purchases.duplicate(),
	}


func load_save_data(data: Dictionary) -> void:
	fragments = data.get("fragments", []).duplicate(true)
	techniques = data.get("techniques", []).duplicate(true)
	qr_shop_purchases = data.get("qr_shop_purchases", {}).duplicate()
	legacy_changed.emit()
