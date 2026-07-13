import Link from 'next/link';
import { LegalPage } from '@/components/legal/LegalPage';

export default function ContentPolicyPage() {
    return (
        <LegalPage title="콘텐츠 운영정책">
            <p>진주에 게시되는 모든 콘텐츠는 익명 이용자의 경험과 의견이며, 서비스는 그 사실 여부를 검증하지 않습니다.</p>

            <h2>1. 검토 절차</h2>
            <p>
                모든 글은 AI와 로컬 안전 엔진을 거쳐 개인정보와 위험 표현이 정리됩니다. 위험도가 &apos;위험&apos; 또는 &apos;긴급&apos;으로 분류되거나
                &apos;공개 검토 신청&apos;을 선택한 글은 자동으로 공개되지 않고 운영팀의 검토를 거친 뒤에만 다른 사람에게 노출됩니다.
            </p>

            <h2>2. 운영팀의 조치</h2>
            <ul className="list-disc pl-5">
                <li>승인: 검토를 통과해 정상적으로 노출됩니다.</li>
                <li>거부: 정책을 위반해 노출되지 않습니다.</li>
                <li>숨김: 노출을 일시적으로 중단합니다.</li>
                <li>차단: 반복적인 위반 등으로 노출을 제한합니다.</li>
            </ul>

            <h2>3. 신원 정보 처리</h2>
            <p>운영팀은 게시자의 IP나 기기 정보를 확인할 수 없습니다. 검토는 오직 정리된 텍스트와 위험도 정보만으로 이루어집니다.</p>

            <h2>4. 권리침해 신고</h2>
            <p>
                본인이나 타인의 권리를 침해하는 콘텐츠를 발견한 경우{' '}
                <Link href="/legal/rights-report" className="underline decoration-border underline-offset-4">
                    권리침해 신고
                </Link>
                를 통해 알려주세요. 검토 후 필요한 조치를 취합니다.
            </p>

            <h2>5. 반복 위반 시 조치</h2>
            <p>동일한 이용자로 추정되는 위반이 반복될 경우 관련 콘텐츠 노출을 제한하거나 서비스 이용을 제한할 수 있습니다.</p>
        </LegalPage>
    );
}
