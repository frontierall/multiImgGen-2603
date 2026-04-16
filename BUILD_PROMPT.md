# Multi Image Generator — 빌드 프롬프트

이 문서는 동일한 앱을 처음부터 재현할 수 있도록 작성된 상세 명세입니다.
모델 ID, API 파라미터 오류, 쿼터 설계 등 실제 개발 과정에서 발견된 이슈가 모두 반영되어 있습니다.

---

## 앱 개요

**목적:** Together AI · OpenAI 2개 프로바이더의 이미지 생성 모델을 한 화면에서 동시에 비교 생성하는 웹 앱

**Tech Stack:**
- Vite + React 18 + TypeScript
- Tailwind CSS (다크 테마, 배경 `#0f1117`)
- lucide-react (아이콘)
- 배포: GitHub Pages (GitHub Actions)

---

## 핵심 기능 목록

1. 모델 카드 다중 선택 (체크박스) → 선택된 모델들을 동시에 생성
2. 모델 검색 (모델명 · 회사명), 회사 필터 탭, 가격 낮은 순 정렬
3. API Key 입력 — sessionStorage 저장 (탭 닫으면 자동 삭제)
4. 쿼터 시스템 — 기본 10장, 암호 입력마다 +10장 추가
5. 결과 그리드 — hover 시 다운로드 버튼 노출
6. 에러 로그 패널 — 실패 모델과 에러 메시지를 결과 하단에 표시
7. 히스토리 — 최근 5회 생성 결과를 ResultsPanel에 보관 (세션 내)
8. 샘플 프롬프트 버튼 (풍경, 사이버펑크, 인물, 애니)
9. 이미지 크기 프리셋 (1:1, 16:9, 9:16, 4:3) + Steps 입력
10. Negative 프롬프트 — `supportsNegative: true` 모델 선택 시 입력란 자동 노출
11. **ResultsPanel 상단 배치** — 생성 버튼 누른 후 스크롤 없이 바로 결과 확인
12. **Together AI 가격 최신화** — `useTogetherPricing` hook, `refresh(apiKey)` 호출로 실시간 조회, 변경된 가격은 ModelCard에 ↑/↓ 배지로 표시

---

## 프로바이더 구성

| 프로바이더 | API Endpoint | 비고 |
|---|---|---|
| Together AI | `https://api.together.xyz/v1/images/generations` | 대부분의 모델 |
| OpenAI | `https://api.openai.com/v1/images/generations` | DALL·E 3, GPT Image 1.5 Direct |

> Google 모델(Imagen, Flash Image, Gemini)은 Together AI를 통해 접근합니다.
> Google 자체 API Key 불필요.

---

## 지원 모델 전체 목록 (검증된 serverless 모델만)

### Together AI

