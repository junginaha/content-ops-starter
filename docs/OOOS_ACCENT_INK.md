# ooOS 포인트 색 (2도 별색)

레퍼런스 라이브러리의 에세이 선별 세트를 실제 조판에 쓰는 첫 기능입니다.

## 옵션
| 포인트 색 | 별색이 들어가는 곳 | 출처 레퍼런스 |
|---|---|---|
| 1도 (먹) — 기본값 | 없음. 기존 출력과 바이트 단위로 같음 | — |
| 쪽번호만 별색 | 쪽번호 | ADC*E Essay Series "Between you and me" |
| 2도 리듬 | 장 번호·장 시작 선·소제목·차례 쪽번호·쪽번호 | Zmysły, zmysły… |

별색: 빨강(Zmysły) · 민트(의도하지 않았지만) · 주황(ADC*E). `/os`의 「에세이 선별」 카드에서 「이 색 쓰기 (Apply)」를 누르면 해당 책의 조합이 바로 적용됩니다.

## 인쇄 방식
- 별색은 PDF Separation 색공간(`ooOS Red` / `ooOS Mint` / `ooOS Orange`, 대체색 DeviceCMYK)으로 씁니다. 인쇄소는 먹 + 별색 1판의 **2도 인쇄**로 찍거나, 4도 인쇄로 변환할 수 있습니다.
- 인쇄 점검의 색상 항목이 `2도(K + 별색)`로 바뀌고, 작업지시서의 내지 도수도 `2도 (K100 + 별색 …)`로 표시됩니다.
- 2도 인쇄는 1도보다 비용이 듭니다. 인쇄소에 별색 지정(팬톤 번호 등)과 단가를 확인한 뒤 확정합니다.
- 색은 레이아웃을 바꾸지 않습니다. 같은 원고는 1도와 2도의 쪽수가 같습니다.

## 코드
- 정의: `src/utils/print/designProfiles.js` (`ACCENT_STYLES`, `ACCENT_COLORS`, `resolveAccent`, `REFERENCE_ACCENT_PRESETS`)
- 조판: `src/utils/print/interiorPdf.js` (항목별 `ink: 'accent'`, 쪽마다 Separation 리소스)
- 점검: `src/utils/print/printPreflight.js` (CMYK 대체색 Separation만 허용, `spotColors` 보고)
- 테스트: `tests/print-package.test.mjs`, `tests/designReferences.test.mjs`
