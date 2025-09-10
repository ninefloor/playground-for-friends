# 레포지토리 가이드라인

## 프로젝트 구조 및 모듈 구성
- Vite + React + TypeScript 앱. 엔트리: `index.html`, `src/main.tsx`, `src/App.tsx`.
- 소스는 `src/`에 위치:
  - `components/`(UI 및 기능 폴더, 동일 폴더에 `*.module.scss` 공존).
  - `pages/`(라우트 단위 뷰).
  - `utils/`(훅, atom, Firebase 헬퍼).
  - `assets/`(이미지, 폰트), 전역 스타일은 `src/index.css`와 `src/theme.scss`.
- 정적 파일은 `public/`에. 환경 변수는 `.env.local`에(커밋 금지).

## 빌드, 테스트 및 개발 명령
- `npm run dev` — Vite 로컬 개발 서버 시작.
- `npm run build` — 타입 체크(`tsc -b`) 후 프로덕션 빌드.
- `npm run preview` — 빌드된 앱을 로컬에서 제공.
- `npm run lint` — 프로젝트 전반에 ESLint 실행.
팁: 레포의 Node 버전 사용: `nvm use`(`.nvmrc` 기준).

## 코딩 스타일 및 네이밍 규칙
- TypeScript, 2칸 들여쓰기, 공개 API에는 명시적 타입을 선호.
- React 함수형 컴포넌트; 컴포넌트 파일명은 `PascalCase.tsx`.
- 훅/유틸은 `camelCase.ts`; 훅은 반드시 `use`로 시작(예: `useLogin`).
- CSS Modules는 `*.module.scss`로 컴포넌트와 같은 폴더에 위치. 전역 스타일은 `theme.scss`/`index.css` 외에는 지양.
- 린팅은 `eslint.config.js` 기준으로 수행; 푸시 전 이슈를 해결(`npm run lint`).

## 테스트 가이드라인
- 테스트 러너는 아직 없음. 테스트 추가 시 Vitest + React Testing Library 사용.
- 테스트는 소스와 나란히 `ComponentName.test.tsx` 또는 `utilName.test.ts`로 배치.
- 훅과 페이지 로직 위주로 커버리지를 확보하고, UI 스냅샷은 최소화.

## 커밋 및 PR 가이드라인
- Conventional Commits 사용: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:` 및 선택적 스코프(예: `feat(form): ...`).
- 제목은 간결하게, 본문에는 무엇을 왜 했는지 설명. 영어/한국어 모두 가능하며 일관성 유지.
- PR에는 명확한 설명, 관련 이슈 링크(예: `Closes #123`), UI 변경 시 스크린샷/GIF 포함.
- 작고 집중된 PR을 선호. 공개 API나 동작 변경 시 문서 업데이트.

## 보안 및 구성 팁
- 비밀 값은 절대 커밋 금지. Vite는 `VITE_`로 시작하는 환경 변수만 노출.
- `.env.local` 예시 키(현 구현 사용):
  - `VITE_API_KEY`, `VITE_AUTH_DOMAIN`, `VITE_DATABASE_URL`, `VITE_PROJECT_ID`, `VITE_STORAGE_BUCKET`, `VITE_MESSAGING_SENDER_ID`, `VITE_APP_ID`
  - 선택: `VITE_APP_ADMIN_ID` (환경변수 기반 관리자 판별을 도입하는 경우에만 사용)

## 에이전트 전용 메모
- 변경은 최소화하고 범위를 명확히 유지. 위의 파일 조직을 준수.
- 관련 없는 코드 리팩터링 금지. 규칙이 바뀌면 이 가이드를 업데이트.

## 회원 기능 요약(현 구현 기준)
- 회원가입: 이메일/비밀번호, 닉네임, 프로필 이미지(선택), 퍼스널 컬러 저장. Firestore `users/{uid}`에 `nickname`, `photoURL`, `createdAt`, `role("USER")`, `color` 기록.
- 로그인/로그아웃: `useLogin` 훅, `Home`에서 로그아웃 처리.
- 프로필 수정: `/profile` 경로(인증 필요). 닉네임/프로필 이미지/컬러 변경 가능.
  - Firebase Auth `displayName`/`photoURL`와 Firestore 사용자 문서 동기 업데이트.
  - 전역 상태 `userInfoAtom` 동기화.
- 관리자 판별: Firestore 사용자 문서의 `role === "ADMIN"` 기준(`RouteGuards.AdminLayout`).
- 닉네임 중복 검사는 현재 요구사항에서 제외됨(미적용).

## 라우팅(현행)
- 공개: `/`, `/register`
- 인증 필요: `/profile`, `/vote`, `/tier`
- 관리자(ADMIN): `/admin`, `/admin/vote`, `/admin/tier`, `/admin/members`
