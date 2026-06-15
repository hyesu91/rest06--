# rest06 — 드림아이티비즈(DreamIT Biz)

온라인 IT 교육 플랫폼 랜딩/수강 사이트. 코딩·자격증·데이터 AI 실무 교육.

- **배포**: https://rest06.dreamitbiz.com (GitHub Pages, `main` push 시 Actions 자동배포)
- **스택**: React 18 + Vite 5 + Supabase + 아임포트(PortOne v2)
- **인증**: 구글 · 카카오 소셜 로그인 (Supabase Auth OAuth)
- **결제**: 아임포트(PortOne) — 신용카드 · 계좌이체 · 휴대폰

## 구조

```
src/
├── main.jsx          진입점
├── App.jsx           앱 컨트롤러 (화면 상태·테마·인증·결제 연결)
├── dcRuntime.jsx     DC 템플릿 → React 렌더러 (sc-for / sc-if / {{ }})
├── template.js       랜딩 뷰 템플릿 (디자인 아티팩트에서 추출)
├── global.css        전역 스타일·애니메이션
└── lib/
    ├── supabase.js   Supabase 클라이언트 + 테이블명
    ├── auth.js       구글·카카오 로그인 / 세션 / 프로필
    └── payment.js    아임포트 결제 + 무료수강 + 기록
reference/rest06.original.html   원본 디자인 아티팩트 (단일 HTML 번들)
sql/schema.sql                   Supabase 테이블·RLS (rest06_ 접두사)
```

> 디자인은 원본 아티팩트(Claude dc-runtime)의 마크업·스타일을 100% 보존하고,
> 템플릿 엔진만 React로 재구현했습니다. 폰트는 임베드 → CDN(Google Fonts·Pretendard)으로 대체.

## 필요한 환경변수 (GitHub Secrets → Actions 빌드 주입)

`.env.example` 참고. 로컬은 `.env` 파일, 배포는 리포지토리 **Secrets** 에 등록.

| 변수 | 용도 |
|---|---|
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |
| `VITE_PORTONE_STORE_ID` | 아임포트(PortOne) 상점 식별코드 |
| `VITE_PORTONE_CHANNEL_KEY` | 아임포트 채널 키 |

키가 없어도 랜딩 페이지는 정상 동작하며, 로그인/결제만 비활성(결제는 테스트 모드)으로 동작합니다.

## 연동 체크리스트

1. **Supabase**: `sql/schema.sql` 을 SQL Editor 에서 실행 (rest06_ 테이블 + RLS).
2. **소셜 로그인**: Supabase 대시보드 > Authentication > Providers 에서 **Google**, **Kakao** 활성화.
   - Redirect URL: `https://rest06.dreamitbiz.com` (및 로컬 `http://localhost:5173`).
3. **아임포트**: PortOne 콘솔에서 결제대행사 채널 연결 후 storeId·channelKey 발급 → Secrets 등록.

## 개발

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
```
