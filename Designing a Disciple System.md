# Disciple System — GDD Section for Cultivation Sect Tycoon v4

**Status:** Design-ready. Slots into GDD v4 as Sections 9.5 (Disciples), 16 (Secret Realms), and updates to Sections 3 (Economy) and 11 (Ascension).

---

## 1. System Overview

Disciples are gacha-summoned cultivators who serve two roles: **dungeon combatants** (deployed to Secret Realms for loot, abilities, and progression) and **hall advisors** (assigned to Cultivation Halls for production bonuses). Every disciple dies permanently when an Ascension run ends or when killed in a dungeon push attempt — but every disciple, regardless of rarity, leaves behind permanent power through the Legacy system.

**Core tension:** Your best disciples generate the most value in dungeons (ability inheritance, loot) AND in halls (highest production bonuses) — but dungeons carry permadeath risk. Assigning a Legendary disciple to the safe Alchemy Furnace means forgoing their combat potential. Sending them into Floor 90 means risking permanent loss for rare ability scrolls. This push-pull is the system's central decision.

**Relationship with Elders:** Elders remain unchanged — deterministic hires that automate hall cycles. Disciples are a separate layer providing a production *multiplier* on top of Elder automation. A hall can have both an Elder AND a disciple. Elders are the engine; disciples are the turbocharger.

---

## 2. Gacha Summoning — Opening the Sect Gates

Framed as "Opening the Sect Gates" — wandering cultivators arrive at your sect seeking entry. Rarity represents innate Spiritual Root quality.

### 2.1 New Currency: Recruitment Tokens (RT)

**Why not Spirit Stones:** SS resets every Ascension and is spent on hall levels. Competing with hall investment would feel terrible mid-run. Recruitment Tokens are a separate, permanent currency.

| Source | RT per Day (Active) |
|--------|-------------------|
| Secret Realm idle farming | ~1,200 RT |
| Secret Realm push clears (5 keys) | ~600 RT |
| Daily check-in | 300 RT |
| Ascension completion bonus | 300 RT |
| Sect Missions (3 per day) | 300 RT |
| Weekly Sect Rankings reward | ~200 RT/day avg |
| **Total (active F2P)** | **~2,900 RT/day (~9-10 pulls)** |

### 2.2 Pull Rates and Pity

| Rarity | Color | Pull Rate | Ability Slots |
|--------|-------|-----------|---------------|
| Common | Gray | 52% | 1 |
| Uncommon | Green | 25% | 1 |
| Rare | Blue | 15% | 2 |
| Epic | Purple | 6% | 2 |
| Legendary | Gold | 2% | 3 |

- **Single pull:** 300 RT
- **10-pull:** 2,700 RT (10% discount), guaranteed Rare+
- **Hard pity:** Guaranteed Epic+ every 50 pulls (resets on any Epic+ pull)
- **Spark system:** After 300 total pulls, choose ANY Legendary from the selector
- **No duplicate Legendary:** Pulling a Legendary you already own converts to 50 Legacy Fragments instead

### 2.3 Spiritual Roots (Element System)

Every disciple has one of five Spiritual Roots, determining their elemental affinity and hall matching bonuses.

| Root | Element | Strengths | Weakness |
|------|---------|-----------|----------|
| Fire Root (火灵根) | Fire | +15% ATK, burst damage | Weak to Water |
| Water Root (水灵根) | Water | +12% DEF, sustain/healing | Weak to Wood |
| Wood Root (木灵根) | Wood | +15% SPD, evasion/poison | Weak to Metal |
| Metal Root (金灵根) | Metal | +15% CRIT, precision strikes | Weak to Fire |
| Earth Root (土灵根) | Earth | +20% HP, tankiness | Weak to Wood |

**Elemental advantage:** +25% damage dealt, -15% damage taken against weak element.

---

## 3. Disciple Roster — 15 Example Disciples

### Common (Gray) — 3 Disciples

