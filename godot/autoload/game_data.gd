extends Node

# ===========================================================================
# Immortal Sect — Complete Static Game Data
# Ported from TypeScript source into GDScript dictionaries/arrays.
# ===========================================================================

# ---------------------------------------------------------------------------
# Hall Configs (12 halls)
# ---------------------------------------------------------------------------
var HALL_CONFIGS: Array[Dictionary] = [
	{id=1, name="Qi Gathering Pavilion", base_cost=4.0, coefficient=1.07, cycle_seconds=1.0, base_revenue=0.08, element="neutral", matching_root="any", description="The foundation of any sect. Disciples gather ambient qi here."},
	{id=2, name="Body Tempering Dojo", base_cost=26.0, coefficient=1.15, cycle_seconds=3.0, base_revenue=0.49, element="earth", matching_root="earth", description="A brutal training ground where cultivators forge their physical vessels."},
	{id=3, name="Alchemy Furnace Chamber", base_cost=182.0, coefficient=1.13, cycle_seconds=6.0, base_revenue=3.25, element="fire", matching_root="fire", description="Pill refinement hall. Generates Alchemy Essence alongside Spirit Stones."},
	{id=4, name="Formation Array Hall", base_cost=1274.0, coefficient=1.12, cycle_seconds=12.0, base_revenue=20.55, element="earth", matching_root="earth", description="Masters of protective and offensive formations reduce costs for the sect."},
	{id=5, name="Spirit Beast Garden", base_cost=8918.0, coefficient=1.11, cycle_seconds=24.0, base_revenue=120.51, element="wood", matching_root="wood", description="A menagerie of spiritual beasts that generate resources and AE."},
	{id=6, name="Talisman Inscription Studio", base_cost=62426.0, coefficient=1.10, cycle_seconds=36.0, base_revenue=725.88, element="metal", matching_root="metal", description="Calligraphers inscribe powerful talismans that extend alchemy buff durations."},
	{id=7, name="Sword Refinement Peak", base_cost=436982.0, coefficient=1.11, cycle_seconds=48.0, base_revenue=4459.0, element="metal", matching_root="metal", description="The highest peak of the sect where sword cultivators hone their blades."},
	{id=8, name="Tribulation Lightning Tower", base_cost=3058874.0, coefficient=1.10, cycle_seconds=96.0, base_revenue=20951.0, element="fire", matching_root="fire", description="A tower that harnesses tribulation lightning for cultivation breakthroughs."},
	{id=9, name="Void Meditation Sanctum", base_cost=21412118.0, coefficient=1.09, cycle_seconds=192.0, base_revenue=88480.0, element="water", matching_root="water", description="A pocket dimension where time flows differently, boosting offline earnings."},
	{id=10, name="Soul Tempering Pagoda", base_cost=149884826.0, coefficient=1.09, cycle_seconds=384.0, base_revenue=345357.0, element="water", matching_root="water", description="A pagoda that tempers the soul, increasing the value of Heavenly Treasures."},
	{id=11, name="Celestial Inscription Library", base_cost=1124136195.0, coefficient=1.08, cycle_seconds=512.0, base_revenue=2000242.0, element="wood", matching_root="wood", description="An ancient library containing celestial inscriptions that empower Dao Path spells."},
	{id=12, name="Dao Comprehension Throne", base_cost=8993089560.0, coefficient=1.07, cycle_seconds=768.0, base_revenue=10993997.0, element="neutral", matching_root="any", description="The seat of ultimate enlightenment. Increases Mandate effectiveness."},
]

# ---------------------------------------------------------------------------
# Elder Configs (12 elders)
# ---------------------------------------------------------------------------
var ELDER_CONFIGS: Array[Dictionary] = [
	{id=1, name="Elder Qin", title="Qi Master", hall_id=1, cost=1000.0, description="A venerable master of qi circulation who can manage the Pavilion in his sleep."},
	{id=2, name="Master Iron Fist", title="Body Cultivator", hall_id=2, cost=15000.0, description="His iron body techniques are legendary throughout the cultivation world."},
	{id=3, name="Grandmaster Huo", title="Pill Saint", hall_id=3, cost=100000.0, description="A pill refinement genius who can produce spirit pills with a wave of his hand."},
	{id=4, name="Formation Sage Wei", title="Array Master", hall_id=4, cost=750000.0, description="He can set up a ten-thousand-sword formation before you finish your tea."},
	{id=5, name="Beast Tamer Liu", title="Spirit Beast Master", hall_id=5, cost=5000000.0, description="Even the most ferocious spirit beasts become docile under his gaze."},
	{id=6, name="Talisman Master Xu", title="Inscription Sage", hall_id=6, cost=35000000.0, description="His talismans are said to contain the wisdom of three cultivation epochs."},
	{id=7, name="Sword Saint Jian", title="Sword Immortal", hall_id=7, cost=250000000.0, description="A sword immortal who comprehended ten thousand sword intents on a single mountaintop."},
	{id=8, name="Lightning Elder Zhao", title="Tribulation Sovereign", hall_id=8, cost=1750000000.0, description="He has survived nine heavenly tribulations and wears the scars proudly."},
	{id=9, name="Void Walker Chen", title="Void Sage", hall_id=9, cost=12500000000.0, description="He exists partially between dimensions, his form flickering like a mirage."},
	{id=10, name="Soul Sage Bai", title="Soul Cultivator", hall_id=10, cost=87500000000.0, description="Her soul sense extends across three continents and two spiritual planes."},
	{id=11, name="Celestial Scribe Lin", title="Celestial Recorder", hall_id=11, cost=625000000000.0, description="He has transcribed every celestial scripture known to the nine heavens."},
	{id=12, name="Dao Ancestor", title="Dao Progenitor", hall_id=12, cost=5000000000000.0, description="The founder of the sect, returned from beyond the heavens to guide its future."},
]

# ---------------------------------------------------------------------------
# Dao Path Configs (5 paths)
# ---------------------------------------------------------------------------
var DAO_PATH_CONFIGS: Array[Dictionary] = [
	{
		id=1, name="Sword Dao",
		boosted_hall_ids=[1, 7], hall_multiplier=3.0,
		passive_description="+10% crit chance on Heavenly Treasures", passive_value=0.10,
		spell={name="Sword Storm", active_duration=45, cooldown=180, effect_description="For 45s, every 3s a random hall receives x3-x10 income (avg x5.5). 180s cooldown."},
	},
	{
		id=2, name="Alchemy Dao",
		boosted_hall_ids=[3, 5], hall_multiplier=3.0,
		passive_description="-20% alchemy crafting time", passive_value=0.20,
		spell={name="Golden Core Overflow", active_duration=60, cooldown=240, effect_description="For 60s, AE generation is tripled (x3). 240s cooldown."},
	},
	{
		id=3, name="Formation Dao",
		boosted_hall_ids=[4, 6], hall_multiplier=3.0,
		passive_description="-5% all hall costs", passive_value=0.05,
		spell={name="Barrier Seal", active_duration=90, cooldown=300, effect_description="Lock 1 hall for 90s. Income ramps x1 to x4 over duration (avg x2.5, x4 if held full). 300s cooldown."},
	},
	{
		id=4, name="Body Dao",
		boosted_hall_ids=[2, 8], hall_multiplier=3.0,
		passive_description="+25% offline earnings", passive_value=0.25,
		spell={name="Heavenly Tribulation", active_duration=10, cooldown=300, effect_description="50% chance: x10 all income for 10s. 50% chance: x0 for 5s then x5 for 5s. 300s cooldown."},
	},
	{
		id=5, name="Spirit Dao",
		boosted_hall_ids=[9, 10, 11], hall_multiplier=2.5,
		passive_description="+1 Heavenly Treasure per minute", passive_value=1.0,
		spell={name="Beast Stampede", active_duration=45, cooldown=360, effect_description="For 45s, Heavenly Treasure spawn rate is x5. 360s cooldown."},
	},
]

