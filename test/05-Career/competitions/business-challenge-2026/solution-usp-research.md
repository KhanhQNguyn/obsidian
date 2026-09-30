---
type: research
date: 2026-09-30
tags: [competition, business-challenge-2026, solution, usp]
---

# Solution stress-test & USP research (30/09)

Parent: [[business-challenge-2026]] · Process analysis: [[underwriting-process-analysis]] · Diary: [[2026-09-30]]. Baseline solution = pre-computed cash-flow credit line + income-linked repayment.

## 1. Gaps in the current solution (judges will find these)

1. **Invisible-until-apply.** Exhibit 1 says these customers are "near invisible until they apply". Weekly pre-scoring only works for customers who already consented and linked data. Who are they before their first purchase? -> need a *cold lane*.
2. **Cold start / selection bias.** HLBVN has no default labels for gig/first-time customers (they were rejected). A model trained only on approved customers is biased (reject inference problem).
3. **Stale limit.** Weekly score vs. checkout: income can drop, or the customer can stack loans across apps in between. -> need limit reservation + trigger events.
4. **Income-linked repayment needs a mechanism.** Who collects? If money lands in another bank's wallet, "income-linked" is a promise, not a control.
5. **Consent law.** Law 91/2025 (PDPL, effective 1 Jan 2026) requires specific, informed consent per purpose; scoring/credit rating must be stated. CIC data sharing needs explicit consent from 1 Nov 2026. Design consent as a feature, not a footnote.
6. **Unit economics unproven.** Need a per-loan P&L at 1.6M, not just "cost near zero".

## 2. USP candidates (ranked)

### USP A (recommended headline) - "Cash-flow-secured credit": repayment stream = collateral
- Collateral-free is the problem; the customer's *future payout* is the collateral. Bank opens a CASA/virtual account; platform/merchant payouts route (or split) through it; installment is swept at source **before** the customer sees it (pay-when-paid).
- Turns underwriting from *predicting* behaviour into *controlling* the cash flow. Explains why default risk drops "by design".
- Ties to Exhibit 1 hint: MSME risk is mitigated by onboarding CASA early. HLBVN also gains CASA deposits (funding).
- Feasible in 6-12 months: partner integration with 1-2 platforms; no new AI needed for enforcement.
- Caveat to state: customer can redirect payouts -> mitigate with limit decay when inflow drops (see C).

### USP B - "Earn-your-data" exploration budget (reject inference, bounded loss)
- Reserve a small fixed budget (e.g. 2-5% of thin-file applicants, micro-limit only) to approve outside the model's comfort zone and observe true outcomes. Research shows 2-5% exploration is enough to diagnose the feedback loop cheaply (see sources).
- Solves the cold-start label problem no other team will mention; credit committee gets a hard cap on expected loss (budget = max loss).
- Pitch line: "the bank buys its own training data for a capped, pre-approved amount."

### USP C - Credit ladder / graduation
- Start every thin-file customer at a micro-limit; limit grows with weekly-observed behaviour; on-time payments reported to CIC = the loan *builds* the bureau file.
- Reframes the ~64.5% no-file segment from "risky" to "future best segment" (Salaried-with-history is the most profitable, 35.5% of mix). Sustainable-inclusion angle for the 35% Solution Concept criterion.

### USP D - Merchant as co-underwriter / co-funder
- Merchant pays a subsidy (MDR-like) and/or shares first-loss for its own customers -> fixes small-ticket unit economics from the revenue side, not only the cost side. Merchant signals (returns, repeat purchase) as extra features.

### USP E - Transparent "income passport"
- Customer sees which linked sources raised their limit and what to link next; adverse-action reasons come free from a scorecard. Answers explainability (HLBVN letter) and consent conversion at once.

## 3. Suggested combined architecture (fits 1 infographic)

- **Warm lane**: consent-linked customers, weekly score (P20 of rolling weekly inflow, not the mean -> conservative), pre-computed limit, checkout = lookup + real-time velocity/stacking check + limit reservation.
- **Cold lane**: first-time / unlinked customer: eKYC + 60-second data-connect -> conservative micro-limit only.
- **Repayment**: fixed installment (salaried) / payout-swept (gig, merchant) via USP A.
- **Learning loop**: exploration budget (B) + graduation ladder (C) feed labels back into the scorecard.
- **Model**: logistic/scorecard, explainable; human review only for above-threshold or flagged cases.
- **Triggers**: limit auto-shrinks on inflow drop; freeze on missed sweep.

## 4. To quantify before 04/10 (assumptions must be stated)

- Per-loan P&L at 1.6M / 3-mo vs. 380,000 VND manual cost. Assumed APR, automated cost per decision, expected loss -> break-even ticket size.
- Approval-rate uplift for gig/first-time/MSME, decision time (days -> seconds), cost/decision.
- Exploration budget size and max-loss cap.
- Expected share of applicants reachable in warm lane (depends on partner consent linking) - explicit assumption.

## 5. Compliance points (verify with a lawyer/BTC, do not present as certain)

- Law 91/2025 + Decree 356/2025: purpose-specific consent, scoring must be disclosed.
- Explicit consent for CIC data sharing from 1 Nov 2026.
- eKYC required for first-time digital consumer loans; reported cap of VND 100M outstanding for digitally-originated living-purpose loans (from a secondary summary - confirm against the circular). Case max is 90.1M, so it fits.
- Reported SBV move to extend consumer loan term 12 -> 24 months (draft/direction only); case terms already go to 24.

## Sources
- [FPF - Vietnam data protection regime (Jan 2026)](https://fpf.org/wp-content/uploads/2026/01/January-2026-FPF-Issue-Brief-Making-Sense-of-Vietnams-Latest-Data-Protection-and-Governance-Regime-1.pdf)
- [Tilleke - Vietnam's new PDPL](https://www.tilleke.com/insights/vietnams-new-personal-data-protection-law-a-closer-look/)
- [VietnamPlus - explicit consent for credit info from 1 Nov](https://en.vietnamplus.vn/explicit-consent-required-for-sharing-customers-credit-information-from-november-1-post351801.vnp)
- [Reject inference / exploration (arXiv 2606.18479)](https://arxiv.org/html/2606.18479v1)
- [Experian - reject inference](https://www.experian.com/blogs/insights/reject-inference/)
- [Tilleke - onshore loans / digital lending eKYC](https://www.tilleke.com/insights/new-regulations-on-onshore-loans-in-vietnam/6/)
