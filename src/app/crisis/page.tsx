import { TopBar } from '@/components/ui/TopBar';
import { Container } from '@/components/ui/Container';

const RESOURCES = [
    { name: '자살예방상담전화', contact: '109', note: '24시간 운영, 전국 어디서나 무료' },
    { name: '정신건강 위기상담전화', contact: '1577-0199', note: '24시간 정신건강 위기 상담' },
    { name: '여성긴급전화', contact: '1366', note: '가정폭력·성폭력·데이트폭력 등 24시간 상담' },
    { name: '아동학대 신고', contact: '112', note: '경찰청, 24시간 신고 접수' },
    { name: '학교폭력 신고센터', contact: '117', note: '24시간 상담 및 신고' },
    { name: '노동상담', contact: '1350', note: '고용노동부 노동 관련 상담' }
];

export default function CrisisPage() {
    return (
        <div className="min-h-screen">
            <TopBar backHref="/" title="공식 도움기관 확인" />
            <Container className="flex flex-col gap-6 py-6">
                <p className="text-[14px] leading-relaxed text-ink-soft">
                    지금 겪고 있는 어려움은 혼자 감당하지 않아도 괜찮습니다. 아래 기관은 전문적인 도움을 무료로 제공합니다.
                </p>
                <ul className="flex flex-col gap-3">
                    {RESOURCES.map((resource) => (
                        <li key={resource.name} className="rounded-2xl border border-border bg-surface p-4">
                            <p className="text-[15px] font-medium text-ink">{resource.name}</p>
                            <p className="mt-1 text-[20px] font-semibold tracking-tight text-action">{resource.contact}</p>
                            <p className="mt-1 text-[13px] text-ink-soft">{resource.note}</p>
                        </li>
                    ))}
                </ul>
                <p className="text-[12px] leading-relaxed text-ink-soft">
                    이 페이지에서 나눈 내용은 저장되지 않습니다. 위급한 상황이라면 112 또는 119에 즉시 연락해 주세요.
                </p>
            </Container>
        </div>
    );
}
