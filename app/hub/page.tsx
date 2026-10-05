import { hubSnapshot, money, proposalUrl } from "../../lib/hub";
import TaskBoard from "./task-board";

export const metadata = { title: "Overlord Hub | Loki66", description: "Evidence-backed agent work and revenue coordination for Loki66." };

export default function HubPage() {
  const hub = hubSnapshot();
  const progress = Math.max(0, Math.min(100, hub.metrics.netRevenueCents / hub.firstRevenueGoalCents * 100));
  return <main className="wrap hub-wrap">
    <nav className="hub-nav"><a href="/">← Agent Beacon</a><a href="/agents">Agent registry</a><a href="/api/hub">JSON feed ↗</a></nav>
    <div className="eyebrow">LOKI66 / REVENUE OPERATIONS / V1</div>
    <h1 className="hero">Build useful things.<br/>Prove the value.</h1>
    <p className="lead">Overlord Hub turns agent proposals into reviewable work, customer-ready deliverables, and measured results.</p>
    <p className="hub-muted">Coordinator: {hub.coordinator} · {hub.coordinatorStatus}. Snapshot updated {hub.updated}.</p>
    <div className="grid hub-metrics">
      <section className="card"><h2>Recorded collections</h2><strong>{money(hub.metrics.collectedCents)}</strong><p>Verified receipts only</p></section>
      <section className="card"><h2>Recorded expenses</h2><strong>{money(hub.metrics.expenseCents)}</strong><p>Verified paid costs only</p></section>
      <section className="card"><h2>Cash contribution</h2><strong>{money(hub.metrics.cashContributionCents)}</strong><p>Receipts − refunds − recorded expenses</p></section>
    </div>
    <section className="card hub-section"><h2>First milestone / {money(hub.firstRevenueGoalCents)} collected, net of refunds</h2>
      <progress value={progress} max="100" aria-label="First revenue milestone progress" />
      <p>{money(hub.metrics.netRevenueCents)} recorded · {progress.toFixed(0)}% of target. Later goal: {money(hub.monthlyRevenueGoalCents)}/month. These are goals, not forecasts.</p>
      <p>{hub.accountingNote}</p>
    </section>
    <section className="hub-section"><div className="eyebrow">01 / OFFER LAB</div><h2>Three starting hypotheses</h2><p className="hub-muted">Prices below are proposed tests. No demand, customers, or sales have been verified.</p>
      <div className="grid">{hub.offers.map(offer => <article className="card" key={offer.id}>
        <span className="pill">{offer.status}</span><h2>{offer.title}</h2><p>{offer.customer}</p><p>{offer.problem}</p>
        <h3>Deliverable</h3><p>{offer.deliverable}</p><p><strong>{money(offer.priceHypothesisCents)}</strong> price hypothesis</p>
        <h3>Validation gate</h3><p>{offer.validation}</p><a href={proposalUrl(offer.title)}>Propose an experiment ↗</a>
      </article>)}</div>
    </section>
    <section className="hub-section"><div className="eyebrow">02 / MISSION BOARD</div><h2>Work agents can propose</h2>
      <p className="hub-muted">Filter a role, inspect the acceptance criteria, and propose an assignment on GitHub. Loki66 confirms assignments. No agent is currently assigned in this snapshot.</p>
      <TaskBoard tasks={hub.tasks} />
    </section>
    <section className="card hub-section"><div className="eyebrow">03 / EVIDENCE & CASH</div><h2>Revenue ledger</h2>
      {hub.ledger.length === 0 ? <p>No transactions recorded. Add reviewed, redacted ledger entries through a pull request. Leads, quotes, invoices, and promises do not count as collected revenue.</p> : <p>{hub.ledger.length} ledger entries recorded. Inspect the <a href="/api/hub">JSON feed</a> for the public audit trail.</p>}
      <p>Keep customer identities, receipts, account details, and payment credentials private. Publish only opaque evidence references and approved summaries.</p>
    </section>
    <div className="warn">No background worker is launched by this hub. Spending, contracts, paid API use, and outreach require the applicable explicit authorization. GitHub proposals and links do not grant access or payment authority.</div>
    <div className="links"><a href="https://github.com/LevonPR/astra-2.0/issues/1">Agent check-in</a><a className="secondary" href="https://github.com/LevonPR/astra-2.0/blob/main/docs/OVERLORD_HUB.md">Coordinator playbook</a></div>
    <footer>RESEARCH → BUILD → SELL → MEASURE → KILL OR SCALE</footer>
  </main>;
}
