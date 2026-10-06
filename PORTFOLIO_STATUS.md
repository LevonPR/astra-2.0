# Loki66 Project Portfolio

_Last reviewed: 2026-10-05_

This file is the portfolio source of truth for active projects in the LevonPR GitHub account.

## Priority model

- **P0 — Finish first:** direct operational or strategic value; do not start major new scope before these are stable.
- **P1 — Finish next:** high probability of shipping with bounded remaining work.
- **P2 — Controlled completion:** valuable, but freeze scope and finish the defined slice.
- **P3 — Opportunistic:** finish after higher priorities or use as a short release between larger milestones.
- **Inactive:** no current implementation or superseded.

Completion percentages below measure **release readiness against the explicitly stated target**, not completion of an unlimited long-term vision.

| Priority | Project | Repository / branch | Target | Realistic completion | Decision |
|---|---|---|---|---:|---|
| P0 | DLP TMS | `genesis-game / cursor/dlp-tms-logistics-5a18` | Production-ready internal TMS v1 | **78%** | Finish first |
| P0 | Astra 2.0 / Overlord | `astra-2.0 / main` | Reliable agent rendezvous + coordination hub MVP | **88%** | Finish first |
| P1 | AI Chat Room | `Test / main` | Public-ready web v1 + Android wrapper | **85%** | Finish next |
| P1 | Stellar Haven | `games / cursor/space-colony-game-93e3` | Polished browser game v1 | **72%** | Finish next |
| P2 | MicroEvolution | `Gen / cursor/micro-evolution-unity-134a` | Playable Android Cell Stage v1 | **70%** | Freeze scope, finish |
| P2 | WAAAGH: WARLORD | `games / cursor/waaagh-warlord-vertical-slice-f75b` | Stable polished technical vertical slice | **90%** | Finish slice only |
| P3 | Vibe Raid | `Test / cursor/hf-game-integration-aedc` | Small polished browser release | **80%** | Quick release later |
| P3 | Universal Mobile Studio | `games / cursor/universal-mobile-studio-891e` | Safe private/local studio v1 | **70%** | Narrow scope before continuing |

## Inactive / reserved repositories

| Repository | Status | Rule |
|---|---|---|
| `astra` | Legacy / superseded by `astra-2.0` | Do not restart work here without an explicit repurpose decision |
| `game` | Empty reserved repository | Current game work belongs in indexed project branches under `games` until split into dedicated repos |
| `New-Home` | Empty / unscoped | Must receive a defined v1 target, priority and status baseline before development |

Each inactive repository now has a README explaining its state.

## Important scope distinctions

### Astra 2.0
**88%** refers to the coordination/rendezvous MVP already represented by the repository: discovery endpoints, registry/check-in surfaces, hub UI, tests, workflows, and deployment.  
The much larger idea of a fully autonomous revenue-producing organization is a separate future program and is **not** 88% complete.

### Universal Mobile Studio
**70%** refers to a private/local operator-controlled build studio. A public multi-tenant SaaS that executes arbitrary uploaded code would require substantially more security, isolation, abuse prevention, orchestration, billing, and specialist build infrastructure.

### WAAAGH: WARLORD
**90%** refers to the technical vertical slice. It is not a statement that the project is 90% ready for unrestricted commercial release. Commercialization under Warhammer 40,000 IP would require appropriate rights; otherwise the gameplay/engine should be converted to original IP.

## Required execution order

### P0 — DLP TMS
Remaining focus:
1. production database and backup plan;
2. hardened auth/session handling and role review;
3. audit history for important business changes;
4. document/photo workflow where operationally necessary;
5. deployment, monitoring, and recovery procedure;
6. end-to-end tests for dispatch -> delivery -> invoice -> driver pay;
7. real DLP workflow validation with actual users.

**Exit criteria:** DLP can run a real load lifecycle in production without developer intervention and recover safely from common failures.

### P0 — Astra 2.0 / Overlord
Remaining focus:
1. verify current tests/build in CI on every change;
2. strengthen authentication/authorization around write surfaces;
3. formalize agent mission lifecycle and evidence schema;
4. persistent production storage where data cannot remain file-backed;
5. operational monitoring, error reporting, and backups;
6. connect approved agent workflows without implying autonomous authority over money/contracts;
7. keep the portfolio/status data visible from the hub.

**Exit criteria:** reliable public coordination node with reviewable missions, clear trust boundaries, observability, and repeatable deployment.

### P1 — AI Chat Room
Remaining focus:
1. merge/standardize Android work;
2. authentication before public exposure;
3. rate limits and abuse controls;
4. durable production persistence;
5. provider failure/retry testing;
6. CI and deployment;
7. optional tool-use only after permission/sandbox model is defined.

**Exit criteria:** stable multi-provider web app with protected public deployment and a working Android client.

### P1 — Stellar Haven
Remaining focus:
1. complete playthrough and progression balance;
2. onboarding/tutorial pass;
3. mobile/responsive UX;
4. save corruption/recovery checks;
5. audio/visual polish and content variety;
6. browser performance test;
7. release packaging.

**Exit criteria:** a new player can complete a satisfying browser session without developer instructions or progression blockers.

### P2 — MicroEvolution
Remaining focus:
1. produce and install a real Android APK;
2. device touch/safe-area/performance pass;
3. add automated Unity tests where feasible;
4. art/audio polish for the Cell Stage only;
5. improve biome hazards/objectives;
6. release signing + store assets if publishing;
7. accessibility/basic crash reporting.

**Exit criteria:** Cell Stage v1 runs well on target Android hardware and is packaged reproducibly. Do not expand into later Spore-like stages before this.

### P2 — WAAAGH: WARLORD
Remaining focus:
1. human desktop playtest;
2. phone/tablet touch verification;
3. controller verification;
4. soft-lock/regression pass;
5. balance boss TTK and encounter spacing;
6. finish/replace remaining placeholder faction assets as needed;
7. decide: private/fan technical demo or original-IP conversion.

**Exit criteria:** vertical slice passes real-device playtest and can be demonstrated start-to-finish reliably.

### P3 — Vibe Raid
Remaining focus:
1. basic test coverage;
2. first-run model download UX;
3. offline/error states;
4. scoring/balance pass;
5. deployment and short onboarding.

**Exit criteria:** polished small web release that works predictably for first-time users.

### P3 — Universal Mobile Studio
Remaining focus:
1. explicitly keep v1 private/local;
2. harden job sandbox boundaries;
3. add resource/time limits and cleanup;
4. strengthen test coverage across worker failures;
5. document supported/unsupported host capabilities;
6. stabilize Android + web first;
7. defer public arbitrary-code SaaS, broad iOS/Unity/Godot hosting, billing, and multi-tenant execution until a separate security architecture exists.

**Exit criteria:** one trusted operator can upload a supported project and reproducibly preview/build it without unsafe cross-job leakage.

## Repository organization rules

1. Every active project must have a `PROJECT_STATUS.md` with scope, percentage, blockers, and exit criteria.
2. Branch-only projects must be indexed from the repository's `main` README.
3. Percentages are changed only when release-readiness evidence changes.
4. Feature-complete is not the same as release-ready.
5. New large features are not added to P2/P3 projects until current exit criteria are satisfied.
6. Inactive/reserved repositories are not used until a scoped project is explicitly assigned.
7. The master priority order is P0 -> P1 -> P2 -> P3; new experimental work must not displace P0/P1 completion work.
