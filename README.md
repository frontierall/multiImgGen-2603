# Multi Image Generator

Together AI · OpenAI 2개 프로바이더의 이미지 생성 모델을 한 화면에서 비교 생성할 수 있는 웹 앱입니다.

**Tech Stack:** Vite · React 18 · TypeScript · Tailwind CSS  
**배포:** GitHub Pages (GitHub Actions 자동 배포)

---

## 버전 히스토리

| 버전 | 날짜 | 주요 변경 |
|---|---|---|
| v0.1 | 2026-03-24 | 기본 구조 · Together AI 단일 프로바이더 |
| v0.2 | 2026-03-24 | OpenAI 추가 · 샘플 프롬프트 · 스타일 태그 |
| v0.3 | 2026-03-25 | 쿼터 제한 (10장) · 잔여량 프로그레스 바 |
| v0.4 | 2026-03-25 | 앱 게이트 (AppGateModal) · 암호 입력으로 쿼터 해제 |
| v0.5 | 2026-03-27 | sessionStorage API Key 보안 · 프로바이더별 섹션 분리 · 선택 모델 상단 표시 |
| v0.6 | 2026-04-08 | OpenRouter 연동 · PromptPlannerPanel 추가 · 쿼터 15장으로 상향 |
| **v0.7** | **2026-04-15** | **패스코드 환경변수 분리 · Negative Prompt · 실시간 결과 표시 · 생성 히스토리** |
| **v0.8** | **2026-04-15** | **OpenRouter 프롬프트 플래너 · 실시간 가격 조회 · 회사 필터 · IndexedDB 히스토리 복원** |

### v0.7 상세 변경 내역 (2026-04-15)

#### 🔐 보안 — 패스코드 환경변수 분리
- 소스코드에 하드코딩된 패스코드를 `.env` 파일로 이동
- `VITE_GATE_PASSCODE`, `VITE_QUOTA_PASSCODE` 두 개 환경변수로 관리
- `src/vite-env.d.ts` TypeScript 타입 선언 추가
- **변경 파일:** `AppGateModal.tsx`, `useQuota.ts`, `.env`(신규), `.env.example`(신규), `vite-env.d.ts`(신규)

#### 🚫 기능 — Negative Prompt 지원
- SD 계열 모델 선택 시 네거티브 프롬프트 입력란 자동 표시 (미지원 모델 선택 시 숨김)
- `imageModels.ts`에 `supportsNegative` 플래그 추가, Together AI API에 `negative_prompt` 파라미터 전달
- **지원 모델:** SDXL, SD3 Medium, DreamShaper, Juggernaut Lightning Flux, Juggernaut Pro Flux
- **변경 파일:** `imageModels.ts`, `PromptPanel.tsx`, `useImageGen.ts`, `App.tsx`

#### ⚡ UX — 결과 실시간 표시
- 전체 완료 후 일괄 표시 → 각 모델 완료 즉시 해당 카드에 이미지 표시
- 생성 중인 카드는 스피너, 완료된 카드는 이미지로 자동 전환 (레이아웃 고정)
- **변경 파일:** `useImageGen.ts`, `ResultsPanel.tsx`

#### 📋 기능 — 생성 히스토리
- 생성할 때마다 최대 7개 이전 결과를 하단에 자동 저장
- 프롬프트 요약 + 사용한 neg prompt + 성공/전체 카운트 표시
- 클릭으로 펼쳐서 미니 그리드로 확인 + 개별 다운로드 가능
- IndexedDB 기반으로 새로고침 후에도 복원
- **변경 파일:** `useImageGen.ts`(`HistoryEntry` 타입 추가), `ResultsPanel.tsx`, `App.tsx`, `utils/historyDb.ts`

### v0.8 상세 변경 내역 (2026-04-15)

#### 🧠 OpenRouter 프롬프트 플래너
- OpenRouter 모델 5개 shortlist 제공
- 내용 입력 → 프롬프트 후보 3개 생성
- 후보마다 `English Prompt`와 `Korean Guide`를 함께 표시
- **변경 파일:** `PromptPlannerPanel.tsx`, `usePromptPlanner.ts`, `App.tsx`

#### 💲 실시간 가격 조회
- OpenRouter Models API 기반 실시간 가격 표시
- `가격 최신화` 버튼으로 수동 재조회
- Together 가격도 별도 훅으로 최신화 지원
- **변경 파일:** `useOpenRouterPricing.ts`, `useTogetherPricing.ts`, `PromptPlannerPanel.tsx`, `ProviderSection.tsx`

