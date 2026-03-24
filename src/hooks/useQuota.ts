import { useState } from 'react'

const STORAGE_KEY = 'img_gen_used'
const UNLOCK_KEY = 'img_gen_unlocked'
const MAX_IMAGES = 10
const PASSCODE = '1234'

export function useQuota() {
  const [used, setUsed] = useState<number>(() =>
    parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10),
  )
  const [unlocked, setUnlocked] = useState<boolean>(
    () => localStorage.getItem(UNLOCK_KEY) === 'true',
  )

  const remaining = unlocked ? Infinity : Math.max(0, MAX_IMAGES - used)
  const isExhausted = !unlocked && used >= MAX_IMAGES

  function consume(count: number): boolean {
    if (unlocked) return true
    const current = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10)
    if (current + count > MAX_IMAGES) return false
    const next = current + count
    localStorage.setItem(STORAGE_KEY, String(next))
    setUsed(next)
    return true
  }

  function tryUnlock(code: string): boolean {
    if (code === PASSCODE) {
      localStorage.setItem(UNLOCK_KEY, 'true')
      setUnlocked(true)
      return true
    }
    return false
  }

  return { used, remaining, isExhausted, unlocked, MAX_IMAGES, consume, tryUnlock }
}
