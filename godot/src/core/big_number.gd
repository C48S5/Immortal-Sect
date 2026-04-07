class_name BigNumber
extends RefCounted

## Custom big number class for idle game math.
## Stores numbers as mantissa * 10^exponent for arbitrary precision.

var mantissa: float = 0.0
var exponent: int = 0

func _init(val = 0.0) -> void:
	if val is BigNumber:
		mantissa = val.mantissa
		exponent = val.exponent
	elif val is String:
		_parse_string(val)
	elif val is float or val is int:
		_from_float(float(val))

func _parse_string(s: String) -> void:
	s = s.strip_edges()
	if s.contains("e") or s.contains("E"):
		var parts := s.split("e" if s.contains("e") else "E")
		_from_float(float(parts[0]))
		exponent += int(parts[1])
	else:
		_from_float(float(s))

func _from_float(val: float) -> void:
	if val == 0.0 or is_nan(val):
		mantissa = 0.0
		exponent = 0
		return
	var neg := val < 0
	val = absf(val)
	exponent = int(floor(log(val) / log(10.0)))
	mantissa = val / pow(10.0, exponent)
	if neg:
		mantissa = -mantissa
	_normalize()

func _normalize() -> void:
	if mantissa == 0.0:
		exponent = 0
		return
	while absf(mantissa) >= 10.0:
		mantissa /= 10.0
		exponent += 1
	while absf(mantissa) < 1.0 and mantissa != 0.0:
		mantissa *= 10.0
		exponent -= 1

static func create(val = 0.0) -> BigNumber:
	return BigNumber.new(val)

static func zero() -> BigNumber:
	return BigNumber.new(0)

static func one() -> BigNumber:
	return BigNumber.new(1)

func duplicate_bn() -> BigNumber:
	var bn := BigNumber.new()
	bn.mantissa = mantissa
	bn.exponent = exponent
	return bn

func to_float() -> float:
	return mantissa * pow(10.0, exponent)

func is_zero() -> bool:
	return mantissa == 0.0

func add(other) -> BigNumber:
	var b: BigNumber = _ensure_bn(other)
	if is_zero():
		return b.duplicate_bn()
	if b.is_zero():
		return duplicate_bn()
	var diff := exponent - b.exponent
	var result := BigNumber.new()
	if diff >= 15:
		return duplicate_bn()
	if diff <= -15:
		return b.duplicate_bn()
	if diff >= 0:
		result.exponent = exponent
		result.mantissa = mantissa + b.mantissa * pow(10.0, -diff)
	else:
		result.exponent = b.exponent
		result.mantissa = mantissa * pow(10.0, diff) + b.mantissa
	result._normalize()
	return result

func sub(other) -> BigNumber:
	var b: BigNumber = _ensure_bn(other)
	var neg_b := b.duplicate_bn()
	neg_b.mantissa = -neg_b.mantissa
	return add(neg_b)

func mul(other) -> BigNumber:
	var b: BigNumber = _ensure_bn(other)
	var result := BigNumber.new()
	result.mantissa = mantissa * b.mantissa
	result.exponent = exponent + b.exponent
	result._normalize()
	return result

func div(other) -> BigNumber:
	var b: BigNumber = _ensure_bn(other)
	if b.mantissa == 0.0:
		return BigNumber.new(0)
	var result := BigNumber.new()
	result.mantissa = mantissa / b.mantissa
	result.exponent = exponent - b.exponent
	result._normalize()
	return result

func pow_n(n: float) -> BigNumber:
	if mantissa == 0.0:
		return BigNumber.new(0)
	var result := BigNumber.new()
	var new_exp_f := float(exponent) * n + log(absf(mantissa)) / log(10.0) * n
	result.exponent = int(floor(new_exp_f))
	result.mantissa = pow(10.0, new_exp_f - result.exponent)
	if mantissa < 0 and int(n) % 2 == 1:
		result.mantissa = -result.mantissa
	result._normalize()
	return result