```typescript
// Black Forest Labs — steps 지원
{ name: 'FLUX.1 Schnell',        modelId: 'black-forest-labs/FLUX.1-schnell',      price: 0.003 }
{ name: 'FLUX.1 Krea [dev]',     modelId: 'black-forest-labs/FLUX.1-krea-dev',     price: 0.025 }
{ name: 'FLUX.1.1 Pro',          modelId: 'black-forest-labs/FLUX.1.1-pro',        price: 0.040 }
{ name: 'FLUX.1 Kontext Pro',    modelId: 'black-forest-labs/FLUX.1-kontext-pro',  price: 0.040 }
{ name: 'FLUX.1 Kontext Max',    modelId: 'black-forest-labs/FLUX.1-kontext-max',  price: 0.080 }

// Stability AI — steps 지원
{ name: 'Stable Diffusion XL',       modelId: 'stabilityai/stable-diffusion-xl-base-1.0', price: 0.002 }
{ name: 'Stable Diffusion 3 Medium', modelId: 'stabilityai/stable-diffusion-3-medium',    price: 0.002 }

// Lykon — steps 지원
{ name: 'DreamShaper', modelId: 'Lykon/DreamShaper', price: 0.001 }

// RunDiffusion — steps 지원
{ name: 'Juggernaut Lightning Flux', modelId: 'RunDiffusion/Juggernaut-Lightning-Flux', price: 0.002 }
{ name: 'Juggernaut Pro Flux',       modelId: 'RunDiffusion/Juggernaut-pro-flux',       price: 0.005 }

// HiDream — steps 지원
// ⚠️ 대소문자 정확히 지켜야 함 (HiDream-ai/HiDream-I1-Fast, 소문자 x)
{ name: 'HiDream I1 Fast', modelId: 'HiDream-ai/HiDream-I1-Fast', price: 0.003 }
{ name: 'HiDream I1 Dev',  modelId: 'HiDream-ai/HiDream-I1-Dev',  price: 0.005 }
{ name: 'HiDream I1 Full', modelId: 'HiDream-ai/HiDream-I1-Full', price: 0.009 }

// Qwen — ⚠️ noSteps: true (steps 파라미터 미지원)
{ name: 'Qwen Image',     modelId: 'Qwen/Qwen-Image',     price: 0.006 }
{ name: 'Qwen Image 2.0', modelId: 'Qwen/Qwen-Image-2.0', price: 0.008 }

// ByteDance — ⚠️ noSteps: true
// ⚠️ 네임스페이스: ByteDance-Seed (ByteDance 아님)
{ name: 'Seedream 3.0', modelId: 'ByteDance-Seed/Seedream-3.0', price: 0.018 }
{ name: 'Seedream 4.0', modelId: 'ByteDance-Seed/Seedream-4.0', price: 0.030 }

// Wan-AI — ⚠️ noSteps: true
{ name: 'Wan 2.6 Image', modelId: 'Wan-AI/Wan-2.6-Image', price: 0.008 }

// Ideogram — ⚠️ noSteps: true
{ name: 'Ideogram 3.0', modelId: 'ideogram/ideogram-3.0', price: 0.060 }

// Google (via Together AI) — ⚠️ noSteps: true (전체)
{ name: 'Imagen 4.0 Fast (나노 바나나 Fast)',       modelId: 'google/imagen-4.0-fast',     price: 0.020 }
{ name: 'Flash Image 2.5 (나노 바나나 2)',          modelId: 'google/flash-image-2.5',     price: 0.039 }
{ name: 'Flash Image 3.1 (나노 바나나 3)',          modelId: 'google/flash-image-3.1',     price: 0.039 }
{ name: 'Imagen 4.0 Preview (나노 바나나 Preview)', modelId: 'google/imagen-4.0-preview',  price: 0.040 }
{ name: 'Imagen 4.0 Ultra (나노 바나나 Ultra)',     modelId: 'google/imagen-4.0-ultra',    price: 0.060 }
{ name: 'Gemini 3 Pro Image (나노 바나나 Pro)',     modelId: 'google/gemini-3-pro-image',  price: 0.060 }

// OpenAI via Together AI — ⚠️ noSteps: true
{ name: 'GPT Image 1.5', modelId: 'openai/gpt-image-1.5', price: 0.040 }
```

### OpenAI Direct

```typescript
// ⚠️ response_format: 'b64_json' — dall-e-3만 지원, gpt-image-1은 미지원
{ name: 'GPT Image 1.5 (Direct)', modelId: 'gpt-image-1', price: 0.040 }
{ name: 'DALL·E 3',               modelId: 'dall-e-3',    price: 0.040 }
{ name: 'DALL·E 3 HD',            modelId: 'dall-e-3-hd', price: 0.080 }
// dall-e-3-hd는 내부적으로 modelId에서 -hd를 제거하고 quality: 'hd'로 처리
```

---

## ⚠️ 실제 개발 중 발생한 에러 및 해결법

### 1. steps 파라미터 오류

**에러 메시지:**
```
Invalid parameter detected. The parameter 'steps' is not recognized or supported.
Parameter 'steps' is not supported for the selected model configuration.
```

**원인:** Qwen, ByteDance, Wan-AI, Ideogram, Google 모델, OpenAI via Together 등
비확산(non-diffusion) 계열 모델은 `steps` 파라미터를 아예 받지 않음

**해결:** 모델 데이터에 `noSteps?: boolean` 플래그 추가, API 호출 시 조건부 생략

```typescript
// imageModels.ts
interface ImageModel {
  noSteps?: boolean  // true이면 steps 파라미터 전송 안 함
}

// useImageGen.ts — Together AI 호출
const body: Record<string, unknown> = {
  model: modelId, prompt, width, height, n: 1, response_format: 'b64_json'
}
if (!noSteps) body.steps = steps  // noSteps가 true면 steps 생략
```

---

### 2. response_format 파라미터 오류 (OpenAI Direct)

**에러 메시지:**
```
Unknown parameter: 'response_format'
```

**원인:** OpenAI의 `gpt-image-1` 모델은 `response_format` 파라미터 미지원
DALL·E 3는 지원함

**해결:** 모델별 분기 처리

```typescript
// useImageGen.ts — OpenAI 호출
const realModelId = modelId.replace(/-hd$/, '')
const supportsResponseFormat = realModelId.startsWith('dall-e')
const body: Record<string, unknown> = { model: realModelId, prompt, n: 1, size, quality }
if (supportsResponseFormat) body.response_format = 'b64_json'
```

---

### 3. serverless 미지원 모델 오류

