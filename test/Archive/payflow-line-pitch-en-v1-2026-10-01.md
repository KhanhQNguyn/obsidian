---
type: solution
date: 2026-10-01
tags: [competition, business-challenge-2026, solution, pitch-draft, english]
status: confirmed by Khanh only - NOT yet reviewed/approved by team
---

# PayFlow Line — A Cash-Flow-Secured Credit Line for Point-of-Purchase Lending

English pitch-ready draft, written to go straight onto the infographic/submission (Ideation Round requires English). Refines and supersedes parts of the Vietnamese working doc [[final-solution]] — see discrepancy note at the bottom before merging the two.

Parent: [[business-challenge-2026]] · Process analysis: [[underwriting-process-analysis]] · USP research: [[solution-usp-research]] · Diary: [[2026-10-01]]

---

## Problem Diagnosis (20% of the score)

Today, Hong Leong Bank Vietnam can only check one thing to decide if a customer deserves a loan: the customer's old credit bureau history, called CIC. To check this, an officer must read documents by hand, one by one. This process takes 1.8 to 4.6 days and costs 380,000 VND per application, no matter if the loan is small or large.

To understand exactly where this time and cost come from, we broke the manual process down into five steps:

| Step | Who Does It | Time (days) | Cost (VND) |
|---|---|---|---|
| 1. Document submission | Customer, branch or merchant staff | 0.4–1.2 | 60,000 |
| 2. Queue for central processing | Operations team | 0.5–1.3 | (covered by fixed salary budget) |
| 3. Identity, phone, and employment verification | Verification officer | 0.4–1.0 | 90,000 |
| 4. Cross-check against CIC and income records | Credit officer | 0.3–0.5 | 130,000 |
| 5. Approval, signature, and disbursement setup | Approver, operations | 0.2–0.6 | 100,000 |
| **Total** | | **1.8–4.6** (matches case total) | **380,000** (matches case total) |

