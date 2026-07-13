import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { BRAND_CREDIT, BRAND_NAME, BRAND_SUBTITLE, BRAND_TAGLINE } from '@/lib/constants';

const MODES: Array<{ key: string; label: string; description: string }> = [
    { key: 'confess', label: '털어놓기', description: '마음속에 있던 이야기를 그대로 꺼내 놓아 보세요.' },
    { key: 'ask_opinion', label: '의견 묻기', description: '다른 사람들의 생각이 궁금한 고민을 나눠보세요.' },
    { key: 'anonymous_say', label: '익명으로 말해주기', description: '누군가에게 직접 하지 못한 말을 대신 전해요.' },
    { key: 'propose_to_org', label: '조직에 제안하기', description: '소속된 곳에 개선했으면 하는 점을 제안해요.' }
];

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Container className="flex flex-1 flex-col py-10">
                <div className="mb-10">
                    <p className="text-[15px] font-semibold tracking-tight text-ink">{BRAND_NAME}</p>
                    <p className="text-[13px] text-ink-soft">{BRAND_SUBTITLE}</p>
                </div>

                <h1 className="text-[26px] font-semibold leading-snug tracking-tight text-ink">아무에게도 하지 못한 말을 들려주세요.</h1>

                <div className="mt-4 space-y-1.5 text-[15px] leading-relaxed text-ink-soft">
                    <p>회원가입 없이 시작합니다.</p>
                    <p>공개하기 전 개인정보와 위험한 표현을 확인합니다.</p>
                    <p>최종 전달 여부는 직접 결정합니다.</p>
                </div>

                <div className="mt-10">
                    <p className="mb-3 text-[13px] font-medium text-ink-soft">어떤 이야기인가요?</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {MODES.map((mode) => (
                            <Link
                                key={mode.key}
                                href={`/compose/${mode.key}`}
                                className="group flex flex-col gap-1 rounded-2xl border border-border bg-surface p-4 transition-colors duration-150 hover:border-action"
                            >
                                <span className="text-[15px] font-medium text-ink">{mode.label}</span>
                                <span className="text-[13px] leading-relaxed text-ink-soft">{mode.description}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4 text-[13px] text-ink-soft">
                    <Link href="/inbox/new" className="underline decoration-border underline-offset-4 hover:text-ink">
                        내 의견함 만들기
                    </Link>
                    <Link href="/manage" className="underline decoration-border underline-offset-4 hover:text-ink">
                        내가 쓴 글 관리하기
                    </Link>
                    <Link href="/crisis" className="underline decoration-border underline-offset-4 hover:text-ink">
                        공식 도움기관 확인
                    </Link>
                </div>
            </Container>

            <footer className="border-t border-border">
                <Container className="flex flex-col gap-4 py-8">
                    <p className="text-[14px] text-ink">{BRAND_TAGLINE}</p>
                    <nav className="flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-ink-soft" aria-label="정책 링크">
                        <Link href="/legal/terms" className="hover:text-ink">
                            이용약관
                        </Link>
                        <Link href="/legal/privacy" className="hover:text-ink">
                            개인정보 처리 안내
                        </Link>
                        <Link href="/legal/content-policy" className="hover:text-ink">
                            콘텐츠 운영정책
                        </Link>
                        <Link href="/legal/ai-notice" className="hover:text-ink">
                            AI 이용 안내
                        </Link>
                        <Link href="/legal/rights-report" className="hover:text-ink">
                            권리침해 신고
                        </Link>
                        <Link href="/legal/subscription" className="hover:text-ink">
                            유료 구독 및 환불정책
                        </Link>
                    </nav>
                    <p className="text-[12px] text-ink-soft">by {BRAND_CREDIT}</p>
                </Container>
            </footer>
        </div>
    );
}