#### 🗂️ 모델 탐색 UI 정리
- 상단 회사 필터 유지
- 회사별 섹션 구조 유지 + 섹션 내부 카드 그리드 확장 (`lg 4열 / xl 5열`)
- 모델 카드에 회사 배지 표시
- **변경 파일:** `App.tsx`, `ProviderSection.tsx`, `ModelCard.tsx`

---

## 주요 기능

- **멀티 모델 동시 생성** — 여러 모델을 체크박스로 선택 후 한 번에 생성, 결과를 나란히 비교
- **실시간 결과 표시** — 빠른 모델부터 완료 순으로 즉시 이미지 표시 (레이아웃 고정)
- **Negative Prompt** — SD 계열 모델 선택 시 제외 요소 입력란 자동 표시
- **프롬프트 플래너** — OpenRouter 모델로 키워드/소스텍스트 → 이미지 프롬프트 3개 생성
- **영문/한글 프롬프트 표시** — 후보 카드에 English Prompt + Korean Guide 함께 표시
- **생성 히스토리** — 최근 7개 기록을 IndexedDB에 저장하고 새로고침 후 복원
- **모델 검색 · 정렬** — 모델명/회사명 검색, 회사 필터, 가격순 정렬 지원
- **API Key 관리** — sessionStorage 임시 저장 (탭 닫으면 자동 삭제)
- **쿼터 제한** — 기본 15장 제한, 암호 입력 시 +10장 추가
- **에러 로그 패널** — 실패한 모델과 에러 메시지 별도 표시
- **이미지 다운로드** — 결과 카드 hover 시 다운로드 버튼 노출
- **다크/라이트 모드** — localStorage 기반 테마 기억

---

## 프로바이더 구성

| 프로바이더 | API Key 환경변수 | 용도 |
|---|---|---|
| Together AI | `TOGETHER_API_KEY` | 대부분의 모델 (FLUX, HiDream, Google, Qwen, ByteDance 등) |
| OpenAI | `OPENAI_API_KEY` | DALL·E 3, GPT Image 1.5 Direct |
| OpenRouter | `OPENROUTER_API_KEY` | 프롬프트 플래너 전용 (이미지 생성 아님) |

> Google 모델(Imagen, Flash Image, Gemini)은 Together AI를 통해 제공됩니다.

---

## 프로젝트 구조

```
multiImgGen-2603/
├── .env                          # 환경변수 (gitignore됨 — 패스코드 등)
├── .env.example                  # 환경변수 템플릿
├── vite.config.ts                # Vite 설정 (base: '/multiImgGen-2603/')
├── tailwind.config.js
├── src/
│   ├── vite-env.d.ts             # ImportMeta.env 타입 선언
│   ├── main.tsx                  # React 진입점
│   ├── App.tsx                   # 루트 컴포넌트 — 전역 상태, 레이아웃
│   ├── index.css                 # Tailwind 기본 스타일
│   │
│   ├── data/
│   │   └── imageModels.ts        # 모델 정의 데이터 + 그룹핑 유틸
│   │
│   ├── hooks/
│   │   ├── useImageGen.ts        # 이미지 생성 API 호출 훅 (Together AI / OpenAI)
│   │   ├── useQuota.ts           # 쿼터 관리 훅 (localStorage 기반)
│   │   ├── usePromptPlanner.ts   # OpenRouter 프롬프트 생성 훅
│   │   ├── useOpenRouterPricing.ts # OpenRouter 모델 가격 실시간 조회 훅
│   │   └── useTogetherPricing.ts # Together 모델 가격 실시간 조회 훅
│   │
│   ├── utils/
│   │   └── historyDb.ts          # IndexedDB 히스토리 저장/복원
│   │
│   └── components/
│       ├── AppGateModal.tsx      # 앱 진입 게이트 (패스코드 입력)
│       ├── PasscodeModal.tsx     # 쿼터 초과 시 암호 입력 모달
│       ├── ApiKeyInput.tsx       # API Key 입력 드롭다운 (헤더)
│       ├── PromptPanel.tsx       # 프롬프트 + 네거티브 프롬프트 + 파라미터 입력
│       ├── PromptPlannerPanel.tsx # OpenRouter 기반 프롬프트 생성 패널
│       ├── ProviderSection.tsx   # 회사별/프로바이더별 모델 목록 (접이식)
│       ├── ModelCard.tsx         # 개별 모델 카드 (회사 배지, 가격, NEW 뱃지)
│       ├── SelectedSection.tsx   # 선택된 모델 상단 요약 표시
│       └── ResultsPanel.tsx      # 결과 그리드 + 에러 로그 + 히스토리 패널
```