*(Note: this step-level breakdown is our own illustrative estimate, built backward from the two totals given in the case. HLBVN did not publish a step-level cost breakdown, so this table should be validated with the bank if possible. It is meant only to show that the case's totals are consistent with a realistic Vietnamese consumer-lending workflow.)*

This breakdown shows something important. More than half of the total cost, 220,000 out of 380,000 VND, around 58%, comes from just two steps: verification and bureau cross-checking. These two steps exist for one reason only: the bank has no automatic way to confirm who the customer is and whether they can be trusted financially.

One more detail from the case matters here. The case does not specify exactly which channel this separate process uses, whether it means visiting a branch, using a dedicated app, scanning a code at a merchant counter, or sending documents by email. What the case does state clearly is that the customer is "redirected into a separate process", away from the purchase journey they were already in. We do not need to guess the specific channel to identify the underlying issue. Any interruption that pulls a customer out of the purchase flow creates a moment where they can abandon the transaction, and this redirection itself is consistent with the checkout abandonment problem the case describes.

This single limitation, the lack of any automatic way to check creditworthiness beyond a paper file, creates three results at the same time.

**First, it is slow.** A customer standing at a checkout cannot wait several days, and being redirected away from the purchase journey only makes this worse. By the time the bank says yes, the customer has already left or found another way to pay.

**Second, it is expensive.** For a small loan of 1,600,000 VND, the bank only earns a small amount of interest, much less than the 380,000 VND it spends just to check the application. The bank loses money on every small loan.

**Third, and most important, this method is blind to a large group of customers.** Gig workers, online sellers, and first-time borrowers do not have a CIC history. This does not mean they cannot repay a loan. It only means the old system has no way to see their real income. In the case data, this group represents 64.5% of all applications, almost two out of every three customers.

We want to be very clear about one thing. These are not three separate problems. They are three results of one single root cause: the bank has no tool to check a customer's creditworthiness except reading old paper records by hand. Being slow, being expensive, and being blind to new customers are not three diseases. They are three symptoms of the same disease.

---

## Intervention Justification (30% of the score)

Our solution replaces exactly the part of the process that costs the most and causes the most delay: manual verification and bureau cross-checking (steps 3 and 4 above). Instead of a person reading documents by hand, a scoring model reads real cash-flow data automatically, such as platform payouts, salary transfers, or e-wallet activity, and produces a decision in seconds.

**Why a learning model, not just a fixed rule table.** A model that learns from past repayment data can notice combinations of factors that are hard for a person to weigh by hand. For example, stable income with one recent late payment carries different risk than unstable income with no late payments at all. This is a form of supervised learning, specifically a scorecard built with logistic regression, a method the global credit industry has used reliably for decades. It is not new or experimental technology, which supports feasibility within the required 6 to 12 month timeframe.

**Why this design is not just another AI idea.** Many teams in this competition will likely suggest using AI simply to predict whether a customer will repay. We believe this is the wrong starting point. In the letter from HLBVN, the judging panel asks clearly for solutions that are explainable, not a black box that gives an answer without showing why. A complex model that only says "approve" or "reject" without clear reasons is a weakness in a banking context, not a strength, because the bank must explain every decision to customers and regulators. So our main innovation is not a smarter prediction model. It is a different design: instead of trying to predict behavior, we control the cash flow directly. This is a safer and more honest way to reduce risk, and it is also structurally different from the current process, which the case describes as redirecting the customer away from their purchase journey. PayFlow Line requires no redirection at all. The credit decision happens inside the same checkout screen the customer is already using.

This is not a theoretical idea. A similar structure already exists in the market. Revenue-based financing providers such as Stripe Capital collect loan repayments automatically as a fixed percentage of a merchant's daily sales, with no manual review needed after approval. Our design applies this same proven logic to HLBVN's point-of-purchase customers in Vietnam.

**Evidence that this approach actually works for underserved customers.** A study published in Management Science, "Invisible Primes: Fintech Lending with Alternative Data," analyzed a real fintech lender and found that using alternative data allowed the platform to approve 15 to 30% of applicants previously rejected by traditional scoring models, and that these newly approved customers showed low actual default risk. This supports our core assumption: many of the rejected applicants described in this case are not genuinely high risk. They are simply invisible to a system that only reads bureau files.

---

## Solution Concept (35% of the score, the largest share)

**Community impact.** We focus on financial inclusion. The 64.5% of applicants without a bureau file are not inherently risky. They are invisible to a system that was never built to see them. Giving them a fair, explainable path into formal credit is the long-term story of this solution.

### Architecture, Path 1: Gig Workers and Online Merchants (~29.5% of applications)

These customers receive money regularly from a platform, such as a delivery app or an e-commerce marketplace.

- **Input:** history of platform payouts — how often they are paid, how stable the amount is, whether there have been penalties or account issues.
- **Logic:** a scorecard model produces two numbers: a **risk score** (likelihood of repayment) and a **confidence score** (how much data actually supports that risk score).
- **Output:** a specific loan limit when both scores are favorable — e.g. a score of 75/100 → limit of 5,000,000 VND.
- **Business action:** the bank opens a pass-through account. When the platform pays the customer, the installment is deducted automatically before the rest is sent to the customer — matching the proven revenue-based financing model above.

### Architecture, Path 2: Salaried Customers Without Credit History and First-Time Borrowers (~35% of applications)

For these customers, money cannot be intercepted the same way — salary may go to a different bank, or they have almost no financial history at all.

- **Input:** salary transfer history if available, e-wallet activity, or on-time utility bill payments for completely new customers.
- **Logic:** the same scorecard model runs, but when very little data is available, the confidence score is automatically lowered, capping the maximum loan amount regardless of how high the risk score appears.
- **Output:** salaried customers get a limit based on income pattern; first-time borrowers get only the smallest loan size in this product, 1,600,000 VND.
- **Business action:** salaried customers repay with a fixed monthly installment. First-time borrowers who repay on time see their limit grow gradually (a **credit ladder**), and their on-time payments are reported to CIC — this small loan helps build their first-ever credit history.

### A Third Decision Zone, Added to Handle Uncertainty Honestly

Not every case should be decided by the model alone. Three outcomes, based on both scores together:
- High confidence + low risk → automatic approval.
- High confidence + high risk → automatic decline, with a clear reason.
- **Low confidence, regardless of risk score → routed to a credit officer for manual review.** This zone mainly captures first-time borrowers, where the model doesn't yet have enough data to decide safely on its own.

### A Known Limitation, Stated Honestly

Any model trained only on previously approved customers risks learning a biased picture, since the bank has no repayment data for people it has always rejected — the industry calls this **reject inference**. Recent 2026 research shows statistical methods for guessing rejected-applicant outcomes often fail to truly improve a model. A more reliable alternative, supported by the same research, is **controlled exploration**: deliberately approving a small, capped share of borderline first-time applicants to observe real repayment outcomes. We recommend HLBVN adopt this at a small scale — e.g. 2–5% of thin-file applicants, micro-loan size only. This feeds real data back into the model over time and turns the credit ladder into a genuine learning loop, not only a customer-facing feature.

### Key Metrics, Measured Against This Specific Bottleneck

Only metrics that directly measure the problem identified — not broad market statistics unrelated to this specific intervention.

| Metric | Current Situation | Target With PayFlow Line |
|---|---|---|
| Decision time | 1.8–4.6 business days | Under 1 minute, for customers with available income data |
| Processing cost per application | 380,000 VND | **[Assumption]** ~50,000 VND for automated decisions in Path 1/2; somewhat higher for first-time customers needing identity verification + manual review |
| Profitability of a small loan (1,600,000 VND, 3-month term) | Loss of ~300,000 VND (manual cost exceeds interest earned) | **[Assumption]** Profit of ~30,000 VND once processing cost drops near automated infrastructure cost |
| Approval rate for underserved segments | Low, despite real repayment ability | **[Assumption]** Meaningfully higher, consistent with the 15–30% uplift observed in comparable alternative-data lending research |

### Assumptions, Stated Clearly

- The case does not disclose the exact document-submission channel used today (branch visit, dedicated app, merchant counter, or email). We don't assume a specific channel — we treat the case's own language ("redirected into a separate process") as sufficient evidence that the current flow interrupts the purchase journey. Our solution removes this interruption entirely, regardless of the actual channel.
- The five-step cost breakdown above is our own estimate, built to match the case's two given totals — validate against a real step-level breakdown from HLBVN if one exists.
- We assume an indicative consumer loan interest rate of ~20%/year, over a 3-month term, within the case's loan tenure range (3–24 months).
- We assume HLBVN can establish data-sharing partnerships with e-wallets, delivery platforms, and e-commerce marketplaces, with explicit customer consent, in line with Vietnam's current data protection requirements.
- We assume platform payouts to gig workers/merchants occur on a predictable cycle (weekly/biweekly), which the pass-through account design relies on.
- For first-time borrowers with no data at all, we assume the bank starts with the smallest loan size in this product (1,600,000 VND) as a safe starting point before credit-ladder growth.
- We assume a small, capped exploration budget is an acceptable business cost for HLBVN to generate real repayment data on first-time borrowers over time.

---

## Data and Assumptions (10% of the score)

Covered inside Solution Concept above, through the input fields defined for each path and the assumptions listed — no separate space dedicated to it, since the case materials group this criterion into the same assessment detail as Solution Concept.

---

## Visualization (5% of the score)

Clear two-column layout. One side: the problem + five-step cost breakdown. Other side: Path 1/Path 2 architecture diagram + three-zone decision logic. Metrics table and assumptions below, in smaller text. Primary information (root-cause statement, the two paths) in the largest type size; supporting detail (five-step table, assumptions, citations) visually secondary. Format: 1920×1080, one page, PDF, Noto Sans.

---

## Closing Statement

Instead of asking, "Can we predict if this customer will repay?", we ask a different question: "Can we design the repayment itself so that non-payment becomes unlikely from the start?" By turning a customer's own future income into their collateral, removing the redirection that currently interrupts the purchase journey, and routing only genuinely uncertain cases to a human reviewer, PayFlow Line replaces slow manual judgment with fast, explainable automation. It gives nearly two out of three underserved applicants a real, fair path into Vietnam's formal credit system, using proven methods already validated in other markets rather than experimental technology, and feasible to launch within 6 to 12 months.

---

## ⚠️ Discrepancies vs. [[final-solution]] (Vietnamese working doc) — resolve before merging

Flagging these so nothing silently diverges between the two documents:

1. **Automated cost per decision:** this draft says ~50,000 VND; `final-solution.md` §6 says 15,000 VND (→ total 53,000 incl. exception lane). Pick one number and use it everywhere.
2. **Interest rate assumption:** this draft says ~20%/year; `final-solution.md` §2/§6 says 24%/year. Different assumption → different break-even math. Reconcile.
3. **New sources not yet in any sources list:** "Invisible Primes: Fintech Lending with Alternative Data" (Management Science) and the Stripe Capital revenue-based-financing reference — not in `final-solution.md`'s Nguồn section or `solution-usp-research.md`'s Sources. Add them with real links before citing in the submission (APA 7 requires a real reference, not just a name-drop).
4. **New concrete structure:** explicit risk-score/confidence-score pairing and the 3-zone decision logic (auto-approve / auto-decline / human review) is more precise than `final-solution.md` §4.2's looser "đủ hạn mức → duyệt; thiếu chút → đề nghị; khả nghi → chuyển người." This version is better for the infographic — consider back-porting it into the Vietnamese doc so the two stay consistent.
5. **This file is English and pitch-ready (submission requirement); `final-solution.md` stays the Vietnamese working/ops doc** with more internal detail (roadmap, rubric cross-reference table, risk table). Keep both, but treat this file as the one source of truth for what actually goes on the infographic.
