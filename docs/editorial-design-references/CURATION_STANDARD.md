# ooOS 레퍼런스 선별 기준 (Curation Standard)

기준일: 2026-11-18 · 적용 대상: `src/data/designReferences.js`의 큐레이션 세트(`collections`)

## 한 줄 원칙
**눈으로 확인한 아름다운 책만 넣는다.** 평판·수상 경력·검색 결과 요약만으로는 넣지 않는다.

## 통과 조건 (모두 충족)
1. **직접 확인** — 브라우저로 페이지를 열어 **표지와 내지 펼침면 사진을 실제로 보고** 판단한다. 텍스트 요약(WebFetch 등)만 본 항목은 넣지 않는다. 확인하면 `visuallyVerified: true`, `verifiedAt: YYYY-MM-DD`.
2. **장르 일치** — 세트의 장르와 맞는 책이다. `essay-beauty`는 에세이·산문·일기형 비주얼 에세이만. 연구서·도록·학생 과제는 제외.
3. **표지 + 내지** — 표지만 있는 페이지는 제외한다. 펼침면이 최소 2장 이상 보여야 한다.
4. **옮길 원리** — 원데이북스 원고에 바로 옮길 수 있는 원리가 한 줄로 나온다(`borrow`). 예: "2도(먹 + 빨강)만으로 리듬".
5. **중복 없음** — 라이브러리와 이전 보고에 없던 책이다. `scripts/merge-design-references.mjs --dry-run`이 중복 0이어야 한다.
6. **사실만** — 출판사·연도·서체·판형은 페이지에서 확인한 값만 쓴다. 모르면 `CHECK`로 남긴다. 숫자(평가·조회수)는 확인 날짜와 함께.

## 탈락 기준 (하나라도 해당하면 제외)
- 화면으로 봤을 때 평범하거나 조잡한 디자인
- 학생 과제처럼 이미지가 작아 판단이 불가능한 페이지
- 표지 이미지만 있는 서점 상품 페이지(알라딘·교보 등)
- 이미 소개한 책(이전 대화·라이브러리 포함)

## 권리
- 레이아웃·색 관계·그리드 원리만 `ADAPT`. 원본 이미지·본문·표지 파일은 `NO`.
- 서체는 원본이 유료거나 미공개면 `CHECK`, 한글 대체는 Noto Serif/Sans CJK KR(`SUBSTITUTE`). 무료 서체라도 배포처 약관 확인 전에는 `CHECK`.

## 찾는 곳 (우선순위)
1. Behance 검색(인기순): `essays editorial design`, `essay collection book design`, `에세이 북디자인`, `エッセイ 装丁`, `随筆 装幀` — **큐레이션 배지(Featured)** 항목 우선
2. Stiftung Buchkunst 수상작 중 에세이 · AIGA 50 Books · Best Dutch Book Designs · 가장 아름다운 스위스 책
3. 출판사·디자이너 공식 포트폴리오(펼침면 공개 사이트)

## 반영 절차
1. 후보마다 표지·펼침면을 보고 위 조건으로 판정
2. 통과 항목을 JSON 배열로 작성 → `node scripts/merge-design-references.mjs batch.json --dry-run` → `--write`
3. `npm test` 통과 확인
4. `docs/editorial-design-references/YYYY-MM-DD.md`에 기록(책·링크·본 것·옮길 점)
5. 브랜치·PR로 올린다. main 병합은 유니콘님 승인 후.