**에러 메시지:**
```
Unable to access non-serverless model prompthero/openjourney.
Please visit https://api.together.ai/models/... to create a dedicated endpoint.
```

**원인:** Together AI의 일부 모델은 serverless 방식이 아닌 전용 엔드포인트(유료 dedicated)만 지원
**해결:** 해당 모델 목록에서 제거. Together AI 사이트에서 serverless 지원 여부 확인 후 추가

**제거된 모델 (미지원 확인):**
- `prompthero/openjourney`
- FLUX.2 계열 전체 (`FLUX.2-dev`, `FLUX.2-flex`, `FLUX.2-pro`, `FLUX.2-max`)
- `FLUX.1-dev` (krea-dev로 대체)

---

### 4. 잘못된 모델 ID (대소문자 · 네임스페이스)

Together AI는 모델 ID의 대소문자를 정확히 구분합니다.

| 잘못된 ID | 올바른 ID |
|---|---|
| `hidream-ai/hidream-i1-fast` | `HiDream-ai/HiDream-I1-Fast` |
| `ByteDance/Seedream-3.0` | `ByteDance-Seed/Seedream-3.0` |
| `Wan-AI/Wan2.6-Image` | `Wan-AI/Wan-2.6-Image` |
| `ideogram-ai/ideogram-v3` | `ideogram/ideogram-3.0` |
| `Qwen/QwenImage-2.0` | `Qwen/Qwen-Image-2.0` |

---

### 5. 한도 소진 시 모달이 열리지 않는 버그

**원인:** 생성 버튼에 `disabled={isExhausted}` 조건이 있어, 한도 소진 시 클릭 자체가 막힘
모달을 여는 `handleGenerate`가 호출되지 않음

**해결:** `isExhausted`를 disabled 조건에서 제거, 버튼 스타일만 변경 (주황색)

```tsx
// ❌ 잘못된 코드
<button disabled={loading || selectedCount === 0 || isExhausted}>

// ✅ 올바른 코드
<button disabled={loading || selectedCount === 0}>
  {isExhausted ? '🔒 한도 소진 — 암호로 충전' : '생성'}
</button>
```

---

## API 호출 구조

### Together AI

```typescript
POST https://api.together.xyz/v1/images/generations
Authorization: Bearer {API_KEY}
Content-Type: application/json

{
  "model": "black-forest-labs/FLUX.1-schnell",
  "prompt": "...",
  "width": 1024,
  "height": 1024,
  "steps": 4,          // noSteps 모델은 생략
  "n": 1,
  "response_format": "b64_json"
}

// 응답
{ "data": [{ "b64_json": "..." }] }
// 또는
{ "data": [{ "url": "https://..." }] }
```

### OpenAI Direct

```typescript
POST https://api.openai.com/v1/images/generations
Authorization: Bearer {API_KEY}
Content-Type: application/json

// DALL·E 3
{
  "model": "dall-e-3",
  "prompt": "...",
  "n": 1,
  "size": "1024x1024",   // dall-e-3는 특정 사이즈만 지원
  "quality": "standard", // dall-e-3-hd → quality: "hd", model: "dall-e-3"
  "response_format": "b64_json"
}

// GPT Image 1.5 (gpt-image-1)
{
  "model": "gpt-image-1",
  "prompt": "...",
  "n": 1,
  "size": "1024x1024",
  "quality": "standard"
  // response_format 생략 — 미지원
}
```

---

## 쿼터 시스템 설계

```typescript
// localStorage 키
const STORAGE_KEY = 'img_gen_used'  // 사용한 장수
const CAP_KEY     = 'img_gen_cap'   // 현재 한도 (기본 10)

// 동작 방식
// - 기본 한도: 10장
// - 암호 입력 시: cap += 10 (localStorage 저장)
// - 10장 → 암호 입력 → 20장 한도 → 또 소진 → 암호 입력 → 30장
// - sessionStorage 아닌 localStorage 사용 (브라우저 유지)
```

---

## 컴포넌트 구조

```
App.tsx
├── AppGateModal      — 앱 진입 암호 게이트 (한 번 통과하면 localStorage에 저장)
├── PasscodeModal     — 쿼터 충전 암호 입력 모달
├── [header]          — sticky 헤더: 검색, ApiKeyInput, 다크모드 토글
├── PromptPlannerPanel — OpenRouter 기반 프롬프트 변형 생성 패널
├── PromptPanel       — 프롬프트, Negative 프롬프트(조건부), 크기 프리셋, Steps, 생성 버튼, 쿼터 바
├── ResultsPanel      — 결과 이미지 그리드 + 에러 로그 패널 + 히스토리(최근 5회)
├── SelectedSection   — 선택된 모델 상단 표시 + 전체 해제
└── [모델 선택 카드]  — 회사 필터 탭 + 가격순/기본순 정렬 + 평면 ModelCard 그리드
    └── ModelCard     — 개별 모델 카드 (체크박스, 가격, NEW 뱃지, Together 가격 오버라이드)

hooks/
├── useImageGen.ts        — API 호출 (Together AI / OpenAI), 히스토리 반환
├── useQuota.ts           — 쿼터 관리 (localStorage)
├── useOpenRouterPricing.ts — OpenRouter 모델 가격 실시간 조회
├── useTogetherPricing.ts   — Together AI 모델 가격 실시간 조회 (API Key 필요)
└── usePromptPlanner.ts   — OpenRouter 기반 프롬프트 변형 생성

data/
└── imageModels.ts    — 모델 정의, groupByProvider(), groupByCompany(), COMPANY_COLORS
```

