import { useCallback, useState } from 'react'

// modelId → price per image (USD)
export type TogetherPriceMap = Record<string, number>

const CACHE_KEY = 'together_prices_cache'
const CACHE_TTL_MS = 5 * 60 * 1000 // 5분

interface PriceCache {
  prices: TogetherPriceMap
  fetchedAt: number
  apiKeyHash: string // API Key 변경 감지용 (앞 8자)
}

function getKeyHash(apiKey: string) {
  return apiKey.slice(0, 8)
}

function loadCache(apiKey: string): PriceCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cache = JSON.parse(raw) as PriceCache
    if (Date.now() - cache.fetchedAt > CACHE_TTL_MS) return null
    if (cache.apiKeyHash !== getKeyHash(apiKey)) return null
    return cache
  } catch {
    return null
  }
}

function saveCache(prices: TogetherPriceMap, apiKey: string) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      prices,
      fetchedAt: Date.now(),
      apiKeyHash: getKeyHash(apiKey),
    }))
  } catch {}
}

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

    // 캐시가 유효하면 fetch 생략
    const cached = loadCache(apiKey)
    if (cached) {
      setPrices(cached.prices)
      setLastUpdated(new Date(cached.fetchedAt).toLocaleTimeString())
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

      saveCache(nextPrices, apiKey)
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
