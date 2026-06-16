import React from 'react'
import { renderTemplate } from './dcRuntime'
import { TEMPLATE } from './template'
import { signIn, signOut, getSession, onAuthChange, summarizeUser, ensureProfile } from './lib/auth'
import { requestPayment, enrollFree } from './lib/payment'
import { fetchDashboard, touchStreak } from './lib/dashboard'
import ChatWidget from './ChatWidget'

// ─────────────────────────────────────────────────────────────────────────────
// 디자인 아티팩트의 로그인/결제 버튼에 실제 핸들러를 연결하기 위한 최소 패치.
// (마크업/디자인은 그대로 두고 바인딩만 주입한다)
// ─────────────────────────────────────────────────────────────────────────────
function patchTemplate(tpl) {
  let t = tpl
  const sub = (from, to) => {
    if (t.includes(from)) t = t.replace(from, to)
    else console.warn('[patch] 앵커 미발견:', from.slice(0, 40))
  }
  // 1) 네비 "로그인" 버튼 → 로그인/계정 메뉴
  sub('onclick="{{ goDashboard }}"', 'onclick="{{ navAuthClick }}"')
  sub('data-desktop-nav="">로그인</button>', 'data-desktop-nav="">{{ navAuthLabel }}</button>')
  // 2) 상세화면 "수강 신청하기" → 유료 결제 화면으로
  sub(
    '{{ goEnrollFree }}" style="width:100%; font-family:\'Pretendard\',sans-serif; font-weight:700; font-size:16px; color:#0a0b10; background:linear-gradient(135deg,var(--a2),var(--a1)); border:none; padding:16px; border-radius:13px; cursor:pointer; margin-bottom:10px; box-shadow:0 10px 28px rgba(var(--a2-rgb),.28);">수강 신청하기',
    '{{ goEnrollPaid }}" style="width:100%; font-family:\'Pretendard\',sans-serif; font-weight:700; font-size:16px; color:#0a0b10; background:linear-gradient(135deg,var(--a2),var(--a1)); border:none; padding:16px; border-radius:13px; cursor:pointer; margin-bottom:10px; box-shadow:0 10px 28px rgba(var(--a2-rgb),.28);">수강 신청하기',
  )
  // 3) 결제 화면 "결제하고 시작하기" → 아임포트 결제
  sub('rgba(var(--a2-rgb),.28);">결제하고 시작하기 →</button>', 'rgba(var(--a2-rgb),.28);" onclick="{{ doPay }}">결제하고 시작하기 →</button>')
  // 4) 신청자 정보 → 로그인 사용자 정보
  sub('>홍길동</div>', '>{{ buyerName }}</div>')
  sub('>student@dreamitbiz.co.kr</div>', '>{{ buyerEmail }}</div>')
  // 5) 마이페이지 → 실데이터 바인딩
  sub('>안녕하세요, 홍길동님 👋</div>', '>안녕하세요, {{ dashName }}님 👋</div>')
  sub('font-size:26px; color:#0a0b10;">홍</div>', 'font-size:26px; color:#0a0b10;">{{ dashInitial }}</div>')
  sub('font-size:28px; color:var(--a1);">3</div>', 'font-size:28px; color:var(--a1);">{{ dashActive }}</div>')
  sub('font-size:28px; color:var(--a2);">47</div>', 'font-size:28px; color:var(--a2);">{{ dashLessons }}</div>')
  sub('font-size:28px; color:var(--text);">12<span style="font-size:16px;">일</span>', 'font-size:28px; color:var(--text);">{{ dashStreak }}<span style="font-size:16px;">일</span>')
  sub('font-size:28px; color:var(--text);">2</div>', 'font-size:28px; color:var(--text);">{{ dashCerts }}</div>')
  return t
}

const PATCHED_TEMPLATE = patchTemplate(TEMPLATE)

export default class App extends React.Component {
  state = {
    screen: 'home', selectedId: 'fullstack', catFilter: 'all', enrollStep: 1, enrollFree: false,
    payMethod: 'card', paletteOpen: false, theme: 'lime', mode: 'dark', openMenu: null, certTab: 'aws',
    // 인증/결제
    user: null, authReady: false, accountOpen: false, payBusy: false,
    // 마이페이지 실데이터 (null = 데모 폴백)
    dash: null,
  }

  // 마이페이지 데이터 로드 (로그인 + Supabase 연결 시)
  loadDashboard = async () => {
    const { user } = this.state
    if (!user) { this.setState({ dash: null }); return }
    const dash = await fetchDashboard(user, this._courses())
    this.setState({ dash })
  }

