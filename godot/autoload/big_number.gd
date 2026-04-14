extends Node

const SUFFIXES: Array[Array] = [
	[1e303, "Ce"],
	[1e300, "GoC"],
	[1e120, "Tg"],
	[1e117, "uTg"],
	[1e114, "DTg"],
	[1e111, "tTg"],
	[1e108, "qTg"],
	[1e105, "QiTg"],
	[1e102, "sxTg"],
	[1e99, "SpTg"],
	[1e96, "OcTg"],
	[1e93, "NoTg"],
	[1e90, "Tgt"],
	[1e87, "uTgt"],
	[1e84, "DTgt"],
	[1e81, "tTgt"],
	[1e78, "qTgt"],
	[1e75, "QiTgt"],
	[1e72, "sxTgt"],
	[1e69, "SpTgt"],
	[1e66, "Uvg"],
	[1e63, "Vg"],
	[1e60, "Nod"],
	[1e57, "Ocd"],
	[1e54, "Spd"],
	[1e51, "Sxd"],
	[1e48, "Qid"],
	[1e45, "Qad"],
	[1e42, "Td"],
	[1e39, "Dd"],
	[1e36, "Ud"],
	[1e33, "Dc"],
	[1e30, "No"],
	[1e27, "Oc"],
	[1e24, "Sp"],
	[1e21, "Sx"],
	[1e18, "Qi"],
	[1e15, "Qa"],
	[1e12, "T"],
	[1e9, "B"],
	[1e6, "M"],
	[1e3, "K"],
]


func format_number(n: float) -> String:
	if n < 0.0:
		return "-" + format_number(-n)

	if n < 1000.0:
		return str(int(n))

	for entry in SUFFIXES:
		var threshold: float = entry[0]
		var suffix: String = entry[1]
		if n >= threshold:
			var value: float = n / threshold
			if value >= 100.0:
				return str(int(value)) + suffix
			if value >= 10.0:
				var truncated := snappedf(floorf(value * 10.0) / 10.0, 0.1)
				var s := "%.1f" % truncated
				if s.ends_with(".0"):
					s = s.substr(0, s.length() - 2)
				return s + suffix
			var truncated := snappedf(floorf(value * 100.0) / 100.0, 0.01)
			var s := "%.2f" % truncated
			s = s.rstrip("0").rstrip(".")
			return s + suffix

	var exp_val := int(log(n) / log(10.0))
	var mantissa := n / pow(10.0, exp_val)
	var truncated := snappedf(floorf(mantissa * 100.0) / 100.0, 0.01)
	var s := "%.2f" % truncated
	s = s.rstrip("0").rstrip(".")
	return s + "e" + str(exp_val)


func bulk_cost(base_cost: float, coeff: float, owned: int, buying: int) -> float:
	if buying <= 0:
		return 0.0
	if is_equal_approx(coeff, 1.0):
		return base_cost * buying

	return base_cost * pow(coeff, owned) * (pow(coeff, buying) - 1.0) / (coeff - 1.0)


func max_affordable(base_cost: float, coeff: float, owned: int, budget: float) -> int:
	if budget < bulk_cost(base_cost, coeff, owned, 1):
		return 0

	var lo := 1
	var hi := 2
	while bulk_cost(base_cost, coeff, owned, hi) <= budget:
		hi *= 2
		if hi > 1_000_000_000:
			break

	while lo < hi:
		var mid := (lo + hi + 1) / 2
		if bulk_cost(base_cost, coeff, owned, mid) <= budget:
			lo = mid
		else:
			hi = mid - 1

	return lo
