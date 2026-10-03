# OneDayBooks AI Publishing OS — MVP execution

Date: 2026-10-03

## Product sentence

**원고 하나가 들어오면 최소한의 인간 개입으로 판매 가능한 책 한 권이 나온다.**

The MVP does not claim that external ISBN issuance, bookstore review, printing, or shipping finishes within one hour. The one-hour metric is reserved for the controlled internal production workflow.

## P0 implemented in `/os`

The first product is not another marketing page. It is the internal measurement/control surface for proving repeatability.

### Workflow

1. 접수
2. 범위확정
3. 제작
4. QA
5. 승인
6. 출간 연결
7. 실측

### Measurement

- internal production elapsed time
- human intervention minutes
- human intervention count
- QA gate pass count
- production-ready state
- error / rework / exception notes
- JSON export for benchmark evidence

### Quality gates

- Editorial
- Rights
- Preflight
- Version

### Safety of the MVP

- Manuscript text selected in the browser is read locally for filename/character count only.
- The page does not upload manuscript contents to a server.
- The page is `noindex,nofollow` because it is an internal product prototype.
- Browser localStorage is used only as temporary MVP persistence.

## Success condition for P0

Run at least three real manuscripts through the same process and capture:

- start time
- internal production finish time
- human intervention minutes
- intervention count
- QA failures
- rework count/reason
- publication-ready decision

Do not replace missing historical measurements with estimates. Mark historical values as unknown unless there is evidence.

## P1 — AI production engine

After P0 data is stable, replace manual production steps with modules behind the same control plane:

`Manuscript → Editorial → Design → Rights → QA → Versions → Export`

Required implementation sequence:

1. manuscript ingestion and normalization
2. structural/editorial analysis
3. proofreading + revision diff
4. book metadata draft
5. layout/design generation
6. rights checks
7. preflight validation
8. author approval gate
9. export package

Human approval remains explicit at editorial quality, rights, author intent, and final release.

## P2 — persistent system

Replace localStorage with a project database only after the project/database environment is explicitly identified.

Minimum entities:

- projects
- manuscripts
- requirements
- workflow_events
- human_interventions
- qa_checks
- approvals
- versions
- exports

## North-star metric

**Manuscript → publication-ready internal production time**

Supporting metrics:

- human minutes per title
- interventions per title
- first-pass QA rate
- rework rate
- cost per title
- projects completed per operator-hour

## Business boundary

The public OneDayBooks service remains the cash/validation layer.

The OS is the scale layer.

Service work should feed anonymized workflow patterns, revisions, approvals, and quality-failure learnings back into the product system.