# ---------------------------------------------------------------------------
# Alchemy Item Configs (10 pills)
# ---------------------------------------------------------------------------
var ALCHEMY_ITEM_CONFIGS: Array[Dictionary] = [
	{id=1, name="Qi Condensation Pill", ae_cost=10, duration_seconds=60, multiplier=2.0, affected_hall_ids=[1, 2, 3], unlock_level=50, effect_description="x2 income for Halls 1-3 for 60s"},
	{id=2, name="Body Tempering Pill", ae_cost=25, duration_seconds=120, multiplier=3.0, affected_hall_ids=[2], unlock_level=100, effect_description="x3 Hall 2 income for 120s"},
	{id=3, name="Spirit Enhancement Pill", ae_cost=50, duration_seconds=180, multiplier=2.0, affected_hall_ids=[4, 5, 6], unlock_level=200, effect_description="x2 income for Halls 4-6 for 180s"},
	{id=4, name="Sword Qi Pill", ae_cost=100, duration_seconds=300, multiplier=3.0, affected_hall_ids=[7], unlock_level=400, effect_description="x3 Hall 7 income for 300s"},
	{id=5, name="Lightning Resistance Pill", ae_cost=75, duration_seconds=300, multiplier=3.0, affected_hall_ids=[8], unlock_level=600, effect_description="x3 Hall 8 income for 300s"},
	{id=6, name="Void Essence Pill", ae_cost=200, duration_seconds=600, multiplier=3.0, affected_hall_ids=[9], unlock_level=1000, effect_description="x3 Hall 9 income for 600s"},
	{id=7, name="Soul Strengthening Pill", ae_cost=200, duration_seconds=300, multiplier=2.5, affected_hall_ids=[10, 11], unlock_level=1500, effect_description="x2.5 income for Halls 10-11 for 300s"},
	{id=8, name="Dao Comprehension Pill", ae_cost=350, duration_seconds=600, multiplier=4.0, affected_hall_ids=[12], unlock_level=2000, effect_description="x4 Hall 12 income for 600s"},
	{id=9, name="Heavenly Fortune Pill", ae_cost=400, duration_seconds=600, multiplier=2.5, affected_hall_ids=[], unlock_level=3000, effect_description="x2.5 Heavenly Treasure value for 600s"},
	{id=10, name="Universal Cultivation Pill", ae_cost=500, duration_seconds=900, multiplier=2.0, affected_hall_ids=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], unlock_level=5000, effect_description="x2 ALL halls income for 900s"},
]

# ---------------------------------------------------------------------------
# Challenge Configs (12 tribulation challenges)
# ---------------------------------------------------------------------------
var CHALLENGE_CONFIGS: Array[Dictionary] = [
	{id=1, name="One Path", restriction="Only Hall 1 active", target_earnings=1e9, reward_description="x2 Hall 1 income permanent", reward_type="hallProfitMult", reward_value=2.0, target_hall_id=1},
	{id=2, name="Poverty Sect", restriction="No Elders allowed", target_earnings=1e10, reward_description="-10% all Elder costs permanent", reward_type="elderCostReduction", reward_value=0.10},
	{id=3, name="Speed Trial", restriction="All cycles x3 slower", target_earnings=1e11, reward_description="x1.5 all speed permanent", reward_type="allSpeedMult", reward_value=1.5},
	{id=4, name="No Alchemy", restriction="No crafting allowed", target_earnings=5e11, reward_description="+50% AE generation permanent", reward_type="aeGenerationMult", reward_value=1.5},
	{id=5, name="Iron Wall", restriction="Formation Hall disabled", target_earnings=1e12, reward_description="-15% all costs permanent", reward_type="allCostReduction", reward_value=0.15},
	{id=6, name="Wild Beasts", restriction="Spirit Garden only", target_earnings=1e12, reward_description="x3 treasure value permanent", reward_type="treasureValueMult", reward_value=3.0},
	{id=7, name="Sword Only", restriction="Only Halls 1 and 7 active", target_earnings=5e13, reward_description="x2 Sword Peak income permanent", reward_type="hallProfitMult", reward_value=2.0, target_hall_id=7},
	{id=8, name="Lightning Trial", restriction="Random hall disabled each minute", target_earnings=5e14, reward_description="+25% HDP gain permanent", reward_type="hdpGainMult", reward_value=1.25},
	{id=9, name="Void Meditation", restriction="Offline only (cannot earn while app is open)", target_earnings=5e15, reward_description="x3 offline earnings permanent", reward_type="offlineEarningsMult", reward_value=3.0},
	{id=10, name="Soul Tempering", restriction="All income divided by 10", target_earnings=5e16, reward_description="x2 all income permanent", reward_type="allIncomeMult", reward_value=2.0},
	{id=11, name="Celestial Test", restriction="No milestones active", target_earnings=5e17, reward_description="x1.5 milestone multipliers permanent", reward_type="milestonePowerMult", reward_value=1.5},
	{id=12, name="Dao Heart Trial", restriction="All restrictions combined (except Void Meditation)", target_earnings=1e18, reward_description="x5 all income permanent", reward_type="allIncomeMult", reward_value=5.0},
]

# ---------------------------------------------------------------------------
# Mandate Config
# ---------------------------------------------------------------------------
var MANDATE_LEVELS: Array[Dictionary] = [
	{level=1, multiplier=1.5, hs_cost=1},
	{level=2, multiplier=3.0, hs_cost=3},
	{level=3, multiplier=6.0, hs_cost=10},
	{level=4, multiplier=15.0, hs_cost=25},
]

var MANDATE_DC_PER_SEAL: int = 6

# ---------------------------------------------------------------------------
# HDP Shop Configs (10 upgrades)
# ---------------------------------------------------------------------------
var HDP_SHOP_CONFIGS: Array[Dictionary] = [
	{id=1, name="Qi Burst", hdp_cost=10, effect_description="x2 Hall 1 income permanent", affected_hall_ids=[1], multiplier=2.0},
	{id=2, name="Iron Body", hdp_cost=25, effect_description="x2 Hall 2 income permanent", affected_hall_ids=[2], multiplier=2.0},
	{id=3, name="Furnace Mastery", hdp_cost=50, effect_description="x2 Hall 3 income permanent", affected_hall_ids=[3], multiplier=2.0},
	{id=4, name="Formation Insight", hdp_cost=100, effect_description="x2 Hall 4 income permanent", affected_hall_ids=[4], multiplier=2.0},
	{id=5, name="Beast Communion", hdp_cost=200, effect_description="x2 Hall 5 income permanent", affected_hall_ids=[5], multiplier=2.0},
	{id=6, name="Talisman Wisdom", hdp_cost=400, effect_description="x2 Hall 6 income permanent", affected_hall_ids=[6], multiplier=2.0},
	{id=7, name="Sword Heart", hdp_cost=750, effect_description="x2 Hall 7 income permanent", affected_hall_ids=[7], multiplier=2.0},
	{id=8, name="Thunder Dao", hdp_cost=1500, effect_description="x2 Hall 8 income permanent", affected_hall_ids=[8], multiplier=2.0},
	{id=9, name="Void Mastery", hdp_cost=3000, effect_description="x2 Hall 9 income permanent", affected_hall_ids=[9], multiplier=2.0},
	{id=10, name="Cosmic Insight", hdp_cost=5000, effect_description="x2 ALL halls income permanent", affected_hall_ids=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], multiplier=2.0},
]

