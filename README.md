# Multi Image Generator

Together AI · OpenAI 2개 프로바이더의 이미지 생성 모델을 한 화면에서 비교 생성할 수 있는 웹 앱입니다.

**Tech Stack:** Vite · React 18 · TypeScript · Tailwind CSS
**배포:** GitHub Pages (GitHub Actions 자동 배포)

---

## 주요 기능

- **멀티 모델 동시 생성** — 여러 모델을 체크박스로 선택 후 한 번에 생성, 결과를 나란히 비교
- **모델 검색 · 정렬** — 모델명 또는 회사명으로 검색, 가격 낮은 순 정렬
- **API Key 관리** — sessionStorage 임시 저장 (탭 닫으면 자동 삭제, localStorage 미사용)
- **쿼터 제한** — 기본 10장 제한 / 암호(1234) 입력 시 무제한 해제
- **에러 로그 패널** — 실패한 모델과 에러 메시지를 결과 하단에 표시
- **이미지 다운로드** — 결과 카드 hover 시 다운로드 버튼 노출

---

## 프로바이더 구성

| 프로바이더 | API Key | 용도 |
|---|---|---|
| Together AI | `TOGETHER_API_KEY` | 대부분의 모델 (FLUX, HiDream, Google, Qwen, ByteDance 등) |
| OpenAI | `OPENAI_API_KEY` | DALL·E 3, GPT Image 1.5 Direct |

> Google 모델(Imagen, Flash Image, Gemini)은 Together AI를 통해 제공됩니다.
> Google 자체 API Key는 필요하지 않습니다.

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

#### Stability AI
| 모델명 | Model ID | 가격/장 |
|---|---|---|
| Stable Diffusion XL | `stabilityai/stable-diffusion-xl-base-1.0` | $0.002 |
| Stable Diffusion 3 Medium | `stabilityai/stable-diffusion-3-medium` | $0.002 |

#### Lykon
| 모델명 | Model ID | 가격/장 |
|---|---|---|
| DreamShaper | `Lykon/DreamShaper` | $0.001 |

#### RunDiffusion
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
| Flash Image 2.5 🆕 | `google/flash-image-2.5` | $0.039 |
| Flash Image 3.1 🆕 | `google/flash-image-3.1` | $0.039 |
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

## API 파라미터 처리 상세

### noSteps 플래그

Together AI의 일부 모델은 `steps` 파라미터를 지원하지 않습니다.
`noSteps: true` 인 모델에는 API 호출 시 `steps` 파라미터를 생략합니다.

```
noSteps: true 적용 모델
  - Qwen, ByteDance, Wan-AI, Ideogram
  - Google 전체 (Imagen, Flash Image, Gemini)
  - OpenAI/gpt-image-1.5 (via Together)
```

### response_format 처리

OpenAI Direct API 호출 시:

- `dall-e-3` / `dall-e-3-hd` → `response_format: 'b64_json'` 전송
- `gpt-image-1` → `response_format` 파라미터 생략 (미지원)

---

## 쿼터 시스템

- 기본 제한: **10장** (sessionStorage가 아닌 localStorage 기반, 브라우저 유지)
- 제한 초과 시 암호 입력 모달 표시
- 암호 `1234` 입력 → 무제한 해제 (해제 상태는 sessionStorage 저장)

---

## 프로젝트 구조

```
src/
├── App.tsx                    # 메인 레이아웃, 상태 관리
├── data/
│   └── imageModels.ts         # 모델 정의, 그룹핑 유틸
├── hooks/
│   ├── useImageGen.ts         # API 호출 훅 (Together AI / OpenAI)
│   └── useQuota.ts            # 쿼터 관리 훅
└── components/
    ├── ApiKeyInput.tsx         # API Key 입력 드롭다운
    ├── ProviderSection.tsx     # 프로바이더별 모델 목록
    ├── ModelCard.tsx           # 개별 모델 카드 (NEW 뱃지, 가격)
    ├── SelectedSection.tsx     # 선택된 모델 상단 표시
    ├── PromptPanel.tsx         # 프롬프트 + 파라미터 입력
    ├── ResultsPanel.tsx        # 결과 그리드 + 에러 로그 패널
    └── PasscodeModal.tsx       # 쿼터 해제 암호 입력 모달
```

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
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 빌드
```
