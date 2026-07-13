import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = { title: '서비스 이용약관', alternates: { canonical: '/terms' } };

export default function TermsPage() {
    return (
        <LegalPage eyebrow="Legal" title="서비스 이용약관" updated="2026년 7월">
            <section>
                <h2>제1조 (목적)</h2>
                <p>이 약관은 Travelog(이하 &quot;서비스&quot;)가 제공하는 여행 포스터 아카이브 열람 및 디지털 이미지 판매 서비스의 이용조건과 절차, 이용자와 서비스 운영자의 권리·의무를 규정함을 목적으로 합니다.</p>
            </section>

            <section>
                <h2>제2조 (서비스의 내용)</h2>
                <p>서비스는 취재를 기반으로 제작한 펜화·수채화 여행 포스터 이미지를 열람, 검색, 필터링할 수 있는 아카이브를 제공하며, 이용자는 개별 포스터의 고해상도 디지털 이미지를 유상으로 구매할 수 있습니다.</p>
            </section>

            <section>
                <h2>제3조 (결제)</h2>
                <p>모든 결제는 Toss Payments를 통해 원화(KRW)로 처리되며, 결제 금액은 서버에서 상품 가격 데이터베이스를 기준으로 산정됩니다. 결제 승인은 Toss Payments의 결제 승인 API를 통해 서버에서 최종 검증한 이후에만 유효합니다.</p>
            </section>

            <section>
                <h2>제4조 (다운로드 및 이용권한)</h2>
                <p>
                    구매한 이미지의 다운로드 및 이용 범위는{' '}
                    <Link href="/license" className="underline decoration-line underline-offset-4">
                        라이선스 페이지
                    </Link>
                    에 따릅니다.
                </p>
            </section>

            <section>
                <h2>제5조 (면책)</h2>
                <p>서비스는 천재지변, 결제대행사 장애 등 서비스 운영자의 귀책사유가 없는 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.</p>
            </section>

            <section>
                <h2>제6조 (문의)</h2>
                <p>서비스 이용과 관련한 문의는 관리자 이메일로 접수해 주세요.</p>
            </section>
        </LegalPage>
    );
}
