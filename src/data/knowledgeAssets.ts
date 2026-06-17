import { KnowledgeAssetProduct } from '../types';

export const knowledgeAssetProducts: KnowledgeAssetProduct[] = [
  {
    id: '1',
    title: '나의 질문 리포트',
    description:
      '한 시즌 동안 당신이 남긴 질문과 답변을 정리해 나만의 리포트로 만들어드립니다. AI 초안 작성 후 운영자 검수를 거칩니다.',
    type: 'report',
    priceLabel: '북클럽 참여 시 포함',
    ctaLabel: '샘플 보기',
  },
  {
    id: '2',
    title: '질문으로 만든 나의 책',
    description:
      '내가 한 질문과 생각, 문장들을 엮어 개인 E-Book으로 제작합니다. 공개 여부와 실명/익명은 직접 선택합니다.',
    type: 'ebook',
    priceLabel: '별도 신청',
    ctaLabel: '신청하기',
  },
  {
    id: '3',
    title: '그룹 아카이브북',
    description:
      '한 시즌 함께 읽고 나눈 대화를 한 권의 공동 기록으로 남깁니다. 그룹 동의 후 제작되며, 출판사 검수를 거칩니다.',
    type: 'groupArchive',
    priceLabel: '그룹 단위 제작',
    ctaLabel: '더 알아보기',
  },
];