# ---------------------------------------------------------------------------
# Disciple Configs (15 disciples)
# ---------------------------------------------------------------------------
var DISCIPLE_CONFIGS: Array[Dictionary] = [
	# === COMMON ===
	{
		id="li-fen", name="Li Fen", chinese_name="李奋",
		rarity="common", root="fire",
		stats={hp=95, atk=110, def=80, spd=90}, ability_slots=1,
		hall_passive_description="+3% Alchemy Furnace speed",
		combat_ability_name="Flame Fist", combat_ability_description="120% ATK to single target",
		lore="A countryside orphan who taught herself cultivation by watching sect disciples through a crack in the wall.",
	},
	{
		id="zhou-mu", name="Zhou Mu", chinese_name="周木",
		rarity="common", root="wood",
		stats={hp=100, atk=85, def=90, spd=115}, ability_slots=1,
		hall_passive_description="+3% Spirit Beast Garden income",
		combat_ability_name="Vine Whip", combat_ability_description="80% ATK to all enemies, 10% slow",
		lore="A former herbalist's apprentice who can identify three hundred spirit herbs by scent alone.",
	},
	{
		id="chen-gang", name="Chen Gang", chinese_name="陈刚",
		rarity="common", root="earth",
		stats={hp=130, atk=75, def=110, spd=70}, ability_slots=1,
		hall_passive_description="+3% Formation Array Hall DEF bonus",
		combat_ability_name="Stone Shield", combat_ability_description="Absorb 200% DEF as damage for 5s",
		lore="A miner who accidentally broke through to Qi Condensation after years of hauling spirit ore.",
	},
	# === UNCOMMON ===
	{
		id="mei-shuang", name="Mei Shuang", chinese_name="梅霜",
		rarity="uncommon", root="water",
		stats={hp=150, atk=120, def=140, spd=110}, ability_slots=1,
		hall_passive_description="+8% Void Meditation Sanctum offline earnings",
		combat_ability_name="Frost Nova", combat_ability_description="90% ATK AoE + 15% freeze chance",
		lore="Raised in a waterfall monastery, she meditates under cascading ice every morning before dawn.",
	},
	{
		id="guo-jin", name="Guo Jin", chinese_name="郭金",
		rarity="uncommon", root="metal",
		stats={hp=120, atk=165, def=100, spd=130}, ability_slots=1,
		hall_passive_description="+8% Sword Refinement Peak income",
		combat_ability_name="Sword Qi Slash", combat_ability_description="150% ATK to front row",
		lore="A wandering swordsman who dueled forty-seven opponents before finding a sect worthy of his blade.",
	},
	{
		id="tian-lei", name="Tian Lei", chinese_name="田雷",
		rarity="uncommon", root="fire",
		stats={hp=140, atk=155, def=110, spd=115}, ability_slots=1,
		hall_passive_description="+8% Tribulation Lightning Tower HDP bonus",
		combat_ability_name="Thunder Palm", combat_ability_description="130% ATK + 20% stun",
		lore="Born during a thunderstorm with scorch marks on both palms — the midwife called it Heaven's brand.",
	},
	# === RARE ===
	{
		id="lin-qinghe", name="Lin Qinghe", chinese_name="林清河",
		rarity="rare", root="water",
		stats={hp=210, atk=175, def=195, spd=160}, ability_slots=2,
		hall_passive_description="+15% Qi Gathering Pavilion speed + 5% AE generation",
		combat_ability_name="Tidal Surge", combat_ability_description="200% ATK wave hits all enemies, heals allies 5% HP",
		lore="The daughter of a river spirit and a mortal scholar, she hears the Dao in flowing water.",
	},
	{
		id="bai-yue", name="Bai Yue", chinese_name="白月",
		rarity="rare", root="wood",
		stats={hp=200, atk=190, def=170, spd=200}, ability_slots=2,
		hall_passive_description="+15% Spirit Beast Garden income + Heavenly Treasure freq x1.1",
		combat_ability_name="Moonvine Binding", combat_ability_description="Root 2 enemies for 3s + 150% ATK poison over 6s",
		lore="Cultivates only under moonlight; her techniques grow 30% stronger between midnight and dawn.",
	},
	{
		id="huo-yan", name="Huo Yan", chinese_name="火焰",
		rarity="rare", root="fire",
		stats={hp=180, atk=240, def=150, spd=175}, ability_slots=2,
		hall_passive_description="+15% Alchemy Furnace AE production + 10% pill potency",
		combat_ability_name="Inferno Blast", combat_ability_description="280% ATK to single target + burn for 100% ATK over 4s",
		lore="A prodigy expelled from three sects for burning down their pill refineries. The fourth time's the charm.",
	},
	# === EPIC ===
	{
		id="xiao-wuji", name="Xiao Wuji", chinese_name="萧无极",
		rarity="epic", root="metal",
		stats={hp=280, atk=350, def=220, spd=260}, ability_slots=2,
		hall_passive_description="+30% Sword Refinement Peak profit + x1.2 Dao Path amplifier",
		combat_ability_name="Ten Thousand Swords Return", combat_ability_description="300% ATK to all + 30% DEF shred for 5s",
		lore="He comprehended the Sword Dao at age nine by watching falling autumn leaves — each one a blade.",
	},
	{
		id="yun-shui", name="Yun Shui", chinese_name="云水",
		rarity="epic", root="earth",
		stats={hp=380, atk=250, def=340, spd=200}, ability_slots=2,
		hall_passive_description="+30% Formation Array Hall cost reduction (additional -3%)",
		combat_ability_name="Mountain Sovereign Domain", combat_ability_description="All allies gain +25% DEF for 8s + taunt all enemies",
		lore="An ancient cultivator who slept inside a mountain for three centuries and emerged unchanged.",
	},
	{
		id="hua-lian", name="Hua Lian", chinese_name="花莲",
		rarity="epic", root="wood",
		stats={hp=300, atk=280, def=260, spd=310}, ability_slots=2,
		hall_passive_description="+30% Talisman Inscription Studio duration + 20% all pill durations",
		combat_ability_name="Forest's Blessing", combat_ability_description="Heal all allies 15% max HP + cleanse debuffs + 180% ATK thorns for 6s",
		lore="She cultivates by growing a lotus from seed to bloom in a single breath — each petal a sutra.",
	},
	# === LEGENDARY ===
	{
		id="jian-wuchen", name="Jian Wuchen", chinese_name="剑无尘",
		rarity="legendary", root="metal",
		stats={hp=420, atk=520, def=310, spd=400}, ability_slots=3,
		hall_passive_description="x1.5 Sword Refinement Peak income + x1.3 ALL hall speed",
		combat_ability_name="Heavenly Sword Domain", combat_ability_description="500% ATK to all enemies over 5s + ignore 50% DEF. If an enemy dies, extend duration 2s.",
		lore="Once the youngest Sword Saint in nine heavens — he shattered his own golden core to save his sect, then rebuilt it from nothing.",
	},
	{
		id="feng-huangyu", name="Feng Huangyu", chinese_name="凤凰羽",
		rarity="legendary", root="fire",
		stats={hp=450, atk=480, def=280, spd=380}, ability_slots=3,
		hall_passive_description="x1.5 Alchemy Furnace income + AE generation x1.5 + 25% pill potency",
		combat_ability_name="Phoenix Rebirth Flame", combat_ability_description="400% ATK AoE. If any ally would die within 8s, revive them at 30% HP (once per battle).",
		lore="Found as an infant in a nest of phoenix ashes. Her hair turns white-gold when she burns at full power.",
	},
	{
		id="gui-xu", name="Gui Xu", chinese_name="归墟",
		rarity="legendary", root="water",
		stats={hp=500, atk=350, def=450, spd=340}, ability_slots=3,
		hall_passive_description="x1.5 Void Meditation Sanctum income + offline earnings x1.3 + x1.2 Mandate effectiveness",
		combat_ability_name="Abyss of Returning Ruins", combat_ability_description="All enemies take 200% ATK/s for 6s + heal reduction 80%. Allies gain 10% lifesteal.",
		lore="He sat at the bottom of the Returning Ruins Sea for forty years, listening to the Dao echo off the bones of drowned immortals.",
	},
]

