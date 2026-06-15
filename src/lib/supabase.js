import { createClient } from '@supabase/supabase-js'

// 환경변수가 있을 때만 클라이언트를 만든다.
// (키가 없어도 랜딩 페이지는 정적으로 정상 동작 — 로그인/결제 기능만 비활성)
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      })
    : null

export const hasSupabase = Boolean(supabase)

// rest06_ 접두사 테이블 (공유 Supabase 프로젝트 규칙)
export const TABLES = {
  enrollments: 'rest06_enrollments',
  payments: 'rest06_payments',
  profiles: 'rest06_profiles',
}
