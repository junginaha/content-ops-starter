---
title: Home
slug: /
sections:
  - type: GenericSection
    title:
      text: 이 사람 만나도 될까?
      color: text-dark
      type: TitleBlock
    subtitle: 소개팅 전, 5분 안전 점검
    text: >
      대화, 사진, 전화번호, 계좌, 링크 중 받은 정보를 입력하면 AI가 위험 신호를
      점검해드립니다. 폭로가 아닌 나를 위한 사전 점검이며, 분석 결과는 본인만
      확인할 수 있습니다.
    actions:
      - label: 무료로 점검 시작하기
        altText: ''
        url: /
        showIcon: false
        icon: arrowRight
        iconPosition: right
        style: primary
        elementId: ''
        type: Button
      - label: 요금 안내 보기
        altText: ''
        url: /pricing
        showIcon: true
        icon: arrowRight
        iconPosition: right
        style: secondary
        elementId: ''
        type: Link
    media:
      url: /images/main-hero.svg
      altText: 소개팅 전 안전 점검 일러스트
      elementId: ''
      type: ImageBlock
    badge:
      label: 비공개 분석 · 자동 삭제 · 실명 미노출
      color: text-primary
      type: Badge
    elementId: ''
    colors: bg-light-fg-dark
    styles:
      self:
        alignItems: center
        flexDirection: row
        padding:
          - pt-16
          - pl-16
          - pb-16
          - pr-16
  - type: FeaturedItemsSection
    title:
      text: 무엇을 점검하나요?
      color: text-dark
      styles:
        self:
          textAlign: center
      type: TitleBlock
    subtitle: 상대를 특정하지 않고, 받은 정보의 위험 신호만 분석합니다
    items:
      - type: FeaturedItem
        title: 대화
        subtitle: 대화 패턴 분석
        text: >-
          호감 표현 속도, 금전·계좌 언급 시점, 반복되는 정형 문구, 신상 진술
          불일치 등 위험 신호를 분석합니다.
        image:
          url: /images/icon1.svg
          altText: 대화 분석 아이콘
          elementId: ''
          type: ImageBlock
          styles:
            self:
              borderRadius: x-large
        actions: []
        colors: bg-neutralAlt-fg-dark
        styles:
          self:
            padding:
              - pt-8
              - pl-8
              - pb-8
              - pr-8
            borderRadius: x-large
            flexDirection: row
            justifyContent: center
            textAlign: left
      - type: FeaturedItem
        title: 사진
        subtitle: 이미지 신뢰도 분석
        text: >-
          AI 합성·딥페이크 가능성, 메타데이터 이상 여부, 동일 이미지의 중복
          사용 패턴을 익명으로 점검합니다.
        image:
          url: /images/icon2.svg
          altText: 사진 분석 아이콘
          elementId: ''
          type: ImageBlock
          styles:
            self:
              borderRadius: x-large
        actions: []
        colors: bg-neutralAlt-fg-dark
        styles:
          self:
            padding:
              - pt-8
              - pl-8
              - pb-8
              - pr-8
            borderRadius: x-large
            flexDirection: row
            justifyContent: center
            textAlign: left
      - type: FeaturedItem
        title: 전화번호
        subtitle: 번호 형식 분석
        text: >-
          인터넷전화, 안심번호, 해외번호 등 번호의 형식과 유형을 기반으로
          위험 신호를 안내합니다.
        image:
          url: /images/icon3.svg
          altText: 전화번호 분석 아이콘
          elementId: ''
          type: ImageBlock
          styles:
            self:
              borderRadius: x-large
        actions: []
        colors: bg-neutralAlt-fg-dark
        styles:
          self:
            padding:
              - pt-8
              - pl-8
              - pb-8
              - pr-8
            borderRadius: x-large
            flexDirection: row
            justifyContent: center
            textAlign: left
      - type: FeaturedItem
        title: 계좌
        subtitle: 행동 패턴 분석
        text: >-
          계좌 형식의 유효성과, 만남 전에 계좌 정보를 요구하는 행동 자체의
          위험도를 안내합니다.
        image:
          url: /images/abstract-feature1.svg
          altText: 계좌 분석 아이콘
          elementId: ''
          type: ImageBlock
          styles:
            self:
              borderRadius: x-large
        actions: []
        colors: bg-neutralAlt-fg-dark
        styles:
          self:
            padding:
              - pt-8
              - pl-8
              - pb-8
              - pr-8
            borderRadius: x-large
            flexDirection: row
            justifyContent: center
            textAlign: left
      - type: FeaturedItem
        title: 링크
        subtitle: URL 안전성 검사
        text: >-
          공유받은 링크의 피싱·악성코드 여부, 단축 URL의 원본 주소, 도메인
          정보를 확인합니다.
        image:
          url: /images/abstract-feature2.svg
          altText: 링크 분석 아이콘
          elementId: ''
          type: ImageBlock
          styles:
            self:
              borderRadius: x-large
        actions: []
        colors: bg-neutralAlt-fg-dark
        styles:
          self:
            padding:
              - pt-8
              - pl-8
              - pb-8
              - pr-8
            borderRadius: x-large
            flexDirection: row
            justifyContent: center
            textAlign: left
    actions: []
    badge:
      label: 위험 신호 탐지 · 폭로 아님
      color: text-primary
      styles:
        self:
          textAlign: center
      type: Badge
    elementId: ''
    variant: three-col-grid
    colors: bg-neutral-fg-dark
    styles:
      self:
        padding:
          - pb-16
          - pt-16
          - pl-16
          - pr-16
        justifyContent: center
      subtitle:
        textAlign: center
  - type: FeaturedItemsSection
    title:
      text: 어떻게 진행되나요?
      color: text-dark
      styles:
        self:
          textAlign: center
      type: TitleBlock
    subtitle: 5단계로 끝나는 사전 점검
    items:
      - type: FeaturedItem
        tagline: STEP 1
        title: 정보 입력
        text: 대화, 사진, 전화번호, 계좌, 링크 중 받은 정보를 원하는 만큼 입력하세요.
        image:
          url: /images/icon1.svg
          altText: 정보 입력 아이콘
          elementId: ''
          type: ImageBlock
          styles:
            self:
              borderRadius: x-large
        actions: []
        colors: bg-light-fg-dark
        styles:
          self:
            padding:
              - pt-6
              - pl-6
              - pb-6
              - pr-6
            borderRadius: large
            flexDirection: row
            justifyContent: center
            textAlign: left
      - type: FeaturedItem
        tagline: STEP 2
        title: AI 위험 신호 점검
        text: AI가 입력하신 정보의 패턴과 형식을 분석해 위험 신호를 찾아냅니다.
        image:
          url: /images/icon2.svg
          altText: AI 분석 아이콘
          elementId: ''
          type: ImageBlock
          styles:
            self:
              borderRadius: x-large
        actions: []
        colors: bg-light-fg-dark
        styles:
          self:
            padding:
              - pt-6
              - pl-6
              - pb-6
              - pr-6
            borderRadius: large
            flexDirection: row
            justifyContent: center
            textAlign: left
      - type: FeaturedItem
        tagline: STEP 3
        title: 결과 일부 공개
        text: 종합 위험도와 카테고리별 위험 신호 건수를 무료로 확인할 수 있습니다.
        image:
          url: /images/icon3.svg
          altText: 결과 공개 아이콘
          elementId: ''
          type: ImageBlock
          styles:
            self:
              borderRadius: x-large
        actions: []
        colors: bg-light-fg-dark
        styles:
          self:
            padding:
              - pt-6
              - pl-6
              - pb-6
              - pr-6
            borderRadius: large
            flexDirection: row
            justifyContent: center
            textAlign: left
      - type: FeaturedItem
        tagline: STEP 4
        title: 상세 리포트 결제
        text: 더 자세한 분석 근거와 항목별 설명이 필요하면 상세 리포트를 결제해 확인하세요.
        image:
          url: /images/abstract-feature1.svg
          altText: 결제 아이콘
          elementId: ''
          type: ImageBlock
          styles:
            self:
              borderRadius: x-large
        actions: []
        colors: bg-light-fg-dark
        styles:
          self:
            padding:
              - pt-6
              - pl-6
              - pb-6
              - pr-6
            borderRadius: large
            flexDirection: row
            justifyContent: center
            textAlign: left
      - type: FeaturedItem
        tagline: STEP 5
        title: 안전 행동 가이드 제공
        text: 상황별 대처 방법과 다음 행동을 위한 가이드를 제공합니다.
        image:
          url: /images/abstract-feature2.svg
          altText: 행동 가이드 아이콘
          elementId: ''
          type: ImageBlock
          styles:
            self:
              borderRadius: x-large
        actions: []
        colors: bg-light-fg-dark
        styles:
          self:
            padding:
              - pt-6
              - pl-6
              - pb-6
              - pr-6
            borderRadius: large
            flexDirection: row
            justifyContent: center
            textAlign: left
    actions: []
    elementId: ''
    variant: small-list
    colors: bg-light-fg-dark
    styles:
      self:
        padding:
          - pb-16
          - pt-16
          - pl-16
          - pr-16
        justifyContent: center
      subtitle:
        textAlign: center
  - type: GenericSection
    title:
      text: 폭로가 아닌, 나를 위한 점검입니다
      color: text-dark
      styles:
        self:
          textAlign: center
      type: TitleBlock
    subtitle: 안심하고 사용하세요
    text: |-
      - 분석 결과는 본인만 확인할 수 있으며, 상대방의 실명·SNS 계정 등 신상 정보는 어디에도 노출되지 않습니다.
      - 외부 신고 게시판이나 공개 데이터베이스를 조회하지 않고, 입력하신 정보 자체의 패턴과 형식만 분석합니다.
      - 입력한 정보는 분석 후 자동으로 삭제되며, 보관 여부는 직접 선택할 수 있습니다.
      - 모든 분석 결과는 통계적 패턴에 기반한 참고 정보이며, 특정인의 신원이나 범죄 사실을 단정하지 않습니다.
    colors: bg-neutral-fg-dark
    styles:
      self:
        flexDirection: col
        justifyContent: center
        padding:
          - pt-16
          - pl-16
          - pb-16
          - pr-16
      subtitle:
        textAlign: center
      text:
        textAlign: left
  - type: GenericSection
    title:
      text: 지금, 5분만 투자해보세요
      color: text-dark
      styles:
        self:
          textAlign: center
      type: TitleBlock
    subtitle: 종합 위험도는 무료로 확인할 수 있습니다
    actions:
      - label: 무료로 점검 시작하기
        altText: ''
        url: /
        showIcon: false
        icon: arrowRight
        iconPosition: right
        style: primary
        elementId: ''
        type: Button
      - label: 요금 안내 보기
        altText: ''
        url: /pricing
        showIcon: true
        icon: arrowRight
        iconPosition: right
        style: secondary
        elementId: ''
        type: Link
    elementId: ''
    colors: bg-light-fg-dark
    styles:
      self:
        flexDirection: col
        justifyContent: center
        padding:
          - pt-16
          - pl-16
          - pb-16
          - pr-16
      subtitle:
        textAlign: center
seo:
  metaTitle: 이 사람 만나도 될까? - 소개팅 전 안전 점검
  metaDescription: >-
    대화, 사진, 전화번호, 계좌, 링크를 입력하면 AI가 위험 신호를 점검해드립니다.
    분석 결과는 본인만 확인할 수 있으며, 실명 공개나 공개 검색 없이 안전하게
    이용할 수 있습니다.
  socialImage: /images/main-hero.jpg
  type: Seo
type: PageLayout
---
