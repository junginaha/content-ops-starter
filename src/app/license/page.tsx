import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = { title: '라이선스', alternates: { canonical: '/license' } };

export default function LicensePage() {
    return (
        <LegalPage eyebrow="Legal" title="이용조건 (라이선스)" updated="2026년 7월">
            <section>
                <h2>1. 구매 시 제공되는 것</h2>
                <p>Travelog에서 990원에 구매한 디지털 이미지는 판매 시점에 게시된 해당 포스터의 고해상도 원본 파일 1건에 대한 개인 이용 권한입니다. 파일 자체의 저작권은 Travelog에 있으며, 구매자에게는 아래 범위의 이용 권한만 부여됩니다.</p>
            </section>

            <section>
                <h2>2. 허용되는 이용</h2>
                <ul>
                    <li>개인 소장 및 개인 컴퓨터·모바일 기기 배경화면 사용</li>
                    <li>비상업적 목적의 개인 인쇄 (가정 내 액자, 개인 앨범 등)</li>
                    <li>구매자 본인만을 위한 사적 열람 및 백업</li>
                </ul>
            </section>

            <section>
                <h2>3. 허용되지 않는 이용</h2>
                <ul>
                    <li>이미지의 재판매, 재배포 또는 유상·무상 양도</li>
                    <li>공유 링크, 클라우드 공개 폴더 등을 통한 제3자 공개</li>
                    <li>엽서, 포스터, 굿즈 등 상품 제작 및 판매</li>
                    <li>광고, 브랜딩, 상업적 인쇄물 등 상업적 이용 전반</li>
                    <li>파일에 포함된 워터마크·출처 표기 제거 또는 변형</li>
                </ul>
            </section>

            <section>
                <h2>4. 다운로드 정책</h2>
                <p>구매 확인 후 발급되는 다운로드 링크는 발급 시점으로부터 10분간 유효하며, 구매 1건당 최대 5회까지 다시 다운로드할 수 있습니다. 링크가 만료된 경우 구매 내역 페이지에서 새 링크를 다시 발급받을 수 있습니다.</p>
            </section>

            <section>
                <h2>5. 환불</h2>
                <p>디지털 콘텐츠의 특성상 다운로드가 완료된 이후에는 원칙적으로 환불이 제한됩니다. 결제 오류 등 정당한 사유가 있는 경우 관리자에게 문의해 주세요.</p>
            </section>
        </LegalPage>
    );
}