  // ── 테마 ───────────────────────────────────────────────────────────────────
  _themes() {
    return [
      { key: 'lime', name: '사이버 라임', a1: '#22d3ee', a1rgb: '34,211,238', a2: '#a3e635', a2rgb: '163,230,53' },
      { key: 'sunset', name: '노랑 · 빨강', a1: '#f5c518', a1rgb: '245,197,24', a2: '#fb5a47', a2rgb: '251,90,71' },
      { key: 'bubble', name: '파랑 · 핑크', a1: '#38bdf8', a1rgb: '56,189,248', a2: '#f472b6', a2rgb: '244,114,182' },
      { key: 'grape', name: '보라 · 민트', a1: '#a78bfa', a1rgb: '167,139,250', a2: '#34d399', a2rgb: '52,211,153' },
      { key: 'mango', name: '오렌지 · 청록', a1: '#fb923c', a1rgb: '251,146,60', a2: '#2dd4bf', a2rgb: '45,212,191' },
      { key: 'candy', name: '핑크 · 라임', a1: '#fb7185', a1rgb: '251,113,133', a2: '#bef264', a2rgb: '190,242,100' },
    ]
  }
  applyTheme(t) {
    const root = document.querySelector('[data-root]')
    if (root) {
      root.style.setProperty('--a1', t.a1); root.style.setProperty('--a1-rgb', t.a1rgb)
      root.style.setProperty('--a2', t.a2); root.style.setProperty('--a2-rgb', t.a2rgb)
    }
    try { localStorage.setItem('dib-theme', t.key) } catch (e) {}
  }
  pickTheme = (key) => {
    const t = this._themes().find((x) => x.key === key) || this._themes()[0]
    this.applyTheme(t)
    this.setState({ theme: key, paletteOpen: false })
  }
  _modes() {
    return {
      dark: { bg: '#0a0b10', bgRgb: '10,11,16', surface: '#0c0e15', panel: '#12141c', text: '#e8eaf0', text2: '#c4c9d8', muted: '#9aa0b4', muted2: '#7c8298', faint: '#5d6478', line: '255,255,255' },
      light: { bg: '#eef1f7', bgRgb: '238,241,247', surface: '#ffffff', panel: '#ffffff', text: '#181b24', text2: '#3a4051', muted: '#5a6173', muted2: '#6b7280', faint: '#98a0b0', line: '17,21,32' },
    }
  }
  applyMode(mode) {
    const m = this._modes()[mode] || this._modes().dark
    const root = document.querySelector('[data-root]')
    if (root) {
      const set = (k, v) => root.style.setProperty(k, v)
      set('--bg', m.bg); set('--bg-rgb', m.bgRgb); set('--surface', m.surface); set('--panel', m.panel)
      set('--text', m.text); set('--text2', m.text2); set('--muted', m.muted); set('--muted2', m.muted2)
      set('--faint', m.faint); set('--line', m.line)
    }
    try { document.body.style.background = m.bg; document.body.style.color = m.text } catch (e) {}
    try { localStorage.setItem('dib-mode', mode) } catch (e) {}
  }
  toggleMode = () => {
    const next = this.state.mode === 'dark' ? 'light' : 'dark'
    this.applyMode(next)
    this.setState({ mode: next })
  }

  // ── 라이프사이클 ─────────────────────────────────────────────────────────────
  async componentDidMount() {
    let saved = 'lime'
    try { saved = localStorage.getItem('dib-theme') || 'lime' } catch (e) {}
    const t = this._themes().find((x) => x.key === saved) || this._themes()[0]
    this.applyTheme(t)
    let savedMode = 'dark'
    try { savedMode = localStorage.getItem('dib-mode') || 'dark' } catch (e) {}
    this.applyMode(savedMode)
    const patch = {}
    if (t.key !== this.state.theme) patch.theme = t.key
    if (savedMode !== this.state.mode) patch.mode = savedMode
    if (Object.keys(patch).length) this.setState(patch)
    this._fx()
    this._prevScreen = this.state.screen

    // 인증 초기화
    const session = await getSession()
    const u = summarizeUser(session)
    this.setState({ user: u, authReady: true }, () => {
      if (this.state.screen === 'dashboard') this.loadDashboard()
    })
    if (u) { await ensureProfile(u); touchStreak(u.id) }
    this._unsub = onAuthChange(async (s) => {
      const nu = summarizeUser(s)
      this.setState({ user: nu, dash: null }, () => {
        if (this.state.screen === 'dashboard') this.loadDashboard()
      })
      if (nu) { await ensureProfile(nu); touchStreak(nu.id) }
    })
  }
  componentDidUpdate() {
    // React 리렌더가 덮어쓴 테마/모드 CSS 변수를 항상 복원
    const t = this._themes().find((x) => x.key === this.state.theme) || this._themes()[0]
    this.applyTheme(t)
    this.applyMode(this.state.mode)
    const cur = this.state.screen
    if (this._prevScreen !== cur) {
      this._prevScreen = cur
      try { window.scrollTo(0, 0) } catch (e) {}
      clearTimeout(this._t); this._t = setTimeout(() => this._fx(), 60)
    } else {
      this._reapplyCounters()
      const rot = document.querySelector('[data-rotator]')
      if (rot && this._rotWord) rot.textContent = this._rotWord
    }
  }
  componentWillUnmount() {
    clearInterval(this._rot); clearTimeout(this._t); clearTimeout(this._sc)
    window.removeEventListener('scroll', this._onScroll)
    this._unsub?.()
  }