# ---------------------------------------------------------------------------
# Pull Rates
# ---------------------------------------------------------------------------
var PULL_RATES: Array[Dictionary] = [
	{rarity="common", rate=0.52, ability_slots=1, qi_residue_on_death=1, rarity_multiplier=1.05},
	{rarity="uncommon", rate=0.25, ability_slots=1, qi_residue_on_death=3, rarity_multiplier=1.12},
	{rarity="rare", rate=0.15, ability_slots=2, qi_residue_on_death=0, rarity_multiplier=1.25},
	{rarity="epic", rate=0.06, ability_slots=2, qi_residue_on_death=0, rarity_multiplier=1.50},
	{rarity="legendary", rate=0.02, ability_slots=3, qi_residue_on_death=0, rarity_multiplier=2.00},
]

# ---------------------------------------------------------------------------
# Gacha Config
# ---------------------------------------------------------------------------
var GACHA_CONFIG: Dictionary = {
	single_pull_cost=300,
	ten_pull_cost=2700,
	hard_pity_pulls=50,
	spark_pulls=300,
}

# ---------------------------------------------------------------------------
# Disciple Element Data
# ---------------------------------------------------------------------------
var ELEMENT_MATCH_MULTIPLIER: float = 2.0
var NEUTRAL_HALL_ELEMENT_BONUS: float = 1.25
var TRAIT_MATCH_MULTIPLIER: float = 1.25
var ELEMENTAL_ADVANTAGE_DAMAGE_BONUS: float = 0.25
var ELEMENTAL_ADVANTAGE_DAMAGE_REDUCTION: float = 0.15

var SPIRITUAL_ROOT_DATA: Dictionary = {
	"fire": {strength_description="+15% ATK, burst damage", weakness="water", stat_bonus={stat="atk", percent=15}},
	"water": {strength_description="+12% DEF, sustain/healing", weakness="wood", stat_bonus={stat="def", percent=12}},
	"wood": {strength_description="+15% SPD, evasion/poison", weakness="metal", stat_bonus={stat="spd", percent=15}},
	"metal": {strength_description="+15% CRIT, precision strikes", weakness="fire", stat_bonus={stat="crit", percent=15}},
	"earth": {strength_description="+20% HP, tankiness", weakness="wood", stat_bonus={stat="hp", percent=20}},
}

var HALL_ELEMENT_MAP: Dictionary = {
	1: {element="neutral", matching_root="any"},
	2: {element="earth", matching_root="earth"},
	3: {element="fire", matching_root="fire"},
	4: {element="earth", matching_root="earth"},
	5: {element="wood", matching_root="wood"},
	6: {element="metal", matching_root="metal"},
	7: {element="metal", matching_root="metal"},
	8: {element="fire", matching_root="fire"},
	9: {element="water", matching_root="water"},
	10: {element="water", matching_root="water"},
	11: {element="wood", matching_root="wood"},
	12: {element="neutral", matching_root="any"},
}

# ---------------------------------------------------------------------------
# Secret Realm Configs (5 realms)
# ---------------------------------------------------------------------------
var SECRET_REALM_CONFIGS: Array[Dictionary] = [
	{id="verdant-spirit-forest", name="Verdant Spirit Forest", element="wood", connected_hall_id=5, environmental_effect="Poison DoT on all units every 10s; Wood disciples immune", total_floors=100},
	{id="crimson-flame-caverns", name="Crimson Flame Caverns", element="fire", connected_hall_id=3, environmental_effect="Burning ground tiles; Fire disciples heal from fire damage", total_floors=100},
	{id="abyssal-tide-grotto", name="Abyssal Tide Grotto", element="water", connected_hall_id=9, environmental_effect="Frozen floors slow SPD by 20%; Water disciples gain +20% SPD instead", total_floors=100},
	{id="iron-bone-mountains", name="Iron Bone Mountains", element="metal", connected_hall_id=7, environmental_effect="Enemies have +15% DEF; Metal disciples ignore bonus DEF", total_floors=100},
	{id="earthen-core-depths", name="Earthen Core Depths", element="earth", connected_hall_id=4, environmental_effect="Cave-ins deal AoE damage every 15s; Earth disciples take 50% less", total_floors=100},
]

var IDLE_FARMING_TIERS: Array[Dictionary] = [
	{min_floor=10, ss_per_hour=500.0, rt_per_hour=10, ae_per_hour=2},
	{min_floor=25, ss_per_hour=5000.0, rt_per_hour=25, ae_per_hour=10},
	{min_floor=50, ss_per_hour=100000.0, rt_per_hour=50, ae_per_hour=50},
	{min_floor=75, ss_per_hour=10000000.0, rt_per_hour=100, ae_per_hour=200},
	{min_floor=100, ss_per_hour=1000000000.0, rt_per_hour=200, ae_per_hour=1000},
]

var PUSH_REWARD_TIERS: Array[Dictionary] = [
	{min_floor=1, max_floor=10, ss_per_clear=1000.0, rt_per_clear=30, ae_per_clear=5, ability_scroll_chance=0.0, rare_shard_chance=0.0, epic_shard_chance=0.0, legendary_shard_chance=0.0},
	{min_floor=11, max_floor=25, ss_per_clear=25000.0, rt_per_clear=60, ae_per_clear=25, ability_scroll_chance=0.10, rare_shard_chance=0.0, epic_shard_chance=0.0, legendary_shard_chance=0.0},
	{min_floor=26, max_floor=50, ss_per_clear=500000.0, rt_per_clear=100, ae_per_clear=100, ability_scroll_chance=0.15, rare_shard_chance=0.05, epic_shard_chance=0.0, legendary_shard_chance=0.0},
	{min_floor=51, max_floor=75, ss_per_clear=50000000.0, rt_per_clear=150, ae_per_clear=500, ability_scroll_chance=0.20, rare_shard_chance=0.0, epic_shard_chance=0.03, legendary_shard_chance=0.0},
	{min_floor=76, max_floor=100, ss_per_clear=5000000000.0, rt_per_clear=250, ae_per_clear=2000, ability_scroll_chance=0.25, rare_shard_chance=0.0, epic_shard_chance=0.0, legendary_shard_chance=0.01},
]

var BOSS_CONFIGS: Array[Dictionary] = [
	{floor=10, name="Spirit Beast Alpha", mechanic="Enrages below 30% HP: +50% ATK"},
	{floor=20, name="Corrupted Elder", mechanic="Summons 2 adds every 15s"},
	{floor=30, name="Flame Serpent King", mechanic="AoE fire breath every 10s; back row vulnerable"},
	{floor=40, name="Iron Golem", mechanic="Damage reflection (20%) for 5s phases"},
	{floor=50, name="Realm Guardian", mechanic="Two phases: melee + ranged; element shifts mid-fight"},
	{floor=60, name="Void Wraith", mechanic="Drains 5% max HP/s from highest HP ally"},
	{floor=70, name="Thunder Tribulation Beast", mechanic="Lightning strikes random disciple for 40% HP every 8s"},
	{floor=80, name="Ancient Formation Array", mechanic="Rotating damage zones; only safe spot shifts"},
	{floor=90, name="Fallen Sword Saint", mechanic="Mirrors your team's highest ATK disciple's abilities"},
	{floor=100, name="Heavenly Tribulation Manifestation", mechanic="All mechanics combined; 3 phases; guaranteed Legendary ability scroll"},
]