| Name | Root | HP | ATK | DEF | SPD | Slots | Hall Passive | Combat Ability | Lore |
|------|------|-----|-----|-----|-----|-------|-------------|----------------|------|
| Li Fen (李奋) | Fire | 95 | 110 | 80 | 90 | 1 | +3% Alchemy Furnace speed | Flame Fist: 120% ATK to single target | A countryside orphan who taught herself cultivation by watching sect disciples through a crack in the wall. |
| Zhou Mu (周木) | Wood | 100 | 85 | 90 | 115 | 1 | +3% Spirit Beast Garden income | Vine Whip: 80% ATK to all enemies, 10% slow | A former herbalist's apprentice who can identify three hundred spirit herbs by scent alone. |
| Chen Gang (陈刚) | Earth | 130 | 75 | 110 | 70 | 1 | +3% Formation Array Hall DEF bonus | Stone Shield: Absorb 200% DEF as damage for 5s | A miner who accidentally broke through to Qi Condensation after years of hauling spirit ore. |

### Uncommon (Green) — 3 Disciples

| Name | Root | HP | ATK | DEF | SPD | Slots | Hall Passive | Combat Ability | Lore |
|------|------|-----|-----|-----|-----|-------|-------------|----------------|------|
| Mei Shuang (梅霜) | Water | 150 | 120 | 140 | 110 | 1 | +8% Void Meditation Sanctum offline earnings | Frost Nova: 90% ATK AoE + 15% freeze chance | Raised in a waterfall monastery, she meditates under cascading ice every morning before dawn. |
| Guo Jin (郭金) | Metal | 120 | 165 | 100 | 130 | 1 | +8% Sword Refinement Peak income | Sword Qi Slash: 150% ATK to front row | A wandering swordsman who dueled forty-seven opponents before finding a sect worthy of his blade. |
| Tian Lei (田雷) | Fire | 140 | 155 | 110 | 115 | 1 | +8% Tribulation Lightning Tower HDP bonus | Thunder Palm: 130% ATK + 20% stun | Born during a thunderstorm with scorch marks on both palms — the midwife called it Heaven's brand. |

### Rare (Blue) — 3 Disciples

| Name | Root | HP | ATK | DEF | SPD | Slots | Hall Passive | Combat Ability | Lore |
|------|------|-----|-----|-----|-----|-------|-------------|----------------|------|
| Lin Qinghe (林清河) | Water | 210 | 175 | 195 | 160 | 2 | +15% Qi Gathering Pavilion speed + 5% AE generation | Tidal Surge: 200% ATK wave hits all enemies, heals allies 5% HP | The daughter of a river spirit and a mortal scholar, she hears the Dao in flowing water. |
| Bai Yue (白月) | Wood | 200 | 190 | 170 | 200 | 2 | +15% Spirit Beast Garden income + Heavenly Treasure freq x1.1 | Moonvine Binding: Root 2 enemies for 3s + 150% ATK poison over 6s | Cultivates only under moonlight; her techniques grow 30% stronger between midnight and dawn. |
| Huo Yan (火焰) | Fire | 180 | 240 | 150 | 175 | 2 | +15% Alchemy Furnace AE production + 10% pill potency | Inferno Blast: 280% ATK to single target + burn for 100% ATK over 4s | A prodigy expelled from three sects for burning down their pill refineries. The fourth time's the charm. |

### Epic (Purple) — 3 Disciples

| Name | Root | HP | ATK | DEF | SPD | Slots | Hall Passive | Combat Ability | Lore |
|------|------|-----|-----|-----|-----|-------|-------------|----------------|------|
| Xiao Wuji (萧无极) | Metal | 280 | 350 | 220 | 260 | 2 | +30% Sword Refinement Peak profit + x1.2 Dao Path amplifier | Ten Thousand Swords Return: 300% ATK to all + 30% DEF shred for 5s | He comprehended the Sword Dao at age nine by watching falling autumn leaves — each one a blade. |
| Yun Shui (云水) | Earth | 380 | 250 | 340 | 200 | 2 | +30% Formation Array Hall cost reduction (additional -3%) | Mountain Sovereign Domain: All allies gain +25% DEF for 8s + taunt all enemies | An ancient cultivator who slept inside a mountain for three centuries and emerged unchanged. |
| Hua Lian (花莲) | Wood | 300 | 280 | 260 | 310 | 2 | +30% Talisman Inscription Studio duration + 20% all pill durations | Forest's Blessing: Heal all allies 15% max HP + cleanse debuffs + 180% ATK thorns for 6s | She cultivates by growing a lotus from seed to bloom in a single breath — each petal a sutra. |

