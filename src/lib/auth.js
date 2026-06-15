import { supabase, hasSupabase, TABLES } from './supabase'

// 구글 / 카카오 로그인은 Supabase Auth OAuth 로 처리한다.
// (Supabase 대시보드 > Authentication > Providers 에서 Google, Kakao 활성화 필요)
//
// 리다이렉트는 현재 배포 오리진으로 돌아온다(rest06.dreamitbiz.com 또는 로컬).

const PROVIDERS = ['google', 'kakao']

export async function signIn(provider) {
  if (!hasSupabase) {
    alert('로그인 설정이 아직 연결되지 않았습니다. (Supabase 환경변수 확인)')
    return
  }
  if (!PROVIDERS.includes(provider)) provider = 'google'
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin + window.location.pathname,
      queryParams: provider === 'kakao' ? { prompt: 'login' } : {},
    },
  })
  if (error) {
    console.error('[auth] signIn 실패:', error)
    alert('로그인에 실패했습니다: ' + error.message)
  }
}

export async function signOut() {
  if (!hasSupabase) return
  await supabase.auth.signOut()
}

export async function getSession() {
  if (!hasSupabase) return null
  const { data } = await supabase.auth.getSession()
  return data?.session ?? null
}

// 세션 → 화면에서 쓰기 좋은 유저 요약
export function summarizeUser(session) {
  if (!session?.user) return null
  const u = session.user
  const meta = u.user_metadata || {}
  return {
    id: u.id,
    email: u.email || meta.email || '',
    name: meta.name || meta.full_name || meta.nickname || (u.email ? u.email.split('@')[0] : '회원'),
    avatar: meta.avatar_url || meta.picture || '',
    provider: u.app_metadata?.provider || '',
  }
}

// 로그인/로그아웃 변화를 구독
export function onAuthChange(cb) {
  if (!hasSupabase) return () => {}
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session))
  return () => data?.subscription?.unsubscribe?.()
}

// 프로필 upsert (최초 로그인 시 회원 레코드 보장)
export async function ensureProfile(user) {
  if (!hasSupabase || !user) return
  try {
    await supabase.from(TABLES.profiles).upsert(
      { id: user.id, email: user.email, name: user.name, avatar: user.avatar, provider: user.provider },
      { onConflict: 'id' },
    )
  } catch (e) {
    console.warn('[auth] 프로필 저장 생략:', e?.message)
  }
}
