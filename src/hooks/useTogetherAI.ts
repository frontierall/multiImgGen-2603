import { useState } from 'react'

export interface GenerateParams {
  modelId: string
  prompt: string
  width: number
  height: number
  steps: number
  n: number
}

export interface GeneratedImage {
  modelId: string
  modelName: string
  url: string
  b64?: string
  error?: string
}

export function useTogetherAI(apiKey: string) {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<GeneratedImage[]>([])
  const [error, setError] = useState<string | null>(null)

  async function generate(
    params: GenerateParams,
    modelName: string,
  ): Promise<GeneratedImage> {
    const res = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: params.modelId,
        prompt: params.prompt,
        width: params.width,
        height: params.height,
        steps: params.steps,
        n: params.n,
        response_format: 'b64_json',
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      let msg = `${res.status}`
      try {
        const errJson = JSON.parse(errText)
        msg = errJson?.error?.message ?? errJson?.message ?? msg
      } catch {}
      return { modelId: params.modelId, modelName, url: '', error: msg }
    }

    const data = await res.json()
    const b64 = data?.data?.[0]?.b64_json as string | undefined
    const url = b64 ? `data:image/png;base64,${b64}` : (data?.data?.[0]?.url ?? '')
    return { modelId: params.modelId, modelName, url, b64 }
  }

  async function generateAll(
    selectedModels: { modelId: string; name: string }[],
    prompt: string,
    width: number,
    height: number,
    steps: number,
  ) {
    if (!apiKey.trim()) {
      setError('API Key를 입력해주세요.')
      return
    }
    if (!prompt.trim()) {
      setError('프롬프트를 입력해주세요.')
      return
    }

    setError(null)
    setLoading(true)
    setResults([])

    const tasks = selectedModels.map((m) =>
      generate({ modelId: m.modelId, prompt, width, height, steps, n: 1 }, m.name),
    )

    const settled = await Promise.allSettled(tasks)
    const imgs: GeneratedImage[] = settled.map((r, i) =>
      r.status === 'fulfilled'
        ? r.value
        : {
            modelId: selectedModels[i].modelId,
            modelName: selectedModels[i].name,
            url: '',
            error: String((r as PromiseRejectedResult).reason),
          },
    )

    setResults(imgs)
    setLoading(false)
  }

  return { loading, results, error, generateAll, setResults }
}