  _reapplyCounters() {
    document.querySelectorAll('[data-counter]').forEach((el) => {
      if (!el._counted) return
      const target = +el.getAttribute('data-target'); const suf = el.getAttribute('data-suffix') || ''
      el.textContent = (target >= 1000 ? target.toLocaleString() : target) + suf
    })
  }
  _fx() {
    clearTimeout(this._sc)
    const vh = () => window.innerHeight || document.documentElement.clientHeight
    const scan = () => {
      document.querySelectorAll('[data-counter]').forEach((el) => {
        if (el._counted) return
        const r = el.getBoundingClientRect()
        if (r.top < vh() * 0.98 && r.bottom > 0) { el._counted = true; this._count(el) }
      })
    }
    requestAnimationFrame(scan)
    window.removeEventListener('scroll', this._onScroll)
    this._onScroll = () => { clearTimeout(this._sc); this._sc = setTimeout(scan, 40) }
    window.addEventListener('scroll', this._onScroll, { passive: true })
    clearInterval(this._rot)
    const rot = document.querySelector('[data-rotator]')
    if (rot) {
      const words = ['개발자', '데이터 분석가', 'AI 엔지니어', '자격증 합격자']
      let i = 0; this._rotWord = words[0]
      this._rot = setInterval(() => {
        i = (i + 1) % words.length
        rot.style.transition = 'opacity .25s, transform .25s'; rot.style.opacity = '0'; rot.style.transform = 'translateY(-8px)'
        setTimeout(() => { this._rotWord = words[i]; rot.textContent = words[i]; rot.style.opacity = '1'; rot.style.transform = 'none' }, 260)
      }, 2200)
    }
  }
  _count(el) {
    const target = +el.getAttribute('data-target'); const suf = el.getAttribute('data-suffix') || ''
    const fin = (target >= 1000 ? target.toLocaleString() : target) + suf
    const dur = 1500; const t0 = performance.now()
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1); const e = 1 - Math.pow(1 - p, 3)
      const v = Math.round(target * e)
      el.textContent = (v >= 1000 ? v.toLocaleString() : v) + suf
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    clearTimeout(el._cto)
    el._cto = setTimeout(() => { el.textContent = fin }, 1700)
  }

  // ── 데이터 ───────────────────────────────────────────────────────────────────
  _courses() {
    return [
      { id: 'fullstack', title: '웹 풀스택 부트캠프', en: 'Full-Stack Bootcamp', cat: 'dev', catLabel: '개발', level: '입문~심화', lessons: 142, hours: 96, price: '₩89,000', priceNum: 89000, oldPrice: '₩240,000', rating: '4.9', students: 18420, instructor: '김도현 · 前 네이버 개발자', mark: '</>', tag: 'BEST', thumb: 'linear-gradient(135deg,var(--a1),#3b82f6)' },
      { id: 'python', title: '파이썬 기초부터 실전까지', en: 'Python A to Z', cat: 'dev', catLabel: '개발', level: '입문', lessons: 88, hours: 52, price: '₩59,000', priceNum: 59000, oldPrice: '₩150,000', rating: '4.8', students: 24100, instructor: '이서연 · 데이터 엔지니어', mark: 'py', tag: '인기', thumb: 'linear-gradient(135deg,var(--a2),#10b981)' },
      { id: 'react', title: '모던 React 프론트엔드 마스터', en: 'Modern React', cat: 'dev', catLabel: '개발', level: '중급', lessons: 104, hours: 64, price: '₩79,000', priceNum: 79000, oldPrice: '₩190,000', rating: '4.9', students: 12300, instructor: '박준영 · 카카오 FE', mark: '⚛', tag: 'NEW', thumb: 'linear-gradient(135deg,var(--a1),#8b5cf6)' },
      { id: 'data', title: '데이터 분석 & 시각화 실무', en: 'Data Analysis', cat: 'data', catLabel: '데이터·AI', level: '입문~중급', lessons: 76, hours: 48, price: '₩69,000', priceNum: 69000, oldPrice: '₩170,000', rating: '4.7', students: 9800, instructor: '최유진 · 데이터 사이언티스트', mark: '📊', tag: '인기', thumb: 'linear-gradient(135deg,#f59e0b,var(--a2))' },
      { id: 'ai', title: '실전 머신러닝 / AI 모델링', en: 'Machine Learning', cat: 'data', catLabel: '데이터·AI', level: '중급~심화', lessons: 120, hours: 80, price: '₩99,000', priceNum: 99000, oldPrice: '₩260,000', rating: '4.8', students: 7600, instructor: '정민석 · AI 연구원', mark: 'AI', tag: 'HOT', thumb: 'linear-gradient(135deg,#8b5cf6,var(--a1))' },
      { id: 'sqld', title: 'SQLD 자격증 단기합격반', en: 'SQLD Cert', cat: 'cert', catLabel: '자격증', level: '입문', lessons: 42, hours: 24, price: '₩45,000', priceNum: 45000, oldPrice: '₩120,000', rating: '4.9', students: 15200, instructor: '한지원 · DBA', mark: 'SQL', tag: '합격보장', thumb: 'linear-gradient(135deg,var(--a1),var(--a2))' },
      { id: 'info', title: '정보처리기사 필기+실기 패스', en: '정보처리기사', cat: 'cert', catLabel: '자격증', level: '입문~중급', lessons: 160, hours: 88, price: '₩75,000', priceNum: 75000, oldPrice: '₩220,000', rating: '4.8', students: 21000, instructor: '오세훈 · 기술사', mark: 'OK', tag: 'BEST', thumb: 'linear-gradient(135deg,#3b82f6,var(--a1))' },
      { id: 'comp', title: '컴퓨터활용능력 1급 완성', en: '컴활 1급', cat: 'cert', catLabel: '자격증', level: '입문', lessons: 64, hours: 36, price: '₩39,000', priceNum: 39000, oldPrice: '₩99,000', rating: '4.7', students: 18900, instructor: '신아라 · MOS 마스터', mark: 'XL', tag: '인기', thumb: 'linear-gradient(135deg,#10b981,var(--a1))' },
      { id: 'cloud', title: 'AWS 클라우드 입문 & 자격증', en: 'AWS Cloud', cat: 'dev', catLabel: '개발', level: '중급', lessons: 72, hours: 46, price: '₩85,000', priceNum: 85000, oldPrice: '₩200,000', rating: '4.8', students: 6400, instructor: '강태우 · 클라우드 아키텍트', mark: '☁', tag: 'NEW', thumb: 'linear-gradient(135deg,#f59e0b,var(--a1))' },
      { id: 'bigdata', title: '빅데이터분석기사 실기 대비', en: '빅분기', cat: 'cert', catLabel: '자격증', level: '중급', lessons: 58, hours: 40, price: '₩69,000', priceNum: 69000, oldPrice: '₩180,000', rating: '4.7', students: 5200, instructor: '문지호 · 데이터 분석가', mark: 'BIG', tag: '합격보장', thumb: 'linear-gradient(135deg,#8b5cf6,var(--a2))' },
      { id: 'java', title: '자바 백엔드 & Spring 실무', en: 'Java Spring', cat: 'dev', catLabel: '개발', level: '중급~심화', lessons: 130, hours: 84, price: '₩89,000', priceNum: 89000, oldPrice: '₩230,000', rating: '4.8', students: 8900, instructor: '류현진 · 백엔드 리드', mark: 'JV', tag: 'HOT', thumb: 'linear-gradient(135deg,var(--a1),#10b981)' },
      { id: 'biz', title: '기업 맞춤 DX 사내교육', en: 'Corporate DX', cat: 'biz', catLabel: '기업교육', level: '맞춤형', lessons: 0, hours: 0, price: '문의', priceNum: 0, oldPrice: '', rating: '5.0', students: 480, instructor: '전담 매니저 배정', mark: 'B2B', tag: '기업', thumb: 'linear-gradient(135deg,var(--a2),var(--a1))' },
    ]
  }

  go = (screen, id) =>
    this.setState(
      (s) => ({ screen, selectedId: id || s.selectedId, enrollStep: 1, enrollFree: false, openMenu: null, accountOpen: false }),
      () => { if (screen === 'dashboard') this.loadDashboard() },
    )

  _instructors() {
    return [
      { name: '김도현', role: '풀스택 리드 강사', company: '前 NAVER', tags: ['JavaScript', 'React', 'Node'], courses: 3, students: '2.4만', color: 'var(--a1)', initial: '김' },
      { name: '이서연', role: '데이터 엔지니어', company: '前 COUPANG', tags: ['Python', 'SQL', 'ETL'], courses: 2, students: '2.1만', color: 'var(--a2)', initial: '이' },
      { name: '박준영', role: '프론트엔드 멘토', company: 'KAKAO', tags: ['React', 'TypeScript'], courses: 2, students: '1.2만', color: '#8b5cf6', initial: '박' },
      { name: '정민석', role: 'AI 연구원', company: '前 LG AI', tags: ['ML', 'PyTorch', 'LLM'], courses: 2, students: '9천', color: '#f59e0b', initial: '정' },
      { name: '한지원', role: 'DBA · 자격증 전문', company: '삼성SDS', tags: ['SQLD', 'Oracle'], courses: 1, students: '1.5만', color: 'var(--a1)', initial: '한' },
      { name: '강태우', role: '클라우드 아키텍트', company: 'AWS Hero', tags: ['AWS', 'DevOps'], courses: 1, students: '6천', color: 'var(--a2)', initial: '강' },
      { name: '오세훈', role: '정보처리 기술사', company: 'IT 컨설턴트', tags: ['정보처리', '네트워크'], courses: 1, students: '2.1만', color: '#8b5cf6', initial: '오' },
      { name: '류현진', role: '백엔드 리드', company: '우아한형제들', tags: ['Java', 'Spring'], courses: 1, students: '9천', color: '#f59e0b', initial: '류' },
    ]
  }
  _offline() {
    return [
      { title: '웹 풀스택 부트캠프 12기', loc: '강남 캠퍼스', period: '16주 · 주 5일', start: '2026.03.04 개강', seats: '정원 24명 · 4석 남음', price: '국비지원 가능', tag: '모집중', color: 'var(--a1)', mark: '</>' },
      { title: '데이터 분석 직무 부트캠프', loc: '판교 캠퍼스', period: '12주 · 주 5일', start: '2026.03.18 개강', seats: '정원 20명 · 마감임박', price: '₩3,200,000', tag: '마감임박', color: 'var(--a2)', mark: '∑' },
      { title: '주말 React 실전반', loc: '강남 캠퍼스', period: '8주 · 토·일', start: '2026.04.05 개강', seats: '정원 16명 · 9석 남음', price: '₩890,000', tag: '주말반', color: '#8b5cf6', mark: '⚛' },
      { title: '재직자 AWS 야간 부트캠프', loc: '판교 캠퍼스', period: '6주 · 화·목 저녁', start: '2026.03.10 개강', seats: '정원 18명 · 모집중', price: '고용보험 환급', tag: '야간반', color: '#f59e0b', mark: '☁' },
    ]
  }
  _certData() {
    return {
      aws: { name: 'AWS 클라우드', en: 'Solutions Architect', code: 'SAA-C03', pass: '92%', dur: '6주', exam: '온라인 · 130분', fee: '$150', color: '#f59e0b', mark: '☁', courseId: 'cloud', desc: '클라우드 입문부터 솔루션스 아키텍트 자격까지. 실습 중심으로 AWS 핵심 서비스를 익히고 한 번에 합격합니다.', curri: ['EC2 · VPC · IAM 기초', 'S3 · RDS · DynamoDB', '오토스케일링 · 로드밸런싱', '고가용성 아키텍처 설계', '실전 모의고사 3회분'] },
      sqld: { name: 'SQLD', en: 'SQL Developer', code: 'SQLD', pass: '89%', dur: '4주', exam: '필기 · 90분', fee: '₩50,000', color: 'var(--a1)', mark: 'SQL', courseId: 'sqld', desc: '데이터 모델링과 SQL 활용 능력을 검증하는 자격. 2주 단기 합격 커리큘럼으로 빠르게 취득합니다.', curri: ['데이터 모델링의 이해', 'SQL 기본 · 활용', '서브쿼리 · 조인', '집계 · 윈도우 함수', '기출 문제 완전 분석'] },
      info: { name: '정보처리기사', en: 'Engineer Info. Processing', code: '국가기술자격', pass: '87%', dur: '10주', exam: '필기 + 실기', fee: '₩38,200', color: 'var(--a2)', mark: 'OK', courseId: 'info', desc: 'IT 직무의 필수 국가기술자격. 필기와 실기를 한 번에 대비하는 패스 과정입니다.', curri: ['소프트웨어 설계', '데이터베이스 구축', '프로그래밍 언어 활용', '정보시스템 구축 관리', '실기 답안 작성 전략'] },
      comp: { name: '컴퓨터활용능력', en: 'Computer Proficiency', code: '컴활 1급', pass: '85%', dur: '5주', exam: '필기 + 실기', fee: '₩37,000', color: '#8b5cf6', mark: 'XL', courseId: 'comp', desc: '엑셀 · 액세스 실무 능력을 인증하는 사무 직무 필수 자격증. 단기 완성합니다.', curri: ['스프레드시트 기본', '함수 · 매크로', '데이터베이스 일반', '쿼리 · 폼 · 보고서', '실기 시뮬레이션'] },
    }
  }
  _reviews() {
    return [
      { text: '비전공자였는데 풀스택 부트캠프 듣고 6개월 만에 스타트업 개발자로 이직했어요. 인생이 바뀌었습니다.', name: '정OO', role: '프론트엔드 개발자', initial: '정', color: 'var(--a1)' },
      { text: 'SQLD 단기합격반 진짜 미쳤어요. 2주 공부하고 한 번에 합격. 강사님 설명이 핵심만 콕콕.', name: '김OO', role: '데이터 분석가', initial: '김', color: 'var(--a2)' },
      { text: '직장 다니면서 들었는데 모바일로 출퇴근 시간에 조금씩. 평생 수강이라 부담 없어요.', name: '이OO', role: '마케터 → 개발 전향', initial: '이', color: '#8b5cf6' },
      { text: '정보처리기사 필기 실기 한 번에 합격! 기출 분석이 정말 꼼꼼해서 시험장에서 당황 안 했어요.', name: '박OO', role: '대학생', initial: '박', color: '#f59e0b' },
    ]
  }

  // ── 인증 / 결제 액션 ─────────────────────────────────────────────────────────
  login = (provider) => { this.setState({ accountOpen: false }); signIn(provider) }
  logout = async () => { this.setState({ accountOpen: false }); await signOut() }
  navAuthClick = () => {
    if (this.state.user) this.setState((s) => ({ accountOpen: !s.accountOpen }))
    else this.setState({ accountOpen: true })
  }
  goEnrollPaid = () => this.setState({ screen: 'enroll', enrollFree: false, enrollStep: 1, openMenu: null })

  doPay = async () => {
    if (this.state.payBusy) return
    const sel = this._courses().find((c) => c.id === this.state.selectedId) || this._courses()[0]
    if (sel.priceNum <= 0) { this.setState({ screen: 'corporate' }); return }
    // 무료체험 모드면 결제 없이 수강신청
    if (this.state.enrollFree) {
      const r = await enrollFree({ courseId: sel.id, orderName: sel.title, user: this.state.user })
      if (r.ok) { alert('7일 무료체험 수강신청이 완료되었습니다!'); this.go('dashboard') }
      return
    }
    this.setState({ payBusy: true })
    const res = await requestPayment({ courseId: sel.id, orderName: sel.title, amount: sel.priceNum, payMethod: this.state.payMethod, user: this.state.user })
    this.setState({ payBusy: false })
    if (res.ok) {
      alert(res.testMode ? '✅ 테스트 결제가 완료되었습니다. (PortOne 키 연결 시 실결제)' : '✅ 결제가 완료되었습니다! 수강을 시작하세요.')
      this.go('dashboard')
    } else {
      alert('결제 실패: ' + (res.reason || '알 수 없는 오류'))
    }
  }

  // ── 렌더 데이터 ───────────────────────────────────────────────────────────────
  renderVals() {
    const all = this._courses().map((c) => ({ ...c, studentsLabel: c.students.toLocaleString(), onClick: () => this.go('detail', c.id) }))
    const sel = all.find((c) => c.id === this.state.selectedId) || all[0]
    const S = this.state.screen
    const om = this.state.openMenu
    const toggle = (k) => () => this.setState((s) => ({ openMenu: s.openMenu === k ? null : k }))
    const certGo = (tab) => () => this.setState({ screen: 'cert', certTab: tab, openMenu: null })
    const screenKeyMap = { aboutCompany: 'about', aboutInstructors: 'about', online: 'courses', offline: 'courses', corporate: 'corp', cert: 'cert', ai: 'ai', community: 'community' }
    const activeKey = screenKeyMap[S]
    const certData = this._certData()
    const certActive = certData[this.state.certTab] || certData.aws
    const user = this.state.user

    // ── 마이페이지: 실데이터(dash) 있으면 사용, 없으면 데모 폴백 ──
    const dash = this.state.dash
    const demoCourses = all.slice(0, 3).map((c, i) => ({ ...c, progress: [68, 32, 91][i], progressW: [68, 32, 91][i] + '%' }))
    const myCourses = dash
      ? dash.list.map((c) => ({ ...c, onClick: () => this.go('detail', c.course_id) }))
      : demoCourses
    const dashName = user ? user.name : '홍길동'
    const dashInitial = (dashName || '회').trim().charAt(0) || '회'
    const dashStats = dash ? dash.stats : { active: 3, completedLessons: 47, streak: 12, certificates: 2 }

    return {
      screen: S,
      isHome: S === 'home', isAboutCompany: S === 'aboutCompany', isAboutInstructors: S === 'aboutInstructors',
      isOnline: S === 'online', isOffline: S === 'offline', isCorporate: S === 'corporate', isCert: S === 'cert',
      isAi: S === 'ai', isCommunity: S === 'community', isDetail: S === 'detail', isEnroll: S === 'enroll', isDashboard: S === 'dashboard',
      goHome: () => this.go('home'), goOnline: () => this.go('online'), goOffline: () => this.go('offline'),
      goCorporate: () => this.go('corporate'), goAi: () => this.go('ai'), goCommunity: () => this.go('community'),
      goDashboard: () => this.go('dashboard'), goAboutCompany: () => this.go('aboutCompany'), goAboutInstructors: () => this.go('aboutInstructors'),
      goAbout: () => this.go('aboutCompany'), goCatalog: () => this.go('online'),
      goEnrollFree: () => this.setState({ screen: 'enroll', enrollFree: true, enrollStep: 1, openMenu: null }),
      // 인증/결제 연결
      goEnrollPaid: this.goEnrollPaid,
      doPay: this.doPay,
      navAuthClick: this.navAuthClick,
      navAuthLabel: user ? `${user.name} ▾` : '로그인',
      isLoggedIn: Boolean(user),
      buyerName: user ? user.name : '게스트 (로그인 권장)',
      buyerEmail: user ? user.email : 'student@dreamitbiz.co.kr',
      navMenu: [
        { key: 'about', label: 'About', items: [{ label: '회사소개', sub: '미션과 스토리', onClick: () => this.go('aboutCompany') }, { label: '강사소개', sub: '현직자 멘토진', onClick: () => this.go('aboutInstructors') }] },
        { key: 'courses', label: '강의', items: [{ label: '온라인 강의', sub: '평생 무제한 수강', onClick: () => this.go('online') }, { label: '오프라인 강의', sub: '강남·판교 부트캠프', onClick: () => this.go('offline') }] },
        { key: 'corp', label: '기업교육', items: null, top: () => this.go('corporate') },
        { key: 'cert', label: '자격증', items: [{ label: 'AWS', sub: 'Solutions Architect', onClick: certGo('aws') }, { label: 'SQLD', sub: 'SQL Developer', onClick: certGo('sqld') }, { label: '정보처리기사', sub: '국가기술자격', onClick: certGo('info') }, { label: '컴퓨터활용능력', sub: '컴활 1급', onClick: certGo('comp') }] },
        { key: 'ai', label: 'AI 활용', items: null, top: () => this.go('ai') },
        { key: 'community', label: '커뮤니티', items: null, top: () => this.go('community') },
      ].map((m) => ({ ...m, open: om === m.key, caret: m.items ? '▾' : '', onTop: m.items ? toggle(m.key) : m.top, btnColor: activeKey === m.key ? 'var(--text)' : 'var(--text2)', btnBg: activeKey === m.key ? 'rgba(var(--line),.06)' : 'transparent' })),
      openMenu: om,
      closeMenu: () => this.setState({ openMenu: null }),
      instructors: this._instructors(),
      aboutTimeline: [
        { year: '2018', title: '드림아이티비즈 설립', desc: '현직 개발자 3인이 모여 실무형 코딩 교육을 시작했습니다.' },
        { year: '2021', title: '온라인 플랫폼 런칭', desc: '평생 수강 모델과 1:1 코드 리뷰를 도입해 수강생 3만 명을 돌파했습니다.' },
        { year: '2023', title: '기업교육 사업 확장', desc: '삼성·LG 등 480개 기업에 맞춤형 사내 교육을 제공하기 시작했습니다.' },
        { year: '2026', title: '12만 수강생 · AI 교육', desc: 'AI 활용 커리큘럼을 전면 도입하며 누적 수강생 12만 명을 넘었습니다.' },
      ],
      aboutValues: [
        { icon: '▶', title: '실무가 먼저', desc: '이론을 위한 이론이 아니라, 현업에서 바로 쓰는 것을 가르칩니다.', bg: 'rgba(var(--a1-rgb),.12)' },
        { icon: '∞', title: '끝까지 함께', desc: '수강은 평생, 질문은 무제한. 수료가 아니라 취업까지 책임집니다.', bg: 'rgba(var(--a2-rgb),.12)' },
        { icon: '◆', title: '정직한 교육', desc: '과장 없는 커리큘럼과 투명한 후기. 결과로 증명합니다.', bg: 'rgba(139,92,246,.12)' },
      ],
      onlineBenefits: [{ icon: '∞', text: '평생 무제한 수강' }, { icon: '▷', text: '모바일·PC 학습' }, { icon: '◷', text: '1:1 코드 리뷰' }],
      offlineHighlights: ['실습 80% 몰입형', '동료 네트워킹', '취업 연계', '국비지원·고용보험 환급'],
      onlineCourses: all.filter((c) => c.cat !== 'biz'),
      offlinePrograms: this._offline(),
      certTabs: [{ key: 'aws', label: 'AWS' }, { key: 'sqld', label: 'SQLD' }, { key: 'info', label: '정보처리기사' }, { key: 'comp', label: '컴퓨터활용능력' }].map((t) => ({ ...t, active: t.key === this.state.certTab, tabBg: t.key === this.state.certTab ? 'var(--a2)' : 'rgba(var(--line),.05)', tabColor: t.key === this.state.certTab ? '#0a0b10' : 'var(--text2)', onClick: () => this.setState({ certTab: t.key }) })),
      certActive,
      certGoCourse: () => this.go('detail', certActive.courseId),
      corpProcess: [
        { n: '01', t: '니즈 진단', d: '담당자 미팅으로 직무 역량 갭과 교육 목표를 진단합니다.' },
        { n: '02', t: '커리큘럼 설계', d: '직무 맞춤 커리큘럼과 실습 프로젝트를 제안서로 제공합니다.' },
        { n: '03', t: '교육 운영', d: '온·오프라인 혼합 운영, 전담 매니저가 학습을 관리합니다.' },
        { n: '04', t: '성과 리포트', d: '이수율·역량 향상도·만족도를 데이터 리포트로 제공합니다.' },
      ],
      corpRecords: [
        { company: '삼성전자', topic: '사내 DX · 데이터 리터러시', people: '320명', period: '2025.09–11', rating: '4.9' },
        { company: 'LG CNS', topic: '클라우드 / AWS 전환 교육', people: '180명', period: '2025.07–08', rating: '4.8' },
        { company: '현대오토에버', topic: '백엔드 개발 부트캠프', people: '96명', period: '2025.05–07', rating: '4.9' },
        { company: '우아한형제들', topic: '프론트엔드 심화 워크숍', people: '64명', period: '2025.04', rating: '5.0' },
        { company: 'NCSOFT', topic: 'AI / ML 실무 적용 과정', people: '120명', period: '2025.03–04', rating: '4.8' },
      ],
      aiTools: [
        { name: 'ChatGPT', use: '코드 생성 · 리팩터링 · 설명', icon: '✦', color: 'var(--a2)' },
        { name: 'GitHub Copilot', use: 'IDE 자동완성 페어 프로그래밍', icon: '⌥', color: 'var(--a1)' },
        { name: 'Claude', use: '대용량 문서 · 코드베이스 분석', icon: '◇', color: '#f59e0b' },
        { name: 'Cursor', use: 'AI 네이티브 코드 에디터', icon: '➤', color: '#8b5cf6' },
      ],
      aiCases: [
        { t: '코드 리뷰 자동화', d: 'PR 변경점을 AI로 1차 리뷰하고 버그·스타일 이슈를 잡아냅니다.', tag: '개발' },
        { t: '데이터 분석 가속', d: '자연어로 질문하면 분석 코드와 시각화를 자동 생성합니다.', tag: '데이터' },
        { t: 'AI 학습 튜터', d: '막히는 개념을 1:1로 설명받고 예제 문제를 무한 생성합니다.', tag: '학습' },
        { t: '문서 · 테스트 작성', d: '주석, README, 단위 테스트 초안을 자동으로 작성합니다.', tag: '생산성' },
      ],
      aiCourses: all.filter((c) => ['ai', 'data', 'fullstack'].includes(c.id)),
      detailLearn: ['실무 프로젝트 완성', '포트폴리오 제작', '코드 리뷰 피드백', '수료증 발급'],
      detailCurriculum: [
        { t: '오리엔테이션 & 개발 환경 설정', n: 6 }, { t: '핵심 개념 마스터하기', n: 24 }, { t: '실전 프로젝트 ①', n: 32 }, { t: '심화 · 성능 최적화', n: 28 }, { t: '포트폴리오 완성 & 배포', n: 18 },
      ],
      detailIncludes: [
        { icon: '∞', text: '평생 무제한 수강' }, { icon: '▷', text: '전 강의 풀 액세스 · 모바일 학습' }, { icon: '◷', text: '1:1 코드 리뷰 & 질문' }, { icon: '★', text: '수료증 발급 · 취업 연계' },
      ],
      payMethods: [{ key: 'card', label: '신용카드' }, { key: 'trans', label: '계좌이체' }, { key: 'phone', label: '휴대폰' }].map((m) => {
        const a = m.key === this.state.payMethod
        return { ...m, onClick: () => this.setState({ payMethod: m.key }), color: a ? 'var(--a2)' : 'var(--text2)', bg: a ? 'rgba(var(--a2-rgb),.1)' : 'rgba(var(--line),.04)', border: a ? 'rgba(var(--a2-rgb),.5)' : 'rgba(var(--line),.1)' }
      }),
      communityCats: [{ label: '전체', count: '2.4k' }, { label: '질문/답변', count: '982' }, { label: '스터디 모집', count: '416' }, { label: '취업 후기', count: '538' }, { label: '프로젝트', count: '301' }].map((c, i) => ({ ...c, active: i === 0, catColor: i === 0 ? '#0a0b10' : 'var(--text2)', catBg: i === 0 ? 'var(--a2)' : 'rgba(var(--line),.05)' })),
      communityPosts: [
        { cat: '취업 후기', title: '비전공 → 백엔드 개발자 합격 후기 (6개월 기록)', author: '코딩하는곰', time: '2시간 전', likes: 142, comments: 38, hot: true, color: 'var(--a1)', initial: '곰' },
        { cat: '질문/답변', title: 'React useEffect 의존성 배열, 이럴 땐 어떻게 하나요?', author: '리액트초보', time: '4시간 전', likes: 24, comments: 12, color: 'var(--a2)', initial: '리' },
        { cat: '스터디 모집', title: '[모집] SQLD 2주 단기 합격 스터디 (4/6명)', author: '데이터덕후', time: '6시간 전', likes: 56, comments: 21, color: '#8b5cf6', initial: '데' },
        { cat: '프로젝트', title: '풀스택 부트캠프 최종 프로젝트 공유합니다 🚀', author: '풀스택지망생', time: '어제', likes: 88, comments: 29, color: '#f59e0b', initial: '풀' },
        { cat: '취업 후기', title: 'AWS SAA 2주 합격 + 클라우드 직무로 이직 성공', author: '구름과나', time: '어제', likes: 103, comments: 33, color: 'var(--a1)', initial: '구' },
      ],
      studyGroups: [
        { t: '정보처리기사 실기 스터디', members: '8/10', day: '화·목 20시', tag: '자격증' },
        { t: '알고리즘 코테 대비반', members: '12/12', day: '토 10시', tag: '코딩테스트' },
        { t: '토이프로젝트 사이드팀', members: '5/6', day: '온라인 상시', tag: '프로젝트' },
      ],
      communityEvents: [
        { d: '03.20', t: '현직 개발자 커리어 토크', tag: '온라인 LIVE' },
        { d: '03.27', t: '해커톤: 48시간 챌린지', tag: '오프라인' },
        { d: '04.03', t: 'AI 활용 실습 워크숍', tag: '온라인' },
      ],
      myCourses,
      dashName, dashInitial,
      dashActive: dashStats.active,
      dashLessons: dashStats.completedLessons,
      dashStreak: dashStats.streak,
      dashCerts: dashStats.certificates,
      enrollStep: this.state.enrollStep,
      payMethod: this.state.payMethod,
      setStep: (n) => this.setState({ enrollStep: n }),
      setPay: (p) => this.setState({ payMethod: p }),
      enrollFree: this.state.enrollFree,
      mode: this.state.mode,
      isLight: this.state.mode === 'light',
      toggleMode: this.toggleMode,
      modeIcon: this.state.mode === 'dark' ? '☀' : '☾',
      modeLabel: this.state.mode === 'dark' ? 'Light' : 'Dark',
      paletteOpen: this.state.paletteOpen,
      togglePalette: () => this.setState((s) => ({ paletteOpen: !s.paletteOpen })),
      closePalette: () => this.setState({ paletteOpen: false }),
      themes: this._themes().map((t) => {
        const active = t.key === this.state.theme
        return { ...t, active, check: active ? '✓' : '', activeBg: active ? 'rgba(var(--line),.06)' : 'transparent', activeBorder: active ? 'rgba(var(--line),.14)' : 'transparent', onClickPick: () => this.pickTheme(t.key) }
      }),
      partnersLoop: ['NAVER', 'KAKAO', 'SAMSUNG', 'LG CNS', 'COUPANG', '우아한형제들', 'TOSS', '당근', 'LINE', 'SK', '현대오토에버', 'NCSOFT', 'NAVER', 'KAKAO', 'SAMSUNG', 'LG CNS', 'COUPANG', '우아한형제들', 'TOSS', '당근', 'LINE', 'SK', '현대오토에버', 'NCSOFT'],
      categories: [
        { title: '코딩·개발', icon: '</>', desc: '웹·앱·백엔드 풀스택 실무 코딩', count: '124개 강의', bg: 'linear-gradient(160deg,#101a22,#0e1018)', onClick: () => this.go('online') },
        { title: '자격증', icon: '✓', desc: '정보처리기사·SQLD·컴활 합격', count: '86개 강의', bg: 'linear-gradient(160deg,#16210f,#0e1018)', onClick: () => this.go('cert') },
        { title: '데이터·AI', icon: '∑', desc: '데이터 분석·머신러닝·LLM', count: '72개 강의', bg: 'linear-gradient(160deg,#1a1424,#0e1018)', onClick: () => this.go('online') },
        { title: '기업교육', icon: '⌘', desc: '임직원 맞춤 DX 사내교육', count: 'B2B 문의', bg: 'linear-gradient(160deg,#0f1c1f,#0e1018)', onClick: () => this.go('corporate') },
      ],
      popularCourses: all.slice(0, 4),
      features: [
        { icon: '▶', title: '현직자 실무 커리큘럼', desc: '네이버·카카오·토스 현직 개발자가 실제 프로젝트 기반으로 가르칩니다.', bg: 'rgba(var(--a1-rgb),.12)' },
        { icon: '∞', title: '평생 무제한 수강', desc: '한 번 결제로 강의 업데이트까지 평생 무제한. 진도 제한 없이 내 속도로.', bg: 'rgba(var(--a2-rgb),.12)' },
        { icon: '◷', title: '1:1 코드 리뷰', desc: '막히는 부분은 멘토에게 질문. 24시간 내 코드 리뷰와 피드백을 받아요.', bg: 'rgba(139,92,246,.12)' },
        { icon: '★', title: '수료증 & 취업연계', desc: '수료증 발급은 물론, 파트너 기업 480곳에 채용 추천까지 연결합니다.', bg: 'rgba(245,158,11,.12)' },
      ],
      steps: [
        { num: '01', title: '강의 선택', desc: '320개 강의 중 내 목표에 맞는 강의를 고르고 7일간 무료로 체험해보세요.', color: 'var(--a1)' },
        { num: '02', title: '매일 학습', desc: '모바일·PC 어디서나. 짧은 강의 + 실습으로 하루 1시간이면 충분합니다.', color: 'var(--a2)' },
        { num: '03', title: '수료 & 성장', desc: '수료증을 받고 포트폴리오를 완성. 자격증 합격과 취업까지 이어집니다.', color: '#8b5cf6' },
      ],
      reviewsLoop: this._reviews().concat(this._reviews()),
      footerCols: [
        { head: '강의', items: ['코딩·개발', '자격증', '데이터·AI', '기업교육', '무료 강의'] },
        { head: '회사', items: ['회사소개', '수강후기', '채용', '공지사항'] },
        { head: '고객지원', items: ['자주 묻는 질문', '1:1 문의', '환불 정책', '이용 가이드'] },
      ],
      sel,
    }
  }

  // 디자인 외부에 얹는 로그인/계정 오버레이
  _renderAccountOverlay() {
    if (!this.state.accountOpen) return null
    const { user } = this.state
    const backdrop = {
      position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }
    const card = {
      width: '100%', maxWidth: '360px', background: 'var(--panel, #12141c)', color: 'var(--text, #e8eaf0)',
      border: '1px solid rgba(255,255,255,.1)', borderRadius: '18px', padding: '26px',
      boxShadow: '0 30px 80px rgba(0,0,0,.5)', fontFamily: "'Pretendard',sans-serif",
    }
    const btn = (bg, color) => ({
      width: '100%', padding: '13px', borderRadius: '11px', border: 'none', cursor: 'pointer',
      fontFamily: "'Pretendard',sans-serif", fontWeight: 700, fontSize: '14.5px', marginTop: '10px',
      background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    })
    const close = (e) => { if (e.target === e.currentTarget) this.setState({ accountOpen: false }) }
    return (
      <div style={backdrop} onClick={close}>
        <div style={card}>
          {user ? (
            <>
              <div style={{ fontWeight: 800, fontSize: '18px', marginBottom: '4px' }}>{user.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--muted2,#7c8298)', marginBottom: '18px' }}>{user.email}</div>
              <button style={btn('linear-gradient(135deg,var(--a2),var(--a1))', '#0a0b10')} onClick={() => this.go('dashboard')}>마이페이지</button>
              <button style={btn('rgba(255,255,255,.06)', 'var(--text,#e8eaf0)')} onClick={this.logout}>로그아웃</button>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 800, fontSize: '19px', marginBottom: '6px' }}>로그인 / 회원가입</div>
              <div style={{ fontSize: '13px', color: 'var(--muted2,#7c8298)', marginBottom: '18px' }}>소셜 계정으로 3초 만에 시작하세요</div>
              <button style={btn('#fff', '#1f1f1f')} onClick={() => this.login('google')}>
                <span style={{ fontWeight: 800 }}>G</span> Google 로그인
              </button>
              <button style={btn('#FEE500', '#191600')} onClick={() => this.login('kakao')}>
                <span style={{ fontWeight: 800 }}>K</span> 카카오 로그인
              </button>
              <button style={{ ...btn('transparent', 'var(--muted2,#7c8298)'), marginTop: '14px', fontWeight: 500, fontSize: '13px' }} onClick={() => this.setState({ accountOpen: false })}>닫기</button>
            </>
          )}
        </div>
      </div>
    )
  }

  render() {
    return (
      <>
        {renderTemplate(PATCHED_TEMPLATE, this.renderVals())}
        {this._renderAccountOverlay()}
        <ChatWidget />
      </>
    )
  }
}
