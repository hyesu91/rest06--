import { supabase, hasSupabase, TABLES } from './supabase'

// 아임포트(PortOne v2) 결제 연동.
// SDK: https://cdn.portone.io/v2/browser-sdk.js → window.PortOne
// 발행 키(클라이언트 공개용): storeId, channelKey 를 환경변수로 주입한다.
const STORE_ID = import.meta.env.VITE_PORTONE_STORE_ID
const CHANNEL_KEY = import.meta.env.VITE_PORTONE_CHANNEL_KEY

export const hasPayment = Boolean(STORE_ID && CHANNEL_KEY)

// PortOne SDK 지연 로드 (랜딩에서는 불필요하므로 결제 시점에만)
let sdkPromise = null
function loadSdk() {
  if (window.PortOne) return Promise.resolve(window.PortOne)
  if (sdkPromise) return sdkPromise
  sdkPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdn.portone.io/v2/browser-sdk.js'
    s.onload = () => resolve(window.PortOne)
    s.onerror = () => reject(new Error('PortOne SDK 로드 실패'))
    document.head.appendChild(s)
  })
  return sdkPromise
}

// 앱의 결제수단 키 → PortOne payMethod
const PAY_METHOD = { card: 'CARD', trans: 'TRANSFER', phone: 'MOBILE' }

function genPaymentId(courseId) {
  // 시간+랜덤 기반 고유 주문번호
  const t = Date.now().toString(36)
  const r = Math.random().toString(36).slice(2, 8)
  return `rest06_${courseId || 'course'}_${t}${r}`
}

/**
 * 결제 요청.
 * @param {{courseId:string, orderName:string, amount:number, payMethod:string, user?:object}} opt
 * @returns {Promise<{ok:boolean, paymentId?:string, reason?:string, testMode?:boolean}>}
 */
export async function requestPayment(opt) {
  const { courseId, orderName, amount, payMethod = 'card', user } = opt
  const paymentId = genPaymentId(courseId)

  // 키 미설정 시: 테스트(모의) 결제로 흐름만 검증
  if (!hasPayment) {
    await recordPayment({ paymentId, courseId, orderName, amount, payMethod, user, status: 'test' })
    return { ok: true, paymentId, testMode: true }
  }

  try {
    const PortOne = await loadSdk()
    const res = await PortOne.requestPayment({
      storeId: STORE_ID,
      channelKey: CHANNEL_KEY,
      paymentId,
      orderName: orderName || '드림아이티비즈 강의',
      totalAmount: Math.max(amount || 0, 100),
      currency: 'KRW',
      payMethod: PAY_METHOD[payMethod] || 'CARD',
      customer: user
        ? { fullName: user.name, email: user.email }
        : undefined,
    })
    if (res?.code != null) {
      // 실패/취소
      return { ok: false, reason: res.message || '결제가 취소되었습니다.' }
    }
    await recordPayment({ paymentId, courseId, orderName, amount, payMethod, user, status: 'paid' })
    return { ok: true, paymentId }
  } catch (e) {
    console.error('[pay] 결제 오류:', e)
    return { ok: false, reason: e?.message || '결제 처리 중 오류가 발생했습니다.' }
  }
}

// 결제/수강신청 기록을 Supabase 에 남긴다 (실패해도 흐름은 유지)
async function recordPayment({ paymentId, courseId, orderName, amount, payMethod, user, status }) {
  if (!hasSupabase) return
  try {
    await supabase.from(TABLES.payments).insert({
      payment_id: paymentId,
      user_id: user?.id || null,
      email: user?.email || null,
      course_id: courseId,
      order_name: orderName,
      amount,
      pay_method: payMethod,
      status,
    })
    await supabase.from(TABLES.enrollments).upsert(
      {
        user_id: user?.id || null,
        email: user?.email || null,
        course_id: courseId,
        payment_id: paymentId,
        status: status === 'paid' || status === 'test' ? 'active' : 'pending',
      },
      { onConflict: 'user_id,course_id' },
    )
  } catch (e) {
    console.warn('[pay] 결제 기록 생략:', e?.message)
  }
}

// 무료 체험 수강신청 (결제 없음)
export async function enrollFree({ courseId, orderName, user }) {
  const paymentId = genPaymentId(courseId)
  if (hasSupabase) {
    try {
      await supabase.from(TABLES.enrollments).upsert(
        { user_id: user?.id || null, email: user?.email || null, course_id: courseId, payment_id: paymentId, status: 'trial' },
        { onConflict: 'user_id,course_id' },
      )
    } catch (e) {
      console.warn('[pay] 무료수강 기록 생략:', e?.message)
    }
  }
  return { ok: true, paymentId, free: true }
}
