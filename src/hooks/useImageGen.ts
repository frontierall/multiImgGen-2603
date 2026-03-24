import { useState } from 'react'
import type { Provider } from '../data/imageModels'

export interface GeneratedResult {
  modelId: string
  modelName: string
  url: string
  error?: string
}

export interface ApiKeys {
  together: string
  openai: string
}

interface ModelRequest {
  modelId: string
  name: string
  provider: Provider
  noSteps?: boolean
}

// ── Together AI ───────────────────────────────────────────────
async function generateTogether(
  apiKey: string,
  modelId: string,
  modelName: string,
  prompt: string,
  width: number,
  height: number,
  steps: number,
  noSteps: boolean,
): Promise<GeneratedResult> {
  const body: Record<string, unknown> = { model: modelId, prompt, width, height, n: 1, response_format: 'b64_json' }
  if (!noSteps) body.steps = steps

  const res = await fetch('https://api.together.xyz/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const txt = await res.text()
    let msg = `${res.status}`
    try { msg = JSON.parse(txt)?.error?.message ?? msg } catch {}
    return { modelId, modelName, url: '', error: msg }
  }
  const data = await res.json()
  const b64 = data?.data?.[0]?.b64_json as string | undefined
  const url = b64 ? `data:image/png;base64,${b64}` : (data?.data?.[0]?.url ?? '')
  return { modelId, modelName, url }
}

// ── OpenAI ────────────────────────────────────────────────────
async function generateOpenAI(
  apiKey: string,
  modelId: string,
  modelName: string,
  prompt: string,
  width: number,
  height: number,
): Promise<GeneratedResult> {
  const size = modelId.startsWith('dall-e')
    ? width >= height ? '1024x1024' : '1024x1792'
    : `${width}x${height}`
  const quality = modelId.endsWith('-hd') ? 'hd' : 'standard'
  const realModelId = modelId.replace(/-hd$/, '')
  // gpt-image-1 does not support response_format; dall-e-3 supports b64_json
  const supportsResponseFormat = realModelId.startsWith('dall-e')
  const body: Record<string, unknown> = { model: realModelId, prompt, n: 1, size, quality }
  if (supportsResponseFormat) body.response_format = 'b64_json'

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const txt = await res.text()
    let msg = `${res.status}`
    try { msg = JSON.parse(txt)?.error?.message ?? msg } catch {}
    return { modelId, modelName, url: '', error: msg }
  }
  const data = await res.json()
  const b64 = data?.data?.[0]?.b64_json as string | undefined
  const url = b64 ? `data:image/png;base64,${b64}` : (data?.data?.[0]?.url ?? '')
  return { modelId, modelName, url }
}

// ── Main hook ─────────────────────────────────────────────────
export function useImageGen(apiKeys: ApiKeys) {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<GeneratedResult[]>([])
  const [error, setError] = useState<string | null>(null)

  async function generateAll(
    models: ModelRequest[],
    prompt: string,
    width: number,
    height: number,
    steps: number,
  ) {
    if (!prompt.trim()) { setError('프롬프트를 입력해주세요.'); return }

    const needsTogether = models.some((m) => m.provider === 'together')
    const needsOpenAI   = models.some((m) => m.provider === 'openai')
    if (needsTogether && !apiKeys.together.trim()) { setError('Together AI API Key를 입력해주세요.'); return }
    if (needsOpenAI   && !apiKeys.openai.trim())   { setError('OpenAI API Key를 입력해주세요.'); return }

    setError(null)
    setLoading(true)
    setResults([])

    const tasks = models.map((m) => {
      if (m.provider === 'openai') return generateOpenAI(apiKeys.openai, m.modelId, m.name, prompt, width, height)
      return generateTogether(apiKeys.together, m.modelId, m.name, prompt, width, height, steps, m.noSteps ?? false)
    })

    const settled = await Promise.allSettled(tasks)
    const imgs: GeneratedResult[] = settled.map((r, i) =>
      r.status === 'fulfilled'
        ? r.value
        : { modelId: models[i].modelId, modelName: models[i].name, url: '', error: String((r as PromiseRejectedResult).reason) },
    )

    setResults(imgs)
    setLoading(false)
  }

  return { loading, results, error, generateAll }
}
