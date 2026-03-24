export type Provider = 'together' | 'openai' | 'google'

export interface ImageModel {
  id: string
  name: string
  author: string
  pricePerImage: number // USD
  modelId: string
  provider: Provider
  description?: string
  isNew?: boolean
}

export interface CompanyGroup {
  company: string
  color: string
  provider: Provider
  models: ImageModel[]
}

export const IMAGE_MODELS: ImageModel[] = [
  // ── Black Forest Labs (Together AI) ──────────────────────────
  {
    id: 'flux1-schnell',
    name: 'FLUX.1 Schnell',
    author: 'Black Forest Labs',
    pricePerImage: 0.003,
    modelId: 'black-forest-labs/FLUX.1-schnell',
    provider: 'together',
  },
  {
    id: 'flux1-krea',
    name: 'FLUX.1 Krea',
    author: 'Black Forest Labs',
    pricePerImage: 0.025,
    modelId: 'black-forest-labs/FLUX.1-krea',
    provider: 'together',
  },
  {
    id: 'flux1-dev',
    name: 'FLUX.1 [dev]',
    author: 'Black Forest Labs',
    pricePerImage: 0.025,
    modelId: 'black-forest-labs/FLUX.1-dev',
    provider: 'together',
  },
  {
    id: 'flux11-pro',
    name: 'FLUX 1.1 Pro',
    author: 'Black Forest Labs',
    pricePerImage: 0.04,
    modelId: 'black-forest-labs/FLUX.1.1-pro',
    provider: 'together',
  },
  {
    id: 'flux1-kontext-pro',
    name: 'FLUX.1 Kontext [pro]',
    author: 'Black Forest Labs',
    pricePerImage: 0.04,
    modelId: 'black-forest-labs/FLUX.1-kontext-pro',
    provider: 'together',
    isNew: true,
  },
  {
    id: 'flux1-kontext-max',
    name: 'FLUX.1 Kontext [max]',
    author: 'Black Forest Labs',
    pricePerImage: 0.08,
    modelId: 'black-forest-labs/FLUX.1-kontext-max',
    provider: 'together',
    isNew: true,
  },
  {
    id: 'flux2-dev',
    name: 'FLUX.2 [dev]',
    author: 'Black Forest Labs',
    pricePerImage: 0.025,
    modelId: 'black-forest-labs/FLUX.2-dev',
    provider: 'together',
    isNew: true,
  },
  {
    id: 'flux2-flex',
    name: 'FLUX.2 [flex]',
    author: 'Black Forest Labs',
    pricePerImage: 0.035,
    modelId: 'black-forest-labs/FLUX.2-flex',
    provider: 'together',
    isNew: true,
  },
  {
    id: 'flux2-pro',
    name: 'FLUX.2 [pro]',
    author: 'Black Forest Labs',
    pricePerImage: 0.05,
    modelId: 'black-forest-labs/FLUX.2-pro',
    provider: 'together',
    isNew: true,
  },
  {
    id: 'flux2-max',
    name: 'FLUX.2 [max]',
    author: 'Black Forest Labs',
    pricePerImage: 0.08,
    modelId: 'black-forest-labs/FLUX.2-max',
    provider: 'together',
    isNew: true,
  },

  // ── Community / Stability (Together AI) ──────────────────────
  {
    id: 'dreamshaper-xl',
    name: 'DreamShaper XL',
    author: 'Lykon',
    pricePerImage: 0.001,
    modelId: 'prompthero/openjourney',
    provider: 'together',
  },
  {
    id: 'juggernaut-xl',
    name: 'Juggernaut XL',
    author: 'RunDiffusion',
    pricePerImage: 0.002,
    modelId: 'RunDiffusion/Juggernaut-XL-v9',
    provider: 'together',
  },
  {
    id: 'sd-xl',
    name: 'SD XL',
    author: 'Stability AI',
    pricePerImage: 0.002,
    modelId: 'stabilityai/stable-diffusion-xl-base-1.0',
    provider: 'together',
  },
  {
    id: 'sd3-medium',
    name: 'SD3 Medium',
    author: 'Stability AI',
    pricePerImage: 0.002,
    modelId: 'stabilityai/stable-diffusion-3-medium-diffusers',
    provider: 'together',
  },
  {
    id: 'juggernaut-pro',
    name: 'Juggernaut Pro',
    author: 'RunDiffusion',
    pricePerImage: 0.005,
    modelId: 'RunDiffusion/Juggernaut-Pro-v10',
    provider: 'together',
  },

  // ── HiDream (Together AI) ────────────────────────────────────
  {
    id: 'hidream-fast',
    name: 'HiDream Fast',
    author: 'HiDream',
    pricePerImage: 0.003,
    modelId: 'hidream-ai/hidream-i1-fast',
    provider: 'together',
  },
  {
    id: 'hidream-dev',
    name: 'HiDream Dev',
    author: 'HiDream',
    pricePerImage: 0.005,
    modelId: 'hidream-ai/hidream-i1-dev',
    provider: 'together',
  },
  {
    id: 'hidream-full',
    name: 'HiDream Full',
    author: 'HiDream',
    pricePerImage: 0.009,
    modelId: 'hidream-ai/hidream-i1-full',
    provider: 'together',
  },

  // ── Qwen (Together AI) ───────────────────────────────────────
  {
    id: 'qwen-image',
    name: 'Qwen Image',
    author: 'Qwen',
    pricePerImage: 0.006,
    modelId: 'Qwen/Qwen2-VL-72B-Instruct',
    provider: 'together',
  },
  {
    id: 'qwen-image-2',
    name: 'Qwen Image 2.0',
    author: 'Qwen',
    pricePerImage: 0.008,
    modelId: 'Qwen/QwenImage-2.0',
    provider: 'together',
    isNew: true,
  },
  {
    id: 'qwen-image-2-pro',
    name: 'Qwen Image 2.0 Pro',
    author: 'Qwen',
    pricePerImage: 0.012,
    modelId: 'Qwen/QwenImage-2.0-Pro',
    provider: 'together',
    isNew: true,
  },

  // ── ByteDance (Together AI) ──────────────────────────────────
  {
    id: 'seedream-30',
    name: 'Seedream 3.0',
    author: 'ByteDance',
    pricePerImage: 0.018,
    modelId: 'ByteDance/Seedream-3.0',
    provider: 'together',
  },
  {
    id: 'seedream-40',
    name: 'Seedream 4.0',
    author: 'ByteDance',
    pricePerImage: 0.03,
    modelId: 'ByteDance/Seedream-4.0',
    provider: 'together',
  },

  // ── Wan-AI (Together AI) ─────────────────────────────────────
  {
    id: 'wan-image-26',
    name: 'Wan 2.6 Image',
    author: 'Wan-AI',
    pricePerImage: 0.008,
    modelId: 'Wan-AI/Wan2.6-Image',
    provider: 'together',
    isNew: true,
  },

  // ── Ideogram (Together AI) ───────────────────────────────────
  {
    id: 'ideogram-30',
    name: 'Ideogram 3.0',
    author: 'Ideogram',
    pricePerImage: 0.06,
    modelId: 'ideogram-ai/ideogram-v3',
    provider: 'together',
  },

  // ── OpenAI ───────────────────────────────────────────────────
  {
    id: 'gpt-image-15',
    name: 'GPT Image 1.5',
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

  // ── Google ───────────────────────────────────────────────────
  {
    id: 'gemini-flash-image-25',
    name: 'Gemini Flash Image 2.5',
    author: 'Google',
    pricePerImage: 0.039,
    modelId: 'gemini-2.0-flash-preview-image-generation',
    provider: 'google',
    isNew: true,
  },
  {
    id: 'gemini-3-nano-image',
    name: 'Gemini 3 Image',
    author: 'Google',
    pricePerImage: 0.06,
    modelId: 'gemini-3.0-nano-image-generation',
    provider: 'google',
    isNew: true,
  },
  {
    id: 'gemini-31-flash-image',
    name: 'Gemini 3.1 Flash Image (Nano Banana 2)',
    author: 'Google',
    pricePerImage: 0.04,
    modelId: 'gemini-3.1-flash-image-generation',
    provider: 'google',
    isNew: true,
  },

]

export const COMPANY_COLORS: Record<string, string> = {
  'Black Forest Labs': '#7c3aed',
  'Lykon': '#0ea5e9',
  'RunDiffusion': '#f59e0b',
  'Stability AI': '#10b981',
  'HiDream': '#ec4899',
  'Qwen': '#6366f1',
  'ByteDance': '#ef4444',
  'Wan-AI': '#14b8a6',
  'Ideogram': '#f97316',
  'OpenAI': '#10a37f',
  'Google': '#4285f4',
}

export const PROVIDER_LABELS: Record<Provider, string> = {
  together: 'TOGETHER_API_KEY',
  openai: 'OPENAI_API_KEY',
  google: 'GOOGLE_API_KEY',
}

export const PROVIDER_META: Record<Provider, { label: string; color: string }> = {
  together: { label: 'Together AI', color: '#7c3aed' },
  openai:   { label: 'OpenAI',      color: '#10a37f' },
  google:   { label: 'Google',      color: '#4285f4' },
}

export interface ProviderGroup {
  provider: Provider
  label: string
  color: string
  apiKeyLabel: string
  /** sub-groups by author (only relevant for Together AI) */
  companies: { name: string; models: ImageModel[] }[]
}

export function groupByProvider(models: ImageModel[]): ProviderGroup[] {
  const order: Provider[] = ['together', 'openai', 'google']
  return order
    .map((p) => {
      const pModels = models.filter((m) => m.provider === p)
      // sub-group by author
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

// kept for compat but not used in main UI
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
