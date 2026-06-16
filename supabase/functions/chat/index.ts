// supabase/functions/chat/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// 드림아이티비즈 채팅 상담 봇 — Edge Function (서버리스 프록시)
//
// 브라우저는 이 함수만 호출하고, 실제 LLM 호출은 서버(이 함수)에서 일어난다.
// 따라서 Solar / OpenAI API 키는 브라우저에 절대 노출되지 않는다.
//
// 키는 Supabase Secrets(환경변수)에서 읽는다. 배포 전에 아래를 실행:
//   supabase secrets set SOLAR_API_KEY=...    (Upstage Console에서 발급)
//   supabase secrets set OPENAI_API_KEY=...   (OpenAI에서 발급)
//
// 동작: Solar(한국어 강점)로 먼저 응답을 시도하고, 실패하면 OpenAI로 폴백한다.
// 또한 대화(질문/답변)를 rest06_chat_messages 테이블에 service_role로 기록한다.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ── 설정 (필요하면 모델명만 바꾸면 됨) ────────────────────────────────────────
const SOLAR_URL = 'https://api.upstage.ai/v1/chat/completions'
const SOLAR_MODEL = 'solar-pro2' // 최신으로 쓰려면 'solar-pro3'

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_MODEL = 'gpt-4o-mini'

const MAX_HISTORY = 12 // 컨텍스트로 보낼 최근 메시지 수 (system 제외)
const MAX_CHARS = 4000 // 메시지 1개당 허용 길이 (간단한 남용 방지)

// CORS 허용 도메인. 운영 도메인 + GitHub Pages 기본 + 로컬 개발.
const ALLOWED_ORIGINS = [
  'https://rest06.dreamitbiz.com',
  'https://hyesu91.github.io',
  'http://localhost:5173',
  'http://localhost:4173',
]

// 사이트/강좌 안내 상담용 시스템 프롬프트. (브라우저가 아니라 서버가 주입 → 변조 불가)
const SYSTEM_PROMPT = `너는 'DreamIT Biz(드림아이티비즈)' IT 교육 플랫폼의 친절한 한국어 상담 도우미야.
역할: 방문자에게 강좌, 수강 방법, 결제/환불, 자격증 과정, 기업교육을 안내한다.

[회사 소개]
- 2018년 현직 개발자들이 설립한 실무형 IT 교육 플랫폼. 누적 수강생 12만 명.
- 강점: 현직자(네이버·카카오·토스 등) 커리큘럼, 1:1 코드 리뷰, 평생 무제한 수강, 수료증·취업 연계.

[주요 온라인 강좌]
- 웹 풀스택 부트캠프(₩89,000), 파이썬 기초~실전(₩59,000), 모던 React(₩79,000),
  데이터 분석 & 시각화(₩69,000), 머신러닝/AI 모델링(₩99,000), 자바 백엔드 & Spring(₩89,000),
  AWS 클라우드 입문 & 자격증(₩85,000).
- 자격증: SQLD 단기합격반(₩45,000), 정보처리기사 필기+실기(₩75,000),
  컴퓨터활용능력 1급(₩39,000), 빅데이터분석기사 실기(₩69,000).
- 기업교육(B2B): 임직원 맞춤 DX 사내교육 — 별도 문의.

[수강/결제 안내]
- 7일 무료체험 후 결제 가능. 결제수단: 신용카드·계좌이체·휴대폰(PortOne).
- 한 번 결제하면 해당 강의는 평생 무제한 수강.

[응답 규칙]
- 한국어로, 따뜻하고 간결하게(보통 2~5문장). 과장·허위 정보 금지.
- 정확한 가격/혜택은 위 정보를 근거로 안내하고, 모르면 모른다고 말한 뒤
  "1:1 문의"나 "고객지원"으로 안내한다.
- 결제·환불 등 민감한 처리는 직접 수행할 수 없고 안내만 한다는 점을 분명히 한다.`

