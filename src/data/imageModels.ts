export type Provider = 'together' | 'openai'

export interface ImageModel {
  id: string
  name: string
  author: string
  pricePerImage: number // USD per image (1024×1024 기준)
  modelId: string
  provider: Provider
  noSteps?: boolean   // true: steps 파라미터 미지원 모델
  isNew?: boolean
}

export interface CompanyGroup {
  company: string
  color: string
  provider: Provider
  models: ImageModel[]
}

export const IMAGE_MODELS: ImageModel[] = [
  // ── Black Forest Labs ────────────────────────────────────────
  {
    id: 'flux1-schnell',
    name: 'FLUX.1 Schnell',
    author: 'Black Forest Labs',
    pricePerImage: 0.003,
    modelId: 'black-forest-labs/FLUX.1-schnell',
    provider: 'together',
  },
  {
    id: 'flux1-krea-dev',
    name: 'FLUX.1 Krea [dev]',
    author: 'Black Forest Labs',
    pricePerImage: 0.025,
    modelId: 'black-forest-labs/FLUX.1-krea-dev',
    provider: 'together',
  },
  {
    id: 'flux11-pro',
    name: 'FLUX.1.1 Pro',
    author: 'Black Forest Labs',
    pricePerImage: 0.04,
    modelId: 'black-forest-labs/FLUX.1.1-pro',
    provider: 'together',
  },
  {
    id: 'flux1-kontext-pro',
    name: 'FLUX.1 Kontext Pro',
    author: 'Black Forest Labs',
    pricePerImage: 0.04,
    modelId: 'black-forest-labs/FLUX.1-kontext-pro',
    provider: 'together',
  },
  {
    id: 'flux1-kontext-max',
    name: 'FLUX.1 Kontext Max',
    author: 'Black Forest Labs',
    pricePerImage: 0.08,
    modelId: 'black-forest-labs/FLUX.1-kontext-max',
    provider: 'together',
  },

  // ── Stability AI ─────────────────────────────────────────────
  {
    id: 'sd-xl',
    name: 'Stable Diffusion XL',
    author: 'Stability AI',
    pricePerImage: 0.002,
    modelId: 'stabilityai/stable-diffusion-xl-base-1.0',
    provider: 'together',
  },
  {
    id: 'sd3-medium',
    name: 'Stable Diffusion 3 Medium',
    author: 'Stability AI',
    pricePerImage: 0.002,
    modelId: 'stabilityai/stable-diffusion-3-medium',
    provider: 'together',
  },

  // ── Lykon ────────────────────────────────────────────────────
  {
    id: 'dreamshaper',
    name: 'DreamShaper',
    author: 'Lykon',
    pricePerImage: 0.001,
    modelId: 'Lykon/DreamShaper',
    provider: 'together',
  },

  // ── RunDiffusion ─────────────────────────────────────────────
  {
    id: 'juggernaut-lightning',
    name: 'Juggernaut Lightning Flux',
    author: 'RunDiffusion',
    pricePerImage: 0.002,
    modelId: 'RunDiffusion/Juggernaut-Lightning-Flux',
    provider: 'together',
  },
  {
    id: 'juggernaut-pro-flux',
    name: 'Juggernaut Pro Flux',
    author: 'RunDiffusion',
    pricePerImage: 0.005,
    modelId: 'RunDiffusion/Juggernaut-pro-flux',
    provider: 'together',
  },

  // ── HiDream ──────────────────────────────────────────────────
  {
    id: 'hidream-fast',
    name: 'HiDream I1 Fast',
    author: 'HiDream',
    pricePerImage: 0.003,
    modelId: 'HiDream-ai/HiDream-I1-Fast',
    provider: 'together',
  },
  {
    id: 'hidream-dev',
    name: 'HiDream I1 Dev',
    author: 'HiDream',
    pricePerImage: 0.005,
    modelId: 'HiDream-ai/HiDream-I1-Dev',
    provider: 'together',
  },
  {
    id: 'hidream-full',
    name: 'HiDream I1 Full',
    author: 'HiDream',
    pricePerImage: 0.009,
    modelId: 'HiDream-ai/HiDream-I1-Full',
    provider: 'together',
  },

  // ── Qwen ─────────────────────────────────────────────────────
  {
    id: 'qwen-image',
    name: 'Qwen Image',
    author: 'Qwen',
    pricePerImage: 0.006,
    modelId: 'Qwen/Qwen-Image',
    provider: 'together',
    noSteps: true,
  },
  {
    id: 'qwen-image-2',
    name: 'Qwen Image 2.0',
    author: 'Qwen',
    pricePerImage: 0.008,
    modelId: 'Qwen/Qwen-Image-2.0',
    provider: 'together',
    noSteps: true,
    isNew: true,
  },

  // ── ByteDance ─────────────────────────────────────────────────
  {
    id: 'seedream-30',
    name: 'Seedream 3.0',
    author: 'ByteDance',
    pricePerImage: 0.018,
    modelId: 'ByteDance-Seed/Seedream-3.0',
    provider: 'together',
    noSteps: true,
  },
  {
    id: 'seedream-40',
    name: 'Seedream 4.0',
    author: 'ByteDance',
    pricePerImage: 0.030,
    modelId: 'ByteDance-Seed/Seedream-4.0',
    provider: 'together',
    noSteps: true,
    isNew: true,
  },

  // ── Wan-AI ────────────────────────────────────────────────────
  {
    id: 'wan-image-26',
    name: 'Wan 2.6 Image',
    author: 'Wan-AI',
    pricePerImage: 0.008,
    modelId: 'Wan-AI/Wan-2.6-Image',
    provider: 'together',
    noSteps: true,
    isNew: true,
  },

  // ── Ideogram ──────────────────────────────────────────────────
  {
    id: 'ideogram-30',
    name: 'Ideogram 3.0',
    author: 'Ideogram',
    pricePerImage: 0.060,
    modelId: 'ideogram/ideogram-3.0',
    provider: 'together',
    noSteps: true,
  },

  // ── Google (via Together AI) ──────────────────────────────────
  {
    id: 'google-imagen-40-fast',
    name: 'Imagen 4.0 Fast (나노 바나나 Fast)',
    author: 'Google',
    pricePerImage: 0.020,
    modelId: 'google/imagen-4.0-fast',
    provider: 'together',
    noSteps: true,
    isNew: true,
  },
  {
    id: 'google-flash-image-25',
    name: 'Flash Image 2.5 (나노 바나나 2)',
    author: 'Google',
    pricePerImage: 0.039,
    modelId: 'google/flash-image-2.5',
    provider: 'together',
    noSteps: true,
    isNew: true,
  },
  {
    id: 'google-flash-image-31',
    name: 'Flash Image 3.1 (나노 바나나 3)',
    author: 'Google',
    pricePerImage: 0.039,
    modelId: 'google/flash-image-3.1',
    provider: 'together',
    noSteps: true,
    isNew: true,
  },
  {
    id: 'google-imagen-40-preview',
    name: 'Imagen 4.0 Preview (나노 바나나 Preview)',
    author: 'Google',
    pricePerImage: 0.040,
    modelId: 'google/imagen-4.0-preview',
    provider: 'together',
    noSteps: true,
    isNew: true,
  },
  {
    id: 'google-imagen-40-ultra',
    name: 'Imagen 4.0 Ultra (나노 바나나 Ultra)',
    author: 'Google',
    pricePerImage: 0.060,
    modelId: 'google/imagen-4.0-ultra',
    provider: 'together',
    noSteps: true,
    isNew: true,
  },
  {
    id: 'google-gemini-3-pro-image',
    name: 'Gemini 3 Pro Image (나노 바나나 Pro)',
    author: 'Google',
    pricePerImage: 0.060,
    modelId: 'google/gemini-3-pro-image',
    provider: 'together',
    noSteps: true,
    isNew: true,
  },

  // ── OpenAI ────────────────────────────────────────────────────
  {
    id: 'gpt-image-15-together',
    name: 'GPT Image 1.5',
    author: 'OpenAI',
    pricePerImage: 0.04,
    modelId: 'openai/gpt-image-1.5',
    provider: 'together',
    noSteps: true,
    isNew: true,
  },
  {
    id: 'gpt-image-15',
    name: 'GPT Image 1.5 (Direct)',
    author: 'OpenAI',
    pricePerImage: 0.04,
    modelId: 'gpt-image-1',
    provider: 'openai',
    isNew: true,
  },
  {
    id: 'dall-e-3',
    name: 'DALL·E 3',
    author: 'OpenAI',
    pricePerImage: 0.04,
    modelId: 'dall-e-3',
    provider: 'openai',
  },
  {
    id: 'dall-e-3-hd',
    name: 'DALL·E 3 HD',
    author: 'OpenAI',
    pricePerImage: 0.08,
    modelId: 'dall-e-3-hd',
    provider: 'openai',
  },
]

