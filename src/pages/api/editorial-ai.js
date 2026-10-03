import crypto from 'crypto';

const ACCESS_HASH = '7da2fdbb2fb7c08354a9725f97bcfd3c325327b0eff39ed63c92ca6943fccc6a';
const GATEWAY_URL = 'https://ai-gateway.vercel.sh/v1/chat/completions';
const MODEL = 'openai/gpt-5.6-luna';
const MAX_CHARS = 9000;

function verifyAccessKey(value = '') {
  const digest = crypto.createHash('sha256').update(String(value)).digest('hex');
  const a = Buffer.from(digest, 'hex');
  const b = Buffer.from(ACCESS_HASH, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function extractJson(text = '') {
  const raw = String(text || '').trim();
  try {
    return JSON.parse(raw);
  } catch (_) {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('AI 응답에서 JSON을 찾지 못했습니다.');
    return JSON.parse(match[0]);
  }
}

export default async function handler(req, res) {
  const authToken = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;

  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      service: 'OneDayBooks AI Editorial',
      gatewayAuthAvailable: !!authToken,
      model: MODEL,
      maxChars: MAX_CHARS
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'GET 또는 POST만 지원합니다.' });
  }

  if (!verifyAccessKey(req.headers['x-onedaybooks-key'])) {
    return res.status(401).json({ error: 'OneDayBooks OS 접근키가 올바르지 않습니다.' });
  }

  const { text, mode = 'proofread' } = req.body || {};
  const input = String(text || '');

  if (!input.trim()) {
    return res.status(400).json({ error: '교정할 텍스트가 없습니다.' });
  }

  if (input.length > MAX_CHARS) {
    return res.status(413).json({
      error: `한 번에 최대 ${MAX_CHARS.toLocaleString()}자까지 처리합니다. 클라이언트에서 분할해 주세요.`
    });
  }

  if (!authToken) {
    return res.status(503).json({
      error: 'AI Gateway 인증이 아직 활성화되지 않았습니다.',
      code: 'AI_GATEWAY_AUTH_MISSING'
    });
  }

  const task = mode === 'copyedit'
    ? '맞춤법·띄어쓰기·문법·문장 호흡을 다듬되 저자의 문체와 의미를 보존한다.'
    : '명백한 맞춤법·띄어쓰기·문장부호·문법 오류만 교정하고 문체는 가능한 한 그대로 둔다.';

  const system = `
너는 한국어 단행본 출판 교정자다.
작업 원칙:
1. ${task}
2. 고유명사, 숫자, 날짜, 인용문, 출처, ISBN, URL을 임의로 바꾸지 않는다.
3. 사실을 새로 만들거나 삭제하지 않는다.
4. 의미가 불확실하면 고치지 말고 warnings에 남긴다.
5. 원문의 문단 순서와 문단 수를 가능한 한 보존한다.
6. 번역투를 이유 없이 재창작하지 않는다.
7. 응답은 반드시 JSON 객체 하나만 반환한다.

JSON 형식:
{
  "revised_text": "교정된 전체 텍스트",
  "changes": [
    {"before":"변경 전","after":"변경 후","reason":"짧은 이유","confidence":0.0}
  ],
  "warnings": ["사람이 확인해야 하는 항목"]
}

changes는 실제 수정한 항목만 넣고 최대 80개로 제한한다.
confidence는 0에서 1 사이 숫자다.
`.trim();

  try {
    const gatewayResponse = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          {
            role: 'user',
            content: `다음 원고 조각을 교정해라. 원고 밖의 내용은 추가하지 마라.\n\n--- 원고 시작 ---\n${input}\n--- 원고 끝 ---`
          }
        ]
      })
    });

    const payload = await gatewayResponse.json().catch(() => ({}));

    if (!gatewayResponse.ok) {
      return res.status(gatewayResponse.status).json({
        error: payload?.error?.message || payload?.message || 'AI Gateway 호출에 실패했습니다.',
        code: payload?.error?.code || 'AI_GATEWAY_ERROR'
      });
    }

    const message = payload?.choices?.[0]?.message?.content;
    if (!message) {
      return res.status(502).json({ error: 'AI 교정 결과가 비어 있습니다.' });
    }

    const result = extractJson(message);
    const revisedText = String(result.revised_text || '');

    if (!revisedText.trim()) {
      return res.status(502).json({ error: 'AI가 유효한 교정문을 반환하지 않았습니다.' });
    }

    return res.status(200).json({
      model: MODEL,
      revised_text: revisedText,
      changes: Array.isArray(result.changes) ? result.changes.slice(0, 80) : [],
      warnings: Array.isArray(result.warnings) ? result.warnings.slice(0, 30) : []
    });
  } catch (error) {
    return res.status(500).json({
      error: error?.message || 'AI 교정 처리 중 오류가 발생했습니다.'
    });
  }
}
