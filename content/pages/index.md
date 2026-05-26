---
title: 홈
slug: /
sections:
  - type: GenericSection
    title:
      text: 오프라인 책모임
      color: text-dark
      type: TitleBlock
    subtitle: 함께 읽고, 질문하고, 이야기 나누는 모임
    text: >
      매달 한 권의 책을 함께 읽고 오프라인에서 만나 이야기를 나눕니다.
      좋은 질문이 좋은 대화를 만듭니다. 책 속의 문장에서 시작된 질문이
      서로를 더 깊이 이해하는 시간이 됩니다.
    actions:
      - label: 모임 참여하기
        altText: ''
        url: /
        showIcon: false
        icon: arrowRight
        iconPosition: right
        style: secondary
        elementId: ''
        type: Button
      - label: 후기 보기
        altText: ''
        url: /blog
        showIcon: true
        icon: arrowRight
        iconPosition: right
        style: primary
        elementId: ''
        type: Link
    media:
      url: /images/main-hero.svg
      altText: 오프라인 책모임
      elementId: ''
      type: ImageBlock
    badge:
      label: 질문하는 사람들
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
  - title: Divider
    colors: bg-light-fg-dark
    styles:
      self:
        padding:
          - pt-7
          - pl-7
          - pb-7
          - pr-7
    type: DividerSection
  - posts:
      - content/pages/blog/case-study-1.md
      - content/pages/blog/case-study-2.md
      - content/pages/blog/case-study-3.md
    showThumbnail: true
    showDate: true
    showAuthor: true
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
    type: FeaturedPostsSection
    hoverEffect: move-up
    title:
      text: 아카이빙 후기
      color: text-dark
      styles:
        self:
          textAlign: center
      type: TitleBlock
    subtitle: 지난 모임의 이야기를 기록합니다
    badge:
      label: 아카이브
      color: text-primary
      styles:
        self:
          textAlign: center
      type: Badge
  - title: Divider
    colors: bg-light-fg-dark
    styles:
      self:
        padding:
          - pt-7
          - pl-7
          - pb-7
          - pr-7
    type: DividerSection
  - title:
      text: 질문하기
      color: text-dark
      type: TitleBlock
    subtitle: 모임에 대해 궁금한 점이 있으신가요?
    text: |-
      책모임 참여 방법, 일정, 선정 도서 등 궁금하신 내용을 남겨주세요.
      확인 후 답변 드리겠습니다.
    media:
      fields:
        - name: name
          label: 이름
          hideLabel: true
          placeholder: 이름
          isRequired: true
          width: full
          type: TextFormControl
        - name: email
          label: 이메일
          hideLabel: true
          placeholder: 이메일
          isRequired: true
          width: full
          type: EmailFormControl
        - name: message
          label: 질문
          hideLabel: true
          placeholder: 질문을 남겨주세요
          width: full
          type: TextareaFormControl
      elementId: contact-form
      styles:
        self:
          padding:
            - pt-6
            - pb-6
            - pl-6
            - pr-6
          borderColor: border-dark
          borderStyle: solid
          borderWidth: 1
          borderRadius: large
      type: FormBlock
      submitButton:
        type: SubmitButtonFormControl
        label: 보내기
        showIcon: false
        icon: arrowRight
        iconPosition: right
        style: primary
        elementId: null
    badge:
      label: 질문
      color: text-primary
      type: Badge
    colors: bg-light-fg-dark
    type: GenericSection
seo:
  metaTitle: 질문하는 사람들
  metaDescription: 함께 읽고 질문하며 이야기 나누는 오프라인 책모임
  socialImage: /images/main-hero.jpg
  type: Seo
type: PageLayout
---
