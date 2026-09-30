---
type: research
date: 2026-09-30
tags: [competition, business-challenge-2026, underwriting, process, build-vs-buy]
---

# Manual underwriting process: what it is, where 380k VND and 1.8-4.6 days go, build vs. extend

Parent: [[business-challenge-2026]] · Solution side: [[solution-usp-research]] · Diary: [[2026-09-30]]

> **Evidence labels.** **[CASE]** = stated in the HLBVN case ([[business-challenge-2026]] §4.5, §4.8). **[PUBLIC]** = from public sources listed at the bottom. **[ASSUMPTION]** = my decomposition, *not* in the case - the case gives only the totals (380,000 VND, 1.8-4.6 working days), never the breakdown. State these as assumptions on the infographic.

## 1. The current process (what happens to one point-of-purchase application)

[CASE] Customer at a merchant/partner is redirected to a separate flow: submit documents (hard copy/scan) -> verification -> credit officer reviews against credit bureau -> decision after several days. Assessment relies on formal credit history (CIC) + collateral. Underwriting = *Centralized Manual Review*.

[PUBLIC] Typical Vietnamese unsecured-loan flow matches this: submit ID + income proof (3-6 months salary/statements; freelancers/business owners give income certificates) -> bank checks documents, asks for missing ones -> verifies by calling / checking details -> CIC lookup for bad debt -> decision on limit, rate, term; banks quote 3-5 working days once documents are complete.

### Step map with where time and money likely go [ASSUMPTION - illustrative split that sums to the case totals]

| # | Step | Who / system | Time (working days) | Cost (VND) | Bottleneck mechanism |
|---|---|---|---|---|---|
| 1 | Document collection & resubmission | Customer + branch/merchant | 0.4-1.2 | 60,000 | Paper/scan; missing or unreadable docs trigger back-and-forth |
| 2 | Queue in central team | Ops | 0.5-1.3 | (in salary pool) | Centralized batch queue; small and large loans wait equally |
| 3 | Verification (identity, phone/employment/address checks) | Verification staff | 0.4-1.0 | 90,000 | Human phone calls / manual checks; no real-time eKYC |
| 4 | Credit review vs bureau + income docs | Credit officer | 0.3-0.5 | 130,000 | Officer time is the biggest cost; bureau query; income judged from paper |
| 5 | Approval / sign-off / disbursement set-up | Approver, ops | 0.2-0.6 | 100,000 | Sign-off chain regardless of ticket size |
| | **Total** | | **1.8-4.6** [CASE] | **380,000** [CASE] | |

Time column adds to exactly 1.8 (all minima) and 4.6 (all maxima); cost column adds to 380,000. The split itself is a guess: **validate by asking BTC/HLBVN for a step-level breakdown** (add to [[business-challenge-2026]] §8 list).

Key structural point [CASE]: the cost is **fixed per application, whatever the loan size** (1.6M-90.1M VND).

## 2. What that costs in money (worked from case numbers)

- Ticket of 1.6M: 380,000 = **23.75% of principal** [CASE numbers, my arithmetic].
- Ticket of 90.1M: 380,000 = **0.42% of principal** [same].
- Break-even ticket for the review alone [ASSUMPTION: 24% APR, 3-month term -> interest about 6% of principal]: 380,000 / 0.06 = **about 6.3M VND** - anything below loses money on review cost *before* funding cost and credit loss.
- **Rejected applications cost the same 380,000** [CASE: fixed per application]. Cost per funded loan = 380,000 / approval rate. If approval were 50% [ASSUMPTION], it is 760,000 per funded loan. Approval rates by segment are not given in numbers in the case (only High / Low ranking, Exhibit 1).

## 3. Potential loss (what the delay and bureau-only rule destroy)

Three separate leakages [CASE, qualitative]:
1. **Abandonment at checkout** - decision arrives after the customer left (case §4.5). Rate not given -> do not invent one; present as a KPI to measure (decision-to-abandon gap).
2. **Wrong rejections** - 64.5% of inbound apps are not "salaried with credit history" (20.5 + 15 + 14.5 + 14.5; mix in §4.8). Gig, first-time and MSME are rejected despite observable cash flow (Exhibit 1).
3. **Leakage to informal credit** - customers who cannot wait or get declined seek credit outside the formal system (case §4.5).

