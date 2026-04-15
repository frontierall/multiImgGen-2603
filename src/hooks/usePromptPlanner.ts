import { useState } from 'react'

export interface PromptVariant {
  id: string
  title: string
  focus: string
  prompt: string
  promptKo: string
}

interface PlannerResult {
  summary: string
  prompts: PromptVariant[]
}

function extractJson(text: string) {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i)
  if (fenced) return fenced[1]

  const block = text.match(/\{[\s\S]*\}/)
  return block ? block[0] : text
}

function normalizeResult(raw: unknown): PlannerResult {
  const data = (raw && typeof raw === 'object') ? raw as Record<string, unknown> : {}
  const promptsRaw = Array.isArray(data.prompts) ? data.prompts : []
  const prompts = promptsRaw
    .map((item, index) => {
      const record = (item && typeof item === 'object') ? item as Record<string, unknown> : {}
      const title = typeof record.title === 'string' ? record.title.trim() : `프롬프트 ${index + 1}`
      const focus = typeof record.focus === 'string' ? record.focus.trim() : ''
      const prompt = typeof record.prompt === 'string' ? record.prompt.trim() : ''
      const promptKo = typeof record.promptKo === 'string' ? record.promptKo.trim() : ''
      if (!prompt) return null
      return {
        id: `${index + 1}`,
        title,
        focus,
        prompt,
        promptKo,
      }
    })
    .filter((item): item is PromptVariant => Boolean(item))

  return {
    summary: typeof data.summary === 'string' ? data.summary.trim() : '',
    prompts,
  }
}

async function callOpenRouter(apiKey: string, model: string, content: string): Promise<PlannerResult> {
  const prompt = `당신은 이미지 기획자입니다.
사용자가 입력한 내용을 분석해서 이미지 생성용 프롬프트 후보 3개를 만들어 주세요.

목표:
- 같은 원문을 서로 다른 시각 전략으로 해석한 프롬프트 3개 생성
- 각 프롬프트는 바로 이미지 생성 모델에 넣을 수 있을 정도로 구체적일 것
- 영어 프롬프트로 작성할 것
- 설명문은 한국어로 작성할 것

반드시 아래 JSON 형식으로만 응답하세요. 마크다운, 코드블록, 추가 설명 금지.

{
  "summary": "입력 내용을 어떻게 시각화할지 한 줄 요약",
  "prompts": [
    {
      "title": "후보 1 이름",
      "focus": "어떤 방향인지 짧은 설명",
      "prompt": "detailed English image prompt",
      "promptKo": "영문 프롬프트의 한국어 해석"
    },
    {
      "title": "후보 2 이름",
      "focus": "어떤 방향인지 짧은 설명",
      "prompt": "detailed English image prompt",
      "promptKo": "영문 프롬프트의 한국어 해석"
    },
    {
      "title": "후보 3 이름",
      "focus": "어떤 방향인지 짧은 설명",
      "prompt": "detailed English image prompt",
      "promptKo": "영문 프롬프트의 한국어 해석"
    }
  ]
}

사용자 입력:
${content}`

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Multi Image Gen',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    let message = `OpenRouter 오류 (${res.status})`
    try {
      message = JSON.parse(text)?.error?.message ?? message
    } catch {}
    throw new Error(message)
  }

  const data = await res.json()
  const contentText = data?.choices?.[0]?.message?.content
  if (typeof contentText !== 'string' || !contentText.trim()) {
    throw new Error('OpenRouter 응답이 비어 있습니다.')
  }

  const parsed = JSON.parse(extractJson(contentText))
  const result = normalizeResult(parsed)
  if (result.prompts.length === 0) {
    throw new Error('프롬프트 후보를 생성하지 못했습니다.')
  }
  return result
}

export function usePromptPlanner() {
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState('')
  const [variants, setVariants] = useState<PromptVariant[]>([])
  const [error, setError] = useState<string | null>(null)

  async function generate(content: string, apiKey: string, model: string) {
    if (!content.trim()) {
      setError('분석할 내용을 입력해주세요.')
      return
    }
    if (!apiKey.trim()) {
      setError('OpenRouter API Key를 입력해주세요.')
      return
    }

    setLoading(true)
    setError(null)
    setSummary('')
    setVariants([])

    try {
      const result = await callOpenRouter(apiKey, model, content)
      setSummary(result.summary)
      setVariants(result.prompts)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  function clear() {
    setSummary('')
    setVariants([])
    setError(null)
  }

  return { loading, summary, variants, error, generate, clear }
}
