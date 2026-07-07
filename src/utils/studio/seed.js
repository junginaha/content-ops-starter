export const SEED_TRENDS = [
    { id: 'trend_ai', name: 'Artificial Intelligence', momentum: 'Rising', description: 'What machines reveal about being human.' },
    { id: 'trend_mental_health', name: 'Mental Health', momentum: 'Steady', description: 'The quiet epidemic of the connected age.' },
    { id: 'trend_loneliness', name: 'Loneliness', momentum: 'Rising', description: 'A crowded world, an empty room.' },
    { id: 'trend_burnout', name: 'Burnout', momentum: 'Rising', description: 'When ambition outruns the self.' },
    { id: 'trend_money', name: 'Money', momentum: 'Steady', description: 'What we trade for a sense of enough.' },
    { id: 'trend_purpose', name: 'Purpose', momentum: 'Steady', description: 'The search that outlives every answer.' },
    { id: 'trend_relationships', name: 'Relationships', momentum: 'Steady', description: 'How we are shaped by who stays.' },
    { id: 'trend_creativity', name: 'Creativity', momentum: 'Rising', description: 'Making things in an age of machines.' },
    { id: 'trend_reading', name: 'Reading', momentum: 'Rising', description: 'Attention as the last luxury.' },
    { id: 'trend_future_society', name: 'Future Society', momentum: 'Rising', description: 'What we are becoming, together.' }
];

export const SEED_BOOKS = [
    {
        id: 'book_1',
        title: 'Man’s Search for Meaning',
        author: 'Viktor E. Frankl',
        question: 'Can meaning survive the worst that life can do to us?',
        theme: 'Suffering & Purpose',
        symbols: 'The camp, the last human freedom, the unfinished manuscript',
        emotion: 'Grave, redemptive',
        visualStyle: 'Muted grey tones, single figures in vast space, natural window light',
        trendMatch: 'Purpose',
        publishingStatus: 'Ready',
        videoStatus: 'Not Started',
        notes: 'Strong open for a purpose-driven documentary.'
    },
    {
        id: 'book_2',
        title: 'Bowling Alone',
        author: 'Robert D. Putnam',
        question: 'Why did we stop showing up for each other?',
        theme: 'Community & Isolation',
        symbols: 'The empty bowling lane, the dinner table, the front porch',
        emotion: 'Elegiac, urgent',
        visualStyle: 'Suburban Americana, dusk light, wide establishing shots',
        trendMatch: 'Loneliness',
        publishingStatus: 'Ready',
        videoStatus: 'Not Started',
        notes: ''
    },
    {
        id: 'book_3',
        title: 'Deep Work',
        author: 'Cal Newport',
        question: 'What happens to a mind that is never left alone?',
        theme: 'Attention & Craft',
        symbols: 'The locked door, the blank page, the closed laptop',
        emotion: 'Focused, calm',
        visualStyle: 'Minimalist interiors, cool blue light, close-up hands at work',
        trendMatch: 'Burnout',
        publishingStatus: 'Draft',
        videoStatus: 'Not Started',
        notes: ''
    },
    {
        id: 'book_4',
        title: 'The Midnight Library',
        author: 'Matt Haig',
        question: 'How many lives are hidden inside the one we chose?',
        theme: 'Regret & Possibility',
        symbols: 'The library between life and death, the infinite shelf, the chessboard',
        emotion: 'Wistful, hopeful',
        visualStyle: 'Dreamlike interiors, warm gold light, soft focus edges',
        trendMatch: 'Purpose',
        publishingStatus: 'Ready',
        videoStatus: 'Scripted',
        notes: 'Pairs well with a New Year release window.'
    },
    {
        id: 'book_5',
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        question: 'What story did we tell ourselves to build civilization?',
        theme: 'Myth & Progress',
        symbols: 'Cave paintings, the wheat field, the trading ship',
        emotion: 'Awe, unease',
        visualStyle: 'Epic wide landscapes, archival texture, golden hour',
        trendMatch: 'Future Society',
        publishingStatus: 'Draft',
        videoStatus: 'Not Started',
        notes: ''
    },
    {
        id: 'book_6',
        title: 'The Artist’s Way',
        author: 'Julia Cameron',
        question: 'What are we afraid to make?',
        theme: 'Creative Fear',
        symbols: 'The blank canvas, morning pages, the locked studio',
        emotion: 'Tender, encouraging',
        visualStyle: 'Natural studio light, textured paper, hands and ink',
        trendMatch: 'Creativity',
        publishingStatus: 'Ready',
        videoStatus: 'Not Started',
        notes: ''
    }
];