func floor_bn() -> BigNumber:
	if exponent < 0:
		return BigNumber.new(0)
	return BigNumber.new(floor(to_float()))

func gte(other) -> bool:
	return compare(other) >= 0

func gt(other) -> bool:
	return compare(other) > 0

func lte(other) -> bool:
	return compare(other) <= 0

func lt(other) -> bool:
	return compare(other) < 0

func eq(other) -> bool:
	return compare(other) == 0

func compare(other) -> int:
	var b: BigNumber = _ensure_bn(other)
	if mantissa >= 0 and b.mantissa < 0:
		return 1
	if mantissa < 0 and b.mantissa >= 0:
		return -1
	if mantissa == 0.0 and b.mantissa == 0.0:
		return 0
	var sign := 1 if mantissa > 0 else -1
	if exponent != b.exponent:
		return sign if exponent > b.exponent else -sign
	if mantissa > b.mantissa:
		return 1
	elif mantissa < b.mantissa:
		return -1
	return 0

func max_bn(other) -> BigNumber:
	return duplicate_bn() if gte(other) else _ensure_bn(other).duplicate_bn()

func min_bn(other) -> BigNumber:
	return duplicate_bn() if lte(other) else _ensure_bn(other).duplicate_bn()

func log10_bn() -> float:
	if mantissa <= 0:
		return 0.0
	return log(mantissa) / log(10.0) + exponent

func _ensure_bn(val) -> BigNumber:
	if val is BigNumber:
		return val
	return BigNumber.new(val)

const SUFFIXES := [
	"K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No",
	"Dc", "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nod",
	"Vg", "Uvg"
]

func format() -> String:
	if is_zero():
		return "0"
	var val := to_float()
	if absf(val) < 1000.0:
		if val == floor(val):
			return str(int(val))
		return "%.1f" % val
	var suffix_idx := -1
	var display_val := absf(val)
	while display_val >= 1000.0 and suffix_idx < SUFFIXES.size() - 1:
		display_val /= 1000.0
		suffix_idx += 1
	if suffix_idx < 0 or suffix_idx >= SUFFIXES.size():
		return "%.2e" % val
	var sign := "" if val >= 0 else "-"
	if display_val >= 100:
		return "%s%d%s" % [sign, int(display_val), SUFFIXES[suffix_idx]]
	elif display_val >= 10:
		return "%s%.1f%s" % [sign, snappedf(display_val, 0.1), SUFFIXES[suffix_idx]]
	return "%s%.2f%s" % [sign, snappedf(display_val, 0.01), SUFFIXES[suffix_idx]]

func to_dict() -> Dictionary:
	return {"m": mantissa, "e": exponent}

static func from_dict(d: Dictionary) -> BigNumber:
	var bn := BigNumber.new()
	bn.mantissa = d.get("m", 0.0)
	bn.exponent = d.get("e", 0)
	return bn

func _to_string() -> String:
	return format()

static func bulk_cost(base_cost: BigNumber, coeff: float, owned: int, buying: int) -> BigNumber:
	if buying <= 0:
		return BigNumber.zero()
	if coeff == 1.0:
		return base_cost.mul(buying)
	var coeff_bn := BigNumber.new(coeff)
	return base_cost.mul(coeff_bn.pow_n(owned)).mul(coeff_bn.pow_n(buying).sub(BigNumber.one())).div(coeff_bn.sub(BigNumber.one()))

static func max_affordable(base_cost: BigNumber, coeff: float, owned: int, budget: BigNumber) -> int:
	if budget.lt(bulk_cost(base_cost, coeff, owned, 1)):
		return 0
	var lo := 1
	var hi := 2
	while bulk_cost(base_cost, coeff, owned, hi).lte(budget):
		hi *= 2
		if hi > 100000:
			break
	while lo < hi:
		var mid := (lo + hi + 1) / 2
		if bulk_cost(base_cost, coeff, owned, mid).lte(budget):
			lo = mid
		else:
			hi = mid - 1
	return lo