### Legendary (Gold) — 3 Disciples

| Name | Root | HP | ATK | DEF | SPD | Slots | Hall Passive | Combat Ability | Lore |
|------|------|-----|-----|-----|-----|-------|-------------|----------------|------|
| Jian Wuchen (剑无尘) | Metal | 420 | 520 | 310 | 400 | 3 | x1.5 Sword Refinement Peak income + x1.3 ALL hall speed | Heavenly Sword Domain: 500% ATK to all enemies over 5s + ignore 50% DEF. If an enemy dies, extend duration 2s. | Once the youngest Sword Saint in nine heavens — he shattered his own golden core to save his sect, then rebuilt it from nothing. |
| Feng Huangyu (凤凰羽) | Fire | 450 | 480 | 280 | 380 | 3 | x1.5 Alchemy Furnace income + AE generation x1.5 + 25% pill potency | Phoenix Rebirth Flame: 400% ATK AoE. If any ally would die within 8s, revive them at 30% HP (once per battle). | Found as an infant in a nest of phoenix ashes. Her hair turns white-gold when she burns at full power. |
| Gui Xu (归墟) | Water | 500 | 350 | 450 | 340 | 3 | x1.5 Void Meditation Sanctum income + offline earnings x1.3 + x1.2 Mandate effectiveness | Abyss of Returning Ruins: All enemies take 200% ATK/s for 6s + heal reduction 80%. Allies gain 10% lifesteal. | He sat at the bottom of the Returning Ruins Sea for forty years, listening to the Dao echo off the bones of drowned immortals. |

---

## 4. Ability Inheritance

When disciples kill elite enemies or bosses in Secret Realms, there is a probabilistic chance to absorb an ability into an open slot.

### 4.1 Absorption Rates

| Enemy Type | Absorption Chance |
|------------|------------------|
| Normal enemy | 0% (no abilities to absorb) |
| Elite enemy (every 5 floors) | 6% per kill |
| Mini-boss (every 10 floors) | 15% per kill |
| Realm Boss (floors 25, 50, 75, 100) | 40% per kill |

### 4.2 Ability Slot Rules

- Each disciple has ability slots determined by rarity (Common: 1, Rare: 2, Legendary: 3)
- The innate combat ability does NOT occupy a slot — it's permanent
- Absorbed abilities fill open slots. Once full, the player must choose: **replace** an existing absorbed ability or **pass**
- Absorbed abilities are lost on disciple death (not carried to Legacy)

### 4.3 Anti-Power-Stacking Formula

Absorbed abilities that provide stat bonuses use **exponential decay** stacking:

```
Bonus = MaxBonus × (1 - e^(-0.3 × stacks))
```

| Stacks | % of Max Bonus |
|--------|---------------|
| 1 | 26% |
| 2 | 45% |
| 3 | 59% |
| 5 | 78% |
| 10 | 95% |

**MaxBonus per stat type:**
- ATK bonus: 200% max
- DEF bonus: 150% max
- HP bonus: 250% max
- SPD bonus: 100% max

Even a Legendary with 3 absorbed +ATK abilities only reaches ~59% of the 200% cap = +118% ATK. Strong but not game-breaking.

### 4.4 Ability Types (Absorbed from Enemies)

| Ability | Source Floor | Effect | Max Stacks |
|---------|-------------|--------|-----------|
| Iron Skin | 1-25 elites | +DEF (decay formula) | Unlimited (capped by formula) |
| Qi Surge | 1-25 elites | +ATK (decay formula) | Unlimited |
| Shadow Step | 26-50 elites | +SPD (decay formula) | Unlimited |
| Flame Aura | Fire Realm bosses | +15% fire damage (flat, no stacking) | 1 |
| Frost Armor | Water Realm bosses | -20% damage taken from melee (flat) | 1 |
| Earthen Fortitude | Earth Realm bosses | +30% max HP (flat) | 1 |
| Sword Intent | Metal Realm bosses | +25% crit damage (flat) | 1 |
| Nature's Veil | Wood Realm bosses | 15% evasion (flat) | 1 |
| Heavenly Tribulation Resistance | Floor 100 boss | Survive one lethal hit at 1 HP per battle | 1 |

