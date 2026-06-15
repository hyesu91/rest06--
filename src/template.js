// DreamIT Biz 랜딩 뷰 템플릿 (디자인 아티팩트에서 추출).
// DC 템플릿 문법: <sc-for list as>, <sc-if value>, {{ expr }}, onclick="{{ }}", style-hover.
export const TEMPLATE = `<div data-root="" style="--a1:#22d3ee; --a1-rgb:34,211,238; --a2:#a3e635; --a2-rgb:163,230,53; --bg:#0a0b10; --bg-rgb:10,11,16; --surface:#0c0e15; --panel:#12141c; --text:#e8eaf0; --text2:#c4c9d8; --muted:#9aa0b4; --muted2:#7c8298; --faint:#5d6478; --line:255,255,255; color:var(--text); position:relative; min-height:100vh; background:var(--bg); isolation:isolate;">

  

  <!-- ============ NAV ============ -->
  <nav style="position:fixed; top:0; left:0; right:0; z-index:100; display:flex; align-items:center; justify-content:space-between; gap:12px; padding:0 clamp(12px,2.4vw,40px); height:72px; background:rgba(var(--bg-rgb),.82); backdrop-filter:blur(18px); border-bottom:1px solid rgba(var(--line),.07);">
    <div onclick="{{ goHome }}" style="display:flex; align-items:center; gap:10px; cursor:pointer; user-select:none; flex-shrink:0;">
      <div style="width:34px; height:34px; border-radius:9px; background:linear-gradient(135deg,var(--a1),var(--a2)); display:grid; place-items:center; font-family:'JetBrains Mono',monospace; font-weight:700; color:#0a0b10; font-size:17px; box-shadow:0 6px 22px rgba(var(--a1-rgb),.35); flex-shrink:0;">&lt;/&gt;</div>
      <div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:19px; letter-spacing:-.02em; white-space:nowrap;">DREAM<span style="color:var(--a2);">IT</span> <span style="color:var(--faint); font-weight:500;">BIZ</span></div>
    </div>
    <div style="display:flex; align-items:center; gap:1px;" data-desktop-nav="">
      <sc-for list="{{ navMenu }}" as="m" hint-placeholder-count="6">
        <div style="position:relative;">
          <button onclick="{{ m.onTop }}" style="display:flex; align-items:center; gap:4px; background:{{ m.btnBg }}; border:none; color:{{ m.btnColor }}; font-family:'Pretendard',sans-serif; font-size:14.5px; font-weight:500; padding:9px 11px; border-radius:9px; cursor:pointer; white-space:nowrap; transition:color .18s, background .18s;" style-hover="background:rgba(var(--line),.07); color:var(--text);">
            {{ m.label }}<span style="font-size:9px; color:var(--muted);">{{ m.caret }}</span>
          </button>
          <sc-if value="{{ m.open }}" hint-placeholder-val="{{ false }}">
            <div>
              <div onclick="{{ closeMenu }}" style="position:fixed; inset:0; z-index:110;"></div>
              <div style="position:absolute; top:46px; left:0; z-index:120; min-width:236px; padding:8px; background:var(--panel); border:1px solid rgba(var(--line),.12); border-radius:14px; box-shadow:0 24px 60px rgba(0,0,0,.5);">
                <sc-for list="{{ m.items }}" as="it" hint-placeholder-count="2">
                  <button onclick="{{ it.onClick }}" style="display:flex; flex-direction:column; align-items:flex-start; gap:2px; width:100%; padding:10px 12px; background:none; border:none; border-radius:10px; cursor:pointer; text-align:left; transition:background .12s;" style-hover="background:rgba(var(--line),.07);">
                    <span style="font-size:14.5px; font-weight:600; color:var(--text);">{{ it.label }}</span>
                    <span style="font-size:11.5px; color:var(--muted); font-family:'JetBrains Mono',monospace;">{{ it.sub }}</span>
                  </button>
                </sc-for>
              </div>
            </div>
          </sc-if>
        </div>
      </sc-for>
    </div>
    <div style="display:flex; align-items:center; gap:9px; flex-shrink:0;">
      <button onclick="{{ toggleMode }}" title="다크/라이트 모드 전환" style="display:grid; place-items:center; width:38px; height:38px; background:rgba(var(--line),.05); border:1px solid rgba(var(--line),.14); border-radius:11px; cursor:pointer; font-size:16px; line-height:1; color:var(--a2); transition:background .15s, border-color .15s;" style-hover="background:rgba(var(--line),.1); border-color:rgba(var(--line),.28);">{{ modeIcon }}</button>
      <div style="position:relative;">
        <button onclick="{{ togglePalette }}" title="컬러 테마 변경" style="display:flex; align-items:center; gap:8px; background:rgba(var(--line),.05); border:1px solid rgba(var(--line),.14); padding:8px 11px; border-radius:11px; cursor:pointer; transition:background .15s, border-color .15s;" style-hover="background:rgba(var(--line),.1); border-color:rgba(var(--line),.28);">
          <span style="display:flex; flex-shrink:0;">
            <span style="width:15px; height:15px; border-radius:50%; background:var(--a1); border:2px solid var(--panel);"></span>
            <span style="width:15px; height:15px; border-radius:50%; background:var(--a2); border:2px solid var(--panel); margin-left:-6px;"></span>
          </span>
        </button>
        <sc-if value="{{ paletteOpen }}" hint-placeholder-val="{{ false }}">
          <div>
            <div onclick="{{ closePalette }}" style="position:fixed; inset:0; z-index:110;"></div>
            <div style="position:absolute; top:50px; right:0; z-index:120; width:236px; padding:10px; background:var(--panel); border:1px solid rgba(var(--line),.12); border-radius:16px; box-shadow:0 24px 60px rgba(0,0,0,.65);">
              <div style="font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--faint); padding:5px 8px 9px; letter-spacing:.08em;">// COLOR THEME</div>
              <sc-for list="{{ themes }}" as="t" hint-placeholder-count="6">
                <button onclick="{{ t.onClickPick }}" style="display:flex; align-items:center; gap:11px; width:100%; padding:9px 10px; background:{{ t.activeBg }}; border:1px solid {{ t.activeBorder }}; border-radius:11px; cursor:pointer; margin-bottom:5px;" style-hover="background:rgba(var(--line),.08);">
                  <span style="display:flex; flex-shrink:0;">
                    <span style="width:21px; height:21px; border-radius:50%; background:{{ t.a1 }}; border:2px solid #12141c;"></span>
                    <span style="width:21px; height:21px; border-radius:50%; background:{{ t.a2 }}; border:2px solid #12141c; margin-left:-8px;"></span>
                  </span>
                  <span style="font-family:'Pretendard',sans-serif; font-size:13.5px; font-weight:500; color:var(--text); flex:1; text-align:left;">{{ t.name }}</span>
                  <span style="font-size:13px; color:var(--a2); width:14px;">{{ t.check }}</span>
                </button>
              </sc-for>
            </div>
          </div>
        </sc-if>
      </div>
      <button onclick="{{ goDashboard }}" style="background:none; border:none; color:var(--text2); font-size:15px; font-weight:500; font-family:'Pretendard',sans-serif; padding:9px 12px; cursor:pointer; border-radius:9px; white-space:nowrap;" style-hover="color:var(--text);" data-desktop-nav="">로그인</button>
      <button onclick="{{ goEnrollFree }}" style="font-family:'Pretendard',sans-serif; font-weight:700; font-size:14px; color:#0a0b10; background:linear-gradient(135deg,var(--a2),var(--a1)); border:none; padding:11px 20px; border-radius:11px; cursor:pointer; box-shadow:0 8px 24px rgba(var(--a2-rgb),.28); transition:transform .15s, box-shadow .15s; white-space:nowrap;" style-hover="transform:translateY(-2px); box-shadow:0 12px 30px rgba(var(--a2-rgb),.42);">무료체험 →</button>
    </div>
  </nav>

  <!-- ============ SCREENS ============ -->
  <main style="padding-top:72px;">

    <!-- ====== HOME ====== -->
    <sc-if value="{{ isHome }}" hint-placeholder-val="{{ true }}">
      <div>

        <!-- HERO -->
        <section style="position:relative; overflow:hidden; padding:clamp(48px,9vh,110px) clamp(16px,4vw,48px) clamp(60px,8vh,90px);">
          <!-- bg grid -->
          <div style="position:absolute; inset:0; background-image:linear-gradient(rgba(var(--line),.035) 1px,transparent 1px),linear-gradient(90deg,rgba(var(--line),.035) 1px,transparent 1px); background-size:56px 56px; animation:dib-grid 9s linear infinite; mask-image:radial-gradient(ellipse 85% 70% at 50% 30%,#000 35%,transparent 78%); -webkit-mask-image:radial-gradient(ellipse 85% 70% at 50% 30%,#000 35%,transparent 78%); z-index:-2;"></div>
          <!-- orbs -->
          <div style="position:absolute; top:-80px; left:-60px; width:380px; height:380px; border-radius:50%; background:radial-gradient(circle,rgba(var(--a1-rgb),.28),transparent 70%); filter:blur(30px); animation:dib-orb 16s ease-in-out infinite; z-index:-1;"></div>
          <div style="position:absolute; bottom:-120px; right:-40px; width:420px; height:420px; border-radius:50%; background:radial-gradient(circle,rgba(var(--a2-rgb),.22),transparent 70%); filter:blur(34px); animation:dib-orb 20s ease-in-out infinite reverse; z-index:-1;"></div>

          <div style="max-width:1180px; margin:0 auto; display:grid; grid-template-columns:1.15fr .85fr; gap:48px; align-items:center;" data-hero-grid="">
            

            <!-- floating code card -->
            <div>
              <div data-reveal="" style="display:inline-flex; align-items:center; gap:9px; padding:7px 14px; border:1px solid rgba(var(--a2-rgb),.35); border-radius:999px; background:rgba(var(--a2-rgb),.07); font-family:'JetBrains Mono',monospace; font-size:12.5px; color:var(--a2); margin-bottom:24px;">
                <span style="width:7px; height:7px; border-radius:50%; background:var(--a2); box-shadow:0 0 10px var(--a2); animation:dib-blink 1.4s infinite;"></span>
                NOW ENROLLING · 2026 봄학기 모집중
              </div>
              <h1 data-reveal="" style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(38px,5.6vw,68px); line-height:1.04; letter-spacing:-.03em; margin:0 0 22px;">
                코드로<br>
                <span style="position:relative; display:inline-block;">
                  <span data-rotator="" style="background:linear-gradient(100deg,var(--a1),var(--a2)); -webkit-background-clip:text; background-clip:text; color:transparent;">개발자</span><span style="display:inline-block; width:3px; height:.85em; background:var(--a2); margin-left:4px; vertical-align:-6px; animation:dib-blink 1s steps(1) infinite;"></span>
                </span><br>
                되는 가장 빠른 길.
              </h1>
              <p data-reveal="" style="font-size:clamp(15px,1.6vw,18px); line-height:1.7; color:var(--muted); max-width:480px; margin:0 0 32px;">
                코딩·자격증·데이터 AI까지. <strong style="color:var(--text); font-weight:600;">드림아이티비즈</strong>의 실무형 커리큘럼으로 커리어를 업그레이드하세요. <span style="font-family:'JetBrains Mono',monospace; color:var(--a1); font-size:.92em;">// 3천 명 이상이 선택한 강의</span>
              </p>
              <div data-reveal="" style="display:flex; flex-wrap:wrap; gap:13px; margin-bottom:40px;">
                <button onclick="{{ goCatalog }}" style="font-family:'Pretendard',sans-serif; font-weight:700; font-size:16px; color:#0a0b10; background:linear-gradient(135deg,var(--a2),var(--a1)); border:none; padding:16px 28px; border-radius:13px; cursor:pointer; box-shadow:0 10px 30px rgba(var(--a2-rgb),.3); transition:transform .15s, box-shadow .15s;" style-hover="transform:translateY(-3px); box-shadow:0 16px 40px rgba(var(--a2-rgb),.45);">강의 둘러보기 →</button>
                <button onclick="{{ goEnrollFree }}" style="font-family:'Pretendard',sans-serif; font-weight:600; font-size:16px; color:var(--text); background:rgba(var(--line),.05); border:1px solid rgba(var(--line),.16); padding:16px 28px; border-radius:13px; cursor:pointer; transition:background .15s, border-color .15s;" style-hover="background:rgba(var(--line),.1); border-color:rgba(var(--a1-rgb),.5);">▶ 7일 무료체험</button>
              </div>
              <div data-reveal="" style="display:flex; gap:clamp(20px,3vw,40px);">
                <div><div data-counter="students" data-target="124000" data-suffix="+" style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:30px; color:var(--text);">0</div><div style="font-size:12.5px; color:var(--muted2); font-family:'JetBrains Mono',monospace; letter-spacing:.02em;">수강생</div></div>
                <div style="width:1px; background:rgba(var(--line),.1);"></div>
                <div><div data-counter="courses" data-target="320" data-suffix="+" style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:30px; color:var(--text);">0</div><div style="font-size:12.5px; color:var(--muted2); font-family:'JetBrains Mono',monospace;">개설 강의</div></div>
                <div style="width:1px; background:rgba(var(--line),.1);"></div>
                <div><div data-counter="rate" data-target="94" data-suffix="%" style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:30px; color:var(--a2);">0</div><div style="font-size:12.5px; color:var(--muted2); font-family:'JetBrains Mono',monospace;">수료 만족도</div></div>
              </div>
            </div><div data-reveal="" style="position:relative; height:380px;" data-hero-art="">
              <div style="position:absolute; inset:0; margin:auto; width:100%; max-width:380px; height:300px; background:#0e1018; border:1px solid rgba(var(--line),.1); border-radius:18px; box-shadow:0 30px 70px rgba(0,0,0,.5); overflow:hidden; animation:dib-float 6s ease-in-out infinite;">
                <div style="display:flex; align-items:center; gap:7px; padding:13px 16px; border-bottom:1px solid rgba(var(--line),.07); background:#0a0c12;">
                  <span style="width:11px; height:11px; border-radius:50%; background:#ff5f57;"></span>
                  <span style="width:11px; height:11px; border-radius:50%; background:#febc2e;"></span>
                  <span style="width:11px; height:11px; border-radius:50%; background:#28c840;"></span>
                  <span style="margin-left:8px; font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--faint);">career.py</span>
                </div>
                <div style="padding:18px; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.85;">
                  <div><span style="color:#c678dd;">def</span> <span style="color:#61afef;">grow</span>(<span style="color:#e06c75;">you</span>):</div>
                  <div style="padding-left:20px;"><span style="color:var(--faint);"># 매일 1시간씩</span></div>
                  <div style="padding-left:20px;"><span style="color:#e06c75;">skills</span> <span style="color:#56b6c2;">+=</span> <span style="color:#98c379;">"coding"</span></div>
                  <div style="padding-left:20px;"><span style="color:#c678dd;">while</span> <span style="color:#d19a66;">growing</span>:</div>
                  <div style="padding-left:40px;"><span style="color:#61afef;">you</span>.<span style="color:#e5c07b;">level_up</span>()</div>
                  <div style="padding-left:20px;"><span style="color:#c678dd;">return</span> <span style="color:var(--a2);">"개발자"</span> <span style="color:var(--faint);">#✓</span></div>
                </div>
              </div>
              <div style="position:absolute; top:8px; right:0; padding:11px 15px; background:linear-gradient(135deg,var(--a2),var(--a2)); color:#0a0b10; border-radius:13px; font-weight:700; font-size:13px; box-shadow:0 12px 30px rgba(var(--a2-rgb),.4); animation:dib-floatRot 5s ease-in-out infinite; font-family:'JetBrains Mono',monospace;">🎓 합격률 #1</div>
              <div style="position:absolute; bottom:6px; left:-6px; padding:11px 15px; background:var(--panel); border:1px solid rgba(var(--a1-rgb),.4); color:var(--a1); border-radius:13px; font-weight:600; font-size:13px; box-shadow:0 12px 30px rgba(0,0,0,.4); animation:dib-floatRot 7s ease-in-out infinite reverse; font-family:'JetBrains Mono',monospace;">{ live: 14 }</div>
            </div>
          </div>

          <div style="text-align:center; margin-top:40px; color:var(--faint); font-family:'JetBrains Mono',monospace; font-size:12px;"><div>scroll</div><div style="font-size:18px; animation:dib-bob 1.8s ease-in-out infinite;">↓</div></div>
        </section>

        <!-- LOGO MARQUEE -->
        <section style="padding:26px 0; border-top:1px solid rgba(var(--line),.06); border-bottom:1px solid rgba(var(--line),.06); background:var(--surface); overflow:hidden;">
          <div style="text-align:center; font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--faint); margin-bottom:18px; letter-spacing:.08em;">// 수료생이 일하는 곳</div>
          <div style="display:flex; width:max-content; animation:dib-marquee 28s linear infinite;">
            <div style="display:flex; gap:54px; padding-right:54px; align-items:center;">
              <sc-for list="{{ partnersLoop }}" as="p" hint-placeholder-count="14">
                <span style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:21px; color:var(--faint); white-space:nowrap;">{{ p }}</span>
              </sc-for>
            </div>
          </div>
        </section>

        <!-- CATEGORIES -->
        <section style="max-width:1180px; margin:0 auto; padding:clamp(60px,9vh,100px) clamp(16px,4vw,48px);">
          <div data-reveal="" style="text-align:center; margin-bottom:48px;">
            <div style="font-family:'JetBrains Mono',monospace; color:var(--a1); font-size:13px; margin-bottom:12px; letter-spacing:.06em;">// CATEGORIES</div>
            <h2 style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(28px,4vw,44px); letter-spacing:-.02em; margin:0;">무엇을 배우고 싶나요?</h2>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:18px;">
            <sc-for list="{{ categories }}" as="cat" hint-placeholder-count="4">
              <div data-reveal="" onclick="{{ cat.onClick }}" style="position:relative; padding:28px; border-radius:20px; background:{{ cat.bg }}; border:1px solid rgba(var(--line),.09); cursor:pointer; overflow:hidden; transition:transform .2s, border-color .2s;" style-hover="transform:translateY(-6px); border-color:rgba(var(--line),.25);">
                <div style="font-family:'JetBrains Mono',monospace; font-size:34px; margin-bottom:48px; opacity:.9;">{{ cat.icon }}</div>
                <div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:21px; margin-bottom:6px;">{{ cat.title }}</div>
                <div style="font-size:13.5px; color:var(--muted); margin-bottom:14px; line-height:1.5;">{{ cat.desc }}</div>
                <div style="font-family:'JetBrains Mono',monospace; font-size:12.5px; color:var(--a2);">{{ cat.count }} →</div>
              </div>
            </sc-for>
          </div>
        </section>

        <!-- POPULAR COURSES -->
        <section style="max-width:1180px; margin:0 auto; padding:0 clamp(16px,4vw,48px) clamp(60px,9vh,100px);">
          <div data-reveal="" style="display:flex; align-items:flex-end; justify-content:space-between; gap:20px; margin-bottom:36px; flex-wrap:wrap;">
            <div>
              <div style="font-family:'JetBrains Mono',monospace; color:var(--a1); font-size:13px; margin-bottom:12px; letter-spacing:.06em;">// BESTSELLERS</div>
              <h2 style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(28px,4vw,44px); letter-spacing:-.02em; margin:0;">지금 가장 인기있는 강의 🔥</h2>
            </div>
            <button onclick="{{ goCatalog }}" style="font-family:'Pretendard',sans-serif; font-weight:600; font-size:14.5px; color:var(--text); background:rgba(var(--line),.05); border:1px solid rgba(var(--line),.16); padding:12px 20px; border-radius:11px; cursor:pointer; white-space:nowrap;" style-hover="background:rgba(var(--line),.1);">전체 보기 →</button>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:20px;">
            <sc-for list="{{ popularCourses }}" as="c" hint-placeholder-count="4">
              <div data-reveal="" onclick="{{ c.onClick }}" style="background:var(--panel); border:1px solid rgba(var(--line),.08); border-radius:18px; overflow:hidden; cursor:pointer; transition:transform .2s, border-color .2s; display:flex; flex-direction:column;" style-hover="transform:translateY(-6px); border-color:rgba(var(--a1-rgb),.4);">
                <div style="position:relative; height:150px; background:{{ c.thumb }}; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                  <div style="position:absolute; inset:0; background-image:linear-gradient(rgba(0,0,0,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.18) 1px,transparent 1px); background-size:22px 22px;"></div>
                  <div style="font-family:'JetBrains Mono',monospace; font-weight:700; font-size:30px; color:rgba(10,11,16,.82); position:relative;">{{ c.mark }}</div>
                  <div style="position:absolute; top:12px; left:12px; padding:5px 10px; background:rgba(10,11,16,.78); border-radius:8px; font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:600; color:var(--a2);">{{ c.tag }}</div>
                </div>
                <div style="padding:18px; display:flex; flex-direction:column; flex:1;">
                  <div style="font-size:12px; color:var(--muted2); font-family:'JetBrains Mono',monospace; margin-bottom:8px;">{{ c.catLabel }} · {{ c.level }}</div>
                  <div style="font-weight:700; font-size:17px; line-height:1.35; margin-bottom:8px;">{{ c.title }}</div>
                  <div style="font-size:13px; color:var(--muted); margin-bottom:14px;">{{ c.instructor }}</div>
                  <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px; font-size:12.5px; color:var(--muted); font-family:'JetBrains Mono',monospace;">
                    <span style="color:var(--a2);">★ {{ c.rating }}</span>
                    <span>·</span>
                    <span>{{ c.studentsLabel }}명</span>
                  </div>
                  <div style="margin-top:auto; display:flex; align-items:baseline; gap:8px;">
                    <span style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:20px; color:var(--text);">{{ c.price }}</span>
                    <span style="font-size:13px; color:var(--faint); text-decoration:line-through;">{{ c.oldPrice }}</span>
                  </div>
                </div>
              </div>
            </sc-for>
          </div>
        </section>

        <!-- FEATURES / WHY -->
        <section style="position:relative; padding:clamp(60px,9vh,100px) clamp(16px,4vw,48px); background:var(--surface); border-top:1px solid rgba(var(--line),.06); border-bottom:1px solid rgba(var(--line),.06); overflow:hidden;">
          <div style="max-width:1180px; margin:0 auto;">
            <div data-reveal="" style="text-align:center; margin-bottom:54px;">
              <div style="font-family:'JetBrains Mono',monospace; color:var(--a1); font-size:13px; margin-bottom:12px; letter-spacing:.06em;">// WHY DREAMIT</div>
              <h2 style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(28px,4vw,44px); letter-spacing:-.02em; margin:0;">왜 드림아이티비즈일까요?</h2>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:20px;">
              <sc-for list="{{ features }}" as="f" hint-placeholder-count="4">
                <div data-reveal="" style="padding:30px; border-radius:20px; background:var(--panel); border:1px solid rgba(var(--line),.08);">
                  <div style="width:54px; height:54px; border-radius:15px; background:{{ f.bg }}; display:grid; place-items:center; font-family:'JetBrains Mono',monospace; font-size:24px; margin-bottom:20px;">{{ f.icon }}</div>
                  <div style="font-weight:700; font-size:19px; margin-bottom:9px;">{{ f.title }}</div>
                  <div style="font-size:14px; color:var(--muted); line-height:1.65;">{{ f.desc }}</div>
                </div>
              </sc-for>
            </div>
          </div>
        </section>

        <!-- HOW IT WORKS -->
        <section style="max-width:1180px; margin:0 auto; padding:clamp(60px,9vh,100px) clamp(16px,4vw,48px);">
          <div data-reveal="" style="text-align:center; margin-bottom:54px;">
            <div style="font-family:'JetBrains Mono',monospace; color:var(--a1); font-size:13px; margin-bottom:12px; letter-spacing:.06em;">// HOW IT WORKS</div>
            <h2 style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(28px,4vw,44px); letter-spacing:-.02em; margin:0;">3단계면 충분해요</h2>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:20px;">
            <sc-for list="{{ steps }}" as="s" hint-placeholder-count="3">
              <div data-reveal="" style="position:relative; padding:32px 28px; border-radius:20px; background:var(--panel); border:1px solid rgba(var(--line),.08);">
                <div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:60px; color:rgba(var(--line),.06); line-height:1; margin-bottom:8px;">{{ s.num }}</div>
                <div style="font-weight:700; font-size:20px; margin-bottom:10px; color:{{ s.color }};">{{ s.title }}</div>
                <div style="font-size:14px; color:var(--muted); line-height:1.65;">{{ s.desc }}</div>
              </div>
            </sc-for>
          </div>
        </section>

        <!-- TESTIMONIALS -->
        <section style="padding:clamp(60px,9vh,100px) 0; background:var(--surface); border-top:1px solid rgba(var(--line),.06); overflow:hidden;">
          <div data-reveal="" style="text-align:center; margin-bottom:48px; padding:0 24px;">
            <div style="font-family:'JetBrains Mono',monospace; color:var(--a1); font-size:13px; margin-bottom:12px; letter-spacing:.06em;">// REVIEWS</div>
            <h2 style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(28px,4vw,44px); letter-spacing:-.02em; margin:0;">수강생들의 진짜 후기 💬</h2>
          </div>
          <div style="display:flex; width:max-content; animation:dib-marquee 40s linear infinite; gap:18px; padding:0 9px;">
            <sc-for list="{{ reviewsLoop }}" as="r" hint-placeholder-count="8">
              <div style="width:340px; padding:26px; border-radius:18px; background:var(--panel); border:1px solid rgba(var(--line),.08); flex-shrink:0;">
                <div style="color:var(--a2); font-size:14px; margin-bottom:14px; letter-spacing:2px;">★★★★★</div>
                <div style="font-size:14.5px; line-height:1.7; color:var(--text); margin-bottom:20px;">"{{ r.text }}"</div>
                <div style="display:flex; align-items:center; gap:12px;">
                  <div style="width:42px; height:42px; border-radius:50%; background:{{ r.color }}; display:grid; place-items:center; font-weight:700; color:#0a0b10; font-family:'Space Grotesk',sans-serif;">{{ r.initial }}</div>
                  <div><div style="font-weight:600; font-size:14px;">{{ r.name }}</div><div style="font-size:12px; color:var(--muted2); font-family:'JetBrains Mono',monospace;">{{ r.role }}</div></div>
                </div>
              </div>
            </sc-for>
          </div>
        </section>

        <!-- B2B -->
        <section style="max-width:1180px; margin:0 auto; padding:clamp(60px,9vh,100px) clamp(16px,4vw,48px);">
          <div data-reveal="" style="position:relative; border-radius:28px; overflow:hidden; padding:clamp(36px,6vw,64px); background:linear-gradient(135deg,#101622,#0c0e15); border:1px solid rgba(var(--line),.1);">
            <div style="position:absolute; top:-60px; right:-60px; width:280px; height:280px; border-radius:50%; background:radial-gradient(circle,rgba(var(--a1-rgb),.25),transparent 70%); filter:blur(20px);"></div>
            <div style="position:relative; display:grid; grid-template-columns:1.3fr .7fr; gap:36px; align-items:center;" data-b2b-grid="">
              <div>
                <div style="font-family:'JetBrains Mono',monospace; color:var(--a2); font-size:13px; margin-bottom:14px; letter-spacing:.06em;">// FOR BUSINESS</div>
                <h2 style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(26px,3.6vw,40px); letter-spacing:-.02em; margin:0 0 16px; line-height:1.15;">팀 전체의 IT 역량,<br>한 번에 끌어올리세요</h2>
                <p style="font-size:15.5px; color:var(--muted); line-height:1.7; margin:0 0 26px; max-width:520px;">임직원 맞춤 커리큘럼 설계부터 학습 관리, 수료 리포트까지. 삼성·LG·네이버 등 480개 기업이 드림아이티비즈와 함께합니다.</p>
                <div style="display:flex; gap:13px; flex-wrap:wrap;">
                  <button onclick="{{ goAbout }}" style="font-family:'Pretendard',sans-serif; font-weight:700; font-size:15px; color:#0a0b10; background:var(--a2); border:none; padding:14px 24px; border-radius:12px; cursor:pointer;" style-hover="background:var(--a2);">기업교육 문의 →</button>
                  <button onclick="{{ goAbout }}" style="font-family:'Pretendard',sans-serif; font-weight:600; font-size:15px; color:var(--text); background:rgba(var(--line),.06); border:1px solid rgba(var(--line),.16); padding:14px 24px; border-radius:12px; cursor:pointer;" style-hover="background:rgba(var(--line),.12);">제안서 받기</button>
                </div>
              </div>
              <div style="display:grid; gap:14px;">
                <div style="padding:20px; border-radius:16px; background:rgba(var(--line),.04); border:1px solid rgba(var(--line),.09);"><div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:30px; color:var(--a1);">480+</div><div style="font-size:13px; color:var(--muted);">도입 기업</div></div>
                <div style="padding:20px; border-radius:16px; background:rgba(var(--line),.04); border:1px solid rgba(var(--line),.09);"><div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:30px; color:var(--a2);">98%</div><div style="font-size:13px; color:var(--muted);">재계약률</div></div>
              </div>
            </div>
          </div>
        </section>

        <!-- FINAL CTA -->
        <section style="max-width:1180px; margin:0 auto; padding:0 clamp(16px,4vw,48px) clamp(70px,10vh,120px);">
          <div data-reveal="" style="position:relative; text-align:center; border-radius:28px; padding:clamp(48px,8vw,84px) clamp(24px,5vw,48px); background:linear-gradient(120deg,var(--a2),var(--a1)); background-size:200% 200%; animation:dib-grad 8s ease infinite; overflow:hidden;">
            <h2 style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(30px,5vw,56px); letter-spacing:-.03em; margin:0 0 16px; color:#0a0b10; line-height:1.05;">오늘이 가장 빠른 날입니다.</h2>
            <p style="font-size:clamp(15px,1.8vw,19px); color:rgba(10,11,16,.72); margin:0 0 32px; font-weight:500;">7일 무료체험으로 320개 강의를 모두 만나보세요. 카드 등록 없이 시작.</p>
            <button onclick="{{ goEnrollFree }}" style="font-family:'Pretendard',sans-serif; font-weight:700; font-size:17px; color:#fff; background:var(--bg); border:none; padding:18px 38px; border-radius:14px; cursor:pointer; box-shadow:0 14px 40px rgba(10,11,16,.3); animation:dib-pulse 2.4s infinite; transition:transform .15s;" style-hover="transform:scale(1.04);">무료로 시작하기 →</button>
          </div>
        </section>

      </div>
    </sc-if>

    <!-- ====== ABOUT · 회사소개 ====== -->
    <sc-if value="{{ isAboutCompany }}" hint-placeholder-val="{{ false }}">
      <div data-screen-label="회사소개">
        <section style="position:relative; overflow:hidden; padding:clamp(44px,8vh,90px) clamp(16px,4vw,48px) clamp(34px,5vh,56px);">
          <div style="position:absolute; inset:0; background-image:linear-gradient(rgba(var(--line),.04) 1px,transparent 1px),linear-gradient(90deg,rgba(var(--line),.04) 1px,transparent 1px); background-size:56px 56px; mask-image:radial-gradient(ellipse 80% 70% at 30% 20%,#000 30%,transparent 75%); -webkit-mask-image:radial-gradient(ellipse 80% 70% at 30% 20%,#000 30%,transparent 75%); z-index:-1;"></div>
          <div style="position:absolute; top:-80px; right:-40px; width:360px; height:360px; border-radius:50%; background:radial-gradient(circle,rgba(var(--a1-rgb),.18),transparent 70%); filter:blur(30px); z-index:-1;"></div>
          <div style="max-width:1180px; margin:0 auto;">
            <div data-reveal="" style="font-family:'JetBrains Mono',monospace; color:var(--a1); font-size:13px; letter-spacing:.08em; margin-bottom:14px;">// ABOUT US</div>
            <h1 data-reveal="" style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(34px,5vw,58px); line-height:1.08; letter-spacing:-.03em; margin:0 0 20px;">우리는 <span style="background:linear-gradient(100deg,var(--a1),var(--a2)); -webkit-background-clip:text; background-clip:text; color:transparent;">IT 커리어</span>를<br>만드는 회사입니다.</h1>
            <p data-reveal="" style="font-size:clamp(15px,1.7vw,18px); color:var(--muted); line-height:1.7; max-width:560px; margin:0;">드림아이티비즈는 2018년 설립 이후 12만 명의 수강생이 코딩·자격증·데이터 AI를 배우고 커리어를 바꾼 온라인 IT 교육 플랫폼입니다.</p>
          </div>
        </section>

        <section style="max-width:1180px; margin:0 auto; padding:clamp(30px,4vh,40px) clamp(16px,4vw,48px);">
          <div data-reveal="" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:18px;">
            <div style="padding:26px; border-radius:18px; background:var(--panel); border:1px solid rgba(var(--line),.08);"><div data-counter="students" data-target="124000" data-suffix="+" style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:34px; color:var(--text);">0</div><div style="font-size:13px; color:var(--muted2); font-family:'JetBrains Mono',monospace; margin-top:4px;">누적 수강생</div></div>
            <div style="padding:26px; border-radius:18px; background:var(--panel); border:1px solid rgba(var(--line),.08);"><div data-counter="c-courses" data-target="320" data-suffix="+" style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:34px; color:var(--text);">0</div><div style="font-size:13px; color:var(--muted2); font-family:'JetBrains Mono',monospace; margin-top:4px;">개설 강의</div></div>
            <div style="padding:26px; border-radius:18px; background:var(--panel); border:1px solid rgba(var(--line),.08);"><div data-counter="c-corp" data-target="480" data-suffix="+" style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:34px; color:var(--a1);">0</div><div style="font-size:13px; color:var(--muted2); font-family:'JetBrains Mono',monospace; margin-top:4px;">파트너 기업</div></div>
            <div style="padding:26px; border-radius:18px; background:var(--panel); border:1px solid rgba(var(--line),.08);"><div data-counter="c-sat" data-target="94" data-suffix="%" style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:34px; color:var(--a2);">0</div><div style="font-size:13px; color:var(--muted2); font-family:'JetBrains Mono',monospace; margin-top:4px;">수료 만족도</div></div>
          </div>
        </section>

        <section style="max-width:1180px; margin:0 auto; padding:clamp(40px,6vh,70px) clamp(16px,4vw,48px);">
          <div data-reveal="" style="font-family:'JetBrains Mono',monospace; color:var(--a2); font-size:13px; margin-bottom:30px; letter-spacing:.06em;">// OUR STORY</div>
          <div style="display:grid; gap:0;">
            <sc-for list="{{ aboutTimeline }}" as="m" hint-placeholder-count="4">
              <div data-reveal="" style="display:grid; grid-template-columns:120px 1fr; gap:24px; padding:22px 0; border-top:1px solid rgba(var(--line),.08); align-items:start;">
                <div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:26px; color:var(--a1);">{{ m.year }}</div>
                <div><div style="font-weight:700; font-size:19px; margin-bottom:6px;">{{ m.title }}</div><div style="font-size:14.5px; color:var(--muted); line-height:1.6;">{{ m.desc }}</div></div>
              </div>
            </sc-for>
          </div>
        </section>

        <section style="background:var(--surface); border-top:1px solid rgba(var(--line),.06); border-bottom:1px solid rgba(var(--line),.06); padding:clamp(44px,6vh,72px) clamp(16px,4vw,48px);">
          <div style="max-width:1180px; margin:0 auto;">
            <h2 data-reveal="" style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(24px,3.4vw,36px); letter-spacing:-.02em; margin:0 0 32px;">우리가 일하는 방식</h2>
            <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:18px;">
              <sc-for list="{{ aboutValues }}" as="v" hint-placeholder-count="3">
                <div data-reveal="" style="padding:28px; border-radius:18px; background:var(--panel); border:1px solid rgba(var(--line),.08);">
                  <div style="width:50px; height:50px; border-radius:14px; background:{{ v.bg }}; display:grid; place-items:center; font-family:'JetBrains Mono',monospace; font-size:22px; margin-bottom:18px;">{{ v.icon }}</div>
                  <div style="font-weight:700; font-size:18px; margin-bottom:8px;">{{ v.title }}</div>
                  <div style="font-size:14px; color:var(--muted); line-height:1.65;">{{ v.desc }}</div>
                </div>
              </sc-for>
            </div>
          </div>
        </section>

        <section style="max-width:1180px; margin:0 auto; padding:clamp(44px,6vh,72px) clamp(16px,4vw,48px);">
          <div data-reveal="" style="display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap; padding:36px clamp(24px,4vw,44px); border-radius:24px; background:linear-gradient(120deg,var(--a2),var(--a1));">
            <div><div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:clamp(22px,3vw,32px); color:#0a0b10; line-height:1.1;">함께 성장할 동료를 찾습니다</div><div style="font-size:15px; color:rgba(10,11,16,.7); margin-top:8px;">강사 · 운영 · 개발 포지션 상시 채용</div></div>
            <button onclick="{{ goAboutInstructors }}" style="font-family:'Pretendard',sans-serif; font-weight:700; font-size:15px; color:#fff; background:#0a0b10; border:none; padding:15px 28px; border-radius:12px; cursor:pointer; white-space:nowrap;">강사진 보기 →</button>
          </div>
        </section>
      </div>
    </sc-if>

    <!-- ====== ABOUT · 강사소개 ====== -->
    <sc-if value="{{ isAboutInstructors }}" hint-placeholder-val="{{ false }}">
      <div data-screen-label="강사소개">
        <section style="position:relative; overflow:hidden; padding:clamp(44px,8vh,90px) clamp(16px,4vw,48px) clamp(30px,4vh,46px);">
          <div style="position:absolute; top:-80px; left:-40px; width:340px; height:340px; border-radius:50%; background:radial-gradient(circle,rgba(var(--a2-rgb),.16),transparent 70%); filter:blur(30px); z-index:-1;"></div>
          <div style="max-width:1180px; margin:0 auto;">
            <div data-reveal="" style="font-family:'JetBrains Mono',monospace; color:var(--a1); font-size:13px; letter-spacing:.08em; margin-bottom:14px;">// INSTRUCTORS</div>
            <h1 data-reveal="" style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(34px,5vw,58px); line-height:1.08; letter-spacing:-.03em; margin:0 0 18px;">현직자에게 배우세요.</h1>
            <p data-reveal="" style="font-size:clamp(15px,1.7vw,18px); color:var(--muted); line-height:1.7; max-width:560px; margin:0;">네이버 · 카카오 · 토스 · 삼성을 거친 현직 개발자와 전문가가 실무 그대로 가르칩니다.</p>
          </div>
        </section>

        <section style="max-width:1180px; margin:0 auto; padding:clamp(20px,3vh,32px) clamp(16px,4vw,48px) clamp(50px,7vh,80px);">
          <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(255px,1fr)); gap:20px;">
            <sc-for list="{{ instructors }}" as="ins" hint-placeholder-count="8">
              <div data-reveal="" style="padding:26px; border-radius:20px; background:var(--panel); border:1px solid rgba(var(--line),.08); transition:transform .2s, border-color .2s;" style-hover="transform:translateY(-5px); border-color:rgba(var(--a1-rgb),.4);">
                <div style="display:flex; align-items:center; gap:14px; margin-bottom:18px;">
                  <div style="width:60px; height:60px; border-radius:50%; background:{{ ins.color }}; display:grid; place-items:center; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:24px; color:#0a0b10;">{{ ins.initial }}</div>
                  <div><div style="font-weight:700; font-size:18px;">{{ ins.name }}</div><div style="font-size:13px; color:var(--a1); font-family:'JetBrains Mono',monospace; margin-top:2px; white-space:nowrap;">{{ ins.company }}</div></div>
                </div>
                <div style="font-size:14px; color:var(--muted); margin-bottom:14px;">{{ ins.role }}</div>
                <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px;">
                  <sc-for list="{{ ins.tags }}" as="tag" hint-placeholder-count="3">
                    <span style="font-family:'JetBrains Mono',monospace; font-size:11.5px; color:var(--text2); padding:4px 9px; border-radius:7px; background:rgba(var(--line),.06);">{{ tag }}</span>
                  </sc-for>
                </div>
                <div style="display:flex; gap:16px; padding-top:14px; border-top:1px solid rgba(var(--line),.07); font-family:'JetBrains Mono',monospace; font-size:12.5px; color:var(--muted2);">
                  <span>강의 {{ ins.courses }}개</span><span>수강생 {{ ins.students }}</span>
                </div>
              </div>
            </sc-for>
          </div>
        </section>
      </div>
    </sc-if>

    <!-- ====== 강의 · 온라인 ====== -->
    <sc-if value="{{ isOnline }}" hint-placeholder-val="{{ false }}">
      <div data-screen-label="온라인 강의">
        <section style="position:relative; overflow:hidden; padding:clamp(44px,8vh,90px) clamp(16px,4vw,48px) clamp(28px,4vh,42px);">
          <div style="position:absolute; top:-80px; right:-40px; width:360px; height:360px; border-radius:50%; background:radial-gradient(circle,rgba(var(--a1-rgb),.18),transparent 70%); filter:blur(30px); z-index:-1;"></div>
          <div style="max-width:1180px; margin:0 auto;">
            <div data-reveal="" style="font-family:'JetBrains Mono',monospace; color:var(--a1); font-size:13px; letter-spacing:.08em; margin-bottom:14px;">// COURSES / ONLINE</div>
            <h1 data-reveal="" style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(34px,5vw,56px); line-height:1.08; letter-spacing:-.03em; margin:0 0 18px;">온라인 강의</h1>
            <p data-reveal="" style="font-size:clamp(15px,1.7vw,18px); color:var(--muted); line-height:1.7; max-width:540px; margin:0 0 24px;">평생 무제한 수강 · 모바일/PC 어디서나 · 1:1 코드 리뷰. 내 속도로 배우는 실무형 온라인 강의.</p>
            <div data-reveal="" style="display:flex; flex-wrap:wrap; gap:10px;">
              <sc-for list="{{ onlineBenefits }}" as="b" hint-placeholder-count="3">
                <span style="display:inline-flex; align-items:center; gap:7px; padding:8px 14px; border-radius:999px; background:rgba(var(--line),.05); border:1px solid rgba(var(--line),.1); font-size:13.5px; color:var(--text2);"><span style="color:var(--a2);">{{ b.icon }}</span>{{ b.text }}</span>
              </sc-for>
            </div>
          </div>
        </section>
        <section style="max-width:1180px; margin:0 auto; padding:clamp(14px,2vh,24px) clamp(16px,4vw,48px) clamp(50px,7vh,80px);">
          <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(265px,1fr)); gap:20px;">
            <sc-for list="{{ onlineCourses }}" as="c" hint-placeholder-count="8">
              <div data-reveal="" onclick="{{ c.onClick }}" style="background:var(--panel); border:1px solid rgba(var(--line),.08); border-radius:18px; overflow:hidden; cursor:pointer; transition:transform .2s, border-color .2s; display:flex; flex-direction:column;" style-hover="transform:translateY(-6px); border-color:rgba(var(--a1-rgb),.4);">
                <div style="position:relative; height:140px; background:{{ c.thumb }}; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                  <div style="position:absolute; inset:0; background-image:linear-gradient(rgba(0,0,0,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.18) 1px,transparent 1px); background-size:22px 22px;"></div>
                  <div style="font-family:'JetBrains Mono',monospace; font-weight:700; font-size:28px; color:rgba(10,11,16,.82); position:relative;">{{ c.mark }}</div>
                  <div style="position:absolute; top:12px; left:12px; padding:5px 10px; background:rgba(10,11,16,.78); border-radius:8px; font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:600; color:var(--a2);">{{ c.tag }}</div>
                </div>
                <div style="padding:18px; display:flex; flex-direction:column; flex:1;">
                  <div style="font-size:12px; color:var(--muted2); font-family:'JetBrains Mono',monospace; margin-bottom:8px;">{{ c.catLabel }} · {{ c.level }}</div>
                  <div style="font-weight:700; font-size:16.5px; line-height:1.35; margin-bottom:8px;">{{ c.title }}</div>
                  <div style="font-size:13px; color:var(--muted); margin-bottom:14px;">{{ c.instructor }}</div>
                  <div style="margin-top:auto; display:flex; align-items:center; justify-content:space-between;">
                    <span style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:18px; color:var(--text);">{{ c.price }}</span>
                    <span style="font-size:12.5px; color:var(--a2); font-family:'JetBrains Mono',monospace;">★ {{ c.rating }}</span>
                  </div>
                </div>
              </div>
            </sc-for>
          </div>
        </section>
      </div>
    </sc-if>

    <!-- ====== 강의 · 오프라인 ====== -->
    <sc-if value="{{ isOffline }}" hint-placeholder-val="{{ false }}">
      <div data-screen-label="오프라인 강의">
        <section style="position:relative; overflow:hidden; padding:clamp(44px,8vh,90px) clamp(16px,4vw,48px) clamp(28px,4vh,42px);">
          <div style="position:absolute; top:-80px; left:-40px; width:360px; height:360px; border-radius:50%; background:radial-gradient(circle,rgba(var(--a2-rgb),.16),transparent 70%); filter:blur(30px); z-index:-1;"></div>
          <div style="max-width:1180px; margin:0 auto;">
            <div data-reveal="" style="font-family:'JetBrains Mono',monospace; color:var(--a1); font-size:13px; letter-spacing:.08em; margin-bottom:14px;">// COURSES / OFFLINE</div>
            <h1 data-reveal="" style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(34px,5vw,56px); line-height:1.08; letter-spacing:-.03em; margin:0 0 18px;">오프라인 부트캠프</h1>
            <p data-reveal="" style="font-size:clamp(15px,1.7vw,18px); color:var(--muted); line-height:1.7; max-width:560px; margin:0 0 22px;">강남 · 판교 캠퍼스에서 진행하는 몰입형 오프라인 교육. 동료와 함께, 현직 멘토와 마주 보며 성장하세요.</p>
            <div data-reveal="" style="display:flex; flex-wrap:wrap; gap:10px;">
              <sc-for list="{{ offlineHighlights }}" as="b" hint-placeholder-count="4">
                <span style="display:inline-flex; align-items:center; gap:7px; padding:8px 14px; border-radius:999px; background:rgba(var(--line),.05); border:1px solid rgba(var(--line),.1); font-size:13.5px; color:var(--text2);"><span style="color:var(--a2);">●</span>{{ b }}</span>
              </sc-for>
            </div>
          </div>
        </section>
        <section style="max-width:1180px; margin:0 auto; padding:clamp(14px,2vh,24px) clamp(16px,4vw,48px) clamp(50px,7vh,80px);">
          <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:20px;">
            <sc-for list="{{ offlinePrograms }}" as="p" hint-placeholder-count="4">
              <div data-reveal="" style="background:var(--panel); border:1px solid rgba(var(--line),.08); border-radius:20px; overflow:hidden; display:flex; flex-direction:column;">
                <div style="display:flex; align-items:center; gap:14px; padding:22px 24px; border-bottom:1px solid rgba(var(--line),.07);">
                  <div style="width:54px; height:54px; border-radius:14px; background:{{ p.color }}; display:grid; place-items:center; font-family:'JetBrains Mono',monospace; font-weight:700; font-size:22px; color:#0a0b10; flex-shrink:0;">{{ p.mark }}</div>
                  <div style="flex:1;"><div style="font-weight:700; font-size:18px; line-height:1.3;">{{ p.title }}</div></div>
                  <span style="font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:600; color:#0a0b10; background:{{ p.color }}; padding:4px 9px; border-radius:7px; white-space:nowrap;">{{ p.tag }}</span>
                </div>
                <div style="padding:20px 24px; display:grid; grid-template-columns:1fr 1fr; gap:14px 18px;">
                  <div><div style="font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--muted2); margin-bottom:4px;">장소</div><div style="font-size:14px; font-weight:600;">{{ p.loc }}</div></div>
                  <div><div style="font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--muted2); margin-bottom:4px;">기간</div><div style="font-size:14px; font-weight:600;">{{ p.period }}</div></div>
                  <div><div style="font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--muted2); margin-bottom:4px;">일정</div><div style="font-size:14px; font-weight:600; color:var(--a1);">{{ p.start }}</div></div>
                  <div><div style="font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--muted2); margin-bottom:4px;">모집</div><div style="font-size:14px; font-weight:600;">{{ p.seats }}</div></div>
                </div>
                <div style="margin-top:auto; display:flex; align-items:center; justify-content:space-between; padding:16px 24px; border-top:1px solid rgba(var(--line),.07);">
                  <span style="font-size:14px; color:var(--a2); font-weight:600;">{{ p.price }}</span>
                  <button onclick="{{ goEnrollFree }}" style="font-family:'Pretendard',sans-serif; font-weight:700; font-size:13.5px; color:#0a0b10; background:var(--a2); border:none; padding:10px 18px; border-radius:10px; cursor:pointer;">상담 신청 →</button>
                </div>
              </div>
            </sc-for>
          </div>
        </section>
      </div>
    </sc-if>

    <!-- ====== 기업교육 ====== -->
    <sc-if value="{{ isCorporate }}" hint-placeholder-val="{{ false }}">
      <div data-screen-label="기업교육">
        <section style="position:relative; overflow:hidden; padding:clamp(44px,8vh,90px) clamp(16px,4vw,48px) clamp(30px,4vh,48px);">
          <div style="position:absolute; top:-90px; right:-50px; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle,rgba(var(--a1-rgb),.18),transparent 70%); filter:blur(34px); z-index:-1;"></div>
          <div style="max-width:1180px; margin:0 auto;">
            <div data-reveal="" style="font-family:'JetBrains Mono',monospace; color:var(--a2); font-size:13px; letter-spacing:.08em; margin-bottom:14px;">// FOR BUSINESS</div>
            <h1 data-reveal="" style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(34px,5vw,58px); line-height:1.08; letter-spacing:-.03em; margin:0 0 18px;">기업교육</h1>
            <p data-reveal="" style="font-size:clamp(15px,1.7vw,18px); color:var(--muted); line-height:1.7; max-width:580px; margin:0 0 26px;">임직원의 IT 역량을 한 번에 끌어올리는 맞춤형 사내 교육. 진단부터 운영, 성과 리포트까지 전담 매니저가 함께합니다.</p>
            <div data-reveal="" style="display:flex; gap:12px; flex-wrap:wrap;">
              <button onclick="{{ goCorporate }}" style="font-family:'Pretendard',sans-serif; font-weight:700; font-size:15px; color:#0a0b10; background:var(--a2); border:none; padding:14px 24px; border-radius:12px; cursor:pointer;">제안서 요청 →</button>
              <button onclick="{{ goCorporate }}" style="font-family:'Pretendard',sans-serif; font-weight:600; font-size:15px; color:var(--text); background:rgba(var(--line),.06); border:1px solid rgba(var(--line),.14); padding:14px 24px; border-radius:12px; cursor:pointer;">도입 사례 보기</button>
            </div>
          </div>
        </section>

        <section style="max-width:1180px; margin:0 auto; padding:clamp(20px,3vh,30px) clamp(16px,4vw,48px);">
          <div data-reveal="" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:18px;">
            <div style="padding:24px; border-radius:18px; background:var(--panel); border:1px solid rgba(var(--line),.08);"><div data-counter="b-corp" data-target="480" data-suffix="+" style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:32px; color:var(--a1);">0</div><div style="font-size:13px; color:var(--muted2); font-family:'JetBrains Mono',monospace; margin-top:4px;">도입 기업</div></div>
            <div style="padding:24px; border-radius:18px; background:var(--panel); border:1px solid rgba(var(--line),.08);"><div data-counter="b-emp" data-target="64000" data-suffix="+" style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:32px; color:var(--text);">0</div><div style="font-size:13px; color:var(--muted2); font-family:'JetBrains Mono',monospace; margin-top:4px;">교육 임직원</div></div>
            <div style="padding:24px; border-radius:18px; background:var(--panel); border:1px solid rgba(var(--line),.08);"><div data-counter="b-re" data-target="98" data-suffix="%" style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:32px; color:var(--a2);">0</div><div style="font-size:13px; color:var(--muted2); font-family:'JetBrains Mono',monospace; margin-top:4px;">재계약률</div></div>
            <div style="padding:24px; border-radius:18px; background:var(--panel); border:1px solid rgba(var(--line),.08);"><div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:32px; color:var(--text);">4.9</div><div style="font-size:13px; color:var(--muted2); font-family:'JetBrains Mono',monospace; margin-top:4px;">평균 만족도</div></div>
          </div>
        </section>

        <section style="max-width:1180px; margin:0 auto; padding:clamp(40px,6vh,64px) clamp(16px,4vw,48px);">
          <h2 data-reveal="" style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(24px,3.4vw,36px); letter-spacing:-.02em; margin:0 0 10px;">제안 · 운영 프로세스</h2>
          <p data-reveal="" style="font-size:15px; color:var(--muted); margin:0 0 30px;">문의부터 성과 리포트까지, 4단계로 진행됩니다.</p>
          <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:18px;">
            <sc-for list="{{ corpProcess }}" as="p" hint-placeholder-count="4">
              <div data-reveal="" style="position:relative; padding:28px 24px; border-radius:18px; background:var(--panel); border:1px solid rgba(var(--line),.08);">
                <div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:46px; color:rgba(var(--line),.1); line-height:1; margin-bottom:10px;">{{ p.n }}</div>
                <div style="font-weight:700; font-size:18px; margin-bottom:8px;">{{ p.t }}</div>
                <div style="font-size:13.5px; color:var(--muted); line-height:1.6;">{{ p.d }}</div>
              </div>
            </sc-for>
          </div>
        </section>

        <section style="background:var(--surface); border-top:1px solid rgba(var(--line),.06); border-bottom:1px solid rgba(var(--line),.06); padding:clamp(44px,6vh,72px) clamp(16px,4vw,48px);">
          <div style="max-width:1180px; margin:0 auto;">
            <h2 data-reveal="" style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(24px,3.4vw,36px); letter-spacing:-.02em; margin:0 0 8px;">기업교육 강의내역</h2>
            <p data-reveal="" style="font-size:15px; color:var(--muted); margin:0 0 26px;">최근 진행한 대표 교육 사례입니다.</p>
            <div data-reveal="" style="border-radius:18px; overflow:hidden; border:1px solid rgba(var(--line),.08); background:var(--panel);">
              <div style="display:grid; grid-template-columns:1.1fr 2fr 0.9fr 1fr 0.7fr; gap:14px; padding:16px 22px; background:rgba(var(--line),.04); font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--muted2);">
                <span>기업</span><span>교육 주제</span><span>인원</span><span>기간</span><span>만족도</span>
              </div>
              <sc-for list="{{ corpRecords }}" as="r" hint-placeholder-count="5">
                <div style="display:grid; grid-template-columns:1.1fr 2fr 0.9fr 1fr 0.7fr; gap:14px; padding:18px 22px; border-top:1px solid rgba(var(--line),.06); align-items:center;">
                  <span style="font-weight:700; font-size:14.5px;">{{ r.company }}</span>
                  <span style="font-size:14px; color:var(--text2);">{{ r.topic }}</span>
                  <span style="font-size:13.5px; color:var(--muted); font-family:'JetBrains Mono',monospace;">{{ r.people }}</span>
                  <span style="font-size:13.5px; color:var(--muted); font-family:'JetBrains Mono',monospace;">{{ r.period }}</span>
                  <span style="font-size:13.5px; color:var(--a2); font-family:'JetBrains Mono',monospace;">★ {{ r.rating }}</span>
                </div>
              </sc-for>
            </div>
          </div>
        </section>

        <section style="max-width:1180px; margin:0 auto; padding:clamp(44px,6vh,72px) clamp(16px,4vw,48px);">
          <div data-reveal="" style="display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap; padding:36px clamp(24px,4vw,44px); border-radius:24px; background:linear-gradient(135deg,#101622,#0c0e15); border:1px solid rgba(var(--line),.1);">
            <div><div style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(22px,3vw,30px); line-height:1.15;">우리 팀에 맞는 교육이 궁금하신가요?</div><div style="font-size:15px; color:var(--muted); margin-top:8px;">담당자가 1영업일 내 맞춤 제안서를 보내드립니다.</div></div>
            <button onclick="{{ goCorporate }}" style="font-family:'Pretendard',sans-serif; font-weight:700; font-size:15px; color:#0a0b10; background:linear-gradient(135deg,var(--a2),var(--a1)); border:none; padding:15px 28px; border-radius:12px; cursor:pointer; white-space:nowrap;">무료 상담 신청 →</button>
          </div>
        </section>
      </div>
    </sc-if>

    <!-- ====== 자격증 ====== -->
    <sc-if value="{{ isCert }}" hint-placeholder-val="{{ false }}">
      <div data-screen-label="자격증">
        <section style="position:relative; overflow:hidden; padding:clamp(44px,8vh,90px) clamp(16px,4vw,48px) clamp(24px,3vh,36px);">
          <div style="position:absolute; top:-80px; left:-40px; width:340px; height:340px; border-radius:50%; background:radial-gradient(circle,rgba(var(--a2-rgb),.16),transparent 70%); filter:blur(30px); z-index:-1;"></div>
          <div style="max-width:1180px; margin:0 auto;">
            <div data-reveal="" style="font-family:'JetBrains Mono',monospace; color:var(--a1); font-size:13px; letter-spacing:.08em; margin-bottom:14px;">// CERTIFICATIONS</div>
            <h1 data-reveal="" style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(34px,5vw,56px); line-height:1.08; letter-spacing:-.03em; margin:0 0 18px;">자격증 합격 과정</h1>
            <p data-reveal="" style="font-size:clamp(15px,1.7vw,18px); color:var(--muted); line-height:1.7; max-width:560px; margin:0;">AWS · SQLD · 정보처리기사 · 컴퓨터활용능력. 합격까지 책임지는 단기 커리큘럼을 선택하세요.</p>
          </div>
        </section>

        <section style="max-width:1180px; margin:0 auto; padding:0 clamp(16px,4vw,48px) clamp(50px,7vh,80px);">
          <div data-reveal="" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:28px;">
            <sc-for list="{{ certTabs }}" as="t" hint-placeholder-count="4">
              <button onclick="{{ t.onClick }}" style="font-family:'Pretendard',sans-serif; font-weight:600; font-size:14.5px; color:{{ t.tabColor }}; background:{{ t.tabBg }}; border:1px solid rgba(var(--line),.1); padding:11px 20px; border-radius:11px; cursor:pointer; transition:all .15s;">{{ t.label }}</button>
            </sc-for>
          </div>

          <div data-reveal="" style="display:grid; grid-template-columns:1.3fr 1fr; gap:22px; align-items:start;" data-cert-grid="">
            <div style="background:var(--panel); border:1px solid rgba(var(--line),.08); border-radius:22px; padding:clamp(26px,4vw,40px);">
              <div style="display:flex; align-items:center; gap:16px; margin-bottom:22px;">
                <div style="width:64px; height:64px; border-radius:16px; background:{{ certActive.color }}; display:grid; place-items:center; font-family:'JetBrains Mono',monospace; font-weight:700; font-size:24px; color:#0a0b10;">{{ certActive.mark }}</div>
                <div><div style="font-family:'JetBrains Mono',monospace; font-size:12.5px; color:var(--a1);">{{ certActive.en }}</div><div style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:26px;">{{ certActive.name }}</div></div>
              </div>
              <p style="font-size:15px; color:var(--muted); line-height:1.7; margin:0 0 24px;">{{ certActive.desc }}</p>
              <div style="font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--muted2); margin-bottom:14px; letter-spacing:.06em;">// 커리큘럼</div>
              <sc-for list="{{ certActive.curri }}" as="step" hint-placeholder-count="5">
                <div style="display:flex; align-items:center; gap:12px; padding:12px 0; border-top:1px solid rgba(var(--line),.07);">
                  <span style="width:24px; height:24px; border-radius:7px; background:rgba(var(--a2-rgb),.14); color:var(--a2); display:grid; place-items:center; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:700; flex-shrink:0;">{{ $index }}</span>
                  <span style="font-size:14.5px; color:var(--text2);">{{ step }}</span>
                </div>
              </sc-for>
            </div>

            <div style="display:flex; flex-direction:column; gap:16px;">
              <div style="background:var(--panel); border:1px solid rgba(var(--line),.08); border-radius:20px; padding:26px;">
                <div style="display:flex; align-items:baseline; gap:8px; margin-bottom:6px;"><span style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:40px; color:var(--a2);">{{ certActive.pass }}</span><span style="font-size:14px; color:var(--muted);">합격률</span></div>
                <div style="font-size:13px; color:var(--muted2);">최근 3개 기수 수강생 기준</div>
              </div>
              <div style="background:var(--panel); border:1px solid rgba(var(--line),.08); border-radius:20px; padding:24px; display:grid; gap:14px;">
                <div style="display:flex; justify-content:space-between;"><span style="font-size:13.5px; color:var(--muted); font-family:'JetBrains Mono',monospace;">자격 코드</span><span style="font-size:14px; font-weight:600;">{{ certActive.code }}</span></div>
                <div style="display:flex; justify-content:space-between; border-top:1px solid rgba(var(--line),.06); padding-top:14px;"><span style="font-size:13.5px; color:var(--muted); font-family:'JetBrains Mono',monospace;">학습 기간</span><span style="font-size:14px; font-weight:600;">{{ certActive.dur }}</span></div>
                <div style="display:flex; justify-content:space-between; border-top:1px solid rgba(var(--line),.06); padding-top:14px;"><span style="font-size:13.5px; color:var(--muted); font-family:'JetBrains Mono',monospace;">시험 방식</span><span style="font-size:14px; font-weight:600;">{{ certActive.exam }}</span></div>
                <div style="display:flex; justify-content:space-between; border-top:1px solid rgba(var(--line),.06); padding-top:14px;"><span style="font-size:13.5px; color:var(--muted); font-family:'JetBrains Mono',monospace;">응시료</span><span style="font-size:14px; font-weight:600;">{{ certActive.fee }}</span></div>
              </div>
              <button onclick="{{ certGoCourse }}" style="font-family:'Pretendard',sans-serif; font-weight:700; font-size:15px; color:#0a0b10; background:linear-gradient(135deg,var(--a2),var(--a1)); border:none; padding:16px; border-radius:13px; cursor:pointer; box-shadow:0 10px 28px rgba(var(--a2-rgb),.28);">합격 과정 수강하기 →</button>
            </div>
          </div>
        </section>
      </div>
    </sc-if>

    <!-- ====== AI 활용 ====== -->
    <sc-if value="{{ isAi }}" hint-placeholder-val="{{ false }}">
      <div data-screen-label="AI 활용">
        <section style="position:relative; overflow:hidden; padding:clamp(44px,8vh,90px) clamp(16px,4vw,48px) clamp(30px,4vh,48px);">
          <div style="position:absolute; inset:0; background-image:linear-gradient(rgba(var(--line),.04) 1px,transparent 1px),linear-gradient(90deg,rgba(var(--line),.04) 1px,transparent 1px); background-size:56px 56px; mask-image:radial-gradient(ellipse 70% 70% at 50% 10%,#000 30%,transparent 75%); -webkit-mask-image:radial-gradient(ellipse 70% 70% at 50% 10%,#000 30%,transparent 75%); z-index:-1;"></div>
          <div style="position:absolute; top:-80px; right:-40px; width:380px; height:380px; border-radius:50%; background:radial-gradient(circle,rgba(139,92,246,.2),transparent 70%); filter:blur(34px); z-index:-1;"></div>
          <div style="max-width:1180px; margin:0 auto;">
            <div data-reveal="" style="font-family:'JetBrains Mono',monospace; color:var(--a2); font-size:13px; letter-spacing:.08em; margin-bottom:14px;">// WORK WITH AI</div>
            <h1 data-reveal="" style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(34px,5vw,58px); line-height:1.08; letter-spacing:-.03em; margin:0 0 18px;">AI와 함께<br>일하는 법.</h1>
            <p data-reveal="" style="font-size:clamp(15px,1.7vw,18px); color:var(--muted); line-height:1.7; max-width:560px; margin:0;">ChatGPT · Copilot · Claude를 실무에 녹이는 방법. AI를 도구로 다루는 개발자가 살아남습니다.</p>
          </div>
        </section>

        <section style="max-width:1180px; margin:0 auto; padding:clamp(14px,2vh,24px) clamp(16px,4vw,48px) clamp(20px,3vh,30px);">
          <div data-reveal="" style="font-family:'JetBrains Mono',monospace; color:var(--a1); font-size:13px; margin-bottom:18px; letter-spacing:.06em;">// AI 도구</div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:18px;">
            <sc-for list="{{ aiTools }}" as="tool" hint-placeholder-count="4">
              <div data-reveal="" style="padding:24px; border-radius:18px; background:var(--panel); border:1px solid rgba(var(--line),.08);">
                <div style="width:48px; height:48px; border-radius:13px; background:{{ tool.color }}; display:grid; place-items:center; font-size:22px; color:#0a0b10; margin-bottom:16px;">{{ tool.icon }}</div>
                <div style="font-weight:700; font-size:17px; margin-bottom:6px;">{{ tool.name }}</div>
                <div style="font-size:13.5px; color:var(--muted); line-height:1.6;">{{ tool.use }}</div>
              </div>
            </sc-for>
          </div>
        </section>

        <section style="max-width:1180px; margin:0 auto; padding:clamp(30px,4vh,44px) clamp(16px,4vw,48px);">
          <div data-reveal="" style="display:grid; grid-template-columns:1fr 1fr; gap:22px; align-items:center;" data-ai-grid="">
            <div>
              <div style="font-family:'JetBrains Mono',monospace; color:var(--a2); font-size:13px; margin-bottom:14px; letter-spacing:.06em;">// 실무 활용 시나리오</div>
              <div style="display:grid; gap:12px;">
                <sc-for list="{{ aiCases }}" as="cs" hint-placeholder-count="4">
                  <div style="display:flex; gap:14px; padding:18px; border-radius:14px; background:var(--panel); border:1px solid rgba(var(--line),.08);">
                    <span style="font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:600; color:var(--a1); padding:5px 9px; border-radius:7px; background:rgba(var(--a1-rgb),.1); height:fit-content; white-space:nowrap;">{{ cs.tag }}</span>
                    <div><div style="font-weight:700; font-size:15.5px; margin-bottom:4px;">{{ cs.t }}</div><div style="font-size:13.5px; color:var(--muted); line-height:1.55;">{{ cs.d }}</div></div>
                  </div>
                </sc-for>
              </div>
            </div>
            <div style="background:#0e1018; border:1px solid rgba(var(--line),.1); border-radius:18px; overflow:hidden; box-shadow:0 24px 60px rgba(0,0,0,.4);">
              <div style="display:flex; align-items:center; gap:7px; padding:13px 16px; border-bottom:1px solid rgba(255,255,255,.07); background:#0a0c12;">
                <span style="width:11px; height:11px; border-radius:50%; background:#ff5f57;"></span><span style="width:11px; height:11px; border-radius:50%; background:#febc2e;"></span><span style="width:11px; height:11px; border-radius:50%; background:#28c840;"></span>
                <span style="margin-left:8px; font-family:'JetBrains Mono',monospace; font-size:12px; color:#5d6478;">ai-prompt.md</span>
              </div>
              <div style="padding:20px; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.9; color:#abb2bf;">
                <div><span style="color:#5d6478;">// 프롬프트 예시</span></div>
                <div><span style="color:#c678dd;">role:</span> <span style="color:#98c379;">"시니어 백엔드 리뷰어"</span></div>
                <div><span style="color:#c678dd;">task:</span> <span style="color:#98c379;">"이 PR의 버그와"</span></div>
                <div style="padding-left:54px;"><span style="color:#98c379;">"성능 이슈를 찾아줘"</span></div>
                <div><span style="color:#c678dd;">format:</span> <span style="color:#e5c07b;">[심각도, 위치, 수정안]</span></div>
                <div style="margin-top:8px;"><span style="color:var(--a2);">→ 리뷰 시간 70% 단축</span></div>
              </div>
            </div>
          </div>
        </section>

        <section style="max-width:1180px; margin:0 auto; padding:clamp(20px,3vh,30px) clamp(16px,4vw,48px) clamp(50px,7vh,80px);">
          <div data-reveal="" style="display:flex; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:24px; flex-wrap:wrap;">
            <h2 style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(22px,3vw,32px); letter-spacing:-.02em; margin:0;">AI 활용 추천 강의</h2>
            <button onclick="{{ goOnline }}" style="font-family:'Pretendard',sans-serif; font-weight:600; font-size:14px; color:var(--text); background:rgba(var(--line),.05); border:1px solid rgba(var(--line),.14); padding:11px 18px; border-radius:11px; cursor:pointer;">전체 강의 →</button>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(265px,1fr)); gap:20px;">
            <sc-for list="{{ aiCourses }}" as="c" hint-placeholder-count="3">
              <div data-reveal="" onclick="{{ c.onClick }}" style="background:var(--panel); border:1px solid rgba(var(--line),.08); border-radius:18px; overflow:hidden; cursor:pointer; transition:transform .2s, border-color .2s;" style-hover="transform:translateY(-6px); border-color:rgba(var(--a1-rgb),.4);">
                <div style="position:relative; height:130px; background:{{ c.thumb }}; display:flex; align-items:center; justify-content:center;">
                  <div style="font-family:'JetBrains Mono',monospace; font-weight:700; font-size:26px; color:rgba(10,11,16,.82);">{{ c.mark }}</div>
                </div>
                <div style="padding:18px;">
                  <div style="font-weight:700; font-size:16px; line-height:1.35; margin-bottom:8px;">{{ c.title }}</div>
                  <div style="font-size:13px; color:var(--muted);">{{ c.instructor }}</div>
                </div>
              </div>
            </sc-for>
          </div>
        </section>
      </div>
    </sc-if>

    <!-- ====== 커뮤니티 ====== -->
    <sc-if value="{{ isCommunity }}" hint-placeholder-val="{{ false }}">
      <div data-screen-label="커뮤니티">
        <section style="position:relative; overflow:hidden; padding:clamp(44px,8vh,84px) clamp(16px,4vw,48px) clamp(24px,3vh,36px);">
          <div style="position:absolute; top:-80px; right:-40px; width:340px; height:340px; border-radius:50%; background:radial-gradient(circle,rgba(var(--a1-rgb),.16),transparent 70%); filter:blur(30px); z-index:-1;"></div>
          <div style="max-width:1180px; margin:0 auto; display:flex; align-items:flex-end; justify-content:space-between; gap:20px; flex-wrap:wrap;">
            <div>
              <div data-reveal="" style="font-family:'JetBrains Mono',monospace; color:var(--a2); font-size:13px; letter-spacing:.08em; margin-bottom:14px;">// COMMUNITY</div>
              <h1 data-reveal="" style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(34px,5vw,56px); line-height:1.08; letter-spacing:-.03em; margin:0 0 14px;">커뮤니티</h1>
              <p data-reveal="" style="font-size:clamp(15px,1.7vw,18px); color:var(--muted); line-height:1.6; max-width:520px; margin:0;">질문하고, 스터디를 모으고, 합격·취업 후기를 나누세요. 8.6만 멤버가 함께 성장합니다.</p>
            </div>
            <button data-reveal="" style="font-family:'Pretendard',sans-serif; font-weight:700; font-size:15px; color:#0a0b10; background:linear-gradient(135deg,var(--a2),var(--a1)); border:none; padding:14px 24px; border-radius:12px; cursor:pointer; white-space:nowrap;">✎ 글쓰기</button>
          </div>
        </section>

        <section style="max-width:1180px; margin:0 auto; padding:clamp(14px,2vh,24px) clamp(16px,4vw,48px) clamp(50px,7vh,80px);">
          <div style="display:grid; grid-template-columns:1fr 320px; gap:24px; align-items:start;" data-comm-grid="">
            <div>
              <div data-reveal="" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:18px;">
                <sc-for list="{{ communityCats }}" as="c" hint-placeholder-count="5">
                  <button style="font-family:'Pretendard',sans-serif; font-weight:600; font-size:13.5px; color:{{ c.catColor }}; background:{{ c.catBg }}; border:1px solid rgba(var(--line),.1); padding:9px 15px; border-radius:999px; cursor:pointer;">{{ c.label }} <span style="font-family:'JetBrains Mono',monospace; font-size:11px; opacity:.7;">{{ c.count }}</span></button>
                </sc-for>
              </div>
              <div style="display:grid; gap:12px;">
                <sc-for list="{{ communityPosts }}" as="p" hint-placeholder-count="5">
                  <div data-reveal="" style="display:flex; gap:16px; padding:20px; border-radius:16px; background:var(--panel); border:1px solid rgba(var(--line),.08); cursor:pointer; transition:border-color .2s, transform .2s;" style-hover="border-color:rgba(var(--a1-rgb),.4); transform:translateY(-2px);">
                    <div style="width:46px; height:46px; border-radius:50%; background:{{ p.color }}; display:grid; place-items:center; font-family:'Space Grotesk',sans-serif; font-weight:700; color:#0a0b10; flex-shrink:0;">{{ p.initial }}</div>
                    <div style="flex:1; min-width:0;">
                      <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                        <span style="font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:600; color:var(--a1); padding:3px 8px; border-radius:6px; background:rgba(var(--a1-rgb),.1);">{{ p.cat }}</span>
                        <sc-if value="{{ p.hot }}" hint-placeholder-val="{{ false }}"><span style="font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:700; color:var(--a2);">🔥 HOT</span></sc-if>
                      </div>
                      <div style="font-weight:700; font-size:16px; line-height:1.4; margin-bottom:8px; text-wrap:pretty;">{{ p.title }}</div>
                      <div style="display:flex; align-items:center; gap:14px; font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--muted2);">
                        <span>{{ p.author }}</span><span>· {{ p.time }}</span><span>♥ {{ p.likes }}</span><span>💬 {{ p.comments }}</span>
                      </div>
                    </div>
                  </div>
                </sc-for>
              </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:18px;" data-comm-side="">
              <div data-reveal="" style="padding:22px; border-radius:18px; background:var(--surface); border:1px solid rgba(var(--line),.08);">
                <div style="font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--muted2); margin-bottom:16px; letter-spacing:.06em;">// 스터디 모집</div>
                <div style="display:grid; gap:14px;">
                  <sc-for list="{{ studyGroups }}" as="g" hint-placeholder-count="3">
                    <div style="display:flex; align-items:center; gap:12px;">
                      <div style="flex:1;"><div style="font-weight:600; font-size:14px; margin-bottom:3px;">{{ g.t }}</div><div style="font-family:'JetBrains Mono',monospace; font-size:11.5px; color:var(--muted2);">{{ g.day }} · {{ g.members }}</div></div>
                      <span style="font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--a2); padding:4px 8px; border-radius:6px; background:rgba(var(--a2-rgb),.12); white-space:nowrap;">{{ g.tag }}</span>
                    </div>
                  </sc-for>
                </div>
              </div>
              <div data-reveal="" style="padding:22px; border-radius:18px; background:var(--surface); border:1px solid rgba(var(--line),.08);">
                <div style="font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--muted2); margin-bottom:16px; letter-spacing:.06em;">// 다가오는 이벤트</div>
                <div style="display:grid; gap:14px;">
                  <sc-for list="{{ communityEvents }}" as="e" hint-placeholder-count="3">
                    <div style="display:flex; align-items:center; gap:12px;">
                      <div style="width:46px; text-align:center; flex-shrink:0;"><div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:16px; color:var(--a1);">{{ e.d }}</div></div>
                      <div style="flex:1;"><div style="font-weight:600; font-size:14px; line-height:1.3;">{{ e.t }}</div><div style="font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--muted2); margin-top:2px;">{{ e.tag }}</div></div>
                    </div>
                  </sc-for>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </sc-if>

    <!-- ====== 강의 상세 ====== -->
    <sc-if value="{{ isDetail }}" hint-placeholder-val="{{ false }}">
      <div data-screen-label="강의 상세">
        <section style="max-width:1180px; margin:0 auto; padding:clamp(30px,5vh,54px) clamp(16px,4vw,48px) clamp(50px,7vh,80px);">
          <button onclick="{{ goOnline }}" style="background:none; border:none; color:var(--muted); font-family:'JetBrains Mono',monospace; font-size:13px; cursor:pointer; margin-bottom:24px; padding:0;">← 강의 목록</button>
          <div style="display:grid; grid-template-columns:1fr 360px; gap:30px; align-items:start;" data-detail-grid="">
            <div>
              <div data-reveal="" style="position:relative; height:240px; border-radius:22px; background:{{ sel.thumb }}; display:flex; align-items:center; justify-content:center; overflow:hidden; margin-bottom:28px;">
                <div style="position:absolute; inset:0; background-image:linear-gradient(rgba(0,0,0,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.16) 1px,transparent 1px); background-size:30px 30px;"></div>
                <div style="font-family:'JetBrains Mono',monospace; font-weight:700; font-size:54px; color:rgba(10,11,16,.8); position:relative;">{{ sel.mark }}</div>
              </div>
              <div data-reveal="">
                <div style="font-family:'JetBrains Mono',monospace; font-size:12.5px; color:var(--a1); margin-bottom:10px;">{{ sel.catLabel }} · {{ sel.level }}</div>
                <h1 style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(26px,3.6vw,38px); line-height:1.18; letter-spacing:-.02em; margin:0 0 14px;">{{ sel.title }}</h1>
                <div style="display:flex; align-items:center; gap:16px; font-family:'JetBrains Mono',monospace; font-size:13.5px; color:var(--muted); margin-bottom:26px; flex-wrap:wrap;">
                  <span>{{ sel.instructor }}</span><span style="color:var(--a2);">★ {{ sel.rating }}</span><span>수강생 {{ sel.studentsLabel }}명</span>
                </div>
                <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:30px;">
                  <sc-for list="{{ detailLearn }}" as="l" hint-placeholder-count="4">
                    <span style="display:inline-flex; align-items:center; gap:7px; font-size:13.5px; color:var(--text2); padding:9px 14px; border-radius:10px; background:rgba(var(--line),.05); border:1px solid rgba(var(--line),.08);"><span style="color:var(--a2);">✓</span>{{ l }}</span>
                  </sc-for>
                </div>
                <div style="font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--muted2); margin-bottom:14px; letter-spacing:.06em;">// 커리큘럼</div>
                <sc-for list="{{ detailCurriculum }}" as="c" hint-placeholder-count="5">
                  <div style="display:flex; align-items:center; gap:14px; padding:15px 0; border-top:1px solid rgba(var(--line),.07);">
                    <span style="width:28px; height:28px; border-radius:8px; background:rgba(var(--a1-rgb),.12); color:var(--a1); display:grid; place-items:center; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:700; flex-shrink:0;">{{ $index }}</span>
                    <span style="font-size:15px; color:var(--text2); flex:1;">{{ c.t }}</span>
                    <span style="font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--muted2);">{{ c.n }}강</span>
                  </div>
                </sc-for>
              </div>
            </div>

            <div data-reveal="" style="position:sticky; top:90px; background:var(--panel); border:1px solid rgba(var(--line),.1); border-radius:20px; padding:26px; box-shadow:0 20px 50px rgba(0,0,0,.3);">
              <div style="display:flex; align-items:baseline; gap:9px; margin-bottom:4px;"><span style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:30px; color:var(--text);">{{ sel.price }}</span><span style="font-size:14px; color:var(--muted2); text-decoration:line-through;">{{ sel.oldPrice }}</span></div>
              <div style="font-size:13px; color:var(--a2); margin-bottom:20px;">평생 무제한 수강 · 7일 무료체험</div>
              <button onclick="{{ goEnrollFree }}" style="width:100%; font-family:'Pretendard',sans-serif; font-weight:700; font-size:16px; color:#0a0b10; background:linear-gradient(135deg,var(--a2),var(--a1)); border:none; padding:16px; border-radius:13px; cursor:pointer; margin-bottom:10px; box-shadow:0 10px 28px rgba(var(--a2-rgb),.28);">수강 신청하기</button>
              <button onclick="{{ goEnrollFree }}" style="width:100%; font-family:'Pretendard',sans-serif; font-weight:600; font-size:15px; color:var(--text); background:rgba(var(--line),.05); border:1px solid rgba(var(--line),.14); padding:14px; border-radius:13px; cursor:pointer; margin-bottom:22px;">7일 무료체험</button>
              <div style="display:grid; gap:12px;">
                <sc-for list="{{ detailIncludes }}" as="i" hint-placeholder-count="4">
                  <div style="display:flex; align-items:center; gap:10px; font-size:13.5px; color:var(--text2);"><span style="color:var(--a1);">{{ i.icon }}</span>{{ i.text }}</div>
                </sc-for>
              </div>
            </div>
          </div>
        </section>
      </div>
    </sc-if>

    <!-- ====== 수강신청 / 결제 ====== -->
    <sc-if value="{{ isEnroll }}" hint-placeholder-val="{{ false }}">
      <div data-screen-label="수강신청 결제">
        <section style="max-width:880px; margin:0 auto; padding:clamp(40px,6vh,72px) clamp(16px,4vw,48px) clamp(50px,7vh,80px);">
          <div data-reveal="" style="font-family:'JetBrains Mono',monospace; color:var(--a1); font-size:13px; letter-spacing:.08em; margin-bottom:12px;">// CHECKOUT</div>
          <h1 data-reveal="" style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(28px,4vw,42px); letter-spacing:-.02em; margin:0 0 30px;">수강 신청</h1>
          <div data-reveal="" style="display:grid; grid-template-columns:1fr 320px; gap:24px; align-items:start;" data-enroll-grid="">
            <div style="display:flex; flex-direction:column; gap:18px;">
              <div style="background:var(--panel); border:1px solid rgba(var(--line),.08); border-radius:18px; padding:24px;">
                <div style="font-weight:700; font-size:16px; margin-bottom:18px;">신청자 정보</div>
                <div style="display:grid; gap:14px;">
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
                    <div><div style="font-size:12px; color:var(--muted2); font-family:'JetBrains Mono',monospace; margin-bottom:7px;">이름</div><div style="padding:13px 15px; border-radius:11px; background:rgba(var(--line),.05); border:1px solid rgba(var(--line),.1); font-size:14px; color:var(--muted);">홍길동</div></div>
                    <div><div style="font-size:12px; color:var(--muted2); font-family:'JetBrains Mono',monospace; margin-bottom:7px;">연락처</div><div style="padding:13px 15px; border-radius:11px; background:rgba(var(--line),.05); border:1px solid rgba(var(--line),.1); font-size:14px; color:var(--muted);">010-1234-5678</div></div>
                  </div>
                  <div><div style="font-size:12px; color:var(--muted2); font-family:'JetBrains Mono',monospace; margin-bottom:7px;">이메일</div><div style="padding:13px 15px; border-radius:11px; background:rgba(var(--line),.05); border:1px solid rgba(var(--line),.1); font-size:14px; color:var(--muted);">student@dreamitbiz.co.kr</div></div>
                </div>
              </div>
              <div style="background:var(--panel); border:1px solid rgba(var(--line),.08); border-radius:18px; padding:24px;">
                <div style="font-weight:700; font-size:16px; margin-bottom:18px;">결제 수단</div>
                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px;">
                  <sc-for list="{{ payMethods }}" as="m" hint-placeholder-count="3">
                    <button onclick="{{ m.onClick }}" style="font-family:'Pretendard',sans-serif; font-weight:600; font-size:13.5px; color:{{ m.color }}; background:{{ m.bg }}; border:1px solid {{ m.border }}; padding:14px 10px; border-radius:12px; cursor:pointer;">{{ m.label }}</button>
                  </sc-for>
                </div>
              </div>
            </div>
            <div data-reveal="" style="position:sticky; top:90px; background:var(--panel); border:1px solid rgba(var(--line),.1); border-radius:18px; padding:24px;">
              <div style="display:flex; gap:13px; align-items:center; margin-bottom:20px; padding-bottom:20px; border-bottom:1px solid rgba(var(--line),.08);">
                <div style="width:50px; height:50px; border-radius:12px; background:{{ sel.thumb }}; display:grid; place-items:center; font-family:'JetBrains Mono',monospace; font-weight:700; color:#0a0b10; flex-shrink:0;">{{ sel.mark }}</div>
                <div style="font-weight:700; font-size:14.5px; line-height:1.35;">{{ sel.title }}</div>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:14px; color:var(--muted); margin-bottom:10px;"><span>정가</span><span style="text-decoration:line-through;">{{ sel.oldPrice }}</span></div>
              <div style="display:flex; justify-content:space-between; font-size:14px; color:var(--a2); margin-bottom:16px;"><span>할인가</span><span>{{ sel.price }}</span></div>
              <div style="display:flex; justify-content:space-between; align-items:baseline; padding-top:16px; border-top:1px solid rgba(var(--line),.08); margin-bottom:20px;"><span style="font-weight:700;">결제 금액</span><span style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:24px; color:var(--text);">{{ sel.price }}</span></div>
              <button style="width:100%; font-family:'Pretendard',sans-serif; font-weight:700; font-size:16px; color:#0a0b10; background:linear-gradient(135deg,var(--a2),var(--a1)); border:none; padding:16px; border-radius:13px; cursor:pointer; box-shadow:0 10px 28px rgba(var(--a2-rgb),.28);">결제하고 시작하기 →</button>
              <div style="text-align:center; font-size:12px; color:var(--muted2); margin-top:12px; font-family:'JetBrains Mono',monospace;">7일 이내 100% 환불 보장</div>
            </div>
          </div>
        </section>
      </div>
    </sc-if>

    <!-- ====== 마이페이지 ====== -->
    <sc-if value="{{ isDashboard }}" hint-placeholder-val="{{ false }}">
      <div data-screen-label="마이페이지">
        <section style="max-width:1180px; margin:0 auto; padding:clamp(40px,6vh,72px) clamp(16px,4vw,48px) clamp(50px,7vh,80px);">
          <div data-reveal="" style="display:flex; align-items:center; gap:16px; margin-bottom:36px;">
            <div style="width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg,var(--a1),var(--a2)); display:grid; place-items:center; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:26px; color:#0a0b10;">홍</div>
            <div><div style="font-family:'Space Grotesk','Pretendard',sans-serif; font-weight:700; font-size:clamp(22px,3vw,30px); letter-spacing:-.02em;">안녕하세요, 홍길동님 👋</div><div style="font-size:14px; color:var(--muted); margin-top:4px;">오늘도 한 걸음 나아가 볼까요?</div></div>
          </div>
          <div data-reveal="" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:16px; margin-bottom:38px;">
            <div style="padding:22px; border-radius:16px; background:var(--panel); border:1px solid rgba(var(--line),.08);"><div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:28px; color:var(--a1);">3</div><div style="font-size:13px; color:var(--muted2); font-family:'JetBrains Mono',monospace; margin-top:3px;">수강 중</div></div>
            <div style="padding:22px; border-radius:16px; background:var(--panel); border:1px solid rgba(var(--line),.08);"><div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:28px; color:var(--a2);">47</div><div style="font-size:13px; color:var(--muted2); font-family:'JetBrains Mono',monospace; margin-top:3px;">완료 강의</div></div>
            <div style="padding:22px; border-radius:16px; background:var(--panel); border:1px solid rgba(var(--line),.08);"><div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:28px; color:var(--text);">12<span style="font-size:16px;">일</span></div><div style="font-size:13px; color:var(--muted2); font-family:'JetBrains Mono',monospace; margin-top:3px;">연속 학습</div></div>
            <div style="padding:22px; border-radius:16px; background:var(--panel); border:1px solid rgba(var(--line),.08);"><div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:28px; color:var(--text);">2</div><div style="font-size:13px; color:var(--muted2); font-family:'JetBrains Mono',monospace; margin-top:3px;">수료증</div></div>
          </div>
          <div data-reveal="" style="font-family:'JetBrains Mono',monospace; color:var(--a1); font-size:13px; margin-bottom:18px; letter-spacing:.06em;">// 이어서 학습하기</div>
          <div style="display:grid; gap:14px;">
            <sc-for list="{{ myCourses }}" as="c" hint-placeholder-count="3">
              <div data-reveal="" onclick="{{ c.onClick }}" style="display:flex; align-items:center; gap:18px; padding:20px; border-radius:16px; background:var(--panel); border:1px solid rgba(var(--line),.08); cursor:pointer; transition:border-color .2s;" style-hover="border-color:rgba(var(--a1-rgb),.4);">
                <div style="width:60px; height:60px; border-radius:13px; background:{{ c.thumb }}; display:grid; place-items:center; font-family:'JetBrains Mono',monospace; font-weight:700; font-size:22px; color:#0a0b10; flex-shrink:0;">{{ c.mark }}</div>
                <div style="flex:1; min-width:0;">
                  <div style="font-weight:700; font-size:16px; margin-bottom:4px;">{{ c.title }}</div>
                  <div style="font-size:13px; color:var(--muted); margin-bottom:10px;">{{ c.instructor }}</div>
                  <div style="height:7px; border-radius:4px; background:rgba(var(--line),.08); overflow:hidden;"><div style="height:100%; width:{{ c.progressW }}; background:linear-gradient(90deg,var(--a1),var(--a2)); border-radius:4px;"></div></div>
                </div>
                <div style="text-align:right; flex-shrink:0;"><div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:20px; color:var(--a2);">{{ c.progress }}%</div><div style="font-size:11.5px; color:var(--muted2); font-family:'JetBrains Mono',monospace;">진도율</div></div>
              </div>
            </sc-for>
          </div>
        </section>
      </div>
    </sc-if>

  </main>

  <!-- ============ FOOTER ============ -->
  <footer style="border-top:1px solid rgba(var(--line),.07); background:var(--surface); padding:clamp(48px,7vw,72px) clamp(16px,4vw,48px) 40px;">
    <div style="max-width:1180px; margin:0 auto;">
      <div style="display:grid; grid-template-columns:1.4fr 1fr 1fr 1fr; gap:36px; margin-bottom:48px;" data-foot-grid="">
        <div>
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
            <div style="width:32px; height:32px; border-radius:9px; background:linear-gradient(135deg,var(--a1),var(--a2)); display:grid; place-items:center; font-family:'JetBrains Mono',monospace; font-weight:700; color:#0a0b10; font-size:15px;">&lt;/&gt;</div>
            <div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:17px;">DREAM<span style="color:var(--a2);">IT</span> BIZ</div>
          </div>
          <p style="font-size:13.5px; color:var(--muted2); line-height:1.7; max-width:280px; margin:0;">코딩·자격증·데이터 AI 실무 교육 플랫폼. 12만 수강생과 함께 성장합니다.</p>
        </div>
        <sc-for list="{{ footerCols }}" as="col" hint-placeholder-count="3">
          <div>
            <div style="font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--faint); margin-bottom:16px; letter-spacing:.06em;">{{ col.head }}</div>
            <sc-for list="{{ col.items }}" as="it" hint-placeholder-count="4">
              <div style="font-size:14px; color:var(--muted); margin-bottom:11px; cursor:pointer;" style-hover="color:var(--text);">{{ it }}</div>
            </sc-for>
          </div>
        </sc-for>
      </div>
      <div style="display:flex; align-items:center; justify-content:space-between; gap:16px; padding-top:28px; border-top:1px solid rgba(var(--line),.06); flex-wrap:wrap;">
        <div style="font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--faint);">© 2026 DreamIT Biz Co., Ltd. · 사업자등록번호 123-45-67890</div>
        <div style="display:flex; gap:14px; font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--muted2);">
          <span style="cursor:pointer;" style-hover="color:var(--text);">이용약관</span>
          <span style="cursor:pointer; color:var(--text2);" style-hover="color:#fff;">개인정보처리방침</span>
          <span style="cursor:pointer;" style-hover="color:var(--text);">고객센터</span>
        </div>
      </div>
    </div>
  </footer>

</div>`;