export const SEED_QUESTIONS = [
    { id: 'q_1', text: 'Can meaning survive the worst that life can do to us?', trend: 'Purpose', status: 'Explored', bookId: 'book_1' },
    { id: 'q_2', text: 'Why did we stop showing up for each other?', trend: 'Loneliness', status: 'Explored', bookId: 'book_2' },
    { id: 'q_3', text: 'What happens to a mind that is never left alone?', trend: 'Burnout', status: 'In Progress', bookId: 'book_3' },
    { id: 'q_4', text: 'How many lives are hidden inside the one we chose?', trend: 'Purpose', status: 'Explored', bookId: 'book_4' },
    { id: 'q_5', text: 'What story did we tell ourselves to build civilization?', trend: 'Future Society', status: 'New', bookId: 'book_5' },
    { id: 'q_6', text: 'What are we afraid to make?', trend: 'Creativity', status: 'New', bookId: 'book_6' },
    { id: 'q_7', text: 'Can a machine ever be lonely?', trend: 'Artificial Intelligence', status: 'New', bookId: null },
    { id: 'q_8', text: 'What is money actually a substitute for?', trend: 'Money', status: 'New', bookId: null }
];

export const SEED_PROMPTS = [
    {
        id: 'prompt_1',
        category: 'Question Prompt',
        title: 'Surface the human question behind a trend',
        body: 'Given the current trend "{{trend}}", identify the single timeless human question it is really asking. State it in one sentence, under 15 words, written as a question a stranger would stop scrolling for.',
        favorite: true,
        version: 1
    },
    {
        id: 'prompt_2',
        category: 'Research Prompt',
        title: 'Deep research brief for a documentary book',
        body: 'Research "{{book}}" by its author in the context of the question "{{question}}". Return: historical context, biographical context of the author, three key passages, two contrasting scholarly interpretations, and one modern real-world case study.',
        favorite: true,
        version: 2
    },
    {
        id: 'prompt_3',
        category: 'Script Prompt',
        title: '10-minute documentary script generator',
        body: 'Write a {{runtime}} documentary narration script in a {{tone}} tone exploring "{{question}}" through the book "{{book}}", for an audience of {{audience}}. Structure: Opening Hook, Current Trend, Human Question, Historical Context, Book Introduction, Story, Symbols, Meaning, Modern Interpretation, Reflection, Book Club Questions, Ending.',
        favorite: true,
        version: 3
    },
    {
        id: 'prompt_4',
        category: 'Scene Prompt',
        title: '25-scene storyboard breakdown',
        body: 'Break the script into exactly 25 scenes. For each scene provide: purpose, narration excerpt, visual description, camera movement, lighting, transition, subtitle, duration in seconds, and sound design notes.',
        favorite: false,
        version: 1
    },
    {
        id: 'prompt_5',
        category: 'Image Prompt',
        title: 'Cinematic editorial still',
        body: 'Ultra realistic 35mm cinema still, natural light, editorial composition, movie quality, authentic human emotion, no text, no logo, consistent visual identity across the series. Scene: {{scene_description}}',
        favorite: true,
        version: 1
    },
    {
        id: 'prompt_6',
        category: 'Voice Prompt',
        title: 'Documentary narrator direction',
        body: 'Narrate in a {{emotion}} register at {{speed}} speed with {{pause_style}} pausing. Read as a documentary narrator addressing one thoughtful listener, not an audience.',
        favorite: false,
        version: 1
    },
    {
        id: 'prompt_7',
        category: 'Music Prompt',
        title: 'Suno cinematic score prompt',
        body: 'Mood: {{mood}}. Instrumentation: solo piano, low strings, sparse felt piano, distant field recordings. Tempo: {{tempo}} BPM. Structure: intro swell, restrained verse, held bridge, quiet resolve. Runtime: {{runtime}}. No vocals.',
        favorite: true,
        version: 1
    },
    {
        id: 'prompt_8',
        category: 'Thumbnail Prompt',
        title: 'Movie-poster quality thumbnail',
        body: 'Movie poster quality composition, single subject, dramatic natural light, minimal text (3-5 words max), high contrast, editorial color grade, no clutter, no logo.',
        favorite: false,
        version: 1
    },
    {
        id: 'prompt_9',
        category: 'SEO Prompt',
        title: 'Full SEO package generator',
        body: 'Generate 20 optimized YouTube titles, one description (with timestamps), 15 tags, chapter markers, a pinned comment, 10 search keywords, and 8 hashtags for a documentary about "{{question}}" via the book "{{book}}".',
        favorite: true,
        version: 2
    }
];