Boss abilities are unique (1 stack max, flat bonuses) and dramatically powerful. This makes boss kills the most exciting moments in dungeons.

---

## 5. Secret Realms (Dungeon System)

### 5.1 Overview

Secret Realms are pocket dimensions containing enemies, bosses, loot, and ability scrolls. Five elemental realms, each with 100 floors. Two modes: Idle Farming (safe, passive) and Push Attempts (active, risky).

### 5.2 The Five Secret Realms

| Realm | Element | Hall Connection | Environmental Effect |
|-------|---------|-----------------|---------------------|
| Verdant Spirit Forest | Wood | Spirit Beast Garden | Poison DoT on all units every 10s; Wood disciples immune |
| Crimson Flame Caverns | Fire | Alchemy Furnace Chamber | Burning ground tiles; Fire disciples heal from fire damage |
| Abyssal Tide Grotto | Water | Void Meditation Sanctum | Frozen floors slow SPD by 20%; Water disciples gain +20% SPD instead |
| Iron Bone Mountains | Metal | Sword Refinement Peak | Enemies have +15% DEF; Metal disciples ignore bonus DEF |
| Earthen Core Depths | Earth | Formation Array Hall | Cave-ins deal AoE damage every 15s; Earth disciples take 50% less |

### 5.3 Idle Farming Mode

- **Cost:** Free (no Realm Keys required)
- **Risk:** Zero. No permadeath. Disciples are "safe" in the realm.
- **Rewards:** Resources per hour based on highest cleared floor
- **Duration:** Runs 24/7 in background; cap at 12 hours of uncollected rewards (Idle Heroes model; encourages twice-daily check-ins)

| Highest Cleared Floor | SS/hour | RT/hour | AE/hour |
|----------------------|---------|---------|---------|
| 10 | 500 | 10 | 2 |
| 25 | 5,000 | 25 | 10 |
| 50 | 100,000 | 50 | 50 |
| 75 | 10M | 100 | 200 |
| 100 | 1B | 200 | 1,000 |

- Disciples assigned to idle farming **cannot** be assigned to halls simultaneously
- Changing idle farming team is instant and free

### 5.4 Push Attempt Mode

- **Cost:** 1 Realm Key per attempt (5 keys/day, regen 1 every 4 hours, cap 10)
- **Risk:** HIGH. Failed push = any disciple who died in battle is permanently lost
- **Flow:** Pick a team → enter next uncleared floor → auto-battle → win (advance) or lose (dead disciples are gone)
- **Rewards:** Dramatically higher than idle farming

| Floor Tier | SS per Clear | RT per Clear | AE per Clear | Bonus Drops |
|-----------|-------------|-------------|-------------|-------------|
| 1-10 | 1,000 | 30 | 5 | — |
| 11-25 | 25,000 | 60 | 25 | Ability Scroll (10%) |
| 26-50 | 500,000 | 100 | 100 | Ability Scroll (15%), Rare+ Disciple Shard (5%) |
| 51-75 | 50M | 150 | 500 | Ability Scroll (20%), Epic Disciple Shard (3%) |
| 76-100 | 5B | 250 | 2,000 | Ability Scroll (25%), Legendary Shard (1%) |

**Bosses (every 10 floors):** Drop guaranteed Ability Scroll + bonus RT and AE.

### 5.5 Floor Difficulty Scaling

Enemy stats scale exponentially per floor:

```
EnemyHP = 100 × 1.08^(Floor - 1)
EnemyATK = 20 × 1.07^(Floor - 1)
EnemyDEF = 15 × 1.06^(Floor - 1)
```

| Floor | Enemy HP | Enemy ATK | Enemy DEF | Recommended Team Power |
|-------|----------|-----------|-----------|----------------------|
| 1 | 100 | 20 | 15 | 500 (5 Commons) |
| 10 | 200 | 37 | 25 | 1,200 |
| 25 | 685 | 97 | 61 | 4,000 |
| 50 | 4,690 | 570 | 270 | 20,000 (full Rare team) |
| 75 | 32,200 | 3,380 | 1,190 | 80,000 (Epic team) |
| 100 | 220,000 | 20,000 | 5,200 | 300,000+ (Legendary team) |

