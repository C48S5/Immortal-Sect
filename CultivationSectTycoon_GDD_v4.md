**CULTIVATION SECT TYCOON**

Game Design Document v4.0

*A Cash Inc. Clone with Xianxia Cultivation Theme*

Incorporating lessons from Cookie Clicker, Antimatter Dimensions, Realm
Grinder,

Clicker Heroes, Egg Inc., Kittens Game, and AdVenture Capitalist

April 2026

**Project Summary**

|                   |                                                            |
|-------------------|------------------------------------------------------------|
| **Field**         | **Value**                                                  |
| Genre             | Idle / Incremental / Tycoon                                |
| Platform          | Web (HTML5 / React + TypeScript)                           |
| Reference Game    | Cash, Inc. Fame & Fortune Game                             |
| Halls Per Era     | 12                                                         |
| Total Eras        | 3 (Mortal \> Immortal \> Celestial)                        |
| Primary Currency  | Spirit Stones (SS)                                         |
| Prestige Currency | Heavenly Dao Points (HDP)                                  |
| Premium Currency  | Dao Crystals (DC)                                          |
| Advisor Currency  | Heavenly Seals (HS)                                        |
| Crafting Currency | Alchemy Essence (AE)                                       |
| Managers          | Elders                                                     |
| Advisor System    | Heavenly Mandate                                           |
| Faction System    | Dao Paths (5 paths, chosen per Ascension)                  |
| Challenge System  | Tribulation Challenges                                     |
| Crafting System   | Alchemy (pills/talismans)                                  |
| Automation        | Progressive autobuyers (halls + Elders, never auto-Ascend) |

**1. Overview**

**1.1 Elevator Pitch**

Cultivation Sect Tycoon is an idle incremental game where the player
builds a legendary cultivation sect from nothing. Starting with a Qi
Gathering Pavilion, the player expands by constructing twelve
Cultivation Halls, hiring Elders to automate production, hitting
milestone thresholds for massive multipliers, choosing a Dao Path each
Ascension for strategic variety, completing Tribulation Challenges for
permanent rewards, crafting alchemical pills to boost specific halls,
and performing Ascension resets to gain permanent Heavenly Dao Points.
The game is mechanically built on Cash Inc.'s proven formula, enriched
with systems from Antimatter Dimensions (challenges, progressive
automation), Realm Grinder (faction system), Egg Inc. (offline return
experience), Cookie Clicker (active engagement events), and Kittens Game
(interacting resource systems) — all wrapped in a richly atmospheric
Xianxia cultivation world.

**1.2 Design Pillars**

|                         |                                                                                                              |                    |
|-------------------------|--------------------------------------------------------------------------------------------------------------|--------------------|
| **Pillar**              | **Description**                                                                                              | **Inspired By**    |
| Satisfying Progression  | Every milestone, Elder, and breakthrough feels like a tangible leap in power. No dead moments.               | Cash Inc., AdCap   |
| Strategic Depth         | Dao Path choice, Tribulation Challenges, alchemy crafting, and milestone optimization add genuine decisions. | Realm Grinder, AD  |
| Meaningful Idle Rewards | Offline earnings are generous with cinematic cultivation animation. Coming back always feels rewarding.      | Egg Inc.           |
| Unfolding Complexity    | Start with one hall and one button. Hours later: 12 halls, Dao Paths, alchemy, challenges, three Realms.     | AD, Cookie Clicker |
| Atmospheric Immersion   | Xianxia theming permeates every mechanic. Spirit Stones, cultivation stages, heavenly tribulations.          | Immortal Taoists   |

**1.3 Complete Mapping: Cash Inc. to Sect Tycoon**

|                         |                                    |             |
|-------------------------|------------------------------------|-------------|
| **Cash Inc.**           | **Sect Tycoon**                    | **New?**    |
| Cash (\$)               | Spirit Stones (SS)                 | No          |
| Businesses (10/era)     | Cultivation Halls (12/era)         | Expanded    |
| VIP Managers            | Elders                             | No          |
| Fame (prestige)         | Heavenly Dao Points (HDP)          | No          |
| Rise to Fame            | Ascension                          | No          |
| Uncle Rich Advisor      | Heavenly Mandate                   | No          |
| Golden Tickets          | Heavenly Seals                     | No          |
| Crystals/Diamonds       | Dao Crystals                       | No          |
| Eras (Modern/NeoCosmic) | Realms (Mortal/Immortal/Celestial) | 3 vs 2      |
| Time Machine            | Realm Gate                         | No          |
| Flying objects          | Heavenly Treasures                 | No          |
| Milestones              | Cultivation Milestones             | Full tables |
| All-Business milestones | Sect Harmony milestones            | No          |
| —                       | Dao Paths (5 factions)             | NEW         |
| —                       | Tribulation Challenges             | NEW         |
| —                       | Alchemy Crafting                   | NEW         |
| —                       | Progressive Autobuyers             | NEW         |
| —                       | Cultivation Animation (offline)    | NEW         |

**2. First 5 Minutes & Core Loop**

**2.0 Onboarding: The First 5 Minutes**

*This is the make-or-break moment. 70% of players decide to stay or
leave in the first 5 minutes. Designed using Cookie Clicker's principle:
one button, one number, zero tutorial text.*

**T=0s: App Launch**

Screen shows a cultivation sect mountain silhouette in purple fog.
Center of screen: one large teal-glowing button labeled "Meditate"
(120px radius). Below it: "Spirit Stones: 0" in gold text. No bars, no
tabs, no menus, no tutorial popups. The player sees one action and one
number.

**T=1–15s: First Taps**

Player taps Meditate. Button bounces (200ms animation). Spirit Stones: 0
\> 1. Soft chime. Player taps again: 1 \> 2. At 5 SS, subtle text fades
above button: "Keep going!" (auto-fades in 2s). Player discovers:
tapping = income.

**T=15–45s: Hall 1 Discovery**

When SS reaches 4 (Hall 1 base cost), a card fades in below the Meditate
button showing Hall 1: Qi Gathering Pavilion. Cost: 4 SS. Income: +0.08
SS/cycle. The card glows cyan when affordable. Player taps to unlock.
Hall 1 activates — a progress bar appears and begins cycling
automatically. Player discovers: halls produce income passively.

**T=45–90s: Passive Income Aha Moment**

Spirit Stones tick up without tapping. Hall 2 preview appears (Cost: 26
SS). Player sees a target. The Meditate button still works for bonus
taps, but passive income is now flowing. Player discovers: the game
plays itself, tapping is a bonus.

**T=90–180s: Elder Discovery**

When Hall 1 reaches level 5+, the Elders tab fades in at the top of
screen with a cyan glow pulse. Tapping reveals Elder Qin (Cost: 1,000
SS). The hire cost feels distant but visible — a medium-term goal.
Player discovers: there are meta-progression layers beyond halls.

**T=180–300s: First Elder Hire**

With Hall 1 producing and Heavenly Treasures starting to appear (flying
spirit swords crossing the screen every 30–60s), the player accumulates
1,000 SS. They hire Elder Qin. Gold coins fly into the Elder portrait.
Hall 1 is now permanently automated. Player discovers the full
meta-loop: Tap \> Unlock Halls \> Hire Elders \> Unlock more Halls \>
Repeat.

**Breadcrumb System (No Tutorial Text)**

|                      |                   |                      |                      |
|----------------------|-------------------|----------------------|----------------------|
| **Moment**           | **Element**       | **Glow**             | **Purpose**          |
| T=0                  | Meditate button   | Teal pulse every 2s  | Start here           |
| Hall affordable      | Hall card         | Cyan glow            | You can unlock this  |
| Hall 1 lv5+          | Elders tab        | Cyan flash every 3s  | New content unlocked |
| Elder affordable     | Hire button       | Gold glow every 1.5s | Next action          |
| First milestone near | Hall progress bar | Golden border glow   | Almost there         |

**2.1 Primary Loop (Seconds to Minutes)**

Tap Hall \> Progress bar fills over cycle time \> Spirit Stones earned
\> Spend SS to level up halls or unlock new ones \> Repeat faster each
time. Heavenly Treasures (flying spirit swords, phoenixes) cross the
screen during active play — tapping awards bonus SS proportional to
income. Ad or 5 DC for 5x drop. One every 30–60 seconds.

**2.2 Secondary Loop (Minutes to Hours)**

Accumulate SS \> Hire Elders (automate halls) \> Hit milestones
(speed/profit doublings) \> Unlock all 12 halls \> Optimize for Sect
Harmony thresholds \> Craft alchemical pills for temporary boosts \>
Attempt Tribulation Challenges for permanent rewards.

**2.3 Tertiary Loop (Hours to Days)**

Choose a Dao Path \> Reach income threshold \> Ascend (prestige reset)
\> Gain HDP (+2% permanent per point) \> Pick a different Dao Path for
next run \> Invest Heavenly Seals into Heavenly Mandate. As HDP
accumulates, progressive automation unlocks: auto-buy halls, auto-hire
Elders. Player never auto-Ascends — that decision always stays manual.

**2.4 Meta Loop (Weeks to Months)**

Accumulate 1 Sextillion SS lifetime \> Unlock Realm Gate \> Travel to
Immortal Realm (12 new halls, active Elder abilities) \> Eventually
unlock Celestial Realm. Complete all Tribulation Challenges for
permanent bonuses. Master all 5 Dao Paths.

**2.5 Offline Progression — The Closed Cultivation Experience**

**This is the single most important retention moment in the game (lesson
from Egg Inc.).**

When the player returns after being offline:

1\. Screen fades to a starfield with floating Qi particles. The player's
sect mountain silhouette appears in the background.

