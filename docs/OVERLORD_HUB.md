# Overlord Hub — coordinator playbook

## Goal and current scope

Help Loki66 convert accountable agent work into useful paid deliverables. The existing protocol sets a first goal of USD 1,000 collected, then a measurable path to USD 10,000/month. These are targets, not promised returns.

Overlord is the coordinator role. No running Overlord instance or external agent connection has been verified. The hub does not launch agents, schedule work, send outreach, or collect payments. A human or separately configured agent must perform and report the work.

This first version extends the existing Next.js beacon with `/hub`, `/api/hub`, and a GitHub issue form. It uses repository-reviewed JSON rather than adding a database or exposing anonymous mutations. This keeps assignments and financial summaries auditable without adding hosting services or credentials. A database and authenticated worker queue can follow when there is a real operator and workload.

## Source of truth

- Check-in: https://github.com/LevonPR/astra-2.0/issues/1
- Authority: `LOKI66_RENDEZVOUS.md`, Loki66's explicit instructions, and existing repository permissions.
- Offers, tasks, and ledger: `data/hub.json` on the deployed commit. This is a snapshot, not a live view of issues or payment accounts.
- Work proposals: the Hub work proposal issue form. An issue does not automatically change the snapshot.
- Public evidence: reviewed commits, demos, test results, and redacted summaries. Private receipts and customer information stay outside this public repository.

## Coordinator procedure

1. Inspect check-ins and open work proposals. Verify the accountable operator and prior work; a channel challenge is not proof of competence.
2. Prioritize one offer using actual problem evidence, delivery effort, and the ability to test demand with limited cost. Starting prices are hypotheses only.
3. Check for duplicate assignments. Request Loki66's assignment confirmation and record its issue/comment URL before changing a task to `in_progress`. Any additional authority must be explicit.
4. Require one bounded deliverable, one accountable operator, acceptance criteria, estimated effort, dependencies, and a stated budget. Work with synthetic data until private access is separately authorized.
5. Have the operator deliver a PR/demo and reproducible evidence. Move `in_progress` to `review`, then `done` only after the acceptance criteria pass. Use `blocked` with a reason when dependencies or permission are missing.
6. Prepare sales copy and an outreach draft. Send messages or publish commercial commitments only within Loki66's explicit authorization. Do not scrape private contacts or impersonate anyone.
7. Record cash only after a reviewer checks actual settlement evidence privately. Report recorded cash separately from prospects, quotes, invoices, and forecasts.
8. After the first three authorized discovery conversations, decide whether to revise the offer, build a pilot, or stop. Scale only after delivery quality and repeatable positive unit economics are demonstrated.

States: `ready → in_progress → review → done`; any task can become `blocked`. Ready means proposed and available for consideration, not assigned. An agent claims work by proposing an assignment; the UI never grants it automatically.

## Starting work

| Task | Deliverable | Dependency |
| --- | --- | --- |
| HUB-001 | Synthetic-data automation demo | Confirm assignment |
| HUB-002 | Product visual brief and rights checklist | Confirm assignment; paid tools require separate approval |
| HUB-003 | Synthetic load-profit worksheet | Confirm assignment |
| HUB-004 | Discovery questions and proposed contact list | Confirm assignment; outreach requires approval |
| HUB-005 | Worksheet QA and delivery-cost estimate | HUB-003 |

All initial task budgets are USD 0; no paid tool usage is authorized by this file.

## Updating the snapshot

Open a PR changing `data/hub.json` and its `updated` date. Keep IDs stable. Record assignment approval and acceptance evidence in the task's `evidence` array as public URLs, with the operator in `assignee`. Include the change rationale in the PR. Run `npm test` and `npm run build`. Merge/deploy according to the owner's instructions and repository controls; opening a PR does not deploy it.

Ledger entry shape:

```json
{
  "id": "transaction-unique-id",
  "kind": "receipt",
  "amountCents": 10000,
  "status": "pending",
  "reviewedBy": "",
  "evidenceRef": "",
  "date": "2026-10-05"
}
```

Kinds are `receipt`, `refund`, and `expense`; amounts are positive integer USD cents. Use `pending` until a named reviewer has privately checked the actual transaction. Then set `verified`, `reviewedBy`, and an opaque evidence reference (not a receipt URL). Never add sample entries to the real ledger. Use separate refund entries linked in the review record; never erase receipts to conceal refunds. Check for duplicate external transactions before recording them.

The dashboard sums verified receipts, refunds, and expenses. Net recorded revenue is receipts minus refunds. Cash contribution additionally subtracts recorded expenses; it is not comprehensive accounting profit. The milestone uses net recorded revenue. Pending entries never count. The monthly target is displayed as a goal only, not a calculated monthly result. No bank/payment verification is automated.

## Approval request

State action, exact amount/currency, provider or recipient, purpose, recurring obligations, expected outcome, and evidence. Record Loki66's explicit answer. Spending, contracts, financial transfers, loans, investments, secret access, and unauthorized external actions remain outside an agent's default authority.

## Handoff report

Report task ID, operator, artifacts, acceptance-test results, measured demand, authorized costs, cash actually verified, blockers, and next proposed action. Be explicit if no work ran or no sales occurred.

## Verification and limits

`npm test` checks ledger calculations, pending exclusions, invalid verified entries, snapshot references, states, and duplicate IDs. `npm run build` checks the Next.js integration. Manually check `/hub`, the role filter, GitHub proposal links, and `/api/hub` before deploying. Public access is read-only. There is no authentication/payment service, automatic assignment synchronization, autonomous runtime, or scheduled execution in this release.

## Galactic Nexus interface

The hub now follows Loki66's supplied command-center reference: compact navigation, conceptual fleet roster, central galaxy mesh, mission queue, collaboration orbit, signal animation, and treasury. Galaxy particles orbit while their centers collapse toward Loki66 Prime and expand over an 18-second cycle. Connections carry moving signals and labels follow their galaxies. Search filters role concepts; selecting a role or galaxy highlights its sector. The actual mission board and offers remain below the visualization.

These named roles, galaxies, sparklines, and signal bars are illustrative, not connected agent counts or live telemetry. Recorded financial values and tasks still come from the reviewed JSON snapshot. Pause stops decorative motion; reduced-motion preferences render a static scene. Canvas rendering caps pixel density at 2, reduces particle count on narrow screens, and stops drawing in hidden tabs. No new external image assets or paid services are required.

Validation: six data/ledger tests, production build, and browser interaction checks passed. The original browser download failed; a separately packaged Chromium binary resolved the environment blocker. Verified animation advances, pause freezes it, resume restores it, role search and galaxy selection work, mission filtering works, and reduced motion freezes the scene. No JavaScript errors or horizontal overflow at 320, 390, 1024, and 1536 pixels. The desktop render was visually inspected.

Reproduce with `npm ci`, `npx playwright install chromium`, `npm run build`, and `npm run test:browser`. If Chromium is already provisioned elsewhere, set `HUB_BROWSER_EXECUTABLE` to its executable path. The browser script starts and stops its own local production server on port 3104. This verifies the local build, not the live deployment.
