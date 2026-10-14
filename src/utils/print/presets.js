// Lightweight constants shared by the UI (no pdf-lib import, safe for the initial /os bundle).

export const TRIM_PRESETS = [
  { key: '140x210', label: '140×210mm', widthMm: 140, heightMm: 210 },
  { key: '128x188', label: '46판 128×188mm', widthMm: 128, heightMm: 188 },
  { key: '148x210', label: '국판(A5) 148×210mm', widthMm: 148, heightMm: 210 },
  { key: '152x225', label: '신국판 152×225mm', widthMm: 152, heightMm: 225 },
  { key: '176x248', label: '크라운판 176×248mm', widthMm: 176, heightMm: 248 }
];

export const DEFAULT_PRINT_OPTIONS = {
  publisher: '',
  price: '',
  firstEdition: '',
  registration: '',
  contact: '',
  subtitle: '',
  paperCaliperMm: 0.1,
  coverAllowanceMm: 0.5,
  flapMm: 0,
  pageMultiple: 4,
  binding: '무선제본',
  interiorPaper: '',
  coverPaper: ''
};

export const PRINT_HUMAN_GATES = [
  { key: 'printerSpec', label: '인쇄소 사양 확정', note: '용지·제본·책등 폭·PDF 규격(PDF/X 요구 여부)·도련 기준을 인쇄소와 확인' },
  { key: 'proofApproved', label: '교정 최종 승인', note: '저자·편집자가 내지 PDF 전체를 확인' },
  { key: 'coverApproved', label: '표지 디자인 승인', note: '표지 시안·책등·뒤표지 문구 확인' },
  { key: 'colophon', label: '판권 정보 확인', note: '발행일·발행처·ISBN·정가 등 판권 기재 사항' }
];
