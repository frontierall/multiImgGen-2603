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

export const PLANNER_PURPOSES = [
  {
    id: 'general',
    label: '일반용',
    desc: '범용 이미지 기획',
    hint: 'general-purpose image, visually clear, commercially usable, no text, no watermark, focused composition',
  },
  {
    id: 'lecture',
    label: '강의용',
    desc: '설명 중심, 슬라이드 친화적',
    hint: 'educational image for lecture slides, concept clarity first, simple composition, low visual noise, enough whitespace, easy to understand at a glance, no text, no watermark',
  },
  {
    id: 'youtube',
    label: '유튜브용',
    desc: '16:9, 썸네일·영상 장면 친화적',
    hint: 'YouTube-friendly 16:9 composition, strong focal point, visually striking scene, thumbnail-friendly readability, cinematic framing, no text, no watermark',
  },
] as const

export type PlannerPurposeId = typeof PLANNER_PURPOSES[number]['id']

export const PLANNER_VISUAL_STYLES = [
  {
    id: 'infographic',
    label: '인포그래픽',
    desc: '구조와 개념 전달 중심',
    hint: 'infographic-inspired illustration, concept visualization, structured layout, clear visual hierarchy, symbolic objects only, simplified shapes, educational diagram feel',
  },
  {
    id: 'minimal',
    label: '미니멀',
    desc: '여백과 단순 구도',
    hint: 'minimal illustration, reduced detail, generous whitespace, clean background, few objects, calm composition, polished modern look',
  },
  {
    id: 'illustration',
    label: '일러스트',
    desc: '친근한 삽화 느낌',
    hint: 'editorial illustration style, friendly and clear, soft colors, readable shapes, polished digital illustration, approachable tone',
  },
  {
    id: 'animation',
    label: '애니메이션',
    desc: '캐릭터성과 장면성 강조',
    hint: 'animation-style illustration, expressive characters, vibrant colors, dynamic scene composition, polished background art, high visual appeal',
  },
  {
    id: 'cinematic',
    label: '시네마틱',
    desc: '강한 조명과 드라마틱 구도',
    hint: 'cinematic key art, dramatic lighting, strong contrast, immersive atmosphere, wide framing, emotional storytelling, high-impact composition',
  },
] as const

export type PlannerVisualStyleId = typeof PLANNER_VISUAL_STYLES[number]['id']

export const PLANNER_QUICK_PRESETS = [
  {
    id: 'lecture-infographic',
    label: '강의용 + 인포그래픽',
    desc: '개념 설명, 구조 시각화',
    purposeId: 'lecture',
    styleId: 'infographic',
  },
  {
    id: 'lecture-minimal',
    label: '강의용 + 미니멀',
    desc: '여백 중심, 슬라이드 삽입용',
    purposeId: 'lecture',
    styleId: 'minimal',
  },
  {
    id: 'lecture-illustration',
    label: '강의용 + 일러스트',
    desc: '친근한 교육용 삽화',
    purposeId: 'lecture',
    styleId: 'illustration',
  },
  {
    id: 'youtube-animation',
    label: '유튜브용 + 애니메이션',
    desc: '16:9 장면형 비주얼',
    purposeId: 'youtube',
    styleId: 'animation',
  },
  {
    id: 'youtube-cinematic',
    label: '유튜브용 + 시네마틱',
    desc: '강한 임팩트, 썸네일 친화',
    purposeId: 'youtube',
    styleId: 'cinematic',
  },
] as const

export function buildPlannerStyleHint(
  purposeId: PlannerPurposeId,
  styleId: PlannerVisualStyleId,
) {
  const purposeHint = PLANNER_PURPOSES.find((item) => item.id === purposeId)?.hint
  const styleHint = PLANNER_VISUAL_STYLES.find((item) => item.id === styleId)?.hint

  return [purposeHint, styleHint].filter(Boolean).join(', ')
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

async function callOpenRouter(apiKey: string, model: string, content: string, styleHint?: string): Promise<PlannerResult> {
  const styleInstruction = styleHint
    ? `\n스타일 지시 (반드시 아래 스타일을 모든 프롬프트에 반영하세요):\n${styleHint}\n`
    : ''

  const prompt = `당신은 이미지 기획자입니다.
사용자가 입력한 내용을 분석해서 이미지 생성용 프롬프트 후보 3개를 만들어 주세요.
${styleInstruction}
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
      temperature: 0.7,
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

  let parsed: unknown
  try {
    parsed = JSON.parse(extractJson(contentText))
  } catch {
    throw new Error('AI 응답을 JSON으로 파싱하지 못했습니다. 다시 시도해주세요.')
  }
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

  async function generate(content: string, apiKey: string, model: string, styleHint?: string) {
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
      const result = await callOpenRouter(apiKey, model, content, styleHint)
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
