/* eslint-disable @next/next/no-html-link-for-pages */
import type { ReactNode } from "react";

// 와이어프레임 — PDF용. 실제 디자인 숨김. 그레이스케일.
// 모든 인터랙션 없음. layout.tsx 의 cursor/noise/nav 는 CSS 로 숨김.

const RESET_CSS = `
  body, html { background: #fff !important; color: #111 !important; cursor: auto !important; }
  body.has-custom-cursor, body.has-custom-cursor * { cursor: auto !important; }
  .cursor-dot, .cursor-ring, .noise-layer { display: none !important; }
  button[aria-label="메뉴 열기"], button[aria-label="메뉴 닫기"] { display: none !important; }
  nav[aria-hidden] { display: none !important; }
  .wf-page { page-break-after: always; break-after: page; }
  @media print {
    @page { size: A4 portrait; margin: 14mm; }
    .wf-page { min-height: 0; padding: 0 !important; }
    .wf-no-print { display: none !important; }
  }
  .wf-h-hand { font-family: ui-sans-serif, system-ui, sans-serif; letter-spacing: -0.01em; }
  .wf-box { border: 1.5px solid #111; }
  .wf-img { background:
    repeating-linear-gradient(135deg, #d1d1d1 0 1px, transparent 1px 14px), #ededed; }
`;