### 5.6 Boss Mechanics (Every 10 Floors)

| Floor | Boss Name | Mechanic |
|-------|-----------|----------|
| 10 | Spirit Beast Alpha | Enrages below 30% HP: +50% ATK |
| 20 | Corrupted Elder | Summons 2 adds every 15s |
| 30 | Flame Serpent King | AoE fire breath every 10s; back row vulnerable |
| 40 | Iron Golem | Damage reflection (20%) for 5s phases |
| 50 | Realm Guardian | Two phases: melee + ranged; element shifts mid-fight |
| 60 | Void Wraith | Drains 5% max HP/s from highest HP ally |
| 70 | Thunder Tribulation Beast | Lightning strikes random disciple for 40% HP every 8s |
| 80 | Ancient Formation Array | Rotating damage zones; only safe spot shifts |
| 90 | Fallen Sword Saint | Mirrors your team's highest ATK disciple's abilities |
| 100 | Heavenly Tribulation Manifestation | All mechanics combined; 3 phases; guaranteed Legendary ability scroll |

### 5.7 Retreat Mechanic (Loop Hero Graduated Loss)

Players can retreat from a push attempt at any time between floors:

| Retreat Point | Loot Kept | Disciple Safety |
|--------------|----------|-----------------|
| Between floors (voluntary) | 100% of loot earned so far | All disciples survive |
| During battle (emergency) | 60% of loot | All disciples survive but injured (can't push for 1 hour) |
| Wipe (all 5 disciples at 0 HP) | 30% of loot | Dead disciples are permanently lost |

This creates the Loop Hero push-your-luck tension: "Do I retreat safely with my loot, or push one more floor for the boss drop?"

---

## 6. Legacy System — Permadeath Resolution

**Design principle:** Loss must feel like investment, not punishment. Every disciple, regardless of rarity, leaves something behind.

### 6.1 Qi Residue (Common/Uncommon Legacy)

When Common or Uncommon disciples die (Ascension reset or dungeon death), they leave behind **Qi Residue** — a permanent currency that persists forever.

| Rarity | Qi Residue on Death |
|--------|-------------------|
| Common | 1 QR |
| Uncommon | 3 QR |

**Qi Residue Shop (permanent buffs):**

| Buff | QR Cost | Effect | Max Purchases |
|------|---------|--------|--------------|
| Qi Condensation | 50 QR | +0.5% all hall income | 20 (max +10%) |
| Foundation Strengthening | 150 QR | +1% Ascension HDP gain | 10 (max +10%) |
| Spirit Sense | 300 QR | +2% Heavenly Treasure value | 10 (max +20%) |
| Root Purification | 500 QR | +1% disciple base stats | 20 (max +20%) |
| Karma Accumulation | 1,000 QR | +0.5% gacha Epic+ rate | 5 (max +2.5%) |
| Sect Foundation | 2,500 QR | +3% AE generation | 10 (max +30%) |
| Heavenly Fortune | 5,000 QR | +1 free daily Realm Key | 3 (max +3 keys) |
| Dao Comprehension | 10,000 QR | +5% Dao Path spell effectiveness | 5 (max +25%) |

Total QR to max everything: 148,500 QR. At an average of ~5 Common/Uncommon deaths per Ascension, this takes months — a steady background progression that makes every trash pull feel like it contributes.

### 6.2 Legacy Fragments (Rare+ Legacy)

When Rare, Epic, or Legendary disciples die, they leave behind a **Legacy Fragment** tied to their identity.

| Rarity | Fragment Type | Effect |
|--------|-------------|--------|
| Rare | Minor Fragment | +1% to the assigned hall's income permanently. If unassigned at death, +0.5% to a random hall. |
| Epic | Major Fragment | One of the disciple's traits becomes a permanent sect-wide passive at **50% power**. Player chooses which trait. |
| Legendary | Mythic Fragment | One trait becomes permanent at **100% power** + unlocks a unique **Legacy Technique** that can be equipped by one future disciple (persists through Ascension). |

**Examples:**
- Huo Yan (Rare, Fire) dies while assigned to Alchemy Furnace → Alchemy Furnace permanently gains +1% income
- Xiao Wuji (Epic, Metal) dies → Player chooses his "+30% Sword Peak profit" trait → Sword Peak permanently gains +15% profit (50% power)
- Jian Wuchen (Legendary, Metal) dies → His "Heavenly Sword Domain" becomes a Legacy Technique equippable by future disciples + Sword Peak permanently gains +50% income (his x1.5 hall passive at 100%)

### 6.3 Legacy Shrine

A memorial building (not one of the 12 halls) that displays all fallen disciples' contributions.

**Visual:** A stone wall with glowing spirit tablets. Each tablet shows the disciple's name, rarity glow color, and contribution. Legendary tablets pulse with golden light.

**Legacy Power** accumulates from all fragments:

| Fragment Type | Legacy Power Value |
|--------------|-------------------|
| Minor (Rare) | 1 LP |
| Major (Epic) | 10 LP |
| Mythic (Legendary) | 50 LP |

**Legacy Power Global Multiplier:**

```
LegacyMult = 1 + log₁₀(1 + LegacyPower) × 0.5
```

| Legacy Power | Global Multiplier |
|-------------|------------------|
| 10 | x1.52 |
| 50 | x1.85 |
| 100 | x2.00 |
| 500 | x2.35 |
| 1,000 | x2.50 |
| 5,000 | x2.85 |
| 10,000 | x3.00 |

This is a new term in the revenue formula. Growth is logarithmic — massive early impact, gentle late scaling. Never overpowers milestone multipliers but always feels meaningful.

---

## 7. Hall Assignment Bonuses

### 7.1 DiscipleBonus Formula

```
DiscipleBonus = RarityMult × ElementMatch × TraitMatch
```

Added as a new multiplier term in the revenue formula:

```
Revenue/cycle = BaseRevenue × Units × Milestones × HDP × DaoPath × Mandate × Alchemy × DiscipleBonus × LegacyMult × Global
```

### 7.2 Rarity Multipliers

| Rarity | Base DiscipleBonus |
|--------|-------------------|
| Common | x1.05 |
| Uncommon | x1.12 |
| Rare | x1.25 |
| Epic | x1.50 |
| Legendary | x2.00 |

### 7.3 Element Matching

If a disciple's Spiritual Root matches the hall's elemental affinity, the rarity multiplier is **doubled**.

| Hall | Element | Matching Root |
|------|---------|--------------|
| Qi Gathering Pavilion | Neutral | Any root gives x1.25 (flat, no doubling) |
| Body Tempering Dojo | Earth | Earth Root |
| Alchemy Furnace Chamber | Fire | Fire Root |
| Formation Array Hall | Earth | Earth Root |
| Spirit Beast Garden | Wood | Wood Root |
| Talisman Inscription Studio | Metal | Metal Root |
| Sword Refinement Peak | Metal | Metal Root |
| Tribulation Lightning Tower | Fire | Fire Root |
| Void Meditation Sanctum | Water | Water Root |
| Soul Tempering Pagoda | Water | Water Root |
| Celestial Inscription Library | Wood | Wood Root |
| Dao Comprehension Throne | Neutral | Any root gives x1.25 (flat) |

### 7.4 Trait Matching

Certain disciple traits grant an additional x1.25 bonus when assigned to a matching hall. Examples:

| Trait | Matching Hall | Extra Bonus |
|-------|-------------|-------------|
| Pill Refining Talent | Alchemy Furnace | x1.25 |
| Sword Intent | Sword Refinement Peak | x1.25 |
| Beast Affinity | Spirit Beast Garden | x1.25 |
| Formation Insight | Formation Array Hall | x1.25 |
| Void Comprehension | Void Meditation Sanctum | x1.25 |
| Soul Harmony | Soul Tempering Pagoda | x1.25 |
| Inscription Mastery | Talisman Studio / Library | x1.25 |
| Lightning Body | Tribulation Lightning Tower | x1.25 |
| Iron Constitution | Body Tempering Dojo | x1.25 |
| Dao Heart | Dao Comprehension Throne | x1.25 |

### 7.5 Example Calculations

**Common disciple (no match):** x1.05 × x1.00 × x1.00 = **x1.05** (+5%)

**Rare disciple (element match):** x1.25 × x2.00 × x1.00 = **x2.50** (+150%)

**Legendary disciple (element + trait match):** x2.00 × x2.00 × x1.25 = **x5.00** (+400%)

**Maximum possible DiscipleBonus:** x5.00 per hall. With all 12 halls filled with perfect Legendary matches (extremely unlikely), total multiplier across the sect is enormous — but each requires a Legendary pull of the right element AND right trait, making it an aspirational long-term goal.

### 7.6 Assignment Rules

- **1 disciple per hall maximum**
- A disciple in a hall **cannot** be deployed to a Secret Realm simultaneously (and vice versa)
- Assigning/unassigning is instant and free
- **All disciples die on Ascension.** Hall bonuses must be rebuilt each run.
- With auto-hire automation (15,000 HDP), disciples are auto-assigned to their previous halls if available in the new run

---

## 8. Ascension Integration

### What Resets

- All living disciples are lost (trigger Legacy for each)
- Hall DiscipleBonus is removed
- Absorbed abilities are lost with their disciples
- Secret Realm push progress resets to Floor 1
- Idle farming continues from highest-ever cleared floor (permanent)

### What Persists

- Recruitment Tokens (permanent currency)
- Qi Residue and all purchased buffs
- Legacy Fragments and all permanent bonuses
- Legacy Power and global multiplier
- Legacy Techniques (equippable by future disciples)
- Secret Realm highest-ever floor (for idle farming baseline)

---

## 9. GDD v4 Updates Required

### Section 3.1 — Add Two Currencies

| Currency | Source | Spent On | Persists? |
|----------|--------|----------|-----------|
| Recruitment Tokens (RT) | Secret Realms, dailies, Ascension | Gacha summoning | Yes |
| Qi Residue (QR) | Common/Uncommon disciple death | Permanent sect buffs | Yes |

### Section 3.4 — Updated Revenue Formula

```
Revenue/cycle = BaseRevenue × UnitsOwned × MilestoneMult × HDP_Mult × DaoPathMult
               × MandateMult × AlchemyMult × DiscipleBonus × LegacyMult × GlobalMults
```

### Section 11.2 — Updated Reset Table

Add to "Resets" column: All living disciples, DiscipleBonus, absorbed abilities, Secret Realm push progress.

Add to "Persists" column: Recruitment Tokens, Qi Residue + buffs, Legacy Fragments + bonuses, Legacy Power, Legacy Techniques, Secret Realm idle farming floor.

### Section 21 — Development Phase Placement

**Phase 2 (Depth):** Basic disciple summoning (3 rarities: Common/Rare/Epic), 1 Secret Realm (Crimson Flame Caverns, 50 floors), basic hall assignment, basic Legacy (Qi Residue only).

**Phase 3 (Polish):** Full 5 rarities, all 5 Secret Realms (100 floors each), ability inheritance system, full Legacy system (Fragments + Shrine), gacha pity/spark systems, disciple UI.

---

## 10. Design Principles Summary

**Constraints create depth.** The 1-3 ability slot limit per disciple, combined with permadeath, makes every slot choice potentially permanent and irreversible. This is the core that everything orbits.

**Loss is investment, not punishment.** Every disciple leaves something behind. Common trash pulls generate Qi Residue. Rare+ disciples generate Legacy Fragments. Legendary deaths create Legacy Techniques. The player's attachment is to the **lineage of accumulated legacy**, not any individual disciple — which mirrors cultivation fiction's themes of generational transcendence.

**Deploy or preserve.** The central decision: safe hall assignment (guaranteed production bonus) vs risky dungeon push (ability inheritance, rare loot, but permadeath). This is Darkest Dungeon's roster management translated into a cultivation sect.

**Gacha respects the player.** Generous F2P income (~10 pulls/day), hard pity at 50, spark at 300, no duplicate Legendaries. The system should feel rewarding without spending money. The Dragon Hoard (Piggy Bank) from GDD v4's monetization applies to RT purchases as well.