var ABSORPTION_RATES: Array[Dictionary] = [
	{enemy_type="Normal enemy", chance=0.0},
	{enemy_type="Elite enemy (every 5 floors)", chance=0.06},
	{enemy_type="Mini-boss (every 10 floors)", chance=0.15},
	{enemy_type="Realm Boss (floors 25, 50, 75, 100)", chance=0.40},
]

var ABSORBED_ABILITY_CONFIGS: Array[Dictionary] = [
	{name="Iron Skin", source="1-25 elites", effect="+DEF (exponential decay formula)", max_stacks=INF},
	{name="Qi Surge", source="1-25 elites", effect="+ATK (exponential decay formula)", max_stacks=INF},
	{name="Shadow Step", source="26-50 elites", effect="+SPD (exponential decay formula)", max_stacks=INF},
	{name="Flame Aura", source="Fire Realm bosses", effect="+15% fire damage (flat, no stacking)", max_stacks=1},
	{name="Frost Armor", source="Water Realm bosses", effect="-20% damage taken from melee (flat)", max_stacks=1},
	{name="Earthen Fortitude", source="Earth Realm bosses", effect="+30% max HP (flat)", max_stacks=1},
	{name="Sword Intent", source="Metal Realm bosses", effect="+25% crit damage (flat)", max_stacks=1},
	{name="Nature's Veil", source="Wood Realm bosses", effect="15% evasion (flat)", max_stacks=1},
	{name="Heavenly Tribulation Resistance", source="Floor 100 boss", effect="Survive one lethal hit at 1 HP per battle", max_stacks=1},
]

var ABILITY_STACKING: Dictionary = {
	decay_rate=0.3,
	max_bonus_caps={atk=2.0, def=1.5, hp=2.5, spd=1.0},
}

var ENEMY_SCALING: Dictionary = {
	hp={base=100, growth=1.08},
	atk={base=20, growth=1.07},
	def={base=15, growth=1.06},
}

var RETREAT_CONFIG: Dictionary = {
	voluntary_loot_percent=1.0,
	emergency_loot_percent=0.6,
	wipe_loot_percent=0.3,
}

var REALM_KEY_CONFIG: Dictionary = {
	max_daily_keys=5,
	regen_hours=4,
	max_stored_keys=10,
	max_idle_hours=12,
}

# ---------------------------------------------------------------------------
# QR (Qi Residue) Shop Configs (8 buffs)
# ---------------------------------------------------------------------------
var QI_RESIDUE_SHOP_CONFIGS: Array[Dictionary] = [
	{id="qi-condensation", name="Qi Condensation", cost=50, effect_description="+0.5% all hall income", value_per_purchase=0.005, max_purchases=20, max_total_bonus=0.10},
	{id="foundation-strengthening", name="Foundation Strengthening", cost=150, effect_description="+1% Ascension HDP gain", value_per_purchase=0.01, max_purchases=10, max_total_bonus=0.10},
	{id="spirit-sense", name="Spirit Sense", cost=300, effect_description="+2% Heavenly Treasure value", value_per_purchase=0.02, max_purchases=10, max_total_bonus=0.20},
	{id="root-purification", name="Root Purification", cost=500, effect_description="+1% disciple base stats", value_per_purchase=0.01, max_purchases=20, max_total_bonus=0.20},
	{id="karma-accumulation", name="Karma Accumulation", cost=1000, effect_description="+0.5% gacha Epic+ rate", value_per_purchase=0.005, max_purchases=5, max_total_bonus=0.025},
	{id="sect-foundation", name="Sect Foundation", cost=2500, effect_description="+3% AE generation", value_per_purchase=0.03, max_purchases=10, max_total_bonus=0.30},
	{id="heavenly-fortune", name="Heavenly Fortune", cost=5000, effect_description="+1 free daily Realm Key", value_per_purchase=1.0, max_purchases=3, max_total_bonus=3.0},
	{id="dao-comprehension", name="Dao Comprehension", cost=10000, effect_description="+5% Dao Path spell effectiveness", value_per_purchase=0.05, max_purchases=5, max_total_bonus=0.25},
]

var TOTAL_QR_TO_MAX_ALL: int = 110500

# ---------------------------------------------------------------------------
# Mission Pool (11 missions)
# ---------------------------------------------------------------------------
var MISSION_POOL: Array[Dictionary] = [
	{id="buy-levels-50", name="Diligent Builder", description="Buy 50 hall levels", type="buyHallLevels", target=50, rt_reward=100, ae_reward=0},
	{id="buy-levels-200", name="Grand Architect", description="Buy 200 hall levels", type="buyHallLevels", target=200, rt_reward=200, ae_reward=10},
	{id="craft-pills-3", name="Pill Refiner", description="Craft 3 pills", type="craftPills", target=3, rt_reward=100, ae_reward=0},
	{id="craft-pills-8", name="Master Alchemist", description="Craft 8 pills", type="craftPills", target=8, rt_reward=150, ae_reward=15},
	{id="push-3", name="Realm Explorer", description="Complete 3 push floors", type="completePush", target=3, rt_reward=150, ae_reward=10},
	{id="push-10", name="Dungeon Conqueror", description="Complete 10 push floors", type="completePush", target=10, rt_reward=250, ae_reward=25},
	{id="pull-5", name="Gate Opener", description="Summon 5 disciples", type="pullDisciples", target=5, rt_reward=100, ae_reward=0},
	{id="meditate-20", name="Inner Peace", description="Meditate 20 times", type="meditate", target=20, rt_reward=80, ae_reward=5},
	{id="meditate-100", name="Dao Seeker", description="Meditate 100 times", type="meditate", target=100, rt_reward=200, ae_reward=15},
	{id="treasure-3", name="Fortune Finder", description="Collect 3 Heavenly Treasures", type="collectTreasure", target=3, rt_reward=120, ae_reward=10},
	{id="ascend-1", name="Transcendence", description="Perform 1 Ascension", type="ascend", target=1, rt_reward=300, ae_reward=50},
]

var DAILY_CHECK_IN_RT: int = 300
var DAILY_MISSION_COUNT: int = 3

# ---------------------------------------------------------------------------
# Sect Harmony Milestones (global — all 12 halls must reach level)
# ---------------------------------------------------------------------------
var SECT_HARMONY_MILESTONES: Array[Dictionary] = [
	{level=25, effect_type="allSpeed", multiplier=2, applies_to_all=true},
	{level=50, effect_type="allSpeed", multiplier=2, applies_to_all=true},
	{level=100, effect_type="allSpeed", multiplier=2, applies_to_all=true},
	{level=150, effect_type="allProfit", multiplier=2, applies_to_all=true},
	{level=200, effect_type="allSpeed", multiplier=2, applies_to_all=true},
	{level=250, effect_type="allProfit", multiplier=3, applies_to_all=true},
	{level=300, effect_type="allSpeed", multiplier=2, applies_to_all=true},
	{level=400, effect_type="allProfit", multiplier=4, applies_to_all=true},
	{level=500, effect_type="allSpeed", multiplier=2, applies_to_all=true},
	{level=500, effect_type="allProfit", multiplier=5, applies_to_all=true},
	{level=750, effect_type="allProfit", multiplier=10, applies_to_all=true},
	{level=1000, effect_type="allProfit", multiplier=25, applies_to_all=true},
	{level=1500, effect_type="allProfit", multiplier=50, applies_to_all=true},
	{level=2000, effect_type="allProfit", multiplier=100, applies_to_all=true},
	{level=3000, effect_type="allProfit", multiplier=500, applies_to_all=true},
	{level=5000, effect_type="allProfit", multiplier=1000, applies_to_all=true},
]