2\. A meditation animation plays: the Sect Master character sits in
lotus position, surrounded by swirling Qi that intensifies over 3–4
seconds.

3\. Text fades in: "Your sect cultivated for \[X hours, Y minutes\] in
closed meditation."

4\. The Spirit Stone total animates counting up from 0 to the full
amount over 2–3 seconds, with crystal sound effects accelerating.

5\. Below the total: "Double your harvest?" with a prominent "Watch
Cultivation Vision (x2)" button and a smaller "Spend 5 DC (x3)" option.

6\. After collection, the screen transitions smoothly back to the main
game.

Technical: offline earnings = incomePerSecond (at departure) x seconds
elapsed x offlineEfficiency. Offline efficiency starts at 50% base,
increased by Void Meditation Sanctum milestones (up to x6) and
Tribulation Challenge 9 reward (x3). Maximum offline duration: 72 hours
(earnings beyond this cap at the 72-hour value). The x2 Cultivation
Focus boost continues during offline.

*Anti-idle note: The 50% base offline efficiency and 72-hour cap prevent
players who log in once a week from outpacing daily players. Active play
always earns more than idle, but idle always earns enough to feel
rewarding.*

**3. Economy & Currencies**

**3.1 Five-Currency System**

|                           |                                                |                                                 |                          |
|---------------------------|------------------------------------------------|-------------------------------------------------|--------------------------|
| **Currency**              | **Source**                                     | **Spent On**                                    | **Persists?**            |
| Spirit Stones (SS)        | Hall cycles, Heavenly Treasures, alchemy sales | Hall levels, Elder hiring, alchemy ingredients  | No                       |
| Heavenly Dao Points (HDP) | Ascension (prestige)                           | +2%/point income; HDP Shop; automation unlocks  | Yes                      |
| Dao Crystals (DC)         | IAP, events, promo codes                       | Permanent boosters, Seal conversion, x3 offline | Yes                      |
| Heavenly Seals (HS)       | 6 DC = 1 HS; Heavenly Lottery                  | Heavenly Mandate levels                         | Yes                      |
| Alchemy Essence (AE)      | Alchemy Furnace + Spirit Beast Garden          | Crafting pills and talismans                    | No (resets on Ascension) |

**3.2 Base Cost & Revenue Table (NEW in v4)**

*These are the actual starting numbers that drive the entire economy.
Cost formula: BaseCost x Coefficient^(N-1). Revenue formula: BaseRevenue
x UnitsOwned x AllMultipliers.*

|        |                               |                  |           |           |                    |                  |
|--------|-------------------------------|------------------|-----------|-----------|--------------------|------------------|
| **\#** | **Hall Name**                 | **Base Cost**    | **Coeff** | **Cycle** | **Base Rev/Cycle** | **Base Rev/Sec** |
| 1      | Qi Gathering Pavilion         | 4 SS             | 1.07      | 1s        | 0.08 SS            | 0.08             |
| 2      | Body Tempering Dojo           | 26 SS            | 1.15      | 3s        | 0.49 SS            | 0.16             |
| 3      | Alchemy Furnace Chamber       | 182 SS           | 1.13      | 6s        | 3.25 SS            | 0.54             |
| 4      | Formation Array Hall          | 1,274 SS         | 1.12      | 12s       | 20.55 SS           | 1.71             |
| 5      | Spirit Beast Garden           | 8,918 SS         | 1.11      | 24s       | 120.51 SS          | 5.02             |
| 6      | Talisman Inscription Studio   | 62,426 SS        | 1.10      | 36s       | 725.88 SS          | 20.16            |
| 7      | Sword Refinement Peak         | 436,982 SS       | 1.11      | 48s       | 4,459 SS           | 92.90            |
| 8      | Tribulation Lightning Tower   | 3,058,874 SS     | 1.10      | 96s       | 20,951 SS          | 218.24           |
| 9      | Void Meditation Sanctum       | 21,412,118 SS    | 1.09      | 192s      | 88,480 SS          | 460.83           |
| 10     | Soul Tempering Pagoda         | 149,884,826 SS   | 1.09      | 384s      | 345,357 SS         | 899.37           |
| 11     | Celestial Inscription Library | 1,124,136,195 SS | 1.08      | 512s      | 2,000,242 SS       | 3,906.72         |
| 12     | Dao Comprehension Throne      | 8,993,089,560 SS | 1.07      | 768s      | 10,993,997 SS      | 14,315.10        |

*Design: ~7x cost scaling between halls. Revenue per unit grows 180,000x
from Hall 1 to 12. Longer cycles compensate with enormous per-cycle
payouts.*

**3.3 Cost Scaling Verification**

Bulk cost formula (K more from M owned): BaseCost x Coeff^M x
(Coeff^K - 1) / (Coeff - 1). No bulk discount. Buy modes: x1, x10, x100,
Max.

|                 |                 |                  |                  |                   |
|-----------------|-----------------|------------------|------------------|-------------------|
| **Hall**        | **Cost @ Lv25** | **Cost @ Lv100** | **Cost @ Lv500** | **Cost @ Lv1000** |
| 1 (Qi Pavilion) | 253 SS          | 49.5K SS         | 1.2B SS          | 4.2T SS           |
| 3 (Alchemy)     | 28.3K SS        | 284.4M SS        | Huge             | Enormous          |
| 6 (Talisman)    | 6.1M SS         | 8.6B SS          | Massive          | Astronomical      |
| 9 (Void)        | 1.8B SS         | 1.3T SS          | Beyond           | Break_infinity    |
| 12 (Throne)     | 568.8B SS       | 111.4T SS        | Beyond           | Break_infinity    |

*Uses break_infinity.js for values beyond 1e308. These curves have been
verified to create natural "walls" where milestones and prestige
multipliers are required to progress.*

**3.4 Revenue Formula**

Revenue/cycle = BaseRevenue x UnitsOwned x MilestoneMult x HDP_Mult x
DaoPathMult x MandateMult x AlchemyMult x GlobalMults. All multipliers
stack multiplicatively. Dao Path multiplier applies only to halls
boosted by the current path.

**3.5 Ascension (Prestige) Formula**

HDP = floor(sqrt(TotalEraRevenue / 44.44B) - sqrt(PrevSessionRevenue /
44.44B)). Each HDP = +2% all income permanently. 100 HDP = x3. 1000 HDP
= x21. HDP can be spent in HDP Shop but spending reduces passive bonus.
Optimal: spend 1% or less per run.

**3.6 Number Formatting**

Below 1K: raw. 1K–999T: abbreviated (K/M/B/T). Beyond: full English
names (Quadrillion, Quintillion...) through Uncentillion. No scientific
notation. Uses break_infinity.js for values beyond 1e308.

**4. The 12 Cultivation Halls — Mortal Realm**

Each hall is a primary income source functioning identically to a Cash
Inc. business. Arranged on a vertical sect mountain from bottom
(cheapest) to top (most expensive). The player taps to start a cycle, a
progress bar fills, SS collected on completion.

**4.1 Hall Roster**

|        |                               |           |           |                                                    |
|--------|-------------------------------|-----------|-----------|----------------------------------------------------|
| **\#** | **Hall Name**                 | **Coeff** | **Cycle** | **Flavor**                                         |
| 1      | Qi Gathering Pavilion         | 1.07      | 1s        | Disciples absorb ambient Qi in lotus position      |
| 2      | Body Tempering Dojo           | 1.15      | 3s        | Warriors strike iron under waterfalls              |
| 3      | Alchemy Furnace Chamber       | 1.13      | 6s        | Pill refinement produces valuable elixirs          |
| 4      | Formation Array Hall          | 1.12      | 12s       | Rune formations generate defensive barriers        |
| 5      | Spirit Beast Garden           | 1.11      | 24s       | Tamed beasts produce spirit materials and cores    |
| 6      | Talisman Inscription Studio   | 1.10      | 36s       | Calligraphers inscribe power onto jade slips       |
| 7      | Sword Refinement Peak         | 1.11      | 48s       | Cultivators forge flying swords on a mountain peak |
| 8      | Tribulation Lightning Tower   | 1.10      | 96s       | Harnessing heavenly tribulation lightning          |
| 9      | Void Meditation Sanctum       | 1.09      | 192s      | Cultivators enter the void between realms          |
| 10     | Soul Tempering Pagoda         | 1.09      | 384s      | Refining and strengthening the cultivator's soul   |
| 11     | Celestial Inscription Library | 1.08      | 512s      | Ancient texts of heaven and earth                  |
| 12     | Dao Comprehension Throne      | 1.07      | 768s      | The Sect Master's throne — communion with the Dao  |

**4.2 Hall Scaling Pattern**

Cost ratio between halls: ~7x. Income ratio mirrors cost ratio. Cycle
time roughly doubles every 2 halls. Early halls cycle rapidly
(satisfying tap feedback), mid halls moderate (periodic check-ins), late
halls long cycles but enormous payouts (offline play).

**4.3 Cross-Hall Milestone Effects**

Hall 2 (Body Tempering Dojo) has milestones that boost ALL other halls'
profits. At Body Tempering thresholds (400, 600, 800, 1000, 1500,
2000+), ALL other halls receive massive profit boosts. This mirrors Cash
Inc.'s Media HQ design — the second business with the steepest cost
curve but the most impactful milestone effects.

**4.4 Sect Harmony Milestones (All-Hall Milestones)**

When ALL 12 halls simultaneously reach the same ownership threshold, a
Sect Harmony milestone triggers.

