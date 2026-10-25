import { hashString, pick } from './id';

const SCRIPT_SECTIONS = [
    'Opening Hook',
    'Current Trend',
    'Human Question',
    'Historical Context',
    'Book Introduction',
    'Story',
    'Symbols',
    'Meaning',
    'Modern Interpretation',
    'Reflection',
    'Book Club Questions',
    'Ending'
];

const CAMERA_MOVES = ['Slow push-in', 'Static wide', 'Handheld drift', 'Slow pan right', 'Overhead drop', 'Rack focus', 'Dolly out', 'Locked close-up'];
const LIGHTING = ['Golden hour window light', 'Cool overcast daylight', 'Single practical lamp', 'Blue hour ambience', 'Hard midday sun', 'Candlelight glow', 'Soft diffused studio light'];
const TRANSITIONS = ['Cut', 'Cross-dissolve', 'Match cut', 'Fade through black', 'Whip pan', 'Hold then cut'];
const SOUND_DESIGN = ['Room tone with distant traffic', 'Page turns and quiet breath', 'Rain against glass', 'Clock ticking, low drone', 'Footsteps on wood floor', 'Silence, then a single note'];

function buildResearch(input, seed) {
    return {
        historicalContext: `When "${input.book}" first entered the world, the question "${input.question}" was already old — but ${input.trend.toLowerCase()} has made it urgent again. This section traces the conditions that produced the book and the conditions that make it matter now.`,
        authorContext: `The author's own life presses against every page of "${input.book}." Understanding what they lived through — and what they refused to look away from — reframes the book from argument to testimony.`,
        keyPassages: [
            `A passage where the book states its central claim about ${input.trend.toLowerCase()} in plain, unguarded language.`,
            `A passage where the author complicates their own claim — the moment of doubt that makes the book trustworthy.`,
            `A passage that reads differently today than it did on publication, given how ${input.trend.toLowerCase()} has evolved.`
        ],
        interpretations: [
            `Reading One: the book as a diagnosis — a clear-eyed account of what "${input.question}" costs us if left unanswered.`,
            `Reading Two: the book as an invitation — less a set of answers, more a permission to keep asking.`
        ],
        caseStudy: `A modern, real-world case that echoes the book's argument almost exactly — evidence that the question never actually went away, it just changed clothes.`
    };
}

function buildOutline(input) {
    return SCRIPT_SECTIONS.map((section, i) => ({
        section,
        summary: outlineSummary(section, input)
    }));
}

function outlineSummary(section, input) {
    const map = {
        'Opening Hook': `Cold open on a single, arresting image that embodies "${input.question}" — no narration for the first beat.`,
        'Current Trend': `Ground the audience in why ${input.trend.toLowerCase()} matters right now, in their lives, this year.`,
        'Human Question': `Name the question directly: "${input.question}" Let it sit, unanswered.`,
        'Historical Context': `Step back — how long humans have been asking some version of this question.`,
        'Book Introduction': `Introduce "${input.book}" not as a text to summarize, but as a piece of evidence in the investigation.`,
        Story: `Walk through the book's central story or argument, scene by scene, letting it breathe.`,
        Symbols: `Isolate the book's recurring symbols and show what they're really standing in for.`,
        Meaning: `Draw the line from symbol to meaning — what the book is actually trying to tell us.`,
        'Modern Interpretation': `Bring the meaning into ${new Date().getFullYear()} — what changes, what doesn't.`,
        Reflection: `Turn the question back to the viewer. No resolution, just an honest mirror.`,
        'Book Club Questions': `Leave the audience with three questions worth discussing over dinner.`,
        Ending: `Close on the same image or idea from the Opening Hook, transformed by everything in between.`
    };
    return map[section];
}

function buildScript(input, outline, seed) {
    const sections = outline.map((o, i) => ({
        heading: o.section,
        content: scriptContent(o.section, input, seed + i)
    }));
    const wordCount = sections.reduce((sum, s) => sum + s.content.split(/\s+/).length, 0);
    return {
        title: `${input.question}`,
        subtitle: `A documentary exploration through "${input.book}"`,
        sections,
        wordCount
    };
}

