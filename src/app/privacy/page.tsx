import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = { title: '개인정보처리방침', alternates: { canonical: '/privacy' } };

export default function PrivacyPage() {
    return (
        <LegalPage eyebrow="Legal" title="개인정보처리방침" updated="2026년 7월">
            <section>
                <h2>1. 수집하는 개인정보 항목</h2>
                <p>Travelog는 디지털 이미지 구매 및 다운로드 제공을 위해 다음 정보를 수집할 수 있습니다.</p>
                <ul>
                    <li>결제 처리 과정에서 Toss Payments로부터 전달되는 결제 식별 정보(주문번호, 결제키, 결제수단, 결제금액)</li>
                    <li>관리자 계정의 경우 이메일 주소 (Supabase Authentication을 통한 로그인)</li>
                </ul>
            </section>

            <section>
                <h2>2. 이용 목적</h2>
                <ul>
                    <li>결제 확인 및 구매 내역 관리</li>
                    <li>다운로드 링크 발급 및 다운로드 횟수 관리</li>
                    <li>관리자 인증 및 부정 이용 방지</li>
                </ul>
            </section>

            <section>
                <h2>3. 보유 및 이용 기간</h2>
                <p>결제 및 구매 관련 정보는 전자상거래 등에서의 소비자보호에 관한 법률 등 관련 법령에서 정한 기간 동안 보관하며, 이후 지체 없이 파기합니다.</p>
            </section>

            <section>
                <h2>4. 제3자 제공</h2>
                <p>결제 처리를 위해 Toss Payments에 결제에 필요한 최소한의 정보가 전달되며, 그 외 개인정보는 원칙적으로 제3자에게 제공하지 않습니다.</p>
            </section>

            <section>
                <h2>5. 보안</h2>
                <p>고해상도 원본 이미지는 비공개 저장소에 보관되며, 결제가 서버에서 검증된 이후에만 만료 시간이 설정된 서명 URL을 통해 제공됩니다. 서비스 키 및 결제 비밀 키는 서버 환경에서만 사용되며 브라우저에 노출되지 않습니다.</p>
            </section>
        </LegalPage>
    );
}
