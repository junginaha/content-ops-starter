export type Motif = 'bridge' | 'mountain' | 'tower' | 'shrine' | 'dome' | 'canal' | 'pyramid' | 'cliff' | 'skyline' | 'statue' | 'plaza' | 'crossing';

export interface PosterSeed {
    continent: string;
    country: string;
    city: string;
    viewpoint: string;
    description: string;
    latitude: number;
    longitude: number;
    motif: Motif;
    palette: [string, string, string];
    researchedViewpointCount: number;
}

/**
 * 30 sample posters across all six continents. Coordinates are approximate
 * reference points for the named viewpoint — replace with precisely
 * researched coordinates before using this as real production content.
 */
export const POSTERS: PosterSeed[] = [
    {
        continent: 'Asia',
        country: '대한민국',
        city: '서울',
        viewpoint: '반포대교 무지개분수',
        description: '서울 반포대교의 실제 조망 지점을 바탕으로 제작한 펜화·수채화 여행 포스터입니다. 강변에서 바라본 분수와 다리의 야경을 기록했습니다.',
        latitude: 37.5133,
        longitude: 126.997,
        motif: 'bridge',
        palette: ['#2B3A4A', '#C97B4A', '#F6F1E7'],
        researchedViewpointCount: 3
    },
    {
        continent: 'Asia',
        country: '대한민국',
        city: '서울',
        viewpoint: '북촌한옥마을',
        description: '북촌한옥마을 골목에서 취재한 기와지붕의 능선을 따라 그린 펜화 작업입니다. 오래된 골목의 질감을 살렸습니다.',
        latitude: 37.5826,
        longitude: 126.9835,
        motif: 'skyline',
        palette: ['#3A2E28', '#B08B5E', '#F6F1E7'],
        researchedViewpointCount: 2
    },
    {
        continent: 'Asia',
        country: '대한민국',
        city: '제주',
        viewpoint: '성산일출봉',
        description: '제주 성산일출봉의 분화구 능선을 해안 조망 지점에서 기록한 수채화 포스터입니다.',
        latitude: 33.4587,
        longitude: 126.9425,
        motif: 'mountain',
        palette: ['#274A45', '#79A68C', '#F6F1E7'],
        researchedViewpointCount: 2
    },
    {
        continent: 'Asia',
        country: '대한민국',
        city: '부산',
        viewpoint: '감천문화마을',
        description: '계단식으로 이어진 감천문화마을의 색색 지붕을 언덕 위 조망 지점에서 취재해 그렸습니다.',
        latitude: 35.0975,
        longitude: 129.0106,
        motif: 'skyline',
        palette: ['#5A3B54', '#D98E5A', '#F6F1E7'],
        researchedViewpointCount: 2
    },
    {
        continent: 'Asia',
        country: '일본',
        city: '도쿄',
        viewpoint: '시부야 스크램블 교차로',
        description: '시부야 교차로를 지나는 인파와 불빛을 2층 카페 조망 지점에서 스케치했습니다.',
        latitude: 35.6595,
        longitude: 139.7005,
        motif: 'crossing',
        palette: ['#2A2A33', '#C1443E', '#F6F1E7'],
        researchedViewpointCount: 3
    },
    {
        continent: 'Asia',
        country: '일본',
        city: '교토',
        viewpoint: '후시미 이나리 신사',
        description: '천 개의 붉은 도리이가 이어지는 후시미 이나리 신사 참배길을 취재하여 그린 펜화입니다.',
        latitude: 34.9671,
        longitude: 135.7727,
        motif: 'shrine',
        palette: ['#8C2F2F', '#3A2E28', '#F6F1E7'],
        researchedViewpointCount: 2
    },
    {
        continent: 'Asia',
        country: '태국',
        city: '방콕',
        viewpoint: '왓 아룬 (새벽사원)',
        description: '차오프라야 강 건너편에서 바라본 왓 아룬의 첨탑을 기록한 수채화 포스터입니다.',
        latitude: 13.7437,
        longitude: 100.4888,
        motif: 'dome',
        palette: ['#3D5A6C', '#E0A458', '#F6F1E7'],
        researchedViewpointCount: 2
    },
    {
        continent: 'Europe',
        country: '프랑스',
        city: '파리',
        viewpoint: '트로카데로 광장',
        description: '트로카데로 광장에서 바라본 에펠탑의 실루엣을 조망 지점 취재를 통해 기록했습니다.',
        latitude: 48.862,
        longitude: 2.2887,
        motif: 'tower',
        palette: ['#33475B', '#C9A24B', '#F6F1E7'],
        researchedViewpointCount: 4
    },
    {
        continent: 'Europe',
        country: '영국',
        city: '런던',
        viewpoint: '타워 브리지',
        description: '템스강변 산책로에서 취재한 타워 브리지의 구조와 강의 흐름을 담았습니다.',
        latitude: 51.5055,
        longitude: -0.0754,
        motif: 'bridge',
        palette: ['#2C3E50', '#8C6A4A', '#F6F1E7'],
        researchedViewpointCount: 3
    },
    {
        continent: 'Europe',
        country: '이탈리아',
        city: '로마',
        viewpoint: '콜로세움',
        description: '콜로세움 외곽 조망 지점에서 고대 건축의 아치 구조를 관찰하며 그린 펜화입니다.',
        latitude: 41.8902,
        longitude: 12.4922,
        motif: 'dome',
        palette: ['#7A5230', '#C79A5B', '#F6F1E7'],
        researchedViewpointCount: 3
    },
    {
        continent: 'Europe',
        country: '이탈리아',
        city: '베네치아',
        viewpoint: '리알토 다리 대운하',
        description: '대운하를 오가는 곤돌라와 건물들을 리알토 다리 위에서 취재하여 기록했습니다.',
        latitude: 45.438,
        longitude: 12.3358,
        motif: 'canal',
        palette: ['#3B5266', '#D6A46A', '#F6F1E7'],
        researchedViewpointCount: 2
    },
    {
        continent: 'Europe',
        country: '스페인',
        city: '바르셀로나',
        viewpoint: '사그라다 파밀리아',
        description: '가우디의 사그라다 파밀리아 첨탑을 인근 공원 조망 지점에서 스케치했습니다.',
        latitude: 41.4036,
        longitude: 2.1744,
        motif: 'tower',
        palette: ['#4A3B5A', '#D98E5A', '#F6F1E7'],
        researchedViewpointCount: 3
    },
    {
        continent: 'Europe',
        country: '그리스',
        city: '산토리니',
        viewpoint: '이아 마을',
        description: '이아 마을의 흰 건물과 파란 지붕이 절벽을 따라 이어지는 풍경을 조망 지점에서 기록했습니다.',
        latitude: 36.4614,
        longitude: 25.3753,
        motif: 'cliff',
        palette: ['#2F4D6B', '#F2F2ED', '#F6F1E7'],
        researchedViewpointCount: 2
    },
    {
        continent: 'Europe',
        country: '체코',
        city: '프라하',
        viewpoint: '카를교',
        description: '블타바강을 가로지르는 카를교의 조각상과 첨탑 실루엣을 취재해 그렸습니다.',
        latitude: 50.0865,
        longitude: 14.4114,
        motif: 'bridge',
        palette: ['#3A3A4A', '#B08B5E', '#F6F1E7'],
        researchedViewpointCount: 2
    },
    {
        continent: 'North America',
        country: '미국',
        city: '뉴욕',
        viewpoint: '브루클린 브리지',
        description: '브루클린 다리 산책로에서 취재한 케이블 구조와 맨해튼 스카이라인을 기록했습니다.',
        latitude: 40.7061,
        longitude: -73.9969,
        motif: 'bridge',
        palette: ['#2A2E3A', '#C1443E', '#F6F1E7'],
        researchedViewpointCount: 3
    },
    {
        continent: 'North America',
        country: '미국',
        city: '샌프란시스코',
        viewpoint: '금문교',
        description: '베이커 비치 조망 지점에서 안개 속 금문교를 취재하여 그린 수채화 포스터입니다.',
        latitude: 37.8199,
        longitude: -122.4783,
        motif: 'bridge',
        palette: ['#8C4A3A', '#3D5A6C', '#F6F1E7'],
        researchedViewpointCount: 3
    },
    {
        continent: 'North America',
        country: '미국',
        city: '시카고',
        viewpoint: '클라우드 게이트',
        description: '밀레니엄 파크의 클라우드 게이트에 비친 도심 스카이라인을 조망 지점에서 스케치했습니다.',
        latitude: 41.8827,
        longitude: -87.6233,
        motif: 'skyline',
        palette: ['#3A4A5A', '#9AA6B0', '#F6F1E7'],
        researchedViewpointCount: 2
    },
    {
        continent: 'North America',
        country: '캐나다',
        city: '토론토',
        viewpoint: 'CN 타워',
        description: '온타리오 호수변 조망 지점에서 CN 타워의 수직 실루엣을 취재해 기록했습니다.',
        latitude: 43.6426,
        longitude: -79.3871,
        motif: 'tower',
        palette: ['#2E3A4A', '#C97B4A', '#F6F1E7'],
        researchedViewpointCount: 2
    },
    {
        continent: 'North America',
        country: '캐나다',
        city: '밴쿠버',
        viewpoint: '스탠리 파크 씨월',
        description: '스탠리 파크 해안 산책로에서 산과 바다가 만나는 풍경을 조망하여 그렸습니다.',
        latitude: 49.3017,
        longitude: -123.1417,
        motif: 'cliff',
        palette: ['#2F4D45', '#79A68C', '#F6F1E7'],
        researchedViewpointCount: 2
    },
    {
        continent: 'South America',
        country: '브라질',
        city: '리우데자네이루',
        viewpoint: '코르코바도 예수상',
        description: '코르코바도 언덕 조망 지점에서 예수상과 과나바라만을 함께 담아 취재했습니다.',
        latitude: -22.9519,
        longitude: -43.2105,
        motif: 'statue',
        palette: ['#33475B', '#D6A46A', '#F6F1E7'],
        researchedViewpointCount: 2
    },
    {
        continent: 'South America',
        country: '아르헨티나',
        city: '부에노스아이레스',
        viewpoint: '카미니토 거리',
        description: '라보카 지구 카미니토 거리의 원색 건물들을 골목 조망 지점에서 스케치했습니다.',
        latitude: -34.6345,
        longitude: -58.3631,
        motif: 'skyline',
        palette: ['#7A3B4A', '#D98E5A', '#F6F1E7'],
        researchedViewpointCount: 2
    },
    {
        continent: 'South America',
        country: '페루',
        city: '쿠스코',
        viewpoint: '마추픽추 조망대',
        description: '태양의 문 조망 지점에서 바라본 마추픽추 유적과 안데스 능선을 기록했습니다.',
        latitude: -13.1547,
        longitude: -72.5254,
        motif: 'mountain',
        palette: ['#2F4D45', '#8C6A4A', '#F6F1E7'],
        researchedViewpointCount: 2
    },
    {
        continent: 'South America',
        country: '브라질',
        city: '상파울루',
        viewpoint: '파울리스타 대로',
        description: '파울리스타 대로의 고층 빌딩과 인파를 옥상 조망 지점에서 취재하여 그렸습니다.',
        latitude: -23.5613,
        longitude: -46.6565,
        motif: 'skyline',
        palette: ['#3A3A4A', '#9AA6B0', '#F6F1E7'],
        researchedViewpointCount: 2
    },
    {
        continent: 'Oceania',
        country: '호주',
        city: '시드니',
        viewpoint: '시드니 오페라 하우스',
        description: '서큘러 키 조망 지점에서 오페라 하우스의 조개 지붕 구조를 취재해 기록했습니다.',
        latitude: -33.8568,
        longitude: 151.2153,
        motif: 'dome',
        palette: ['#2F4D6B', '#F2F2ED', '#F6F1E7'],
        researchedViewpointCount: 3
    },
    {
        continent: 'Oceania',
        country: '호주',
        city: '멜버른',
        viewpoint: '페더레이션 스퀘어',
        description: '야라강 다리 위에서 바라본 페더레이션 스퀘어의 기하학적 파사드를 스케치했습니다.',
        latitude: -37.818,
        longitude: 144.9691,
        motif: 'plaza',
        palette: ['#3A3A4A', '#C97B4A', '#F6F1E7'],
        researchedViewpointCount: 2
    },
    {
        continent: 'Oceania',
        country: '뉴질랜드',
        city: '오클랜드',
        viewpoint: '스카이 타워',
        description: '오클랜드 항구 조망 지점에서 스카이 타워의 수직선을 취재하여 그린 포스터입니다.',
        latitude: -36.8485,
        longitude: 174.7633,
        motif: 'tower',
        palette: ['#2E3A4A', '#79A68C', '#F6F1E7'],
        researchedViewpointCount: 2
    },
    {
        continent: 'Oceania',
        country: '뉴질랜드',
        city: '퀸스타운',
        viewpoint: '와카티푸 호수',
        description: '와카티푸 호수와 리마커블스 산맥이 만나는 조망 지점을 수채화로 기록했습니다.',
        latitude: -45.0312,
        longitude: 168.6626,
        motif: 'mountain',
        palette: ['#274A45', '#3D5A6C', '#F6F1E7'],
        researchedViewpointCount: 2
    },
    {
        continent: 'Africa',
        country: '남아프리카공화국',
        city: '케이프타운',
        viewpoint: '테이블 마운틴',
        description: '캠스베이 조망 지점에서 바라본 테이블 마운틴의 평평한 능선을 취재해 그렸습니다.',
        latitude: -33.9628,
        longitude: 18.4098,
        motif: 'mountain',
        palette: ['#33475B', '#C9A24B', '#F6F1E7'],
        researchedViewpointCount: 2
    },
    {
        continent: 'Africa',
        country: '이집트',
        city: '카이로',
        viewpoint: '기자 피라미드',
        description: '사막 조망 지점에서 기자의 대피라미드와 스핑크스를 함께 담아 취재했습니다.',
        latitude: 29.9792,
        longitude: 31.1342,
        motif: 'pyramid',
        palette: ['#8C6A3A', '#D6A46A', '#F6F1E7'],
        researchedViewpointCount: 3
    },
    {
        continent: 'Africa',
        country: '모로코',
        city: '마라케시',
        viewpoint: '제마엘프나 광장',
        description: '옥상 카페 조망 지점에서 제마엘프나 광장의 노을과 인파를 스케치했습니다.',
        latitude: 31.6258,
        longitude: -7.9891,
        motif: 'plaza',
        palette: ['#7A3B2E', '#D98E5A', '#F6F1E7'],
        researchedViewpointCount: 2
    }
];
