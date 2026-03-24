import { useState } from 'react'

const STORAGE_KEY = 'img_gen_used'
const CAP_KEY     = 'img_gen_cap'
const BASE_CAP    = 10
const ADD_AMOUNT  = 10
const PASSCODE    = '124578'

export function useQuota() {
  const [used, setUsed] = useState<number>(() =>
    parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10),
  )
  const [cap, setCap] = useState<number>(() =>
    parseInt(localStorage.getItem(CAP_KEY) ?? String(BASE_CAP), 10),
  )

  const remaining   = Math.max(0, cap - used)
  const isExhausted = used >= cap

  function consume(count: number): boolean {
    const current = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10)
    if (current + count > cap) return false
    const next = current + count
    localStorage.setItem(STORAGE_KEY, String(next))
    setUsed(next)
    return true
  }

  function tryUnlock(code: string): boolean {
    if (code === PASSCODE) {
      const newCap = cap + ADD_AMOUNT
      localStorage.setItem(CAP_KEY, String(newCap))
      setCap(newCap)
      return true
    }
    return false
  }

  return { used, remaining, isExhausted, cap, ADD_AMOUNT, consume, tryUnlock }
}
