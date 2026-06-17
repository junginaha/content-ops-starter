---
title: 생각하는 사람들
slug: thinkers
sections:
  - title:
      text: 생각하는 사람들
      color: text-dark
      styles:
        self:
          textAlign: center
      type: TitleBlock
    subtitle: 함께 더 나은 세상을 만들어 갈 사람들을 찾습니다
    text: >
      우리는 끊임없이 질문하고, 깊이 탐구하며, 담대하게 행동하는 사람들과 함께합니다.
      당신도 세상을 바꾸는 생각의 여정에 함께하세요.
    actions:
      - label: 지금 합류하기
        url: /careers
        icon: arrowRight
        iconPosition: right
        style: primary
        type: Button
    colors: bg-dark-fg-light
    styles:
      self:
        padding:
          - pt-40
          - pl-4
          - pb-40
          - pr-4
        alignItems: center
        flexDirection: col
        justifyContent: center
      text:
        textAlign: center
      subtitle:
        textAlign: center
    type: GenericSection
    backgroundImage:
      type: BackgroundImage
      altText: abstract background
      backgroundSize: cover
      backgroundPosition: center
      backgroundRepeat: no-repeat
      opacity: 100
      url: /images/abstract-background.svg
  - title:
      text: 우리 팀의 생각하는 사람들
      color: text-dark
      styles:
        self:
          textAlign: center
      type: TitleBlock
    subtitle: 다양한 배경과 관점을 가진 사람들이 모여 함께 성장합니다
    people:
      - content/data/thinker1.json
      - content/data/thinker2.json
      - content/data/thinker3.json
    variant: three-col-grid
    colors: bg-light-fg-dark
    styles:
      self:
        padding:
          - pt-16
          - pl-16
          - pb-16
          - pr-16
        justifyContent: center
      subtitle:
        textAlign: center
    type: FeaturedPeopleSection
  - title:
      text: 생각하는 사람을 위한 자리
      color: text-dark
      styles:
        self:
          textAlign: center
      type: TitleBlock
    subtitle: 지금 열린 포지션
    items:
      - title: 리서처 (Research)
        subtitle: 사고 & 탐구
        text: >-
          세상의 문제를 발견하고, 데이터와 통찰로 해결책을 설계합니다.
          깊은 호기심과 분석적 사고력을 가진 분을 찾습니다.
        colors: bg-neutral-fg-dark
        styles:
          self:
            padding:
              - pt-8
              - pl-8
              - pb-8
              - pr-8
            textAlign: left
            borderRadius: x-large
            flexDirection: row
            justifyContent: center
        type: FeaturedItem
      - title: 철학자 & 전략가 (Strategist)
        subtitle: 전략 & 비전
        text: >-
          장기적 관점에서 방향을 설정하고, 팀이 옳은 문제를 풀도록 이끕니다.
          '왜'를 묻고 '어떻게'를 설계하는 분을 기다립니다.
        colors: bg-neutral-fg-dark
        styles:
          self:
            padding:
              - pt-8
              - pl-8
              - pb-8
              - pr-8
            textAlign: left
            borderRadius: x-large
            flexDirection: row
            justifyContent: center
        type: FeaturedItem
      - title: 크리에이티브 디렉터 (Creative Director)
        subtitle: 창의 & 표현
        text: >-
          아이디어를 현실로 구현하고, 보이지 않는 것을 보이게 만듭니다.
          상상력과 실행력을 함께 갖춘 분을 모십니다.
        colors: bg-neutral-fg-dark
        styles:
          self:
            padding:
              - pt-8
              - pl-8
              - pb-8
              - pr-8
            borderRadius: x-large
            flexDirection: row
        type: FeaturedItem
    actions:
      - label: 지원하기
        url: /careers
        icon: arrowRight
        iconPosition: right
        style: primary
        type: Button
    variant: toggle-list
    colors: bg-light-fg-dark
    styles:
      self:
        padding:
          - pb-40
          - pt-16
          - pl-3
          - pr-3
        justifyContent: center
      subtitle:
        textAlign: center
    type: FeaturedItemsSection
seo:
  metaTitle: 생각하는 사람들 - Thinkers
  metaDescription: 끊임없이 질문하고 탐구하는 생각하는 사람들과 함께하세요.
  socialImage: /images/main-hero.jpg
  type: Seo
type: PageLayout
---
