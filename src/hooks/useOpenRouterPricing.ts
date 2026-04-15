import { useCallback, useEffect, useState } from 'react'

export interface OpenRouterPrice {
  input: number
  output: number
  request: number
}

type PriceMap = Record<string, OpenRouterPrice>

function toNumber(value: unknown) {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

export function useOpenRouterPricing() {
  const [prices, setPrices] = useState<PriceMap>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('https://openrouter.ai/api/v1/models')
      if (!res.ok) {
        throw new Error(`가격 조회 실패 (${res.status})`)
      }

      const data = await res.json()
      const nextPrices: PriceMap = {}

      for (const model of (data?.data ?? [])) {
        if (!model?.id) continue
        nextPrices[model.id] = {
          input: toNumber(model.pricing?.prompt),
          output: toNumber(model.pricing?.completion),
          request: toNumber(model.pricing?.request),
        }
      }

      setPrices(nextPrices)
      setLastUpdated(new Date().toLocaleString())
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { prices, loading, error, lastUpdated, refresh }
}