function scriptContent(section, input, seed) {
    const openers = ['Somewhere between waking and forgetting,', 'There is a question most of us stop asking too early:', 'Before it was a book, it was a feeling.', 'This did not begin as an idea. It began as an ache.'];
    switch (section) {
        case 'Opening Hook':
            return `${pick(openers, seed)} "${input.question}" It is not a new question. But it has never felt more urgent than it does right now.`;
        case 'Current Trend':
            return `${input.trend} is everywhere now — in the way we talk, the way we scroll, the way we go quiet at dinner. Behind the headlines about ${input.trend.toLowerCase()} is something older and simpler. It is a question about what it means to be human, right now, in this particular moment. Strip away the commentary and what is left is surprisingly personal.`;
        case 'Human Question':
            return `So let's say it plainly. ${input.question} Not as a headline. As a question you could ask a friend, late at night, and actually mean it.`;
        case 'Historical Context':
            return `People have been circling this question for as long as there have been people. Philosophers gave it arguments. Poets gave it metaphors. Religions gave it rituals. And still, every generation has to ask it again, in its own language.`;
        case 'Book Introduction':
            return `Which brings us to the book. Not because it settles the question, no book does, but because it takes the question seriously enough to sit with it for hundreds of pages, without flinching. It was not written as an answer. It was written as an act of attention.`;
        case 'Story':
            return `The book does not argue so much as it shows. Page by page, it builds a case out of small, specific, human moments, the kind that are easy to overlook and impossible to forget. There is a version of this story in nearly every life, if you know where to look. What makes it hold up is how little it reaches for drama. The turning point is quiet, almost missable, and that is exactly why it lands. By the final chapter, the argument has been made entirely in scenes, never once in a slogan.`;
        case 'Symbols':
            return `Certain images recur, almost like a refrain. Each one is doing quiet work, carrying weight the plain sentences cannot quite hold. Once you notice the pattern, you cannot unsee it, and that is precisely the point. The symbol is never decoration here. It is the argument, wearing a disguise.`;
        case 'Meaning':
            return `Strip away the story and the symbols, and what is left is a claim about what matters. It is a claim that shapes the way we live, whether we notice it or not. The book is not trying to be clever here. It is trying to be true, which is a much harder thing to pull off.`;
        case 'Modern Interpretation':
            return `Read today, against the backdrop of ${input.trend.toLowerCase()}, the book sounds less like history and more like a warning we did not take seriously the first time. What was once a private observation now reads like a shared diagnosis.`;
        case 'Reflection':
            return `So here is the question again, aimed back at you: ${input.question} Not to answer out loud. Just to notice what your own silence sounds like.`;
        case 'Book Club Questions':
            return `Three questions worth sitting with: What part of this book described your own life without meaning to? Where do you disagree with the author, and why does that disagreement matter? What would change if you actually acted on the answer?`;
        case 'Ending':
            return `We opened on a single image. We return to it now, changed — not because the question has been answered, but because we finally asked it honestly.`;
        default:
            return '';
    }
}

function sceneAllocation() {
    // distribute 25 scenes across the 12 sections, weighted toward Story/Symbols/Meaning
    const weights = [1, 2, 2, 2, 2, 5, 3, 3, 2, 1, 1, 1];
    return SCRIPT_SECTIONS.map((section, i) => ({ section, count: weights[i] }));
}

function buildScenesAndImages(input, script, seed) {
    const allocation = sceneAllocation();
    const scenes = [];
    let sceneNumber = 1;
    allocation.forEach(({ section, count }) => {
        const sectionScript = script.sections.find((s) => s.heading === section);
        const narrationChunks = splitIntoChunks(sectionScript.content, count);
        for (let i = 0; i < count; i++) {
            const localSeed = seed + sceneNumber * 7;
            const visual = visualDescription(input, section, localSeed);
            scenes.push({
                number: sceneNumber,
                purpose: section,
                narration: narrationChunks[i],
                visual,
                camera: pick(CAMERA_MOVES, localSeed, 1),
                lighting: pick(LIGHTING, localSeed, 2),
                transition: pick(TRANSITIONS, localSeed, 3),
                subtitle: narrationChunks[i].length > 90 ? narrationChunks[i].slice(0, 87) + '…' : narrationChunks[i],
                duration: 18 + (localSeed % 6) * 2,
                imagePrompt: imagePrompt(visual),
                sound: pick(SOUND_DESIGN, localSeed, 4)
            });
            sceneNumber++;
        }
    });
    const imagePrompts = scenes.map((s) => ({ sceneNumber: s.number, prompt: s.imagePrompt }));
    return { scenes, imagePrompts };
}

const SENTENCE_SPLIT = /(?<=[.?!]["')’”]?)\s+(?=[A-Z"“])/;
const CLAUSE_SPLIT = /(?<=[,;—])\s+/;