Plus the hidden fourth: **selection bias** - the bank only learns from those it approved (see [[solution-usp-research]] USP B).

## 4. How to improve it (step by step)

| Step | Fix | Removes |
|---|---|---|
| 1 Docs | eKYC (CCCD + liveness) + consented data connection instead of uploads. Note: eKYC is required by rule for first-time digital consumer loans [PUBLIC: Tilleke]. | Paper, resubmission |
| 2 Queue | Straight-through path for anything inside limit; humans only for exceptions | Queue wait |
| 3 Verification | Automated cross-check of eKYC vs. payout/wallet account holder name | Manual calls |
| 4 Review | Scorecard on cash-flow features run weekly in advance ([[solution-usp-research]] warm lane); officer sees only flagged cases | Officer time per file |
| 5 Approval | Pre-approved limit = lookup; exception lane for big tickets | Sign-off chain |

Result path: decision from days to seconds for the warm lane; per-decision cost falls to data/API + compute + exception handling. Target cost per decision is an **[ASSUMPTION]** to state (do not present a number as fact).

## 5. Build on existing infrastructure vs. build a whole new solution

**What exists [CASE/PUBLIC]:** an STP path already runs for "salaried with credit history" (Exhibit 1: "STP keeps conditions, automates execution"); CIC lookup; branch lending process; CASA accounts. Not existing / unknown: consented alt-data feeds, real-time eKYC in this journey, a checkout-side decision API.

| Option | For | Against |
|---|---|---|
| A. Optimize existing (rules tweaks, digitize forms, more staff) | Lowest risk, no regulator friction | Does not remove the fixed per-file cost or the bureau-only blindness; small tickets still lose money |
| B. Rip-and-replace with a whole new lending stack | Clean design | Far beyond the "6-12 months, operationally viable" test in HLBVN's letter ([[business-challenge-2026]] §4.2); core-banking and compliance rework; credit committee unlikely to sign off |
| **C. Hybrid (recommended): keep core banking and existing branch/manual lane; add a thin new decision layer beside it** | Reuses the proven STP logic and CIC integration; new parts are small: consent + data connectors, weekly scorecard, decision API for checkout, eKYC vendor; manual lane stays as fallback and for large tickets | Needs 2-3 integrations and partner agreements (the main dependency) |

Recommendation: **C**. It is the only option that answers the judges' criteria (feasible in 6-12 months, explainable, defendable to a real credit committee) and it turns the existing manual lane into the exception path instead of deleting it. Buy commodity parts (eKYC, data aggregation); build only the scorecard, limit engine and repayment logic - that is where HLBVN-specific value and the USP sit.

Suggested rollout [ASSUMPTION]: pilot one platform partner and one segment first (e.g. gig workers, small limit) -> shadow-mode scoring beside manual decisions to prove accuracy -> go live with capped limit + exploration budget ([[solution-usp-research]]) -> widen.

## 6. Open items
- Get the step-level time/cost breakdown from HLBVN if possible (else keep section 1 labelled as assumption).
- Fill approval-rate and abandonment figures as explicit assumptions or ask BTC.
- Pick the KPI set: decision time, cost per decision, cost per *funded* loan, approval rate by segment, abandonment at checkout, early-delinquency rate.

## Sources
- [SeABank - unsecured loan procedure](https://www.seabank.com.vn/en/tin-tuc/tu-van-dich-vu/tu-van-meo/vay-tin-chap) (3-5 working days, verification, CIC check)
- [SeABank - documents for unsecured loans](https://www.seabank.com.vn/en/tin-tuc/tu-van-dich-vu/tu-van-meo/ho-so-vay-tin-chap)
- [Tilleke - eKYC for digital consumer lending](https://www.tilleke.com/insights/new-regulations-on-onshore-loans-in-vietnam/6/)
- [ClearStaq - manual statement review costs](https://clearstaq.com/blog/hidden-cost-manual-bank-statement-review) (generic US benchmark; not Vietnam - use only as directional)