// ── CORS ──────────────────────────────────────────────────────────────────────
function corsHeadersFor(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allow,
    Vary: 'Origin',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

function json(body: unknown, status: number, cors: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}

// 들어온 메시지를 검증/정리한다. (role은 user/assistant만, system은 서버가 주입)
function sanitize(messages: unknown): { role: string; content: string }[] {
  if (!Array.isArray(messages)) return []
  return messages
    .filter((m) => m && typeof m === 'object')
    .map((m: any) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content ?? '') }))
    .filter((m) => m.content.trim().length > 0)
    .map((m) => ({ ...m, content: m.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_HISTORY)
}

// OpenAI 호환 chat completions 호출 (Solar/OpenAI 공통)
async function callChat(url: string, apiKey: string, model: string, messages: any[]) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, temperature: 0.4, max_tokens: 1024 }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`${model} ${res.status}: ${detail.slice(0, 300)}`)
  }
  const data = await res.json()
  const reply = data?.choices?.[0]?.message?.content?.trim()
  if (!reply) throw new Error(`${model}: empty response`)
  return reply as string
}

// 로그인 사용자면 JWT에서 user_id를 얻는다. (익명이면 null)
async function resolveUserId(authHeader: string | null): Promise<string | null> {
  try {
    const url = Deno.env.get('SUPABASE_URL')
    const anon = Deno.env.get('SUPABASE_ANON_KEY')
    const token = authHeader?.replace(/^Bearer\s+/i, '')
    if (!url || !anon || !token) return null
    const sb = createClient(url, anon)
    const { data } = await sb.auth.getUser(token)
    return data?.user?.id ?? null
  } catch {
    return null
  }
}

// 대화 한 턴(질문+답변)을 rest06_chat_messages에 기록. service_role이라 RLS를 우회한다.
// 로깅 실패는 채팅 응답에 영향을 주지 않는다(조용히 무시).
async function logTurn(opts: {
  sessionId: string | null
  userId: string | null
  question: string
  answer: string
  provider: string
  model: string
}) {
  try {
    const url = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !serviceKey) return
    const sb = createClient(url, serviceKey)
    await sb.from('rest06_chat_messages').insert([
      { session_id: opts.sessionId, user_id: opts.userId, role: 'user', content: opts.question },
      { session_id: opts.sessionId, user_id: opts.userId, role: 'assistant', content: opts.answer, provider: opts.provider, model: opts.model },
    ])
  } catch (e) {
    console.error('[chat] 로그 저장 실패:', String(e))
  }
}

Deno.serve(async (req) => {
  const cors = corsHeadersFor(req.headers.get('Origin'))
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, cors)

  let payload: any
  try {
    payload = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400, cors)
  }

  const history = sanitize(payload?.messages)
  if (history.length === 0) return json({ error: '메시지가 비어 있습니다.' }, 400, cors)

  const sessionId = typeof payload?.sessionId === 'string' ? payload.sessionId.slice(0, 64) : null
  const messages = [{ role: 'system', content: SYSTEM_PROMPT }, ...history]

  const solarKey = Deno.env.get('SOLAR_API_KEY')
  const openaiKey = Deno.env.get('OPENAI_API_KEY')
  if (!solarKey && !openaiKey) {
    return json({ error: '서버에 API 키가 설정되지 않았습니다. (SOLAR_API_KEY / OPENAI_API_KEY)' }, 500, cors)
  }

  const errors: string[] = []
  let result: { reply: string; model: string; provider: string } | null = null

  // 1) Solar 우선
  if (solarKey) {
    try {
      const reply = await callChat(SOLAR_URL, solarKey, SOLAR_MODEL, messages)
      result = { reply, model: SOLAR_MODEL, provider: 'solar' }
    } catch (e) {
      errors.push(String(e))
    }
  }

  // 2) 실패 시 OpenAI 폴백
  if (!result && openaiKey) {
    try {
      const reply = await callChat(OPENAI_URL, openaiKey, OPENAI_MODEL, messages)
      result = { reply, model: OPENAI_MODEL, provider: 'openai' }
    } catch (e) {
      errors.push(String(e))
    }
  }

  if (!result) {
    console.error('[chat] 모든 제공자 실패:', errors.join(' | '))
    return json({ error: '답변 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.' }, 502, cors)
  }

  // 대화 기록 (실패해도 응답은 그대로 반환)
  const userId = await resolveUserId(req.headers.get('Authorization'))
  await logTurn({
    sessionId,
    userId,
    question: history[history.length - 1].content,
    answer: result.reply,
    provider: result.provider,
    model: result.model,
  })

  return json(result, 200, cors)
})