# ---------------------------------------------------------------------------
# Hall Milestones — per-hall milestone arrays (halls 1-12)
# ---------------------------------------------------------------------------

var HALL_1_MILESTONES: Array[Dictionary] = [
	{level=25, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=50, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=100, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=150, effect_type="profit", multiplier=2, applies_to_all=false},
	{level=200, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=250, effect_type="profit", multiplier=2, applies_to_all=false},
	{level=300, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=350, effect_type="profit", multiplier=3, applies_to_all=false},
	{level=400, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=500, effect_type="profit", multiplier=4, applies_to_all=false},
	{level=600, effect_type="profit", multiplier=4, applies_to_all=false},
	{level=700, effect_type="profit", multiplier=4, applies_to_all=false},
	{level=800, effect_type="profit", multiplier=5, applies_to_all=false},
	{level=900, effect_type="profit", multiplier=5, applies_to_all=false},
	{level=1000, effect_type="profit", multiplier=10, applies_to_all=false},
	{level=1250, effect_type="profit", multiplier=10, applies_to_all=false},
	{level=1500, effect_type="profit", multiplier=20, applies_to_all=false},
	{level=2000, effect_type="profit", multiplier=50, applies_to_all=false},
	{level=2500, effect_type="profit", multiplier=100, applies_to_all=false},
	{level=3000, effect_type="profit", multiplier=200, applies_to_all=false},
	{level=4000, effect_type="profit", multiplier=500, applies_to_all=false},
	{level=5000, effect_type="profit", multiplier=1000, applies_to_all=false},
	{level=6000, effect_type="profit", multiplier=2000, applies_to_all=false},
	{level=7000, effect_type="profit", multiplier=5000, applies_to_all=false},
	{level=8000, effect_type="profit", multiplier=10000, applies_to_all=false},
	{level=10000, effect_type="profit", multiplier=50000, applies_to_all=false},
]

var HALL_2_MILESTONES: Array[Dictionary] = [
	{level=25, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=50, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=100, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=200, effect_type="profit", multiplier=2, applies_to_all=false},
	{level=300, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=400, effect_type="allProfit", multiplier=2, applies_to_all=true},
	{level=500, effect_type="profit", multiplier=3, applies_to_all=false},
	{level=600, effect_type="allProfit", multiplier=2, applies_to_all=true},
	{level=800, effect_type="allProfit", multiplier=2, applies_to_all=true},
	{level=1000, effect_type="allProfit", multiplier=3, applies_to_all=true},
	{level=1200, effect_type="profit", multiplier=4, applies_to_all=false},
	{level=1500, effect_type="allProfit", multiplier=5, applies_to_all=true},
	{level=2000, effect_type="allProfit", multiplier=10, applies_to_all=true},
	{level=2500, effect_type="allProfit", multiplier=25, applies_to_all=true},
	{level=3000, effect_type="allProfit", multiplier=50, applies_to_all=true},
	{level=4000, effect_type="allProfit", multiplier=100, applies_to_all=true},
	{level=5000, effect_type="allProfit", multiplier=500, applies_to_all=true},
	{level=5400, effect_type="allProfit", multiplier=1000, applies_to_all=true},
]

var HALL_3_MILESTONES: Array[Dictionary] = [
	{level=25, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=50, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=75, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=100, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=150, effect_type="profit", multiplier=2, applies_to_all=false},
	{level=200, effect_type="profit", multiplier=2, applies_to_all=false, special_effect="aeGeneration", ae_bonus_per_second=1},
	{level=300, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=400, effect_type="profit", multiplier=3, applies_to_all=false},
	{level=500, effect_type="speed", multiplier=2, applies_to_all=false, special_effect="aeGeneration", ae_bonus_per_second=4},
	{level=600, effect_type="profit", multiplier=4, applies_to_all=false},
	{level=800, effect_type="profit", multiplier=5, applies_to_all=false},
	{level=1000, effect_type="profit", multiplier=10, applies_to_all=false, special_effect="aeGeneration", ae_bonus_per_second=20},
	{level=1250, effect_type="profit", multiplier=10, applies_to_all=false},
	{level=1500, effect_type="profit", multiplier=20, applies_to_all=false},
	{level=2000, effect_type="profit", multiplier=50, applies_to_all=false, special_effect="aeGeneration", ae_bonus_per_second=75},
	{level=2500, effect_type="profit", multiplier=100, applies_to_all=false},
	{level=3000, effect_type="profit", multiplier=200, applies_to_all=false},
	{level=4000, effect_type="profit", multiplier=500, applies_to_all=false, special_effect="aeGeneration", ae_bonus_per_second=400},
	{level=5000, effect_type="profit", multiplier=1000, applies_to_all=false},
	{level=6000, effect_type="profit", multiplier=2000, applies_to_all=false},
	{level=7000, effect_type="profit", multiplier=5000, applies_to_all=false},
	{level=8000, effect_type="profit", multiplier=10000, applies_to_all=false},
]

var HALL_4_MILESTONES: Array[Dictionary] = [
	{level=30, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=60, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=100, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=175, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=250, effect_type="profit", multiplier=2, applies_to_all=false},
	{level=300, effect_type="profit", multiplier=2, applies_to_all=false, special_effect="costReduction"},
	{level=400, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=500, effect_type="profit", multiplier=3, applies_to_all=false, special_effect="costReduction"},
	{level=600, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=700, effect_type="profit", multiplier=4, applies_to_all=false},
	{level=800, effect_type="profit", multiplier=4, applies_to_all=false, special_effect="costReduction"},
	{level=1000, effect_type="profit", multiplier=5, applies_to_all=false},
	{level=1250, effect_type="profit", multiplier=10, applies_to_all=false, special_effect="costReduction"},
	{level=1500, effect_type="profit", multiplier=20, applies_to_all=false},
	{level=2000, effect_type="profit", multiplier=50, applies_to_all=false, special_effect="costReduction"},
	{level=2500, effect_type="profit", multiplier=100, applies_to_all=false},
	{level=3000, effect_type="profit", multiplier=200, applies_to_all=false, special_effect="costReduction"},
	{level=4000, effect_type="profit", multiplier=500, applies_to_all=false},
	{level=5000, effect_type="profit", multiplier=1000, applies_to_all=false},
	{level=6000, effect_type="profit", multiplier=5000, applies_to_all=false},
]

var HALL_5_MILESTONES: Array[Dictionary] = [
	{level=40, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=80, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=125, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=200, effect_type="profit", multiplier=2, applies_to_all=false, special_effect="aeGeneration", ae_bonus_per_second=0.5},
	{level=300, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=500, effect_type="profit", multiplier=3, applies_to_all=false, special_effect="treasureFrequency", treasure_frequency_multiplier=1.2},
	{level=700, effect_type="profit", multiplier=4, applies_to_all=false},
	{level=1000, effect_type="profit", multiplier=5, applies_to_all=false, special_effect="aeGeneration", ae_bonus_per_second=2.0},
	{level=1500, effect_type="profit", multiplier=10, applies_to_all=false, special_effect="treasureFrequency", treasure_frequency_multiplier=1.5},
	{level=2000, effect_type="profit", multiplier=20, applies_to_all=false},
	{level=2500, effect_type="profit", multiplier=50, applies_to_all=false, special_effect="aeGeneration", ae_bonus_per_second=10.0},
	{level=3000, effect_type="profit", multiplier=100, applies_to_all=false},
	{level=3500, effect_type="profit", multiplier=200, applies_to_all=false, special_effect="treasureFrequency", treasure_frequency_multiplier=1.8},
	{level=4000, effect_type="profit", multiplier=500, applies_to_all=false, special_effect="aeGeneration", ae_bonus_per_second=50.0},
	{level=5000, effect_type="profit", multiplier=1000, applies_to_all=false},
	{level=5500, effect_type="profit", multiplier=2000, applies_to_all=false, special_effect="treasureFrequency", treasure_frequency_multiplier=2.0},
	{level=6000, effect_type="profit", multiplier=5000, applies_to_all=false},
	{level=7000, effect_type="profit", multiplier=10000, applies_to_all=false, special_effect="aeGeneration", ae_bonus_per_second=250.0},
	{level=8000, effect_type="profit", multiplier=20000, applies_to_all=false},
	{level=9000, effect_type="profit", multiplier=50000, applies_to_all=false, special_effect="treasureFrequency", treasure_frequency_multiplier=2.5},
	{level=10000, effect_type="profit", multiplier=100000, applies_to_all=false},
]