function splitIntoChunks(text, count) {
    let fragments = text.split(SENTENCE_SPLIT).filter(Boolean);
    // not enough natural sentences for the requested scene count: break long
    // sentences into clauses so scenes never repeat identical narration
    let guard = 0;
    while (fragments.length < count && guard < 8) {
        const idx = fragments.findIndex((f) => CLAUSE_SPLIT.test(f));
        if (idx === -1) break;
        const parts = fragments[idx].split(CLAUSE_SPLIT);
        if (parts.length < 2) break;
        fragments.splice(idx, 1, ...parts);
        guard++;
    }
    if (fragments.length >= count) {
        // partition fragments into `count` contiguous, evenly-sized, non-overlapping
        // groups so no two scenes ever end up with the same narration
        const chunks = [];
        const base = Math.floor(fragments.length / count);
        const remainder = fragments.length % count;
        let idx = 0;
        for (let i = 0; i < count; i++) {
            const size = base + (i < remainder ? 1 : 0);
            chunks.push(fragments.slice(idx, idx + size).join(' ').trim());
            idx += size;
        }
        return chunks;
    }
    // still short: cycle through available fragments rather than repeating one
    const chunks = [];
    for (let i = 0; i < count; i++) chunks.push(fragments[i % fragments.length] || text);
    return chunks;
}

function visualDescription(input, section, seed) {
    const subjects = ['a single reader at a worn table', 'an empty chair by a window', 'hands turning a page', 'a city street at dusk', 'a close-up of an open book', 'a figure walking alone', 'light moving across a wall', 'an old photograph on a shelf'];
    const settings = ['a quiet apartment', 'a public library', 'a rain-streaked window', 'a coastal town at dawn', 'a study lined with books', 'an empty train carriage', 'a kitchen table at night'];
    return `${pick(subjects, seed, 0)}, in ${pick(settings, seed, 1)}, evoking ${section.toLowerCase()} within the theme of ${input.trend.toLowerCase()}`;
}

function imagePrompt(visual) {
    return `Ultra realistic 35mm cinema still of ${visual}. Natural light, editorial composition, movie quality, authentic human emotion, shallow depth of field, consistent visual identity. No text. No logo.`;
}

function buildVoice(input, seed) {
    const voices = ['Alloy', 'Onyx', 'Nova', 'Shimmer', 'Echo', 'Fable'];
    const emotions = ['Contemplative', 'Warm', 'Grave', 'Hopeful', 'Measured', 'Intimate'];
    const pauses = ['Editorial (long breaths)', 'Documentary (natural)', 'Poetic (dramatic)', 'Conversational'];
    return {
        voice: pick(voices, seed, 0),
        emotion: input.tone || pick(emotions, seed, 1),
        speed: [0.85, 0.9, 0.95, 1.0][seed % 4],
        pauseStyle: pick(pauses, seed, 2),
        direction: `Narrate in a ${(input.tone || pick(emotions, seed, 1)).toLowerCase()} register, addressing one thoughtful listener rather than an audience. Let silences breathe between sections — this is a documentary, not an advertisement.`
    };
}

function buildMusic(input, seed) {
    const moods = ['Melancholic and searching', 'Quiet and reverent', 'Slow-building and hopeful', 'Sparse and cinematic', 'Warm and reflective'];
    const instrumentation = ['Solo piano, low strings, distant field recordings', 'Felt piano, sparse cello, soft tape hiss', 'Ambient pads, muted brass, room tone', 'Acoustic guitar, string swells, silence'];
    const tempo = 60 + (seed % 5) * 6;
    const mood = pick(moods, seed, 0);
    const inst = pick(instrumentation, seed, 1);
    const structure = 'Intro swell (0:00) → restrained verse (0:30) → held bridge (2:30) → quiet resolve (final 45s)';
    return {
        mood,
        emotion: input.tone,
        instrumentation: inst,
        tempo,
        structure,
        runtime: input.runtime,
        prompt: `Mood: ${mood}. Instrumentation: ${inst}. Tempo: ${tempo} BPM. Structure: ${structure}. Runtime: ${input.runtime}. Genre: cinematic documentary score. No vocals. No percussion loops — organic dynamics only.`
    };
}

