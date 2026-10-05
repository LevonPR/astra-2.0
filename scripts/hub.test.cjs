const { test } = require('node:test');
const assert = require('node:assert/strict');
const { hub, summarizeLedger, proposalUrl } = require('../.hub-test/lib/hub.js');
const entry = (kind, amountCents, extra = {}) => ({ id: 'test', kind, amountCents, status: 'verified', reviewedBy: 'reviewer', evidenceRef: 'private-record-1', date: '2026-10-05', ...extra });

test('empty ledger starts with no reported money', () => {
  assert.deepEqual(summarizeLedger([]), {collectedCents:0, refundedCents:0, expenseCents:0, netRevenueCents:0, cashContributionCents:0});
});
test('receipts, refunds, and expenses remain separate; pending does not count', () => {
  const result = summarizeLedger([entry('receipt', 50000), entry('refund', 5000), entry('expense', 12000), entry('receipt', 999999, {status:'pending',reviewedBy:'',evidenceRef:''})]);
  assert.deepEqual(result, {collectedCents:50000,refundedCents:5000,expenseCents:12000,netRevenueCents:45000,cashContributionCents:33000});
});
test('unsubstantiated or malformed verified amounts fail closed', () => {
  for (const patch of [{amountCents:-1},{amountCents:0},{amountCents:1.1},{amountCents:NaN},{evidenceRef:''},{reviewedBy:' '},{kind:'invoice'}]) {
    assert.throws(() => summarizeLedger([entry('receipt', 100, patch)]));
  }
});
test('losses are preserved rather than clamped to zero', () => {
  assert.equal(summarizeLedger([entry('expense', 123)]).cashContributionCents, -123);
});
test('snapshot IDs, references, states, and evidence are valid', () => {
  for (const collection of [hub.offers, hub.tasks, hub.ledger]) {
    assert.equal(new Set(collection.map(x=>x.id)).size, collection.length);
  }
  for (const task of hub.tasks) {
    assert.ok(hub.offers.some(offer=>offer.id === task.offerId));
    assert.ok(['ready','in_progress','review','done','blocked'].includes(task.status));
    assert.ok(Number.isSafeInteger(task.budgetCents) && task.budgetCents >= 0);
    assert.ok(task.acceptance.length > 0);
    if (['in_progress','review','done'].includes(task.status)) {
      assert.ok(task.assignee && task.evidence.length > 0, 'assigned work requires operator and approval evidence');
    }
  }
  for (const item of hub.ledger) {
    assert.ok(['pending','verified'].includes(item.status));
    assert.ok(['receipt','refund','expense'].includes(item.kind));
    assert.ok(Number.isSafeInteger(item.amountCents) && item.amountCents > 0);
    assert.match(item.date, /^\d{4}-\d{2}-\d{2}$/);
  }
  summarizeLedger(hub.ledger);
});
test('proposal links preserve task identifiers and encode user-facing titles', () => {
  const link = new URL(proposalUrl('A & B / demo', 'HUB-001'));
  assert.equal(link.origin, 'https://github.com');
  assert.equal(link.searchParams.get('template'), 'hub-proposal.yml');
  assert.equal(link.searchParams.get('title'), '[HUB] HUB-001 — A & B / demo');
});