var HALL_6_MILESTONES: Array[Dictionary] = [
	{level=50, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=100, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=200, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=300, effect_type="profit", multiplier=2, applies_to_all=false},
	{level=400, effect_type="profit", multiplier=3, applies_to_all=false, special_effect="alchemyDuration", alchemy_duration_multiplier=1.1},
	{level=600, effect_type="profit", multiplier=4, applies_to_all=false},
	{level=800, effect_type="profit", multiplier=5, applies_to_all=false, special_effect="alchemyDuration", alchemy_duration_multiplier=1.2},
	{level=1000, effect_type="profit", multiplier=10, applies_to_all=false},
	{level=1500, effect_type="profit", multiplier=20, applies_to_all=false, special_effect="alchemyDuration", alchemy_duration_multiplier=1.3},
	{level=2000, effect_type="profit", multiplier=50, applies_to_all=false},
	{level=2500, effect_type="profit", multiplier=100, applies_to_all=false, special_effect="alchemyDuration", alchemy_duration_multiplier=1.4},
	{level=3000, effect_type="profit", multiplier=200, applies_to_all=false},
	{level=3500, effect_type="profit", multiplier=500, applies_to_all=false, special_effect="alchemyDuration", alchemy_duration_multiplier=1.5},
	{level=4000, effect_type="profit", multiplier=1000, applies_to_all=false},
	{level=5000, effect_type="profit", multiplier=2000, applies_to_all=false, special_effect="alchemyDuration", alchemy_duration_multiplier=1.6},
	{level=6000, effect_type="profit", multiplier=5000, applies_to_all=false},
	{level=7000, effect_type="profit", multiplier=10000, applies_to_all=false, special_effect="alchemyDuration", alchemy_duration_multiplier=1.7},
	{level=8000, effect_type="profit", multiplier=20000, applies_to_all=false},
	{level=9000, effect_type="profit", multiplier=50000, applies_to_all=false, special_effect="alchemyDuration", alchemy_duration_multiplier=1.85},
	{level=10000, effect_type="profit", multiplier=100000, applies_to_all=false, special_effect="alchemyDuration", alchemy_duration_multiplier=2.0},
]

var HALL_7_MILESTONES: Array[Dictionary] = [
	{level=35, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=70, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=110, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=175, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=250, effect_type="profit", multiplier=3, applies_to_all=false},
	{level=400, effect_type="profit", multiplier=4, applies_to_all=false},
	{level=600, effect_type="profit", multiplier=5, applies_to_all=false},
	{level=800, effect_type="profit", multiplier=8, applies_to_all=false},
	{level=1000, effect_type="profit", multiplier=10, applies_to_all=false},
	{level=1250, effect_type="profit", multiplier=15, applies_to_all=false},
	{level=1500, effect_type="profit", multiplier=20, applies_to_all=false},
	{level=2000, effect_type="profit", multiplier=50, applies_to_all=false},
	{level=2500, effect_type="profit", multiplier=100, applies_to_all=false},
	{level=3000, effect_type="profit", multiplier=200, applies_to_all=false},
	{level=3500, effect_type="profit", multiplier=500, applies_to_all=false},
	{level=4000, effect_type="profit", multiplier=1000, applies_to_all=false},
	{level=4500, effect_type="profit", multiplier=2000, applies_to_all=false},
	{level=5000, effect_type="profit", multiplier=5000, applies_to_all=false},
	{level=6000, effect_type="profit", multiplier=10000, applies_to_all=false},
	{level=7000, effect_type="profit", multiplier=25000, applies_to_all=false},
	{level=8000, effect_type="profit", multiplier=50000, applies_to_all=false},
	{level=9000, effect_type="profit", multiplier=100000, applies_to_all=false},
	{level=10000, effect_type="profit", multiplier=250000, applies_to_all=false},
	{level=12000, effect_type="profit", multiplier=500000, applies_to_all=false},
]

var HALL_8_MILESTONES: Array[Dictionary] = [
	{level=60, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=120, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=200, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=350, effect_type="profit", multiplier=2, applies_to_all=false, special_effect="hdpBonus", hdp_bonus_flat=10},
	{level=550, effect_type="profit", multiplier=3, applies_to_all=false},
	{level=800, effect_type="profit", multiplier=4, applies_to_all=false, special_effect="hdpBonus", hdp_bonus_flat=50},
	{level=1000, effect_type="profit", multiplier=5, applies_to_all=false},
	{level=1500, effect_type="profit", multiplier=10, applies_to_all=false, special_effect="hdpBonus", hdp_bonus_flat=200},
	{level=2000, effect_type="profit", multiplier=20, applies_to_all=false},
	{level=2500, effect_type="profit", multiplier=50, applies_to_all=false, special_effect="hdpBonus", hdp_bonus_flat=500},
	{level=3000, effect_type="profit", multiplier=100, applies_to_all=false},
	{level=3500, effect_type="profit", multiplier=200, applies_to_all=false, special_effect="hdpBonus", hdp_bonus_flat=1000},
	{level=4000, effect_type="profit", multiplier=500, applies_to_all=false},
	{level=5000, effect_type="profit", multiplier=1000, applies_to_all=false, special_effect="hdpBonus", hdp_bonus_flat=2000},
	{level=6000, effect_type="profit", multiplier=2000, applies_to_all=false},
	{level=7000, effect_type="profit", multiplier=5000, applies_to_all=false, special_effect="hdpBonus", hdp_bonus_flat=3500},
	{level=8000, effect_type="profit", multiplier=10000, applies_to_all=false},
	{level=9000, effect_type="profit", multiplier=20000, applies_to_all=false, special_effect="hdpBonus", hdp_bonus_flat=5000},
	{level=10000, effect_type="profit", multiplier=50000, applies_to_all=false, special_effect="hdpBonus", hdp_bonus_flat=7500},
	{level=12000, effect_type="profit", multiplier=100000, applies_to_all=false, special_effect="hdpBonus", hdp_bonus_flat=10000},
]

