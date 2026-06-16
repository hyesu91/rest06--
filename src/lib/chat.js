import { supabase, hasSupabase } from './supabase'

// 채팅 메시지를 Edge Function('chat')으로 보내고 답변을 받는다.
// 실제 Solar/OpenAI 호출과 키 사용은 모두 서버(Edge Function)에서 이뤄진다.
//
// messages: [{ role: 'user' | 'assistant', content: string }, ...]
// 반환: { ok: true, reply, model, provider } | { ok: false, error }
export async function sendChat(messages, sessionId) {
  if (!hasSupabase) {
    return { ok: false, error: 'Supabase가 설정되지 않았습니다. (.env 확인)' }
  }
  try {
    const { data, error } = await supabase.functions.invoke('chat', {
      body: { messages, sessionId },
    })
    if (error) {
      // Edge Function이 4xx/5xx로 응답하면 본문(error)도 같이 읽어본다.
      let detail = error.message || '요청에 실패했습니다.'
      try {
        const body = await error.context?.json?.()
        if (body?.error) detail = body.error
      } catch (_) {}
      return { ok: false, error: detail }
    }
    if (data?.error) return { ok: false, error: data.error }
    if (!data?.reply) return { ok: false, error: '빈 응답을 받았습니다.' }
    return { ok: true, reply: data.reply, model: data.model, provider: data.provider }
  } catch (e) {
    return { ok: false, error: e?.message || '네트워크 오류가 발생했습니다.' }
  }
}
