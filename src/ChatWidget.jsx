import React, { useEffect, useRef, useState } from 'react'
import { sendChat } from './lib/chat'

// 메인페이지 우측 하단에 떠 있는 채팅 상담 팝업.
// App.jsx의 render()에서 디자인 템플릿 위에 오버레이로 얹는다.
// 색상은 전역 CSS 변수(--a1, --a2, --panel, --text ...)를 그대로 써서 테마/모드를 따라간다.

const GREETING = {
  role: 'assistant',
  content: '안녕하세요! 드림아이티비즈 상담봇이에요 🙌\n강좌 추천, 수강·결제 방법, 자격증 과정 등 무엇이든 물어보세요.',
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  // 대화 묶음 식별용 세션 ID (브라우저별로 유지)
  const sessionRef = useRef(null)
  if (!sessionRef.current) {
    try {
      let s = localStorage.getItem('dib-chat-session')
      if (!s) {
        s = (crypto?.randomUUID?.() || String(Date.now()) + Math.random().toString(16).slice(2))
        localStorage.setItem('dib-chat-session', s)
      }
      sessionRef.current = s
    } catch (_) {
      sessionRef.current = String(Date.now())
    }
  }

  // 새 메시지가 쌓이면 맨 아래로 스크롤
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading, open])

  // 열릴 때 입력창 포커스
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80)
  }, [open])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)
    // GREETING(인사말)은 컨텍스트에서 빼고 실제 대화만 서버로 전달
    const history = next.filter((m) => m !== GREETING)
    const res = await sendChat(history, sessionRef.current)
    setLoading(false)
    setMessages((cur) => [
      ...cur,
      res.ok
        ? { role: 'assistant', content: res.reply }
        : { role: 'assistant', content: `⚠️ ${res.error}`, isError: true },
    ])
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  // ── 스타일 ───────────────────────────────────────────────────────────────────
  const launcher = {
    position: 'fixed', right: '22px', bottom: '22px', zIndex: 1500,
    width: '60px', height: '60px', borderRadius: '50%', border: 'none', cursor: 'pointer',
    background: 'linear-gradient(135deg,var(--a2,#a3e635),var(--a1,#22d3ee))',
    color: '#0a0b10', fontSize: '26px', lineHeight: 1,
    boxShadow: '0 12px 32px rgba(var(--a2-rgb,163,230,53),.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'transform .15s',
  }
  const panel = {
    position: 'fixed', right: '22px', bottom: '94px', zIndex: 1500,
    width: 'min(380px, calc(100vw - 32px))', height: 'min(560px, calc(100vh - 130px))',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
    background: 'var(--panel,#12141c)', color: 'var(--text,#e8eaf0)',
    border: '1px solid rgba(var(--line,255,255,255),.12)', borderRadius: '18px',
    boxShadow: '0 30px 80px rgba(0,0,0,.5)', fontFamily: "'Pretendard',sans-serif",
  }
  const header = {
    padding: '15px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'linear-gradient(135deg,rgba(var(--a2-rgb,163,230,53),.16),rgba(var(--a1-rgb,34,211,238),.16))',
    borderBottom: '1px solid rgba(var(--line,255,255,255),.1)',
  }
  const body = {
    flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px',
  }
  const bubble = (role, isError) => ({
    maxWidth: '82%', padding: '10px 13px', borderRadius: '14px', fontSize: '14px', lineHeight: 1.5,
    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
    alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
    background: role === 'user'
      ? 'linear-gradient(135deg,var(--a2,#a3e635),var(--a1,#22d3ee))'
      : isError ? 'rgba(251,90,71,.14)' : 'rgba(var(--line,255,255,255),.06)',
    color: role === 'user' ? '#0a0b10' : isError ? '#fca5a5' : 'var(--text,#e8eaf0)',
    borderBottomRightRadius: role === 'user' ? '4px' : '14px',
    borderBottomLeftRadius: role === 'user' ? '14px' : '4px',
  })
  const footer = {
    padding: '12px', borderTop: '1px solid rgba(var(--line,255,255,255),.1)',
    display: 'flex', gap: '8px', alignItems: 'flex-end',
  }
  const textarea = {
    flex: 1, resize: 'none', maxHeight: '96px', minHeight: '42px', padding: '11px 13px',
    borderRadius: '11px', border: '1px solid rgba(var(--line,255,255,255),.14)',
    background: 'rgba(var(--line,255,255,255),.04)', color: 'var(--text,#e8eaf0)',
    fontFamily: "'Pretendard',sans-serif", fontSize: '14px', outline: 'none',
  }
  const sendBtn = {
    flexShrink: 0, width: '42px', height: '42px', borderRadius: '11px', border: 'none',
    cursor: loading || !input.trim() ? 'default' : 'pointer',
    opacity: loading || !input.trim() ? 0.5 : 1,
    background: 'linear-gradient(135deg,var(--a2,#a3e635),var(--a1,#22d3ee))',
    color: '#0a0b10', fontSize: '18px', fontWeight: 700,
  }

  return (
    <>
      {open && (
        <div style={panel} role="dialog" aria-label="상담 채팅">
          <div style={header}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '15px' }}>드림아이티비즈 상담</div>
              <div style={{ fontSize: '12px', color: 'var(--muted2,#7c8298)' }}>보통 몇 초 안에 답해드려요</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="닫기"
              style={{ background: 'transparent', border: 'none', color: 'var(--text,#e8eaf0)', fontSize: '22px', cursor: 'pointer', lineHeight: 1 }}
            >
              ✕
            </button>
          </div>

          <div style={body} ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} style={bubble(m.role, m.isError)}>{m.content}</div>
            ))}
            {loading && (
              <div style={{ ...bubble('assistant', false), color: 'var(--muted2,#7c8298)' }}>입력 중…</div>
            )}
          </div>

          <div style={footer}>
            <textarea
              ref={inputRef}
              style={textarea}
              rows={1}
              placeholder="메시지를 입력하세요…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={loading}
            />
            <button style={sendBtn} onClick={send} disabled={loading || !input.trim()} aria-label="보내기">➤</button>
          </div>
        </div>
      )}

      <button
        style={launcher}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? '채팅 닫기' : '채팅 열기'}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(.92)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {open ? '✕' : '💬'}
      </button>
    </>
  )
}
