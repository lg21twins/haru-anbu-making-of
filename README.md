# 하루안부 — Making Of

시니어 케어 앱 **하루안부**를 AI와 함께 만든 과정을 보여주는 스크롤·시네마틱 마이크로사이트.
발표용으로, **스페이스바**를 눌러 한 장면씩 직접 넘기며 진행한다.

- 라이브: https://haru-anbu-making-of.vercel.app
- 스택: Next.js 16.2.6 · React 19 · TypeScript · Tailwind CSS 4 · GSAP · Lenis

---

## 빠른 시작 (팀원용)

> 필요한 건 **Node.js만** 있으면 됨. 영상·이미지 등 모든 에셋이 저장소에 포함돼 있어서
> 클론 후 아래 3줄이면 로컬과 100% 똑같이 돈다. 별도 파일 다운로드 불필요.

### 0. 사전 준비 — Node.js 설치 (한 번만)
- **Node.js 20 이상** 필요. 없으면 https://nodejs.org 에서 LTS 버전 설치.
- 설치 확인: 터미널에서 `node -v` → `v20.x` 이상이면 OK.

### 1. 내려받기
```bash
git clone https://github.com/rlawldnr4052-netizen/haru-anbu-making-of.git
cd haru-anbu-making-of
```
> Git이 없다면 GitHub 페이지 우측 상단 **Code ▸ Download ZIP**으로 받아 압축 해제해도 된다.

### 2. 패키지 설치
```bash
npm install
```

### 3. 실행
```bash
npm run dev
```
터미널에 뜨는 주소 **http://localhost:3000** 을 브라우저에서 열면 끝.

---

## 조작법 (발표)
- 페이지를 열면 **검은 화면**이 뜬다 (자동 시작 안 함).
- **스페이스바**를 누를 때마다 다음 장면으로 넘어간다:
  숫자 폭격 → "네잎클로버" → "자 넌 이제부터…" → 로고 채팅 → 이거다 →
  시안 카오스(정리해라 → 살아남은 하나) → 코딩 화면 → 영상 → 회고 → 크레딧
- 장면이 멈춰 대기하는 건 **의도된 동작**(발표자가 박자를 통제). 버그 아님.

---

## 명령어
| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 (실시간 편집 반영) |
| `npm run build` | 프로덕션 빌드 (배포와 동일하게 검증) |
| `npm run start` | 빌드 결과 실행 (`build` 후) |
| `npm run lint` | 코드 검사 |

## 폴더 구조
```
app/                 라우트 (/ = 메인, 나머지는 데모/실험용)
components/scenes/   각 장면 컴포넌트
lib/                 공용 유틸 (scrollLock, waitForSpace 등)
public/media/        영상·이미지·로고 등 모든 에셋
```

## 배포
`main` 브랜치에 push하면 Vercel이 자동 배포한다 (1~2분).

## 문제가 생기면
- `node -v`가 20 미만 → Node 최신 LTS로 업데이트 후 `npm install` 다시.
- 화면이 멈춘 것 같으면 → **스페이스바**를 눌러 다음 장면으로. (자동 진행 안 함)
- 그래도 깨지면 `rm -rf node_modules .next && npm install` 후 재실행.
