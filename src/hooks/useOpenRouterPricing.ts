import { useCallback, useEffect, useState } from 'react'

export interface OpenRouterPrice {
  input: number
  output: number
  request: number
}

type PriceMap = Record<string, OpenRouterPrice>

const CACHE_KEY = 'openrouter_prices_cache'
const CACHE_TTL_MS = 5 * 60 * 1000 // 5분

interface PriceCache {
  prices: PriceMap
  fetchedAt: number
}

function loadCache(): PriceCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cache = JSON.parse(raw) as PriceCache
    if (Date.now() - cache.fetchedAt > CACHE_TTL_MS) return null
    return cache
  } catch {
    return null
  }
}

function saveCache(prices: PriceMap) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ prices, fetchedAt: Date.now() }))
  } catch {}
}

function toNumber(value: unknown) {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

export function useOpenRouterPricing() {
  const [prices, setPrices] = useState<PriceMap>(() => loadCache()?.prices ?? {})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(() => {
    const cached = loadCache()
    return cached ? new Date(cached.fetchedAt).toLocaleString() : null
  })

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

      saveCache(nextPrices)
      setPrices(nextPrices)
      setLastUpdated(new Date().toLocaleString())
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // 캐시가 유효하면 fetch 생략
    if (loadCache()) return
    refresh()
  }, [refresh])

  return { prices, loading, error, lastUpdated, refresh }
}