export default function WireframePage() {
  return (
    <main className="relative min-h-screen w-full bg-white text-black wf-h-hand">
      <style dangerouslySetInnerHTML={{ __html: RESET_CSS }} />

      <TopBar />

      {/* 01 — Opening */}
      <Page n="01" title="Opening — Sticky Typewriter">
        <Stack>
          <p className="text-[11px] uppercase tracking-widest text-gray-500">
            Full-bleed black bg · centered text · caret blinks
          </p>
          <div className="wf-box mt-3 p-8">
            <div className="text-3xl font-bold leading-tight">
              자 넌 이제부터<br />
              우리의 프로젝트 “하루안부”를 담당할<br />
              기획자이자<br />
              UX 리서처이자<br />
              시장 분석가이자<br />
              …<br />
              프롬프트 엔지니어야.<span className="ml-1 inline-block h-[1em] w-1 bg-black align-middle" />
            </div>
            <p className="mt-6 text-[11px] text-gray-500">
              스크롤 락 → 28cps 타이핑(~5.3s) → 1.3s dwell → 풀림
            </p>
          </div>
        </Stack>
      </Page>

      {/* 02 — Problem Discovery */}
      <Page n="02" title="Origin — Problem Discovery">
        <Stack>
          <Crumb>chapter 01 · 시작</Crumb>
          <Question>● 노인 돌봄 시장의 빈틈은 어디 있을까?</Question>
          <Cards3>
            <Card title="01 · 자녀의 죄책감">
              멀리 사는 자녀가 매일 부모 상태를 확인할 방법이 없다. 전화는 부담이고, 영상통화는 의무가 된다.
            </Card>
            <Card title="02 · 환자의 고립">
              자식들과 연락이 점점 뜸해진다. 병원에 가도 의사 한 명에게 5분, 그게 전부다.
            </Card>
            <Card title="03 · 간병인의 단절">
              환자의 히스토리가 한 사람 머릿속에만 있다. 다음 교대자에게 전달되지 않는다.
            </Card>
          </Cards3>
          <Divider />
          <p className="text-center text-xl font-bold">
            결론 — “보호자 ↔ 환자 ↔ 간병인 ↔ 의료진을 한 줄로 잇자.”
          </p>
        </Stack>
      </Page>

      {/* 03 — Research / Personas */}
      <Page n="03" title="Research — Personas">
        <Stack>
          <Crumb>chapter 02 · 리서치 (1/3)</Crumb>
          <Command>“누구를 위해 만들지부터 정해.”</Command>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {["보호자 · 김미영, 52", "환자 · 김순자, 78", "간호사 · 박지현, 34"].map((p) => (
              <div key={p} className="wf-box p-4">
                <ImgBox aspect="aspect-[3/4]" caption="persona photo" />
                <div className="mt-2 text-sm font-semibold">{p}</div>
                <div className="mt-1 text-[11px] text-gray-500">
                  pain points · goals · daily routine
                </div>
              </div>
            ))}
          </div>
        </Stack>
      </Page>

      {/* 04 — JTBD */}
      <Page n="04" title="Research — JTBD">
        <Stack>
          <Crumb>chapter 02 · 리서치 (2/3)</Crumb>
          <Command>“그들이 진짜 원하는 게 뭔지 찾아내.”</Command>
          <div className="wf-box mt-4 p-6">
            <p className="text-[11px] uppercase tracking-widest text-gray-500">
              jobs-to-be-done table (surface need → real need)
            </p>
            <div className="mt-3 divide-y divide-gray-300">
              {[
                ["부모 상태 확인", "안심 · 죄책감 해소"],
                ["가족 채팅", "고립감 해소 · 존재 확인"],
                ["복약 알림", "사고 방지 · 책임 분담"],
              ].map(([a, b]) => (
                <div key={a} className="grid grid-cols-2 gap-4 py-3 text-sm">
                  <div className="text-gray-500">{a}</div>
                  <div className="font-semibold">→ {b}</div>
                </div>
              ))}
            </div>
          </div>
        </Stack>
      </Page>

      {/* 05 — Matrix + Blue Ocean */}
      <Page n="05" title="Research — Market Matrix + Blue Ocean">
        <Stack>
          <Crumb>chapter 02 · 리서치 (3/3)</Crumb>
          <Command>“시장에서 우리만 할 수 있는 게 뭔지도.”</Command>
          <p className="mt-4 text-2xl font-bold">기능 14개 · 경쟁사 12개 · 10개는 이미 있다.</p>
          <div className="wf-box mt-4 grid grid-cols-[80px_1fr] gap-x-2 gap-y-1 p-4 text-xs">
            <div className="text-gray-500">covered</div>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className="wf-box px-2 py-0.5 text-[10px]">기능 {i + 1}</span>
              ))}
            </div>
            <div className="mt-2 font-bold">BLUE OCEAN</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {["채팅 통합", "처방 타임라인", "가족 그룹 알림", "AI 컨시어지"].map((f) => (
                <span key={f} className="bg-black px-2 py-0.5 text-[10px] text-white">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </Stack>
      </Page>

      {/* 06 — Brand / Logo Evolution */}
      <Page n="06" title="Brand — Logo Evolution (Chat Thread)">
        <Stack>
          <Crumb>chapter 03 · 브랜드</Crumb>
          <div className="wf-box mt-2 p-6">
            <p className="text-[11px] uppercase tracking-widest text-gray-500">
              10턴 채팅 (me / ai) · ai 응답마다 attempt png 첨부
            </p>
            <div className="mt-4 space-y-3">
              {[
                ["me", "우리 기획서를 가지고 로고 만들어봐."],
                ["ai", "네. 다이어그램형으로… [attempt 01]"],
                ["me", "다이어그램이잖아. 다시."],
                ["ai", "캐릭터형… [attempt 02]"],
                ["me", "캐릭터 같아. 의료 신뢰감 없어. 다시."],
                ["ai", "십자가+하트+가족 콤보… [attempt 03]"],
                ["me", "색이 많아. 단순하게 다시."],
                ["ai", "단일 곡선… [attempt 04]"],
                ["me", "시그니처 한 곡선으로 가자."],
                ["ai", "ㅎ에서 영감, 한번에 그리는 곡선 심볼. [final]"],
              ].map(([role, text], i) => (
                <div
                  key={i}
                  className={role === "me" ? "ml-auto max-w-[70%]" : "mr-auto max-w-[70%]"}
                >
                  <div className={`wf-box p-2 text-xs ${role === "me" ? "bg-gray-200" : ""}`}>
                    <span className="font-mono text-[10px] uppercase text-gray-500">
                      {role}
                    </span>
                    <div>{text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="text-right text-2xl font-bold">이거다.</div>
            <div>→</div>
            <ImgBox aspect="aspect-square" caption="하루안부 final symbol (#2c7afc)" />
          </div>
          <p className="text-center text-[11px] text-gray-500">
            마지막 구간: 로고 scale 1 → 15 줌인 + 풀스크린 블루 wash
          </p>
        </Stack>
      </Page>

      {/* 07 — Design Iteration */}
      <Page n="07" title="Iteration — Design v1 → v13">
        <Stack>
          <Crumb>chapter 04 · 디자인 (1/3)</Crumb>
          <p className="text-sm text-gray-600">
            sticky 시퀀스: v1 — “다시.” — v2 — “다시.” — v3 — cascade — “이거야!” — v13
          </p>
          <div className="mt-4 grid grid-cols-7 gap-2">
            {["v1", "v2", "v3", "v5", "v7", "v9", "v11"].map((v) => (
              <div key={v}>
                <ImgBox aspect="aspect-[3/4]" caption={v} />
                <p className="mt-1 text-center font-mono text-[10px] text-gray-500">{v}</p>
              </div>
            ))}
          </div>
          <Divider />
          <div className="grid grid-cols-[auto_1fr] items-center gap-6">
            <ImgBox aspect="aspect-[9/19.5]" caption="iPhone mockup · v13 final" />
            <div>
              <div className="text-2xl font-bold">“이거야!”</div>
              <p className="mt-2 text-sm text-gray-600">
                12번의 반복 끝에 통과 신호. 디자인 시스템 확정.
              </p>
            </div>
          </div>
        </Stack>
      </Page>

      {/* 08 — App Branching */}
      <Page n="08" title="Iteration — v13 → 3 Apps Branching">
        <Stack>
          <Crumb>chapter 04 · 디자인 (2/3)</Crumb>
          <p className="text-2xl font-bold">한 디자인 시스템에서 세 갈래.</p>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              ["보호자앱", "안심"],
              ["환자앱", "연결"],
              ["의료진웹", "기록"],
            ].map(([n, r]) => (
              <div key={n} className="text-center">
                <ImgBox aspect="aspect-[9/19.5]" caption={n} />
                <div className="mt-2 text-sm font-semibold">{n}</div>
                <div className="font-mono text-[10px] uppercase text-gray-500">{r}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] text-gray-500">
            같은 컴포넌트, 다른 화면. 같은 톤, 다른 역할.
          </p>
        </Stack>
      </Page>

      {/* 09 — Code Workflow */}
      <Page n="09" title="Iteration — Design → Code">
        <Stack>
          <Crumb>chapter 04 · 디자인 (3/3)</Crumb>
          <p className="text-xl font-bold">“이 화면 그대로 코드로 짜줘.”</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="wf-box p-4">
              <div className="font-mono text-[10px] uppercase text-gray-500">design</div>
              <ImgBox aspect="aspect-[4/5]" caption="card UI mock" />
            </div>
            <div className="wf-box p-4">
              <div className="font-mono text-[10px] uppercase text-gray-500">code</div>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-[11px] leading-tight">{`<button className="card">
  <Avatar src={user.avatar} />
  <div className="meta">
    <h3>{user.name}</h3>
    <span className="status">
      마지막 안부 {min}분 전
    </span>
  </div>
  <Indicator color={user.color} />
</button>`}</pre>
            </div>
          </div>
          <p className="text-center text-[11px] text-gray-500">
            → 그 코드가 곧 동작하는 v8 보호자앱이 됨.
          </p>
        </Stack>
      </Page>

      {/* 10 — Film */}
      <Page n="10" title="Film — Higgsfield 4차 진화">
        <Stack>
          <Crumb>chapter 05 · 영상</Crumb>
          <Command>“영상까지 가자.”</Command>
          {[
            ["1차", "‘Korean hospital’ → 미국식 인테리어가 나왔다.", true],
            ["2차", "‘301호 302호, 형광등.’ 한국 디테일을 박자 분위기 살아남.", false],
            ["3차", "‘@김미영’ AI 인플루언서 핸들로 캐스팅 고정.", false],
            ["4차", "렌즈/조명/카메라 워크까지. 멈춤.", false],
          ].map(([n, cap, fail]) => (
            <div key={String(n)} className="mt-3 grid grid-cols-[1fr_2fr] gap-4 items-start">
              <ImgBox aspect="aspect-video" caption={`iter${n}`} />
              <div>
                <div className="text-sm font-bold">
                  {n}{fail ? " — 실패" : ""}
                </div>
                <p className="mt-1 text-xs text-gray-600">{cap}</p>
              </div>
            </div>
          ))}
        </Stack>
      </Page>

      {/* 11 — Method · Prompt Grammar */}
      <Page n="11" title="Method — Prompt Grammar (1/3)">
        <Stack>
          <Crumb>chapter 06 · 방법</Crumb>
          <p className="text-xl font-bold">우리가 자주 쓴 명령의 문법.</p>
          <ul className="mt-4 divide-y divide-gray-300">
            {[
              ["다시.", "47회", "가장 많이 쓴 한 마디"],
              ["이거야.", "12회", "처음 통과 신호"],
              ["더 단순하게.", "28회", "복잡도 컷"],
              ["왜 안 돼?", "19회", "디버깅 트리거"],
              ["X로 가자.", "34회", "방향 결정"],
              ["맥락을 다시 줘봐.", "11회", "흐름 회복"],
            ].map(([cmd, cnt, note]) => (
              <li key={cmd} className="flex items-baseline justify-between py-2">
                <div>
                  <span className="text-lg font-bold">“{cmd}”</span>
                  <span className="ml-3 text-[11px] text-gray-500">{note}</span>
                </div>
                <span className="font-mono text-base">{cnt}</span>
              </li>
            ))}
          </ul>
        </Stack>
      </Page>

      {/* 12 — Method · AI Stack */}
      <Page n="12" title="Method — AI Stack (2/3)">
        <Stack>
          <p className="text-xl font-bold">어떤 AI가 어디서 일했나.</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {[
              ["Claude", "기획 · 디자인 · 코드 · 시나리오", "메인 파트너"],
              ["Higgsfield", "영상 · 1차→4차 진화", "영상 디렉팅"],
              ["Figma", "디자인 시스템 · 목업 · 핸드오프", "디자인 본진"],
              ["Claude Code", "v8 보호자앱 풀 구현", "코드 실행"],
            ].map(([name, role, badge]) => (
              <div key={name} className="wf-box p-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-bold">{name}</h3>
                  <span className="font-mono text-[10px] uppercase text-gray-500">
                    {badge}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-600">{role}</p>
              </div>
            ))}
          </div>
        </Stack>
      </Page>

      {/* 13 — Method · Daily Workflow */}
      <Page n="13" title="Method — Daily Workflow (3/3)">
        <Stack>
          <p className="text-xl font-bold">하루는 이렇게 흘렀다.</p>
          <ol className="mt-4 space-y-3">
            {[
              ["09:00", "전날 결과물 다시 읽기", "Claude"],
              ["10:30", "이슈 발견 → 다시 프롬프트", "Claude"],
              ["13:00", "디자인 시안 새로 그리기", "Claude + Figma"],
              ["16:00", "코드로 옮기기", "Claude Code"],
              ["19:00", "영상 1컷 돌리기", "Higgsfield"],
              ["22:00", "내일 plan 정리", "Claude"],
            ].map(([t, task, tool]) => (
              <li key={t} className="grid grid-cols-[60px_12px_1fr] items-start gap-4">
                <span className="text-right font-mono text-xs text-gray-500">{t}</span>
                <span className="mt-1 h-2 w-2 rounded-full bg-black" />
                <div>
                  <div className="text-sm font-semibold">{task}</div>
                  <div className="font-mono text-[10px] uppercase text-gray-500">
                    with {tool}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Stack>
      </Page>

      {/* 14 — Failures gallery */}
      <Page n="14" title="Retrospective — Wall of Mistakes">
        <Stack>
          <p className="text-xl font-bold">근데 자주 틀렸다.</p>
          <p className="mt-1 text-[11px] uppercase tracking-widest text-gray-500">
            13개 — 로고 4 · 보호자/환자/의료진 초기 · 영상 1~3차
          </p>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[
              "로고 시도 01", "보호자앱 v1", "영상 1차", "로고 시도 02",
              "환자앱 초기", "보호자앱 v2", "영상 2차", "로고 시도 03",
              "의료진웹 초기", "보호자앱 v4", "영상 3차", "로고 시도 04",
              "보호자앱 v7",
            ].map((l) => (
              <div key={l}>
                <ImgBox aspect="aspect-[3/4]" caption={l} />
                <p className="mt-1 font-mono text-[9px] text-gray-500">다시.</p>
              </div>
            ))}
          </div>
        </Stack>
      </Page>

      {/* 15 — Numbers */}
      <Page n="15" title="Numbers — 4 Counts (1 per scroll)">
        <Stack>
          {[
            ["12,236", "줄의 대화"],
            ["612", "줄의 디자인 수정 명령"],
            ["228", "번의 재제작 요청"],
            ["106", "일간의 대장정"],
          ].map(([n, label]) => (
            <div key={n} className="wf-box p-6 text-center">
              <div className="text-5xl font-bold">{n}</div>
              <div className="mt-1 text-sm text-gray-600">{label}</div>
            </div>
          ))}
          <p className="text-center text-[11px] text-gray-500">
            각 숫자는 풀스크린 한 화면, 스크롤로 카운트업
          </p>
        </Stack>
      </Page>

      {/* 16 — Completed designs */}
      <Page n="16" title="Final Outputs — “이게 우리가 원한 것.”">
        <Stack>
          <p className="text-xl font-bold">저희 팀은 우리가 원하는 디자인을 구현하였습니다.</p>
          <div className="mt-4 grid grid-cols-6 gap-4">
            <div className="col-span-3"><ImgBox aspect="aspect-[16/10]" caption="BRAND · 심볼" /></div>
            <div className="col-span-2"><ImgBox aspect="aspect-[9/16]" caption="보호자앱" /></div>
            <div className="col-span-2"><ImgBox aspect="aspect-[9/16]" caption="환자앱" /></div>
            <div className="col-span-2"><ImgBox aspect="aspect-[9/16]" caption="의료진웹" /></div>
            <div className="col-span-3"><ImgBox aspect="aspect-[16/10]" caption="FILM · iter4" /></div>
          </div>
        </Stack>
      </Page>

      {/* 17 — Credits */}
      <Page n="17" title="Credits — Film Roll">
        <Stack>
          <p className="text-2xl font-bold tracking-tight">MAKING OF 하루안부.</p>
          <Divider />
          <Block label="TEAM">
            <div className="space-y-1 text-lg">
              <div>김지욱</div>
              <div>손예찬</div>
              <div>고해은</div>
              <div>Claude</div>
            </div>
          </Block>
          <Block label="AI ENSEMBLE">
            <ul className="space-y-1 text-sm">
              <li>Claude (Opus 4) — 기획 · 디자인 · 코드</li>
              <li>Higgsfield — AI 영상</li>
              <li>Figma — 와이어프레임 · 시스템</li>
              <li>Claude Code — 구현</li>
            </ul>
          </Block>
          <Block label="PROMPTS — excerpt">
            <ul className="space-y-1 font-mono text-[11px] text-gray-700">
              <li>#01 안에 있는 파일 분석해서 우리가 이 프로젝트를 만들기 전에 경쟁사 및 시장 조사를 할꺼야</li>
              <li>#18 우리 기획서를 가지고 로고 만들어봐.</li>
              <li>#37 영상까지 가자.</li>
              <li>#51 4차에서 멈췄다.</li>
              <li>… 외 약 70개</li>
            </ul>
          </Block>
          <p className="text-center text-3xl font-bold tracking-tight">THANK YOU.</p>
        </Stack>
      </Page>

      <footer className="wf-no-print py-12 text-center text-[11px] text-gray-400">
        end · 인쇄: Cmd/Ctrl+P → A4 portrait → save as PDF
      </footer>
    </main>
  );
}

/* ---------------- helpers ---------------- */

function TopBar() {
  return (
    <div className="wf-no-print sticky top-0 z-50 flex items-center justify-between border-b border-gray-300 bg-white px-6 py-3 text-[11px] uppercase tracking-widest">
      <span className="font-mono">making-of · wireframe (greyscale)</span>
      <span className="font-mono text-gray-500">cmd/ctrl + p → pdf</span>
    </div>
  );
}

function Page({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="wf-page mx-auto w-full max-w-[210mm] px-10 py-12">
      <div className="mb-6 flex items-baseline justify-between border-b border-gray-300 pb-3">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="font-mono text-[11px] text-gray-500">page {n}</span>
      </div>
      {children}
    </section>
  );
}

function Stack({ children }: { children: ReactNode }) {
  return <div className="space-y-5">{children}</div>;
}

function Crumb({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
      {children}
    </div>
  );
}

function Command({ children }: { children: ReactNode }) {
  return (
    <div className="wf-box bg-gray-50 px-4 py-2 text-base font-semibold">
      → {children}
    </div>
  );
}

function Question({ children }: { children: ReactNode }) {
  return <div className="text-xl font-semibold">{children}</div>;
}

function Cards3({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-3 gap-3">{children}</div>;
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="wf-box p-3">
      <div className="text-xs font-bold">{title}</div>
      <p className="mt-2 text-[11px] leading-snug text-gray-700">{children}</p>
    </div>
  );
}

function Divider() {
  return <div className="my-2 border-t border-gray-300" />;
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="wf-box p-4">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-gray-500">
        {label}
      </div>
      {children}
    </div>
  );
}

function ImgBox({ aspect, caption }: { aspect: string; caption?: string }) {
  return (
    <div className={`wf-box wf-img relative ${aspect}`}>
      {caption && (
        <span className="absolute bottom-1 left-1 bg-white/80 px-1 font-mono text-[9px] text-gray-600">
          {caption}
        </span>
      )}
    </div>
  );
}