function buildThumbnails(input, seed) {
    const headlineTemplates = [
        `${input.question}`,
        `The Question ${input.book.split(' ').slice(0, 2).join(' ')} Never Answered`,
        `What ${input.trend} Is Really Asking`
    ];
    return [0, 1, 2].map((i) => ({
        concept: `Concept ${i + 1}: ${visualDescription(input, 'Meaning', seed + i * 3)}`,
        headline: headlineTemplates[i].length > 55 ? headlineTemplates[i].slice(0, 52) + '…' : headlineTemplates[i],
        imagePrompt: `Movie poster quality composition, single subject, dramatic natural light, minimal text overlay, high contrast editorial grade, ${visualDescription(input, 'Meaning', seed + i * 3)}. No logo, no clutter.`,
        ctrNote: ['Face + negative space for text overlay performs best on mobile.', 'High contrast subject against dark background increases click-through.', 'Avoid more than 4 words of overlay text — legibility drops CTR on small screens.'][i]
    }));
}

function buildSEO(input, seed) {
    const titleTemplates = [
        `${input.question}`,
        `${input.book}: The Question We're Afraid to Ask`,
        `Why ${input.trend} Keeps Bringing Us Back to This Book`,
        `The Documentary ${input.book} Deserves`,
        `What ${input.book} Knew About ${input.trend} Before We Did`,
        `${input.trend}, Explained by a Book You Forgot to Finish`,
        `Inside the Question ${input.book} Never Stops Asking`,
        `A Documentary About ${input.trend} — Told Through One Book`
    ];
    const titles = [];
    for (let i = 0; i < 20; i++) {
        const base = titleTemplates[i % titleTemplates.length];
        titles.push(i < titleTemplates.length ? base : `${base} (Part ${Math.floor(i / titleTemplates.length) + 1})`);
    }
    const chapters = [
        '0:00 Opening Hook',
        '0:45 The Trend',
        '1:40 The Question',
        '2:50 Historical Context',
        '3:50 The Book',
        '5:00 The Story',
        '6:40 Symbols & Meaning',
        '8:00 Modern Interpretation',
        '9:00 Reflection',
        '9:40 Book Club Questions',
        '10:00 Ending'
    ];
    return {
        titles,
        description: `${input.question}\n\nThis documentary explores that question through "${input.book}" by tracing its ideas from the page into ${input.trend.toLowerCase()} today. A quiet, cinematic look at what the book was really trying to tell us.\n\n${chapters.join('\n')}\n\n#${input.trend.replace(/\s+/g, '')} #BookDocumentary #QuestionStudio`,
        tags: [input.trend, input.book, 'documentary', 'book documentary', 'book summary', 'deep dive', input.tone, input.audience, 'philosophy', 'book club', 'reading', 'life lessons', 'cinematic documentary', 'book analysis', 'must read books'],
        chapters,
        pinnedComment: `What part of "${input.book}" hit closest to home for you? Drop your answer below — I read every comment. 📖`,
        keywords: [input.book, input.trend, input.question, `${input.book} summary`, `${input.book} documentary`, `${input.trend} explained`, 'best books', 'book club questions', 'documentary 2026', 'deep book analysis'],
        hashtags: [`#${input.trend.replace(/\s+/g, '')}`, '#BookDocumentary', '#QuestionStudio', '#DeepDive', '#BookTok', '#Philosophy', '#BookClub', '#Reading']
    };
}

function buildExportManifest(input) {
    const files = [
        { name: 'Script.docx', kind: 'Document', status: 'Ready' },
        { name: 'Voice.mp3', kind: 'Audio', status: 'Pending — connect TTS API key' },
        { name: 'Music.mp3', kind: 'Audio', status: 'Pending — generate via Suno' },
        { name: 'Thumbnail.png', kind: 'Image', status: 'Pending — render from prompt' },
        { name: 'SEO.txt', kind: 'Document', status: 'Ready' }
    ];
    for (let i = 1; i <= 25; i++) {
        files.push({ name: `Scene${String(i).padStart(2, '0')}.png`, kind: 'Image', status: 'Pending — render from prompt' });
    }
    return files;
}

export function generateProject(input) {
    const seed = hashString(`${input.trend}|${input.question}|${input.book}`);
    const research = buildResearch(input, seed);
    const outline = buildOutline(input);
    const script = buildScript(input, outline, seed);
    const { scenes, imagePrompts } = buildScenesAndImages(input, script, seed);
    const voice = buildVoice(input, seed);
    const music = buildMusic(input, seed);
    const thumbnails = buildThumbnails(input, seed);
    const seo = buildSEO(input, seed);
    const exportManifest = buildExportManifest(input);

    return {
        research,
        outline,
        script,
        scenes,
        imagePrompts,
        voice,
        music,
        thumbnails,
        seo,
        exportManifest
    };
}