var HALL_9_MILESTONES: Array[Dictionary] = [
	{level=80, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=160, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=300, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=500, effect_type="profit", multiplier=2, applies_to_all=false, special_effect="offlineEfficiency", offline_multiplier=1.5},
	{level=800, effect_type="profit", multiplier=3, applies_to_all=false},
	{level=1200, effect_type="profit", multiplier=4, applies_to_all=false, special_effect="offlineEfficiency", offline_multiplier=2.0},
	{level=1800, effect_type="profit", multiplier=5, applies_to_all=false},
	{level=2500, effect_type="profit", multiplier=10, applies_to_all=false, special_effect="offlineEfficiency", offline_multiplier=2.5},
	{level=3000, effect_type="profit", multiplier=20, applies_to_all=false},
	{level=3500, effect_type="profit", multiplier=50, applies_to_all=false, special_effect="offlineEfficiency", offline_multiplier=3.0},
	{level=4000, effect_type="profit", multiplier=100, applies_to_all=false},
	{level=4500, effect_type="profit", multiplier=200, applies_to_all=false, special_effect="offlineEfficiency", offline_multiplier=3.5},
	{level=5000, effect_type="profit", multiplier=500, applies_to_all=false},
	{level=6000, effect_type="profit", multiplier=1000, applies_to_all=false, special_effect="offlineEfficiency", offline_multiplier=4.0},
	{level=7000, effect_type="profit", multiplier=2000, applies_to_all=false},
	{level=8000, effect_type="profit", multiplier=5000, applies_to_all=false, special_effect="offlineEfficiency", offline_multiplier=4.5},
	{level=9000, effect_type="profit", multiplier=10000, applies_to_all=false},
	{level=10000, effect_type="profit", multiplier=20000, applies_to_all=false, special_effect="offlineEfficiency", offline_multiplier=5.0},
	{level=12000, effect_type="profit", multiplier=50000, applies_to_all=false, special_effect="offlineEfficiency", offline_multiplier=5.5},
	{level=15000, effect_type="profit", multiplier=100000, applies_to_all=false, special_effect="offlineEfficiency", offline_multiplier=6.0},
]

var HALL_10_MILESTONES: Array[Dictionary] = [
	{level=100, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=200, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=350, effect_type="profit", multiplier=2, applies_to_all=false, special_effect="daoPathAmplifier", dao_path_amplifier=1.2},
	{level=600, effect_type="profit", multiplier=3, applies_to_all=false},
	{level=1000, effect_type="profit", multiplier=4, applies_to_all=false, special_effect="daoPathAmplifier", dao_path_amplifier=1.4},
	{level=1500, effect_type="profit", multiplier=5, applies_to_all=false},
	{level=2000, effect_type="profit", multiplier=10, applies_to_all=false, special_effect="daoPathAmplifier", dao_path_amplifier=1.6},
	{level=2500, effect_type="profit", multiplier=20, applies_to_all=false},
	{level=3000, effect_type="profit", multiplier=50, applies_to_all=false, special_effect="daoPathAmplifier", dao_path_amplifier=1.8},
	{level=3500, effect_type="profit", multiplier=100, applies_to_all=false},
	{level=4000, effect_type="profit", multiplier=200, applies_to_all=false, special_effect="daoPathAmplifier", dao_path_amplifier=2.0},
	{level=5000, effect_type="profit", multiplier=500, applies_to_all=false},
	{level=6000, effect_type="profit", multiplier=1000, applies_to_all=false, special_effect="daoPathAmplifier", dao_path_amplifier=2.2},
	{level=7000, effect_type="profit", multiplier=2000, applies_to_all=false, special_effect="daoPathAmplifier", dao_path_amplifier=2.4},
	{level=8000, effect_type="profit", multiplier=5000, applies_to_all=false},
	{level=9000, effect_type="profit", multiplier=10000, applies_to_all=false, special_effect="daoPathAmplifier", dao_path_amplifier=2.6},
	{level=10000, effect_type="profit", multiplier=20000, applies_to_all=false, special_effect="daoPathAmplifier", dao_path_amplifier=2.8},
	{level=12000, effect_type="profit", multiplier=50000, applies_to_all=false},
	{level=15000, effect_type="profit", multiplier=100000, applies_to_all=false, special_effect="daoPathAmplifier", dao_path_amplifier=3.0},
]

var HALL_11_MILESTONES: Array[Dictionary] = [
	{level=120, effect_type="speed", multiplier=4, applies_to_all=false},
	{level=300, effect_type="speed", multiplier=4, applies_to_all=false},
	{level=600, effect_type="profit", multiplier=3, applies_to_all=false},
	{level=1000, effect_type="profit", multiplier=5, applies_to_all=false},
	{level=1500, effect_type="profit", multiplier=10, applies_to_all=false},
	{level=2000, effect_type="profit", multiplier=20, applies_to_all=false},
	{level=2500, effect_type="profit", multiplier=50, applies_to_all=false},
	{level=3000, effect_type="profit", multiplier=100, applies_to_all=false},
	{level=3500, effect_type="profit", multiplier=200, applies_to_all=false},
	{level=4000, effect_type="profit", multiplier=500, applies_to_all=false},
	{level=5000, effect_type="profit", multiplier=1000, applies_to_all=false},
	{level=6000, effect_type="profit", multiplier=2000, applies_to_all=false},
	{level=7000, effect_type="profit", multiplier=5000, applies_to_all=false},
	{level=8000, effect_type="profit", multiplier=10000, applies_to_all=false},
	{level=9000, effect_type="profit", multiplier=20000, applies_to_all=false},
	{level=10000, effect_type="profit", multiplier=50000, applies_to_all=false},
	{level=12000, effect_type="profit", multiplier=100000, applies_to_all=false},
	{level=15000, effect_type="profit", multiplier=250000, applies_to_all=false},
]

var HALL_12_MILESTONES: Array[Dictionary] = [
	{level=150, effect_type="speed", multiplier=2, applies_to_all=false},
	{level=350, effect_type="profit", multiplier=2, applies_to_all=false, special_effect="mandateEffectiveness", mandate_multiplier=1.5},
	{level=700, effect_type="profit", multiplier=3, applies_to_all=false},
	{level=1000, effect_type="profit", multiplier=5, applies_to_all=false, special_effect="mandateEffectiveness", mandate_multiplier=1.5},
	{level=1500, effect_type="profit", multiplier=10, applies_to_all=false},
	{level=2000, effect_type="profit", multiplier=20, applies_to_all=false, special_effect="mandateEffectiveness", mandate_multiplier=1.5},
	{level=2500, effect_type="profit", multiplier=50, applies_to_all=false},
	{level=3000, effect_type="profit", multiplier=100, applies_to_all=false, special_effect="mandateEffectiveness", mandate_multiplier=1.5},
	{level=3500, effect_type="profit", multiplier=200, applies_to_all=false},
	{level=4000, effect_type="profit", multiplier=500, applies_to_all=false, special_effect="mandateEffectiveness", mandate_multiplier=1.5},
	{level=5000, effect_type="profit", multiplier=1000, applies_to_all=false},
	{level=6000, effect_type="profit", multiplier=2000, applies_to_all=false, special_effect="mandateEffectiveness", mandate_multiplier=1.5},
	{level=7000, effect_type="profit", multiplier=5000, applies_to_all=false},
	{level=8000, effect_type="profit", multiplier=10000, applies_to_all=false, special_effect="mandateEffectiveness", mandate_multiplier=1.5},
	{level=9000, effect_type="profit", multiplier=20000, applies_to_all=false},
	{level=10000, effect_type="profit", multiplier=50000, applies_to_all=false},
	{level=12000, effect_type="profit", multiplier=100000, applies_to_all=false},
	{level=15000, effect_type="profit", multiplier=250000, applies_to_all=false},
]

# Lookup dictionary mapping hall_id -> milestones array
var HALL_MILESTONES: Dictionary = {}


func _ready() -> void:
	HALL_MILESTONES = {
		1: HALL_1_MILESTONES,
		2: HALL_2_MILESTONES,
		3: HALL_3_MILESTONES,
		4: HALL_4_MILESTONES,
		5: HALL_5_MILESTONES,
		6: HALL_6_MILESTONES,
		7: HALL_7_MILESTONES,
		8: HALL_8_MILESTONES,
		9: HALL_9_MILESTONES,
		10: HALL_10_MILESTONES,
		11: HALL_11_MILESTONES,
		12: HALL_12_MILESTONES,
	}
