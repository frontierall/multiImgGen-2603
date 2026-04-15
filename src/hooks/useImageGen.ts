import { useState } from 'react'
import type { Provider } from '../data/imageModels'

export interface GeneratedResult {
  modelId: string
  modelName: string
  url: string
  error?: string
  loading?: boolean // true: 아직 생성 중인 placeholder
}

export interface HistoryEntry {
  id: number
  prompt: string
  negPrompt: string
  results: GeneratedResult[]
}

export interface ApiKeys {
  together: string
  openai: string
  openrouter: string
}

interface ModelRequest {
  modelId: string
  name: string
  provider: Provider
  noSteps?: boolean
  supportsNegative?: boolean
}

function shouldOmitSteps(modelId: string, noSteps: boolean) {
  if (noSteps) return true

  return modelId.startsWith('google/')
}

// ── Together AI ───────────────────────────────────────────────
async function generateTogether(
  apiKey: string,
  modelId: string,
  modelName: string,
  prompt: string,
  negPrompt: string,
  width: number,
  height: number,
  steps: number,
  noSteps: boolean,
  supportsNegative: boolean,
): Promise<GeneratedResult> {
  const body: Record<string, unknown> = { model: modelId, prompt, width, height, n: 1, response_format: 'b64_json' }
  if (!shouldOmitSteps(modelId, noSteps)) body.steps = steps
  if (supportsNegative && negPrompt.trim()) body.negative_prompt = negPrompt

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
    negPrompt: string,
    width: number,
    height: number,
    steps: number,
  ): Promise<GeneratedResult[]> {
    if (!prompt.trim()) { setError('프롬프트를 입력해주세요.'); return [] }

    const needsTogether = models.some((m) => m.provider === 'together')
    const needsOpenAI   = models.some((m) => m.provider === 'openai')
    if (needsTogether && !apiKeys.together.trim()) { setError('Together AI API Key를 입력해주세요.'); return [] }
    if (needsOpenAI   && !apiKeys.openai.trim())   { setError('OpenAI API Key를 입력해주세요.'); return [] }

    setError(null)
    setLoading(true)

    // 즉시 placeholder 세팅 → 각 카드가 처음부터 스피너로 표시됨
    const placeholders: GeneratedResult[] = models.map((m) => ({
      modelId: m.modelId, modelName: m.name, url: '', loading: true,
    }))
    setResults(placeholders)

    // 최종 결과를 모아서 히스토리 저장용으로 반환
    const finalResults: GeneratedResult[] = [...placeholders]

    const tasks = models.map((m, i) => {
      const task = m.provider === 'openai'
        ? generateOpenAI(apiKeys.openai, m.modelId, m.name, prompt, width, height)
        : generateTogether(
            apiKeys.together, m.modelId, m.name, prompt, negPrompt,
            width, height, steps, m.noSteps ?? false, m.supportsNegative ?? false,
          )

      // 완료된 항목을 즉시 해당 인덱스에 교체
      return task.then((result) => {
        finalResults[i] = result
        setResults((prev) => prev.map((r, idx) => (idx === i ? result : r)))
      })
    })

    await Promise.all(tasks)
    setLoading(false)
    return finalResults
  }

  return { loading, results, error, generateAll }
}
