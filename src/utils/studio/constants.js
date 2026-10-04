export const SIDEBAR_GROUPS = [
    {
        label: 'Studio',
        items: [
            { label: 'Dashboard', href: '/studio/dashboard', icon: 'grid' },
            { label: 'Projects', href: '/studio/projects', icon: 'folder' }
        ]
    },
    {
        label: 'Library',
        items: [
            { label: 'Books', href: '/studio/books', icon: 'book' },
            { label: 'Questions', href: '/studio/questions', icon: 'question' },
            { label: 'Trends', href: '/studio/trends', icon: 'trend' },
            { label: 'Prompt Library', href: '/studio/prompts', icon: 'prompt' }
        ]
    },
    {
        label: 'Production',
        items: [
            { label: 'Research', href: '/studio/projects', tab: 'research', icon: 'research' },
            { label: 'Scripts', href: '/studio/projects', tab: 'script', icon: 'script' },
            { label: 'Scenes', href: '/studio/projects', tab: 'storyboard', icon: 'scene' },
            { label: 'Images', href: '/studio/projects', tab: 'images', icon: 'image' },
            { label: 'Voice', href: '/studio/projects', tab: 'voice', icon: 'voice' },
            { label: 'Music', href: '/studio/projects', tab: 'music', icon: 'music' },
            { label: 'Thumbnail', href: '/studio/projects', tab: 'thumbnail', icon: 'thumbnail' },
            { label: 'SEO', href: '/studio/projects', tab: 'seo', icon: 'seo' },
            { label: 'Assets', href: '/studio/projects', tab: 'export', icon: 'assets' }
        ]
    },
    {
        label: 'System',
        items: [
            { label: 'Automation', href: '/studio/automation', icon: 'automation' },
            { label: 'Settings', href: '/studio/settings', icon: 'settings' }
        ]
    }
];

export const AUDIENCE_OPTIONS = [
    'Documentary Viewers',
    'Book Lovers',
    'Self-Improvement Seekers',
    'Philosophy & Deep Thinkers',
    'Young Professionals',
    'Book Club Communities'
];

export const RUNTIME_OPTIONS = ['6 min', '8 min', '10 min', '12 min', '15 min'];

export const LANGUAGE_OPTIONS = ['English', 'Korean', 'Bilingual (EN/KR)'];

export const TONE_OPTIONS = ['Contemplative', 'Cinematic', 'Intimate', 'Investigative', 'Hopeful', 'Melancholic'];

export const PROMPT_CATEGORIES = [
    'Question Prompt',
    'Research Prompt',
    'Script Prompt',
    'Scene Prompt',
    'Image Prompt',
    'Voice Prompt',
    'Music Prompt',
    'Thumbnail Prompt',
    'SEO Prompt'
];

export const PROJECT_STATUSES = ['Draft', 'Generating', 'Ready', 'In Edit', 'Published'];

export const TTS_VOICES = ['Alloy', 'Onyx', 'Nova', 'Shimmer', 'Echo', 'Fable'];
export const TTS_EMOTIONS = ['Contemplative', 'Warm', 'Grave', 'Hopeful', 'Measured', 'Intimate'];
export const TTS_PAUSE_STYLES = ['Editorial (long breaths)', 'Documentary (natural)', 'Poetic (dramatic)', 'Conversational'];
