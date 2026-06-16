# 상담 채팅봇 설정 가이드

메인페이지 우측 하단의 채팅 팝업은 **Supabase Edge Function**을 통해 동작합니다.
브라우저는 Edge Function만 호출하고, 실제 **Solar / OpenAI 호출과 API 키 사용은 서버(Edge Function)에서만** 일어납니다.
→ API 키가 브라우저(개발자도구·네트워크 탭)에 절대 노출되지 않습니다.

```
브라우저(ChatWidget)
   └─ supabase.functions.invoke('chat')
        └─ Edge Function  ── Solar(우선) ──▶ 실패 시 ──▶ OpenAI(폴백)
             (키는 Supabase Secrets에서만 읽음)
```

구성 파일:
- `supabase/functions/chat/index.ts` — Edge Function (서버)
- `src/lib/chat.js` — 프론트 호출 모듈
- `src/ChatWidget.jsx` — 우측 하단 팝업 UI
- `src/App.jsx` — `<ChatWidget />` 연결

---

## 1. Supabase CLI 설치 & 로그인

```bash
npm install -g supabase     # 또는: scoop install supabase
supabase login
```

## 2. 프로젝트 연결

`<PROJECT_REF>`는 Supabase 대시보드 → Project Settings → General의 "Reference ID"입니다.
(또는 프로젝트 URL `https://<PROJECT_REF>.supabase.co` 에서 확인)

```bash
cd rest06--
supabase link --project-ref <PROJECT_REF>
```

## 3. API 키를 Supabase Secrets에 저장 (★ 핵심)

```bash
supabase secrets set SOLAR_API_KEY=업스테이지에서_발급한_키
supabase secrets set OPENAI_API_KEY=오픈AI에서_발급한_키
```

- Solar 키 발급: https://console.upstage.ai/api-keys
- OpenAI 키 발급: https://platform.openai.com/api-keys
- 두 키 중 하나만 설정해도 동작합니다(그 제공자만 사용). 둘 다 넣으면 Solar 우선·OpenAI 폴백.
- 저장된 시크릿 확인: `supabase secrets list`

## 4. Edge Function 배포

```bash
supabase functions deploy chat
```

> 이 채팅봇은 로그인 없이 누구나 사용할 수 있도록 합니다.
> 함수 호출 시 JWT 검증을 끄려면(권장: 익명 상담 허용) 아래처럼 배포하세요.
> ```bash
> supabase functions deploy chat --no-verify-jwt
> ```
> 로그인 사용자만 쓰게 하려면 `--no-verify-jwt` 없이 배포하세요.

## 5. 로컬 테스트 (선택)

```bash
# 로컬에서 시크릿을 쓰려면 supabase/.env 파일에 키를 넣고:
#   SOLAR_API_KEY=...
#   OPENAI_API_KEY=...
supabase functions serve chat --env-file supabase/.env --no-verify-jwt
```

그리고 다른 터미널에서 프론트를 실행: `npm run dev`

---

## 모델 / 동작 바꾸기

`supabase/functions/chat/index.ts` 상단 상수만 수정하면 됩니다.

| 상수 | 기본값 | 설명 |
|------|--------|------|
| `SOLAR_MODEL` | `solar-pro2` | 최신은 `solar-pro3` |
| `OPENAI_MODEL` | `gpt-4o-mini` | 폴백 모델 |
| `MAX_HISTORY` | `12` | 컨텍스트로 보낼 최근 메시지 수 |
| `SYSTEM_PROMPT` | (사이트/강좌 안내) | 봇의 역할·말투·지식 |

수정 후 `supabase functions deploy chat`로 재배포하세요.

## 보안 메모

- `Access-Control-Allow-Origin`이 현재 `*`입니다. 운영 시 실제 도메인
  (예: `https://rest06.dreamitbiz.com`)으로 제한하면 더 안전합니다.
- API 키는 **절대 프론트엔드(.env의 `VITE_*`)에 넣지 마세요.** `VITE_` 변수는 빌드 결과물에 그대로 포함되어 노출됩니다.