---

## 파일별 역할 상세

### `src/App.tsx`
앱의 루트 컴포넌트. 전역 상태(API Keys, 선택 모델, 프롬프트, 히스토리 등)를 관리하고 각 패널 컴포넌트를 조립합니다. 히스토리는 IndexedDB에서 복원하고 최근 7개만 유지합니다.

### `src/data/imageModels.ts`
모든 이미지 모델의 메타데이터를 정의합니다. 각 모델은 아래 필드를 가집니다:

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | `string` | 앱 내부 고유 ID |
| `name` | `string` | UI 표시명 |
| `author` | `string` | 제작사 |
| `pricePerImage` | `number` | 장당 비용 (USD) |
| `modelId` | `string` | API 호출 시 사용하는 실제 모델 ID |
| `provider` | `'together' \| 'openai'` | 호출할 프로바이더 |
| `noSteps` | `boolean?` | `true`: `steps` 파라미터 미지원 모델 |
| `supportsNegative` | `boolean?` | `true`: `negative_prompt` 파라미터 지원 모델 |
| `isNew` | `boolean?` | NEW 뱃지 표시 여부 |

### `src/hooks/useImageGen.ts`
이미지 생성 핵심 훅. 주요 동작:
- Together AI / OpenAI 프로바이더별 API 함수 분리
- `generateAll()` — 선택 모델 병렬 실행, 완료 즉시 해당 인덱스 결과 업데이트 (실시간 표시)
- `negative_prompt` — `supportsNegative` 모델에만 선택적으로 전달
- `steps` — Google 계열 noSteps 예외 처리 포함
- `HistoryEntry` 타입 export — App.tsx에서 히스토리 저장에 활용

### `src/hooks/useQuota.ts`
사용량 제한 훅. localStorage 기반으로 탭 종료 후에도 유지됩니다.
- `consume(n)` — n장 소비, 한도 초과 시 `false` 반환
- `tryUnlock(code)` — 패스코드 일치 시 cap에 +10 추가
- 패스코드: `import.meta.env.VITE_QUOTA_PASSCODE`

### `src/components/PromptPanel.tsx`
프롬프트 입력 영역 전체. 샘플 프롬프트 버튼, 스타일 태그, 크기 프리셋, Steps 입력, 생성 버튼을 포함합니다. **선택된 모델 중 `supportsNegative: true`인 모델이 있을 때만 네거티브 프롬프트 textarea를 표시합니다.**

### `src/components/ResultsPanel.tsx`
생성 결과 + 히스토리 통합 패널:
- **현재 결과:** `loading: true` 항목은 스피너, 완료 항목은 이미지로 표시 (개별 전환)
- **에러 로그:** 실패 항목이 있으면 하단에 모노스페이스 에러 목록 표시
- **히스토리:** 최근 7개 기록을 접이식 행으로 표시, 생성 모델 목록/미니 그리드/개별 다운로드 지원

### `src/components/PromptPlannerPanel.tsx`
- OpenRouter 모델 5개 shortlist 제공
- 실시간 가격 표시 + `가격 최신화` 버튼
- 프롬프트 후보 카드에 `English Prompt`와 `Korean Guide` 동시 표시

### `src/utils/historyDb.ts`
- IndexedDB에 최근 7개 히스토리를 저장/복원
- 이미지 URL과 메타데이터를 함께 보관
- 브라우저/도메인별 저장소이므로 다른 브라우저와 공유되지 않음

### `src/components/AppGateModal.tsx`
앱 최초 진입 시 표시되는 전체화면 패스코드 입력 모달. 세션 내에서는 한 번만 입력하면 됩니다. 패스코드: `import.meta.env.VITE_GATE_PASSCODE`

---

## 환경변수 설정

`.env.example`을 복사해 `.env`로 생성 후 값을 설정합니다:

```bash
cp .env.example .env
```