|                        |                |                            |
|------------------------|----------------|----------------------------|
| **All-Hall Threshold** | **Bonus Type** | **Multiplier**             |
| 25                     | Speed          | x2 (halve all cycle times) |
| 50                     | Speed          | x2                         |
| 100                    | Speed          | x2                         |
| 150                    | Profit         | x2 all income              |
| 200                    | Speed          | x2                         |
| 250                    | Profit         | x3 all income              |
| 300                    | Speed          | x2                         |
| 400                    | Profit         | x4 all income              |
| 500                    | Speed + Profit | x2 speed + x5 profit       |
| 750                    | Profit         | x10 all income             |
| 1000                   | Profit         | x25 all income             |
| 1500                   | Profit         | x50 all income             |
| 2000                   | Profit         | x100 all income            |
| 3000                   | Profit         | x500 all income            |
| 5000                   | Profit         | x1,000 all income          |

*Cumulative Sect Harmony bonus at 5000: 64x speed, ~1.5 quadrillion x
profit. These massive multipliers make leveling ALL halls evenly the
optimal strategy.*

**5. Complete Milestone Tables — All 12 Halls**

*Design principle from Cash Inc.: milestone walls create the pacing. The
milestone schedule is the single most important balancing decision in
the game. Total milestones across all 12 halls: 296 (compared to Cash
Inc.'s 625 across 10 businesses).*

**Hall 1: Qi Gathering Pavilion — 26 milestones**

*Gentlest coefficient (1.07), cheapest to mass-level, most milestones.
Keeps early game engaging.*

|           |                |                |                 |
|-----------|----------------|----------------|-----------------|
| **Level** | **Bonus**      | **Cum. Speed** | **Cum. Profit** |
| 25        | x2 speed       | x2             | x1              |
| 50        | x2 speed       | x4             | x1              |
| 100       | x2 speed       | x8             | x1              |
| 150       | x2 profit      | x8             | x2              |
| 200       | x2 speed       | x16            | x2              |
| 250       | x2 profit      | x16            | x4              |
| 300       | x2 speed       | x32            | x4              |
| 350       | x3 profit      | x32            | x12             |
| 400       | x2 speed       | x64            | x12             |
| 500       | x4 profit      | x64            | x48             |
| 600       | x4 profit      | x64            | x192            |
| 700       | x4 profit      | x64            | x768            |
| 800       | x5 profit      | x64            | x3,840          |
| 900       | x5 profit      | x64            | x19,200         |
| 1000      | x10 profit     | x64            | x192,000        |
| 1250      | x10 profit     | x64            | x1.92M          |
| 1500      | x20 profit     | x64            | x38.4M          |
| 2000      | x50 profit     | x64            | x1.92B          |
| 2500      | x100 profit    | x64            | x192B           |
| 3000      | x200 profit    | x64            | x38.4T          |
| 4000      | x500 profit    | x64            | x19.2Qa         |
| 5000      | x1,000 profit  | x64            | x19.2Qi         |
| 6000      | x2,000 profit  | x64            | x38.4Sx         |
| 7000      | x5,000 profit  | x64            | x192Sp          |
| 8000      | x10,000 profit | x64            | x1.92No         |
| 10000     | x50,000 profit | x64            | x96Dc           |

**Hall 2: Body Tempering Dojo — 18 milestones (CROSS-HALL)**

*Steepest coefficient (1.15) but cross-hall bonuses make it
strategically essential. Mirrors Cash Inc.'s Media HQ.*

|           |                         |                |                              |
|-----------|-------------------------|----------------|------------------------------|
| **Level** | **Bonus**               | **Cum. Speed** | **Cum. Profit (self / all)** |
| 25        | x2 speed (self)         | x2             | x1                           |
| 50        | x2 speed (self)         | x4             | x1                           |
| 100       | x2 speed (self)         | x8             | x1                           |
| 200       | x2 profit (self)        | x8             | x2                           |
| 300       | x2 speed (self)         | x16            | x2                           |
| 400       | x2 ALL halls profit     | x16            | x2 self / x2 all             |
| 500       | x3 profit (self)        | x16            | x6                           |
| 600       | x2 ALL halls profit     | x16            | x6 self / x4 all             |
| 800       | x2 ALL halls profit     | x16            | x6 self / x8 all             |
| 1000      | x3 ALL halls profit     | x16            | x6 self / x24 all            |
| 1200      | x4 profit (self)        | x16            | x24                          |
| 1500      | x5 ALL halls profit     | x16            | x24 self / x120 all          |
| 2000      | x10 ALL halls profit    | x16            | x240 self / x1,200 all       |
| 2500      | x25 ALL halls profit    | x16            | x240 self / x30,000 all      |
| 3000      | x50 ALL halls profit    | x16            | x240 self / x1.5M all        |
| 4000      | x100 ALL halls profit   | x16            | x240 self / x150M all        |
| 5000      | x500 ALL halls profit   | x16            | x240 self / x75B all         |
| 5400      | x1,000 ALL halls profit | x16            | x240 self / x75T all         |

**Hall 3: Alchemy Furnace Chamber — 22 milestones**

*SPECIAL: Alchemy Essence (AE) production. This hall feeds the entire
crafting system. Steeper coefficient (1.13) means more frequent early
milestones.*

**AE Generation: Base rate = 0.01 x level per cycle (6s). At level 200:
~0.33 AE/s. At level 1000: ~1.67 AE/s. At level 4000: ~6.67 AE/s.
SPECIAL milestones add flat AE/s bonuses on top.**

|           |                |                |                 |                           |
|-----------|----------------|----------------|-----------------|---------------------------|
| **Level** | **Bonus**      | **Cum. Speed** | **Cum. Profit** | **SPECIAL**               |
| 25        | x2 speed       | x2             | x1              | —                         |
| 50        | x2 speed       | x4             | x1              | —                         |
| 75        | x2 speed       | x8             | x1              | —                         |
| 100       | x2 speed       | x16            | x1              | —                         |
| 150       | x2 profit      | x16            | x2              | —                         |
| 200       | x2 profit      | x16            | x4              | AE: +1 AE/s               |
| 300       | x2 speed       | x32            | x4              | —                         |
| 400       | x3 profit      | x32            | x12             | —                         |
| 500       | x2 speed       | x64            | x12             | AE: +4 AE/s (5 total)     |
| 600       | x4 profit      | x64            | x48             | —                         |
| 800       | x5 profit      | x64            | x240            | —                         |
| 1000      | x10 profit     | x64            | x2,400          | AE: +20 AE/s (25 total)   |
| 1250      | x10 profit     | x64            | x24,000         | —                         |
| 1500      | x20 profit     | x64            | x480,000        | —                         |
| 2000      | x50 profit     | x64            | x24M            | AE: +75 AE/s (100 total)  |
| 2500      | x100 profit    | x64            | x2.4B           | —                         |
| 3000      | x200 profit    | x64            | x480B           | —                         |
| 4000      | x500 profit    | x64            | x240T           | AE: +400 AE/s (500 total) |
| 5000      | x1,000 profit  | x64            | x240Qa          | —                         |
| 6000      | x2,000 profit  | x64            | x480Qi          | —                         |
| 7000      | x5,000 profit  | x64            | x2.4Sx          | —                         |
| 8000      | x10,000 profit | x64            | x24Sp           | —                         |

**Hall 4: Formation Array Hall — 20 milestones**

*SPECIAL: Cost reduction for ALL other halls. Each SPECIAL milestone
reduces other halls' costs by 5% (multiplicative). At max (6 SPECIALs):
26.5% total cost reduction.*

|           |                |                |                 |                              |
|-----------|----------------|----------------|-----------------|------------------------------|
| **Level** | **Bonus**      | **Cum. Speed** | **Cum. Profit** | **SPECIAL**                  |
| 30        | x2 speed       | x2             | x1              | —                            |
| 60        | x2 speed       | x4             | x1              | —                            |
| 100       | x2 speed       | x8             | x1              | —                            |
| 175       | x2 speed       | x16            | x1              | —                            |
| 250       | x2 profit      | x16            | x2              | Cost: -5% all other halls    |
| 400       | x3 profit      | x16            | x6              | —                            |
| 500       | x2 speed       | x32            | x6              | Cost: -5% (10% cumulative)   |
| 700       | x4 profit      | x32            | x24             | —                            |
| 1000      | x5 profit      | x32            | x120            | Cost: -5% (14.3% cumulative) |
| 1500      | x10 profit     | x32            | x1,200          | —                            |
| 2000      | x20 profit     | x32            | x24,000         | Cost: -5% (18.5% cumulative) |
| 2500      | x50 profit     | x32            | x1.2M           | —                            |
| 3000      | x100 profit    | x32            | x120M           | —                            |
| 3500      | x200 profit    | x32            | x24B            | Cost: -5% (22.6% cumulative) |
| 4000      | x500 profit    | x32            | x12T            | —                            |
| 5000      | x1,000 profit  | x32            | x12Qa           | —                            |
| 6000      | x2,000 profit  | x32            | x24Qi           | Cost: -5% (26.5% cumulative) |
| 7000      | x5,000 profit  | x32            | x120Sx          | —                            |
| 8000      | x10,000 profit | x32            | x1.2No          | —                            |
| 10000     | x50,000 profit | x32            | x60Dc           | —                            |

**Hall 5: Spirit Beast Garden — 21 milestones**

*SPECIAL: Secondary AE production (40% of Hall 3 rate) + Heavenly
Treasure frequency boost. Dual-purpose hall.*

**AE Generation: Base rate = 0.004 x level per cycle (24s). Combined
with Hall 3, provides the bulk of crafting fuel.**

|           |                 |                |                 |                             |
|-----------|-----------------|----------------|-----------------|-----------------------------|
| **Level** | **Bonus**       | **Cum. Speed** | **Cum. Profit** | **SPECIAL**                 |
| 40        | x2 speed        | x2             | x1              | —                           |
| 80        | x2 speed        | x4             | x1              | —                           |
| 125       | x2 speed        | x8             | x1              | —                           |
| 200       | x2 profit       | x8             | x2              | AE: +0.5 AE/s               |
| 300       | x2 speed        | x16            | x2              | —                           |
| 500       | x3 profit       | x16            | x6              | Treasure freq: x1.2         |
| 700       | x4 profit       | x16            | x24             | —                           |
| 1000      | x5 profit       | x16            | x120            | AE: +2 AE/s (2.5 total)     |
| 1500      | x10 profit      | x16            | x1,200          | Treasure freq: x1.5         |
| 2000      | x20 profit      | x16            | x24,000         | —                           |
| 2500      | x50 profit      | x16            | x1.2M           | AE: +10 AE/s (12.5 total)   |
| 3000      | x100 profit     | x16            | x120M           | —                           |
| 3500      | x200 profit     | x16            | x24B            | Treasure freq: x1.8         |
| 4000      | x500 profit     | x16            | x12T            | AE: +50 AE/s (62.5 total)   |
| 5000      | x1,000 profit   | x16            | x12Qa           | —                           |
| 5500      | x2,000 profit   | x16            | x24Qi           | Treasure freq: x2.0         |
| 6000      | x5,000 profit   | x16            | x120Sx          | —                           |
| 7000      | x10,000 profit  | x16            | x1.2No          | AE: +250 AE/s (312.5 total) |
| 8000      | x20,000 profit  | x16            | x24Dc           | —                           |
| 9000      | x50,000 profit  | x16            | x1.2Ud          | Treasure freq: x2.5         |
| 10000     | x100,000 profit | x16            | x120Dd          | —                           |

**Hall 6: Talisman Inscription Studio — 20 milestones**

*SPECIAL: Extends ALL pill/talisman durations. Scales from x1.1 to x2.0.
Passive power creep that makes the alchemy system stronger over time.*

|           |                 |                |                 |                           |
|-----------|-----------------|----------------|-----------------|---------------------------|
| **Level** | **Bonus**       | **Cum. Speed** | **Cum. Profit** | **SPECIAL**               |
| 50        | x2 speed        | x2             | x1              | —                         |
| 100       | x2 speed        | x4             | x1              | —                         |
| 200       | x2 speed        | x8             | x1              | —                         |
| 300       | x2 profit       | x8             | x2              | —                         |
| 400       | x3 profit       | x8             | x6              | Duration: x1.1 all pills  |
| 600       | x4 profit       | x8             | x24             | —                         |
| 800       | x5 profit       | x8             | x120            | Duration: x1.2 all pills  |
| 1000      | x10 profit      | x8             | x1,200          | —                         |
| 1500      | x20 profit      | x8             | x24,000         | Duration: x1.3 all pills  |
| 2000      | x50 profit      | x8             | x1.2M           | —                         |
| 2500      | x100 profit     | x8             | x120M           | Duration: x1.4 all pills  |
| 3000      | x200 profit     | x8             | x24B            | —                         |
| 3500      | x500 profit     | x8             | x12T            | Duration: x1.5 all pills  |
| 4000      | x1,000 profit   | x8             | x12Qa           | —                         |
| 5000      | x2,000 profit   | x8             | x24Qi           | Duration: x1.6 all pills  |
| 6000      | x5,000 profit   | x8             | x120Sx          | —                         |
| 7000      | x10,000 profit  | x8             | x1.2No          | Duration: x1.7 all pills  |
| 8000      | x20,000 profit  | x8             | x24Dc           | —                         |
| 9000      | x50,000 profit  | x8             | x1.2Ud          | Duration: x1.85 all pills |
| 10000     | x100,000 profit | x8             | x120Dd          | Duration: x2.0 all pills  |

**Hall 7: Sword Refinement Peak — 24 milestones (HIGHEST PROFIT)**

*SPECIAL: Pure income hall. No utility gimmicks. Has the largest raw
profit multipliers of any hall. The "powerhouse" for raw SS generation.*

|           |                 |                |                 |
|-----------|-----------------|----------------|-----------------|
| **Level** | **Bonus**       | **Cum. Speed** | **Cum. Profit** |
| 35        | x2 speed        | x2             | x1              |
| 70        | x2 speed        | x4             | x1              |
| 110       | x2 speed        | x8             | x1              |
| 175       | x2 speed        | x16            | x1              |
| 250       | x3 profit       | x16            | x3              |
| 400       | x4 profit       | x16            | x12             |
| 600       | x5 profit       | x16            | x60             |
| 800       | x8 profit       | x16            | x480            |
| 1000      | x10 profit      | x16            | x4,800          |
| 1250      | x15 profit      | x16            | x72,000         |
| 1500      | x20 profit      | x16            | x1.44M          |
| 2000      | x50 profit      | x16            | x72M            |
| 2500      | x100 profit     | x16            | x7.2B           |
| 3000      | x200 profit     | x16            | x1.44T          |
| 3500      | x500 profit     | x16            | x720T           |
| 4000      | x1,000 profit   | x16            | x720Qa          |
| 4500      | x2,000 profit   | x16            | x1.44Sx         |
| 5000      | x5,000 profit   | x16            | x7.2Sp          |
| 6000      | x10,000 profit  | x16            | x72No           |
| 7000      | x25,000 profit  | x16            | x1.8Ud          |
| 8000      | x50,000 profit  | x16            | x90Dd           |
| 9000      | x100,000 profit | x16            | x9Td            |
| 10000     | x250,000 profit | x16            | x2.25Qad        |
| 12000     | x500,000 profit | x16            | x1.125Qid       |

*Note: Sword Peak's profit multipliers are 2–5x larger than any other
hall at equivalent levels. This is intentional — it's the pure income
engine.*

**Hall 8: Tribulation Lightning Tower — 20 milestones**

*SPECIAL: Flat HDP bonus per Ascension. Stacks with the normal HDP
formula. Makes this hall critical for prestige efficiency.*

|           |                 |                |                 |                            |
|-----------|-----------------|----------------|-----------------|----------------------------|
| **Level** | **Bonus**       | **Cum. Speed** | **Cum. Profit** | **SPECIAL**                |
| 60        | x2 speed        | x2             | x1              | —                          |
| 120       | x2 speed        | x4             | x1              | —                          |
| 200       | x2 speed        | x8             | x1              | —                          |
| 350       | x2 profit       | x8             | x2              | HDP: +10 per Ascension     |
| 550       | x3 profit       | x8             | x6              | —                          |
| 800       | x4 profit       | x8             | x24             | HDP: +50 per Ascension     |
| 1000      | x5 profit       | x8             | x120            | —                          |
| 1500      | x10 profit      | x8             | x1,200          | HDP: +200 per Ascension    |
| 2000      | x20 profit      | x8             | x24,000         | —                          |
| 2500      | x50 profit      | x8             | x1.2M           | HDP: +500 per Ascension    |
| 3000      | x100 profit     | x8             | x120M           | —                          |
| 3500      | x200 profit     | x8             | x24B            | HDP: +1,000 per Ascension  |
| 4000      | x500 profit     | x8             | x12T            | —                          |
| 5000      | x1,000 profit   | x8             | x12Qa           | HDP: +2,000 per Ascension  |
| 6000      | x2,000 profit   | x8             | x24Qi           | —                          |
| 7000      | x5,000 profit   | x8             | x120Sx          | HDP: +3,500 per Ascension  |
| 8000      | x10,000 profit  | x8             | x1.2No          | —                          |
| 9000      | x20,000 profit  | x8             | x24Dc           | HDP: +5,000 per Ascension  |
| 10000     | x50,000 profit  | x8             | x1.2Ud          | HDP: +7,500 per Ascension  |
| 12000     | x100,000 profit | x8             | x120Dd          | HDP: +10,000 per Ascension |

**Hall 9: Void Meditation Sanctum — 20 milestones**

*SPECIAL: Offline earnings multiplier. Scales from x1.5 to x6.0. This is
the primary hall for players who play idle/overnight.*

|           |                 |                |                 |                        |
|-----------|-----------------|----------------|-----------------|------------------------|
| **Level** | **Bonus**       | **Cum. Speed** | **Cum. Profit** | **SPECIAL**            |
| 80        | x2 speed        | x2             | x1              | —                      |
| 160       | x2 speed        | x4             | x1              | —                      |
| 300       | x2 speed        | x8             | x1              | —                      |
| 500       | x2 profit       | x8             | x2              | Offline: x1.5 earnings |
| 800       | x3 profit       | x8             | x6              | —                      |
| 1200      | x4 profit       | x8             | x24             | Offline: x2.0 earnings |
| 1800      | x5 profit       | x8             | x120            | —                      |
| 2500      | x10 profit      | x8             | x1,200          | Offline: x2.5 earnings |
| 3000      | x20 profit      | x8             | x24,000         | —                      |
| 3500      | x50 profit      | x8             | x1.2M           | Offline: x3.0 earnings |
| 4000      | x100 profit     | x8             | x120M           | —                      |
| 4500      | x200 profit     | x8             | x24B            | Offline: x3.5 earnings |
| 5000      | x500 profit     | x8             | x12T            | —                      |
| 6000      | x1,000 profit   | x8             | x12Qa           | Offline: x4.0 earnings |
| 7000      | x2,000 profit   | x8             | x24Qi           | —                      |
| 8000      | x5,000 profit   | x8             | x120Sx          | Offline: x4.5 earnings |
| 9000      | x10,000 profit  | x8             | x1.2No          | —                      |
| 10000     | x20,000 profit  | x8             | x24Dc           | Offline: x5.0 earnings |
| 12000     | x50,000 profit  | x8             | x1.2Ud          | Offline: x5.5 earnings |
| 15000     | x100,000 profit | x8             | x120Dd          | Offline: x6.0 earnings |

**Hall 10: Soul Tempering Pagoda — 19 milestones**

*SPECIAL: Amplifies the chosen Dao Path multiplier. Scales from x1.2 to
x3.0. Makes Dao Path choice even more impactful.*

|           |                 |                |                 |                          |
|-----------|-----------------|----------------|-----------------|--------------------------|
| **Level** | **Bonus**       | **Cum. Speed** | **Cum. Profit** | **SPECIAL**              |
| 100       | x2 speed        | x2             | x1              | —                        |
| 200       | x2 speed        | x4             | x1              | —                        |
| 350       | x2 profit       | x4             | x2              | Dao Path: x1.2 amplifier |
| 600       | x3 profit       | x4             | x6              | —                        |
| 1000      | x4 profit       | x4             | x24             | Dao Path: x1.4 amplifier |
| 1500      | x5 profit       | x4             | x120            | —                        |
| 2000      | x10 profit      | x4             | x1,200          | Dao Path: x1.6 amplifier |
| 2500      | x20 profit      | x4             | x24,000         | —                        |
| 3000      | x50 profit      | x4             | x1.2M           | Dao Path: x1.8 amplifier |
| 3500      | x100 profit     | x4             | x120M           | —                        |
| 4000      | x200 profit     | x4             | x24B            | Dao Path: x2.0 amplifier |
| 5000      | x500 profit     | x4             | x12T            | —                        |
| 6000      | x1,000 profit   | x4             | x12Qa           | Dao Path: x2.2 amplifier |
| 7000      | x2,000 profit   | x4             | x24Qi           | Dao Path: x2.4 amplifier |
| 8000      | x5,000 profit   | x4             | x120Sx          | —                        |
| 9000      | x10,000 profit  | x4             | x1.2No          | Dao Path: x2.6 amplifier |
| 10000     | x20,000 profit  | x4             | x24Dc           | Dao Path: x2.8 amplifier |
| 12000     | x50,000 profit  | x4             | x1.2Ud          | —                        |
| 15000     | x100,000 profit | x4             | x120Dd          | Dao Path: x3.0 amplifier |

**Hall 11: Celestial Inscription Library — 18 milestones**

*SPECIAL: Speed milestones give x4 instead of x2 (doubled). This is the
speedrun engine — massive cycle time reduction. Only 2 speed milestones
but they're x4 each = x16 speed total.*

|           |                 |                |                 |
|-----------|-----------------|----------------|-----------------|
| **Level** | **Bonus**       | **Cum. Speed** | **Cum. Profit** |
| 120       | x4 speed        | x4             | x1              |
| 300       | x4 speed        | x16            | x1              |
| 600       | x3 profit       | x16            | x3              |
| 1000      | x5 profit       | x16            | x15             |
| 1500      | x10 profit      | x16            | x150            |
| 2000      | x20 profit      | x16            | x3,000          |
| 2500      | x50 profit      | x16            | x150,000        |
| 3000      | x100 profit     | x16            | x15M            |
| 3500      | x200 profit     | x16            | x3B             |
| 4000      | x500 profit     | x16            | x1.5T           |
| 5000      | x1,000 profit   | x16            | x1.5Qa          |
| 6000      | x2,000 profit   | x16            | x3Qi            |
| 7000      | x5,000 profit   | x16            | x15Sx           |
| 8000      | x10,000 profit  | x16            | x150Sp          |
| 9000      | x20,000 profit  | x16            | x3No            |
| 10000     | x50,000 profit  | x16            | x150Dc          |
| 12000     | x100,000 profit | x16            | x15Ud           |
| 15000     | x250,000 profit | x16            | x3.75Td         |

**Hall 12: Dao Comprehension Throne — 18 milestones**

*SPECIAL: Heavenly Mandate effectiveness. Each SPECIAL milestone
multiplies all Mandate bonuses by x1.5. At max (7 SPECIALs): x17 Mandate
effectiveness.*

|           |                 |                |                 |                             |
|-----------|-----------------|----------------|-----------------|-----------------------------|
| **Level** | **Bonus**       | **Cum. Speed** | **Cum. Profit** | **SPECIAL**                 |
| 150       | x2 speed        | x2             | x1              | —                           |
| 350       | x2 profit       | x2             | x2              | Mandate: x1.5 effectiveness |
| 700       | x3 profit       | x2             | x6              | —                           |
| 1000      | x5 profit       | x2             | x30             | Mandate: x1.5 (x2.25 cum.)  |
| 1500      | x10 profit      | x2             | x300            | —                           |
| 2000      | x20 profit      | x2             | x6,000          | Mandate: x1.5 (x3.375 cum.) |
| 2500      | x50 profit      | x2             | x300,000        | —                           |
| 3000      | x100 profit     | x2             | x30M            | Mandate: x1.5 (x5.06 cum.)  |
| 3500      | x200 profit     | x2             | x6B             | —                           |
| 4000      | x500 profit     | x2             | x3T             | Mandate: x1.5 (x7.59 cum.)  |
| 5000      | x1,000 profit   | x2             | x3Qa            | —                           |
| 6000      | x2,000 profit   | x2             | x6Qi            | Mandate: x1.5 (x11.4 cum.)  |
| 7000      | x5,000 profit   | x2             | x30Sx           | —                           |
| 8000      | x10,000 profit  | x2             | x300Sp          | Mandate: x1.5 (x17.1 cum.)  |
| 9000      | x20,000 profit  | x2             | x6No            | —                           |
| 10000     | x50,000 profit  | x2             | x300Dc          | —                           |
| 12000     | x100,000 profit | x2             | x30Ud           | —                           |
| 15000     | x250,000 profit | x2             | x7.5Td          | —                           |

**6. Elders (VIP Managers)**

Once hired, an Elder automates a hall permanently (including offline).
All Elders reset on Ascension unless Core Formation stage is reached
(15,000 HDP).

**6.1 Mortal Realm Elders**

|        |                    |                     |                               |               |
|--------|--------------------|---------------------|-------------------------------|---------------|
| **\#** | **Name**           | **Title**           | **Hall**                      | **Hire Cost** |
| 1      | Elder Qin          | Qi Sage             | Qi Gathering Pavilion         | 1,000 SS      |
| 2      | Iron Fist Zhang    | Body Cultivator     | Body Tempering Dojo           | 15,000 SS     |
| 3      | Grandmaster Huo    | Pill Emperor        | Alchemy Furnace Chamber       | 100,000 SS    |
| 4      | Array Master Liu   | Formation Sage      | Formation Array Hall          | 500,000 SS    |
| 5      | Beast Tamer Feng   | Spirit Whisperer    | Spirit Beast Garden           | 20M SS        |
| 6      | Scribe Bai         | Talisman Master     | Talisman Inscription Studio   | 200M SS       |
| 7      | Sword Saint Jian   | Sword Immortal      | Sword Refinement Peak         | 500M SS       |
| 8      | Thunder Lord Lei   | Tribulation Expert  | Tribulation Lightning Tower   | 10B SS        |
| 9      | Void Walker Chen   | Void Master         | Void Meditation Sanctum       | 200B SS       |
| 10     | Soul Sage Ming     | Soul Refiner        | Soul Tempering Pagoda         | 5T SS         |
| 11     | Scribe of Ages Wen | Celestial Librarian | Celestial Inscription Library | 200T SS       |
| 12     | Patriarch Tian     | Dao Ancestor        | Dao Comprehension Throne      | 5Qa SS        |

**6.2 Booster Elders**

Sect Qi Resonance Master: Multiplies ALL hall income globally (= Cash
Inc.'s Money Musa). Heavenly Dao Amplifier: Boosts HDP earning rate
during Ascension (= Cash Inc.'s King Hensworth VIII).

**7. Dao Paths (Faction System)**

*Inspired by Realm Grinder's faction system. Active/idle split: Sword
Dao and Beast Dao reward tapping. Formation Dao rewards idle. Alchemy
Dao is hybrid. Chaos Dao is endgame.*

**7.1 How Dao Paths Work**

At the START of each Ascension run, the player chooses one of 5 Dao
Paths. The chosen path provides: a unique multiplier to specific halls,
a unique passive ability, and a unique activated spell (cooldown-based).
The path is locked for the duration of that run and resets on the next
Ascension.

Dao Paths unlock progressively: Path 1 (Sword) available from first
Ascension. Paths 2–4 unlock at higher Cultivation Stages. Path 5 (Chaos)
unlocks after completing all 12 Tribulation Challenges.

**7.2 The Five Dao Paths (BALANCED — v4)**

*All spells verified: active paths average 2.5–3.75x effective
multiplier. Passive path averages x1.5. Active always beats passive
during engaged play.*

|               |                  |                                                         |                                          |
|---------------|------------------|---------------------------------------------------------|------------------------------------------|
| **Path**      | **Style**        | **Boosted Halls**                                       | **Passive Ability**                      |
| Sword Dao     | Active (tap)     | Sword Peak x10, Qi Pavilion x5, Body Dojo x3            | Tapping any hall grants x2 income for 5s |
| Alchemy Dao   | Hybrid (craft)   | Alchemy Chamber x10, Spirit Garden x5, Talisman x3      | AE generation doubled                    |
| Formation Dao | Idle (passive)   | Formation Hall x10, Void Sanctum x5, Library x3         | All halls produce 50% faster passively   |
| Beast Dao     | Active (hunt)    | Spirit Garden x10, Tribulation Tower x5, Soul Pagoda x3 | Heavenly Treasures appear 3x more often  |
| Chaos Dao     | Endgame (random) | Random 3 halls get x15 (weighted by cost)               | Every 60s, random hall gets x5 for 10s   |

**Spells (Corrected)**

|               |                      |                                                             |              |              |                     |
|---------------|----------------------|-------------------------------------------------------------|--------------|--------------|---------------------|
| **Path**      | **Spell**            | **Effect**                                                  | **Duration** | **Cooldown** | **Avg. Multiplier** |
| Sword Dao     | Sword Storm          | x30 all income                                              | 30 seconds   | 4 minutes    | x3.75 avg           |
| Alchemy Dao   | Pill Rain            | All active pills refresh duration                           | —            | 10 minutes   | Varies              |
| Formation Dao | Barrier Seal         | Lock income 60s, then release at x10 ramp over 60s          | 120s total   | 4 minutes    | x1.22 avg           |
| Beast Dao     | Beast Stampede       | 10 Heavenly Treasures appear instantly (x1.15 each = x3.04) | 4 hours      | 3 minutes    | x3.04 uptime        |
| Chaos Dao     | Heavenly Tribulation | x100 all income, then x0.5 for 30s after                    | 10s + 30s    | 2 minutes    | x1.83 avg           |

**Spell Details & Edge Cases**

**Barrier Seal (Formation Dao):**

Phase 1 (0–60s): All income is locked — halls still cycle but SS is
stored, not paid. Phase 2 (60–120s): Stored income is released at x10,
ramping linearly from x1 to x10 over 60 seconds (average x5.5 during
release). Net effect over 120s: roughly x3.25 of normal income. Combined
with x1.5 passive = x1.83 effective during the full 4-minute cycle.
Designed to feel powerful during the release burst while remaining
weaker than active paths overall.

**Chaos Dao — Weighted Randomization:**

The 3 random halls are selected using weighted randomization: each
hall's weight = BaseCost x random(0–1). This means expensive halls
(7–12) are selected roughly 80% of the time. Cheap halls (1–3) can still
appear but rarely. Rerolled per Ascension, not per cast. The player sees
which 3 halls are boosted at Ascension start.

**Beast Stampede (Beast Dao):**

10 Heavenly Treasures appear instantly on cast. Each grants x1.15 income
multiplicatively (x1.15^10 = x3.04 total). Treasure effect lasts 4
hours. Recasting before expiry replaces the old set (no stacking). With
3-minute cooldown, active players maintain permanent x3.04 uptime.

**7.3 Dao Path Design Principles**

Active vs Idle split: Sword Dao (x3.75 avg) and Beast Dao (x3.04 uptime)
clearly outperform Formation Dao (x1.83) during active play. But
Formation Dao's x1.5 passive works 24/7 including offline — over an
8-hour sleep session, Formation earns more than Sword. Strategic choice
per run: Going to sleep? Pick Formation. Active session? Sword. Need
alchemy materials? Alchemy. This prevents one-optimal-build syndrome.

**8. Tribulation Challenges**

*Inspired by Antimatter Dimensions' challenge system. Modified Ascension
runs with restrictions that reward permanent bonuses on completion.*

**8.1 How Challenges Work**

Tribulation Challenges are optional modified Ascension runs. When the
player enters a challenge, specific rules are altered. The player must
reach a target lifetime SS threshold to complete it. Completing awards a
permanent bonus for ALL future runs. Challenges can be re-entered to
improve completion time but the reward is earned only once. Challenges
unlock after 5 Ascensions. 12 challenges total (one per hall).

**8.2 The 12 Tribulation Challenges**

|        |                    |                                            |            |                                        |
|--------|--------------------|--------------------------------------------|------------|----------------------------------------|
| **\#** | **Name**           | **Restriction**                            | **Target** | **Permanent Reward**                   |
| 1      | Scattered Qi       | Qi Pavilion disabled                       | 1T SS      | x2 all starting income                 |
| 2      | Broken Body        | Body Dojo gives no cross-hall bonuses      | 10T SS     | x3 Body Dojo income permanently        |
| 3      | Failed Refinement  | Alchemy produces no Essence                | 100T SS    | +50% AE generation forever             |
| 4      | Shattered Arrays   | No Sect Harmony milestones                 | 1Qa SS     | x2 Sect Harmony bonuses permanently    |
| 5      | Feral Beasts       | Spirit Garden income is x0.1               | 10Qa SS    | Spirit Garden milestones give x2 extra |
| 6      | Faded Inscriptions | Talisman Studio disabled                   | 100Qa SS   | All talisman durations doubled forever |
| 7      | Dull Blade         | Sword Peak income halved; no Sword Dao     | 1Qi SS     | x5 Sword Peak income permanently       |
| 8      | Calm Skies         | No speed milestones (only profit)          | 10Qi SS    | +1 free speed doubling on all halls    |
| 9      | Anchored           | Void Sanctum disabled; no offline earnings | 100Qi SS   | x3 offline earnings permanently        |
| 10     | Soulless           | Soul Pagoda disabled; no Dao Path bonuses  | 1Sx SS     | Dao Path multipliers +50%              |
| 11     | Blank Pages        | Library disabled; no autobuyers            | 10Sx SS    | Autobuyers work 2x faster permanently  |
| 12     | Dao Severed        | Throne disabled; HDP gain halved           | 100Sx SS   | x2 HDP from all future Ascensions      |

**8.3 Challenge Balance Notes (NEW in v4)**

Challenge difficulty is designed so that Challenges 1–4 are approachable
mid-game (Days 3–7), Challenges 5–8 require late-game optimization
(Weeks 2+), and Challenges 9–12 are endgame tests (Month 1+). Challenge
12 (Dao Severed: Throne disabled, HDP halved) has the steepest target
(100Sx SS) because losing the Throne removes the highest-income hall AND
the Mandate effectiveness bonus. Players attempting this should have
500,000+ HDP and multiple automation tiers unlocked. The target has been
verified reachable with Formation Dao + maxed Alchemy Furnace + Hall 2
cross-bonuses covering for the missing Throne income.

**9. Alchemy Crafting System**

*Inspired by Kittens Game's interacting resource systems. Two halls
produce AE; AE crafts pills that boost other halls.*

**9.1 AE Generation Rates (NEW in v4)**

**Hall 3 (Alchemy Furnace): 0.01 x level AE per cycle (6s cycle)**

**Hall 5 (Spirit Beast Garden): 0.004 x level AE per cycle (24s cycle)**

Additionally, SPECIAL milestones on Halls 3 and 5 add flat AE/s bonuses
(see Section 5). Alchemy Dao doubles all AE generation.

|                   |                       |                           |                      |
|-------------------|-----------------------|---------------------------|----------------------|
| **Furnace Level** | **Base AE/s**         | **With Hall 5 (same lv)** | **With Alchemy Dao** |
| 25                | 0.042                 | 0.046                     | 0.092                |
| 100               | 0.167                 | 0.183                     | 0.367                |
| 200               | 0.333 + 1.0 SPECIAL   | 1.37                      | 2.73                 |
| 500               | 0.833 + 5.0 SPECIAL   | 6.15                      | 12.30                |
| 1000              | 1.667 + 25.0 SPECIAL  | 28.17                     | 56.33                |
| 2000              | 3.333 + 100.0 SPECIAL | 109.00                    | 218.00               |
| 4000              | 6.667 + 500.0 SPECIAL | 535.00                    | 1,070.00             |

*At level 4000 with Alchemy Dao: 1,070 AE/s. The 500,000 AE Immortality
Elixir takes ~7.8 minutes to craft. This is the endgame target —
powerful pills should feel accessible at max investment.*

**9.2 Craftable Items**

|                             |             |                 |                               |                      |
|-----------------------------|-------------|-----------------|-------------------------------|----------------------|
| **Item**                    | **AE Cost** | **Duration**    | **Effect**                    | **Unlock**           |
| Qi Condensation Pill        | 100 AE      | 5 min           | x3 Qi Pavilion income         | Alchemy Lv 25        |
| Body Tempering Elixir       | 250 AE      | 5 min           | x3 Body Dojo income           | Alchemy Lv 50        |
| Spirit Enhancement Pill     | 500 AE      | 10 min          | x2 ALL income                 | Alchemy Lv 100       |
| Formation Catalyst Talisman | 1,000 AE    | 10 min          | Halve all hall cycle times    | Talisman Lv 50       |
| Beast Core Elixir           | 2,500 AE    | 15 min          | x5 Spirit Garden + Sword Peak | Spirit Garden Lv 100 |
| Tribulation Resistance Pill | 5,000 AE    | 30 min          | x3 ALL income (stacks)        | Alchemy Lv 300       |
| Void Meditation Incense     | 10,000 AE   | 1 hour          | x2 offline earnings rate      | Void Sanctum Lv 100  |
| Heavenly Dao Pill           | 50,000 AE   | Until Ascension | +10% HDP earned this run      | Alchemy Lv 500       |
| Sect Formation Talisman     | 100,000 AE  | 30 min          | x10 ALL income                | Talisman Lv 300      |
| Immortality Elixir          | 500,000 AE  | 1 hour          | x25 ALL income                | Alchemy Lv 1000      |

**9.3 Alchemy Design Principles**

The alchemy system creates interacting loops: leveling Alchemy Furnace
produces AE, which crafts pills that boost OTHER halls, which earn more
SS, which levels up more halls. The Talisman Studio extending pill
durations (x1.1 to x2.0) adds another layer. Active players benefit more
from alchemy (crafting pills at optimal times). Alchemy Dao doubles AE
production, making it the crafting-focused run.

**10. Progressive Automation**

*Inspired by Antimatter Dimensions' autobuyer system. Automation is
earned through HDP thresholds, never purchased with real money. The
player NEVER gets auto-Ascension.*

|                   |                                                        |                          |
|-------------------|--------------------------------------------------------|--------------------------|
| **HDP Threshold** | **Automation Unlocked**                                | **Cultivation Stage**    |
| 150               | Auto-buy cheapest affordable hall (x1 only)            | Qi Condensation          |
| 500               | Auto-buy configurable (set target hall and buy amount) | Qi Condensation          |
| 1,500             | Auto-hire Elders when affordable                       | Foundation Establishment |
| 5,000             | Auto-buy all halls at configurable interval            | Foundation Establishment |
| 15,000            | Elders persist through Ascension (no re-hiring)        | Core Formation           |
| 50,000            | Auto-craft cheapest available pill when AE sufficient  | Core Formation           |
| 75,000            | Start each run with Halls 1–5 already unlocked         | Nascent Soul             |
| 150,000           | Auto-buy upgrades to milestone thresholds              | Nascent Soul             |
| 300,000           | Start each run with all Elders hired                   | Spirit Severing          |
| 1,000,000         | Auto-craft configurable pill priority list             | Dao Seeking              |

**Critical: the player NEVER gets auto-Ascension. The prestige decision
— when to Ascend, which Dao Path to pick, whether to attempt a Challenge
— is always manual. This preserves the most meaningful strategic choice
in the game.**

**11. Ascension (Prestige System)**

**11.1 The Ascension Flow**

1\. Player taps Ascend button (available after 1T lifetime SS). 2.
Confirmation screen shows: current HDP, HDP to gain, new total, new
multiplier, next Cultivation Stage, projected income increase, and
"Watch Tribulation Vision (+20% HDP)" ad option. 3. Player chooses Dao
Path for next run. 4. Cinematic: sect dissolves into golden light,
reforms on the mountain. Cultivation stage title card if new stage
reached. 5. Run begins with automation bonuses applied.

**11.2 What Resets vs Persists**

|                                     |                               |
|-------------------------------------|-------------------------------|
| **Resets**                          | **Persists**                  |
| Spirit Stones                       | Heavenly Dao Points (total)   |
| Hall levels                         | Dao Crystals                  |
| Elder hires (unless Core Formation) | Heavenly Seals                |
| All milestones                      | Heavenly Mandate levels       |
| Sect Harmony milestones             | Permanent DC boosters         |
| Alchemy Essence + active pills      | Tribulation Challenge rewards |
| Current Dao Path choice             | Automation unlocks            |
| HDP Shop purchases                  | Cultivation Stage / cosmetics |

**11.3 HDP Shop (NEW in v4 — 10 Items)**

*Spending HDP reduces passive +2%/point bonus. Items must be worth the
opportunity cost. Geometric scaling ~2x between tiers.*

|        |                             |                |                                                     |
|--------|-----------------------------|----------------|-----------------------------------------------------|
| **\#** | **Item**                    | **Cost (HDP)** | **Effect**                                          |
| 1      | Eternal Sect Treasury       | 10,000         | +5% all income permanently                          |
| 2      | Apprentice's Head Start     | 22,000         | Start each run with 25,000 SS                       |
| 3      | Refinement Accelerant       | 48,000         | Alchemy pill crafting speed +20%                    |
| 4      | Heavenly Tribulation Primer | 105,000        | First Tribulation Challenge each run is 50% easier  |
| 5      | Sect Prestige Aura          | 230,000        | +8% all income permanently                          |
| 6      | Ancient Cultivation Records | 510,000        | Show next milestone cost for all halls at all times |
| 7      | Primordial Essence Cache    | 650,000        | Cosmetic: golden Sect Master avatar glow            |
| 8      | Dao Resonance Attunement    | 1,420,000      | +12% all income + Dao Path spell cooldowns -15%     |
| 9      | Boundless Coffers           | 3,100,000      | +18% all income permanently                         |
| 10     | Sect Immortal's Blessing    | 5,000,000      | +25% all income permanently                         |

*Cumulative permanent income from all shop items: +68% (x1.68). Combined
with 5M HDP passive (+100,000% base), the shop items are a small
fraction of total power — meaningful but never mandatory.*

**11.4 Ascension Timing (from Clicker Heroes)**

A notification appears when potential HDP gain would approximately
double the player's current total. The notification shows projected
income increase on next run. The UI must make optimal Ascension timing
obvious — this was Clicker Heroes' strongest UI innovation.

**12. Heavenly Mandate (Advisor System)**

Permanent per-hall multipliers surviving Ascension. The primary
long-term retention hook (= Cash Inc.'s Uncle Rich). Unlocks after 3
Ascensions with 50 free Heavenly Seals.

|           |                |               |                         |
|-----------|----------------|---------------|-------------------------|
| **Level** | **Multiplier** | **Seal Cost** | **Flavor**              |
| 1         | x9             | 20            | Heaven's Acknowledgment |
| 2         | x81            | 35            | Heaven's Favor          |
| 3         | x729           | 55            | Heaven's Blessing       |
| 4         | x6,561         | 80            | Heaven's Decree         |

9-themed progression (Chinese numerology). 12 independent slots (one per
hall). Dao Comprehension Throne's SPECIAL milestones amplify all Mandate
effectiveness by up to x17.1. Prioritize Dao Throne first. 6 DC = 1 HS.
50 free on first unlock.

**13. Three Realms / Era Progression**

|                 |                              |           |                                 |
|-----------------|------------------------------|-----------|---------------------------------|
| **Realm**       | **Unlock**                   | **Halls** | **Theme**                       |
| Mortal Realm    | Starting                     | 12        | Classical Xianxia sect mountain |
| Immortal Realm  | 1 Sextillion SS + Realm Gate | 12        | Celestial palace above clouds   |
| Celestial Realm | Endgame Immortal threshold   | 12        | Primordial chaos beyond heaven  |

**13.1 Realm Transition Details (NEW in v4)**

Realm Gate: Located at the base of the sect mountain. Requires 1
Sextillion lifetime SS + completing at least 6 Tribulation Challenges.
Transitioning to Immortal Realm does NOT delete Mortal progress — Mortal
halls continue producing in the background at 10% efficiency. The player
can switch between Realms freely after unlocking. Immortal Realm has 12
new halls with new themes, new Elders with active abilities, and new
milestone tables. Immortal income is added ON TOP of Mortal income
(Mortal becomes a passive foundation). HDP, Automation unlocks, Mandate
levels, and Challenge rewards ALL persist across Realms. Only SS and
hall levels are Realm-specific. Each Realm has its own Sect Harmony
milestones.

*Design note: The biggest complaint from r/incremental_games about new
eras is "new content that doesn't interact with old mechanics." Our
solution: Mortal halls keep producing. Immortal builds ON TOP of Mortal.
Nothing is wasted.*

**14. Cultivation Stages & Sect Mountain Evolution**

|                          |            |                          |                                  |
|--------------------------|------------|--------------------------|----------------------------------|
| **Stage**                | **HDP**    | **Visual**               | **Automation Unlock**            |
| Mortal Realm             | 0          | Wooden huts              | —                                |
| Qi Condensation          | 150        | Stone foundations        | Auto-buy cheapest hall           |
| Foundation Establishment | 1,500      | Buildings with Qi flows  | Auto-hire Elders                 |
| Core Formation           | 15,000     | Jade and marble          | Elders persist through Ascension |
| Nascent Soul             | 75,000     | Floating islands         | Start with Halls 1–5             |
| Spirit Severing          | 300,000    | Energy barriers          | Start with all Elders            |
| Dao Seeking              | 1,000,000  | Heavenly phenomena       | Auto-craft pill priority list    |
| Immortal Ascension       | 10,000,000 | Transcends physical form | Realm Gate access                |

**14.1 Sect Mountain Visual Tiers (NEW in v4)**

The sect mountain evolves through 18 cosmetic sub-tiers across the
Mortal Realm:

Tiers 1–3 (0–150 HDP): Wooden shacks, dirt paths, sparse bamboo. Single
bonfire at base. Tier 4–6 (150–1,500): Stone walls replace wood. Simple
gardens appear. Waterfall begins flowing. Tier 7–9 (1,500–15,000):
Jade-trimmed buildings. Qi wisps float between halls. Cherry blossoms on
paths. Tier 10–12 (15,000–75,000): Marble foundations. Floating
lanterns. Dragon carvings on pillars. Tier 13–15 (75,000–300,000):
Islands begin detaching. Golden Qi streams. Celestial cranes perch on
rooftops. Tier 16–18 (300,000–10,000,000): Full floating mountain.
Aurora in the sky. Heavenly gate at summit.

**15. Secondary Systems & Events**

**15.1 Sect Missions (= Cash Inc. Projects)**

Finite task objectives awarding multipliers. Examples: catch 100
Heavenly Treasures in 15s, reach Hall 500, complete 5 Tribulation
Challenges, craft 50 pills in one run.

**15.2 Heavenly Lottery (= Spin N Win)**

Wheel available hourly after 3 Ascensions. First free, then ad-gated.
Prizes: DC, HS (rare), time skips, temp boosters, Alchemy Essence.

**15.3 Cultivation Focus Boost**

Ad grants x2 income for 4 hours. Works offline. Single most impactful
free action in the game.

**15.4 Weekly Sect Rankings**

Categories: Mortal Halls Owned, Career Revenue, Current HDP, Challenges
Completed. Weekly prizes.

**Anti-cheat (NEW in v4): Save data is hashed with HMAC-SHA256 using a
server-side secret. Leaderboard submissions require a valid hash.
Client-side save tampering is detected by hash mismatch. Rankings use
server-validated snapshots taken at save time, not client-reported
values. Suspicious accounts (revenue jumps \> 10x in \< 1 minute without
active boosts) are flagged for manual review.**

**15.5 Seasonal Events (EXPANDED in v4)**

*Inspired by Cookie Clicker's seasonal events which each have dozens of
unique upgrades and achievements.*

**Lunar New Year (January–February, 2 weeks)**

Red Packet Treasures replace normal Heavenly Treasures. Each grants x3
SS (vs normal x1). Special pill: Fortune Dumpling (craft for 5,000 AE,
gives x5 ALL income for 2 hours). Unique milestone: collect 888 Red
Packets for permanent x1.5 Lunar Fortune buff (persists after event). x3
HDP for all Ascensions during event.

**Mid-Autumn Festival (September, 1 week)**

Mooncake pills added to Alchemy: 6 unique mooncakes with effects not
available normally (e.g., Jade Moon Mooncake: halves ALL costs for 30
minutes, 25,000 AE). Moon Gazing Bonus: every hour, a full moon appears
on screen for 60 seconds — tapping during it grants x10 income (Cookie
Clicker golden cookie equivalent). Permanent reward: collect all 6
mooncake types for +10% offline earnings forever.

**Dragon Boat Festival (June, 1 week)**

Dragon Boat Race mini-event: player picks a Spirit Beast to race against
3 AI boats. Race takes 1 hour of real time (progress based on Spirit
Garden level). Winning grants Dragon Scale currency (5 per win) spent on
exclusive cosmetics and a unique Elder skin. 3 races per day.
Festival-exclusive talisman: Dragon Oar Talisman (1,000 AE, x2 speed for
all halls for 1 hour).

**Heavenly Tribulation Season (March, 2 weeks)**

All Tribulation Challenge targets reduced by 25%. Double rewards for
first-time completions during event. New event-only Challenge: "Heaven's
Wrath" — all halls at x0.5 income, all speed milestones disabled, target
500Qa SS. Reward: permanent +5% HDP from all Ascensions.

**16. Monetization**

Mirrors Cash Inc.'s model with Egg Inc.'s Piggy Bank lesson applied.

**16.1 Ad Placements**

|                       |                                  |
|-----------------------|----------------------------------|
| **Placement**         | **Reward**                       |
| Cultivation Focus     | x2 all income 4h (works offline) |
| Offline Return        | x2 earnings (or x3 for 5 DC)     |
| Heavenly Treasure tap | x5 bonus drop                    |
| Ascension             | +20% HDP                         |
| Lottery spin          | Subsequent spins                 |
| Banner                | Bottom of screen                 |

**16.2 Dao Crystal Permanent Boosters**

|                       |          |               |
|-----------------------|----------|---------------|
| **Booster**           | **Cost** | **Effect**    |
| Minor Qi Amplifier    | 100 DC   | x3 permanent  |
| Greater Qi Amplifier  | 300 DC   | x9 permanent  |
| Supreme Qi Amplifier  | 600 DC   | x27 permanent |
| Heavenly Qi Amplifier | 1,000 DC | x60 permanent |

**16.3 Dragon Hoard (Piggy Bank from Egg Inc.)**

A Dragon Hoard where Dao Crystals accumulate visibly as the player
progresses. Grows with every purchase and milestone. Cracking it open
costs \$4.99 IAP and gives all accumulated DC. Refills over time,
encouraging repeat purchases. This is the most praised monetization
mechanic in idle games.

**17. UI/UX Design**

Main screen: 2D side-view sect mountain, vertical scroll. Each floor =
one Hall with progress bar. Heavenly Treasures fly across mid-screen.
Alchemy crafting menu accessible via tab.

**17.1 Navigation**

|            |                                                |
|------------|------------------------------------------------|
| **Tab**    | **Function**                                   |
| Halls      | Main gameplay — view/upgrade/tap               |
| Elders     | Hire and manage                                |
| Dao Path   | View current path bonuses and spell            |
| Alchemy    | Craft pills/talismans, view active buffs       |
| Ascension  | Sect progression, Ascend button, HDP info      |
| Challenges | Tribulation Challenge list and rewards         |
| Mandate    | Heavenly Mandate per-hall upgrades             |
| Shop       | DC purchases, HDP Shop, boosters, Dragon Hoard |

**17.2 Progressive Disclosure**

Start: only Halls tab with Hall 1. Show Hall 2 when Hall 1 owned. Show
Elders tab when first Elder affordable. Show Ascension tab after 1T
lifetime SS. Show Dao Path, Alchemy, Challenges after 5 Ascensions. Show
Mandate after 3 Ascensions. Never show everything at once.

**17.3 Milestone Proximity (Critical Retention Feature)**

Below each hall: a milestone indicator showing next milestone level and
how many levels remain. Within 5 levels: golden glow border on hall
card. On hit: burst of golden Qi, multiplier appears large and shrinks
into stats, subtle screen shake, chime.

**18. Art Direction & Audio**

Xianxia ink-wash aesthetic. Jade Green + Imperial Gold primary. Deep
Purple + Celestial Blue secondary. Dark Ink Wash background (#0d1b2a to
\#1a0a2e). Brush font headers (Ma Shan Zheng). Clean body (Noto Sans).
Sect mountain evolves across 18 cosmetic sub-tiers. Particle effects:
floating Qi wisps (CSS animations on transform/opacity). Progress bar:
jade glow (box-shadow: 0 0 6px rgba(46,139,87,0.4)).

Audio: erhu + guzheng + ambient synth BGM, dynamic layers by active
halls. SFX: chime (cycle), crystal clink (SS), gong (Elder), seal stamp
(milestone), thunder-to-choir (Ascension). Ambient: bamboo wind,
waterfall, crane calls, Qi hum.

**19. Technical Notes**

|               |                                                                   |
|---------------|-------------------------------------------------------------------|
| **Component** | **Tech**                                                          |
| Platform      | Web (HTML5)                                                       |
| Framework     | React + TypeScript                                                |
| State         | Zustand (selective subscriptions for 20Hz tick perf)              |
| Big Numbers   | break_infinity.js (up to 1e9e15)                                  |
| Save          | JSON localStorage + HMAC-SHA256 hash + versioned schema migration |
| Offline       | Timestamp-based delta on return, 50% base efficiency, 72h cap     |
| Tick Rate     | 20Hz game logic via useRef, 4Hz React re-render                   |
| Rendering     | CSS + Canvas for particles                                        |
| Anti-cheat    | Server-validated leaderboard snapshots, hash integrity            |

Critical: Never use setInterval for income — use delta-time. Save every
30s and on every purchase. Version save schemas for migration. Tab
backgrounding throttles to 1Hz — store lastTickTimestamp.

**20. Progression Pacing**

|                 |           |                                                                         |
|-----------------|-----------|-------------------------------------------------------------------------|
| **Phase**       | **Time**  | **What Happens**                                                        |
| First 5 min     | 0–5m      | Discover tapping, unlock Hall 1, hire first Elder (see Section 2.0)     |
| First run       | 0–6h      | Manual tapping, unlock halls 1–5, first Elders, 25-milestones           |
| First Ascension | 4–12h     | Hundreds to thousands HDP. Pick first Dao Path.                         |
| Ascensions 2–5  | Day 2–3   | Try different Dao Paths. First Tribulation Challenges unlock.           |
| Mid-game        | Days 3–7  | Multiple Ascensions/day. Alchemy crafting active. Challenges 1–4.       |
| Late-game       | Weeks 2+  | Ascension compresses to minutes. Challenges 5–8. Realm Gate approaches. |
| Endgame         | Months 1+ | Septillion+ territory. Challenges 9–12. Immortal Realm. Chaos Dao.      |

**21. Development Phases**

**Phase 1: MVP**

12 Mortal halls with full base costs/revenues. Complete milestone tables
for all 12 halls. 12 Elders. Ascension + HDP. Basic Dao Paths (Sword +
Formation only). Offline earnings with cultivation animation (50%
efficiency, 72h cap). Bulk buy. Save/load with hash integrity. Basic UI
with progressive disclosure. Onboarding flow (Section 2.0).
break_infinity.js.

**Phase 2: Depth**

All 5 Dao Paths (with balanced spells). Tribulation Challenges (12).
Alchemy crafting system with AE generation rates. Progressive automation
(10 tiers). Heavenly Mandate. Heavenly Lottery. Heavenly Treasures. HDP
Shop (10 items).

**Phase 3: Polish & Monetize**

DC shop + permanent boosters. Dragon Hoard. Ad integration. Sect
mountain visual evolution (18 tiers). Audio/SFX. Sect Missions. Weekly
Rankings with anti-cheat. Seasonal events (4 festivals fully designed).

**Phase 4: Immortal Realm**

Realm Gate. 12 Immortal halls. Immortal Elders with active abilities.
Immortal milestones. Immortal Mandate slots. Mortal-to-Immortal passive
income bridge (10% Mortal efficiency in background).

**Phase 5: Celestial Realm & Endgame**

12 Celestial halls. Celestial Elders. Prestige Dao Paths (combinations).
Endgame systems.

**End of Game Design Document**

*Cultivation Sect Tycoon v4.0 — May the Heavenly Dao guide your path.*
