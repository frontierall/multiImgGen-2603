import { useCallback, useState } from 'react'

// modelId → price per image (USD)
export type TogetherPriceMap = Record<string, number>

function toNumber(value: unknown): number {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

export function useTogetherPricing() {
  const [prices, setPrices] = useState<TogetherPriceMap>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const refresh = useCallback(async (apiKey: string) => {
    if (!apiKey.trim()) {
      setError('Together AI API Key를 먼저 입력해주세요.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('https://api.together.xyz/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      if (!res.ok) {
        throw new Error(`가격 조회 실패 (${res.status})`)
      }

      const data = await res.json()
      const nextPrices: TogetherPriceMap = {}

      for (const model of Array.isArray(data) ? data : []) {
        if (!model?.id) continue
        // Together AI image models: pricing.imagecost (USD per image)
        const imagecost = toNumber(model.pricing?.imagecost)
        if (imagecost > 0) {
          nextPrices[model.id] = imagecost
        }
      }

      setPrices(nextPrices)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [])

  return { prices, loading, error, lastUpdated, refresh }
}