```env
VITE_GATE_PASSCODE=your_gate_passcode    # 앱 진입 패스코드
VITE_QUOTA_PASSCODE=your_quota_passcode  # 쿼터 충전 패스코드
```

> `.env`는 `.gitignore`에 포함되어 있어 저장소에 커밋되지 않습니다.  
> Vite 빌드 시 값이 번들에 인라인되므로 공개 배포 시 민감한 정보는 사용하지 마세요.

---

## API 파라미터 처리 상세

### noSteps 플래그

Together AI의 일부 모델은 `steps` 파라미터를 지원하지 않습니다. `noSteps: true` 모델에는 `steps` 파라미터를 생략합니다.

```
noSteps: true 적용 모델
  - Qwen, ByteDance, Wan-AI, Ideogram
  - Google 전체 (Imagen, Flash Image, Gemini)
  - OpenAI/gpt-image-1.5 (via Together)
```

### supportsNegative 플래그

`supportsNegative: true` 모델 선택 시 UI에 네거티브 프롬프트 입력란이 표시되며, API 호출 시 `negative_prompt` 파라미터로 전달됩니다.

```
supportsNegative: true 적용 모델
  - Stable Diffusion XL
  - Stable Diffusion 3 Medium
  - DreamShaper
  - Juggernaut Lightning Flux
  - Juggernaut Pro Flux
```

### response_format 처리 (OpenAI Direct)

- `dall-e-3` / `dall-e-3-hd` → `response_format: 'b64_json'` 전송
- `gpt-image-1` → `response_format` 파라미터 생략 (미지원)

---

## 쿼터 시스템

| 항목 | 내용 |
|---|---|
| 기본 제한 | 15장 (localStorage 기반, 브라우저 재시작 후에도 유지) |
| 초과 시 | 암호 입력 모달 표시 |
| 충전 | 올바른 패스코드 입력 → +10장 추가 |
| 패스코드 설정 | `.env`의 `VITE_QUOTA_PASSCODE` |

---

## 히스토리 저장 방식

- 최근 **7개** 생성 기록을 IndexedDB에 저장합니다.
- 저장 항목: 프롬프트, 네거티브 프롬프트, 생성 결과 이미지, 생성 모델 목록
- 새로고침 후에도 최근 기록이 복원됩니다.
- 저장 위치는 **사용자 브라우저 내부 저장소**이며, 브라우저가 바뀌면 공유되지 않습니다.

> IndexedDB는 `localStorage`보다 큰 데이터를 저장할 수 있어 이미지 히스토리 보관에 적합합니다.

---

## OpenRouter 프롬프트 플래너

- 지원 모델: `google/gemini-2.5-flash-lite`, `deepseek/deepseek-v3.2`, `anthropic/claude-sonnet-4.6`, `minimax/minimax-m2.5`, `minimax/minimax-m2.5:free`
- 입력한 내용을 기반으로 프롬프트 후보 3개 생성
- 후보마다 한국어 해석(`Korean Guide`) 같이 표시
- OpenRouter Models API에서 실시간 가격 조회
- `가격 최신화` 버튼으로 최신 단가 다시 조회 가능

---

## 모델 탐색 UI

- 상단 회사 필터 유지 (`전체 / Google / OpenAI / ...`)
- 회사별 섹션 구조 유지
- 섹션 내부 레이아웃: `lg 4열 / xl 5열`
- 모델 카드에는 회사 배지와 실시간 가격 변경분 표시

---

## 지원 모델 전체 목록

### Together AI

#### Black Forest Labs
| 모델명 | Model ID | 가격/장 |
|---|---|---|
| FLUX.1 Schnell | `black-forest-labs/FLUX.1-schnell` | $0.003 |
| FLUX.1 Krea [dev] | `black-forest-labs/FLUX.1-krea-dev` | $0.025 |
| FLUX.1.1 Pro | `black-forest-labs/FLUX.1.1-pro` | $0.040 |
| FLUX.1 Kontext Pro | `black-forest-labs/FLUX.1-kontext-pro` | $0.040 |
| FLUX.1 Kontext Max | `black-forest-labs/FLUX.1-kontext-max` | $0.080 |

#### Stability AI *(supportsNegative)*
| 모델명 | Model ID | 가격/장 |
|---|---|---|
| Stable Diffusion XL | `stabilityai/stable-diffusion-xl-base-1.0` | $0.002 |
| Stable Diffusion 3 Medium | `stabilityai/stable-diffusion-3-medium` | $0.002 |