### 레이아웃 순서 (위→아래)

```
sticky header
PromptPlannerPanel
PromptPanel
[에러 메시지]
ResultsPanel          ← PromptPanel 바로 아래 배치 (생성 후 스크롤 불필요)
SelectedSection
[모델 선택 카드]      ← 회사 필터 탭 + 평면 그리드 (ProviderSection 대체)
```

> **주의:** `ProviderSection` 컴포넌트는 파일은 존재하지만 현재 App.tsx에서 사용하지 않음.
> 모델 선택 UI는 App.tsx 인라인으로 구현된 평면 그리드를 사용.

---

## Together AI 가격 최신화

Together AI는 시간이 지나면서 모델 가격이 변경될 수 있음.
`useTogetherPricing` hook으로 실시간 조회 후 ModelCard에 반영.

### API 엔드포인트

```typescript
GET https://api.together.xyz/v1/models
Authorization: Bearer {TOGETHER_API_KEY}

// 응답 (배열)
[
  {
    "id": "black-forest-labs/FLUX.1-schnell",
    "type": "image",
    "pricing": {
      "imagecost": "0.003"   // USD per image — 이 값을 사용
    }
  },
  ...
]
```

### 동작 방식

1. `useTogetherPricing` hook: `refresh(apiKey)` 호출 시 API 요청 → `modelId → price` 맵 반환
2. App.tsx에서 `togetherPrices[model.modelId]`를 `ModelCard`의 `overridePrice` prop으로 전달
3. ModelCard: `overridePrice`가 있으면 표시 가격 교체, 하드코딩 값과 다르면 ↑/↓ 배지 표시

```tsx
// ModelCard — 가격 변동 배지
const displayPrice = overridePrice ?? model.pricePerImage
const priceChanged = overridePrice !== undefined && overridePrice !== model.pricePerImage

{priceChanged && (
  <span className={overridePrice > model.pricePerImage ? 'text-red-400' : 'text-emerald-400'}>
    {overridePrice > model.pricePerImage ? '↑' : '↓'} ${model.pricePerImage.toFixed(3)}
  </span>
)}
```

> **API Key 없을 때:** `refresh()` 호출 시 "Together AI API Key를 먼저 입력해주세요." 에러 반환, 상태 변경 없음.

---

## 모델 선택 UI (평면 그리드)

`ProviderSection` 아코디언 대신, App.tsx 인라인으로 구현된 단일 카드 UI.

```tsx
// 회사 필터 탭 (전체 / Black Forest Labs / Stability AI / ...)
const [companyFilter, setCompanyFilter] = useState('all')

// 필터링 + 정렬
const filteredModels = useMemo(() => {
  let models = IMAGE_MODELS.filter(
    (m) =>
      (m.name.toLowerCase().includes(q) || m.author.toLowerCase().includes(q)) &&
      (companyFilter === 'all' || m.author === companyFilter),
  )
  if (sortMode === 'price') models.sort((a, b) => a.pricePerImage - b.pricePerImage)
  return models
}, [search, sortMode, companyFilter])

// 그리드: grid-cols-2 sm:grid-cols-3 lg:grid-cols-5
```

---

## GitHub Pages 배포 설정

**vite.config.ts**
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/레포이름/',  // ← 레포 이름과 일치해야 함
})
```

**.github/workflows/deploy.yml**
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    env:
      FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-artifact@v4
        with:
          name: github-pages
          path: dist/
      - uses: actions/deploy-pages@v4
        id: deployment
```

**GitHub 저장소 설정:**
Settings → Pages → Source → **GitHub Actions** 선택 필수

---

## 보안 설계 원칙

- API Key는 코드에 절대 포함하지 않음
- 사용자가 UI에서 직접 입력 → `sessionStorage` 저장 (탭 닫으면 자동 삭제)
- GitHub Secrets 설정 불필요
- 쿼터는 `localStorage` (브라우저별 독립 카운팅)