export const COMPANY_COLORS: Record<string, string> = {
  'Black Forest Labs': '#7c3aed',
  'Lykon':            '#0ea5e9',
  'RunDiffusion':     '#f59e0b',
  'Stability AI':     '#10b981',
  'HiDream':          '#ec4899',
  'Qwen':             '#6366f1',
  'ByteDance':        '#ef4444',
  'Wan-AI':           '#14b8a6',
  'Ideogram':         '#f97316',
  'Google':           '#4285f4',
  'OpenAI':           '#10a37f',
}

export const PROVIDER_LABELS: Record<Provider, string> = {
  together: 'TOGETHER_API_KEY',
  openai:   'OPENAI_API_KEY',
}

export const PROVIDER_META: Record<Provider, { label: string; color: string }> = {
  together: { label: 'Together AI', color: '#7c3aed' },
  openai:   { label: 'OpenAI',      color: '#10a37f' },
}

export interface ProviderGroup {
  provider: Provider
  label: string
  color: string
  apiKeyLabel: string
  companies: { name: string; models: ImageModel[] }[]
}

export function groupByProvider(models: ImageModel[]): ProviderGroup[] {
  const order: Provider[] = ['together', 'openai']
  return order
    .map((p) => {
      const pModels = models.filter((m) => m.provider === p)
      const companyMap = new Map<string, ImageModel[]>()
      for (const m of pModels) {
        if (!companyMap.has(m.author)) companyMap.set(m.author, [])
        companyMap.get(m.author)!.push(m)
      }
      return {
        provider: p,
        label: PROVIDER_META[p].label,
        color: PROVIDER_META[p].color,
        apiKeyLabel: PROVIDER_LABELS[p],
        companies: Array.from(companyMap.entries()).map(([name, models]) => ({ name, models })),
      }
    })
    .filter((g) => g.companies.length > 0)
}

export function groupByCompany(models: ImageModel[]): CompanyGroup[] {
  const map = new Map<string, ImageModel[]>()
  for (const model of models) {
    if (!map.has(model.author)) map.set(model.author, [])
    map.get(model.author)!.push(model)
  }
  return Array.from(map.entries()).map(([company, models]) => ({
    company,
    color: COMPANY_COLORS[company] ?? '#6b7280',
    provider: models[0].provider,
    models,
  }))
}