#### Lykon *(supportsNegative)*
| 모델명 | Model ID | 가격/장 |
|---|---|---|
| DreamShaper | `Lykon/DreamShaper` | $0.001 |

#### RunDiffusion *(supportsNegative)*
| 모델명 | Model ID | 가격/장 |
|---|---|---|
| Juggernaut Lightning Flux | `RunDiffusion/Juggernaut-Lightning-Flux` | $0.002 |
| Juggernaut Pro Flux | `RunDiffusion/Juggernaut-pro-flux` | $0.005 |

#### HiDream
| 모델명 | Model ID | 가격/장 |
|---|---|---|
| HiDream I1 Fast | `HiDream-ai/HiDream-I1-Fast` | $0.003 |
| HiDream I1 Dev | `HiDream-ai/HiDream-I1-Dev` | $0.005 |
| HiDream I1 Full | `HiDream-ai/HiDream-I1-Full` | $0.009 |

#### Qwen *(noSteps)*
| 모델명 | Model ID | 가격/장 |
|---|---|---|
| Qwen Image | `Qwen/Qwen-Image` | $0.006 |
| Qwen Image 2.0 🆕 | `Qwen/Qwen-Image-2.0` | $0.008 |

#### ByteDance *(noSteps)*
| 모델명 | Model ID | 가격/장 |
|---|---|---|
| Seedream 3.0 | `ByteDance-Seed/Seedream-3.0` | $0.018 |
| Seedream 4.0 🆕 | `ByteDance-Seed/Seedream-4.0` | $0.030 |

#### Wan-AI *(noSteps)*
| 모델명 | Model ID | 가격/장 |
|---|---|---|
| Wan 2.6 Image 🆕 | `Wan-AI/Wan-2.6-Image` | $0.008 |

#### Ideogram *(noSteps)*
| 모델명 | Model ID | 가격/장 |
|---|---|---|
| Ideogram 3.0 | `ideogram/ideogram-3.0` | $0.060 |

#### Google via Together AI *(noSteps)*
| 모델명 | Model ID | 가격/장 |
|---|---|---|
| Imagen 4.0 Fast 🆕 | `google/imagen-4.0-fast` | $0.020 |
| Flash Image 2.5 (Nano Banana 2) 🆕 | `google/flash-image-2.5` | $0.039 |
| Flash Image 3.1 (Nano Banana 3) 🆕 | `google/flash-image-3.1` | $0.039 |
| Imagen 4.0 Preview 🆕 | `google/imagen-4.0-preview` | $0.040 |
| Imagen 4.0 Ultra 🆕 | `google/imagen-4.0-ultra` | $0.060 |
| Gemini 3 Pro Image 🆕 | `google/gemini-3-pro-image` | $0.060 |

#### OpenAI via Together AI *(noSteps)*
| 모델명 | Model ID | 가격/장 |
|---|---|---|
| GPT Image 1.5 🆕 | `openai/gpt-image-1.5` | $0.040 |

### OpenAI Direct

| 모델명 | Model ID | 가격/장 |
|---|---|---|
| GPT Image 1.5 (Direct) 🆕 | `gpt-image-1` | $0.040 |
| DALL·E 3 | `dall-e-3` | $0.040 |
| DALL·E 3 HD | `dall-e-3-hd` | $0.080 |

---

## GitHub Pages 배포

### 워크플로우

`.github/workflows/deploy.yml`이 `main` 브랜치 push 시 자동으로 실행됩니다.

```
push to main → npm ci → npm run build → dist/ → GitHub Pages
```

### 초기 설정 (최초 1회)

1. GitHub 레포 → **Settings → Pages**
2. **Build and deployment → Source: GitHub Actions** 선택

### 배포 주소

```
https://[유저명].github.io/multiImgGen-2603/
```

> `vite.config.ts`의 `base` 값이 레포 이름과 일치해야 합니다.

### 환경변수 / Secrets 불필요

API Key는 사용자가 UI에서 직접 입력 → sessionStorage 저장 방식이므로
GitHub Secrets 설정 없이 바로 배포 가능합니다.

---

## 로컬 개발

```bash
cp .env.example .env   # 패스코드 설정
npm install
npm run dev            # http://localhost:5173
npm run build          # dist/ 빌드
```
