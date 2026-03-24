import { useState } from 'react'
import { Lock, Wand2 } from 'lucide-react'

const GATE_PASSCODE = '1234'
const GATE_KEY      = 'app_gate_unlocked'

export function isGateUnlocked(): boolean {
  return sessionStorage.getItem(GATE_KEY) === 'true'
}

export default function AppGateModal({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode]   = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function handleSubmit() {
    if (code === GATE_PASSCODE) {
      sessionStorage.setItem(GATE_KEY, 'true')
      onUnlock()
    } else {
      setError(true)
      setShake(true)
      setCode('')
      setTimeout(() => setShake(false), 400)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1117]">
      <div className={`w-80 flex flex-col items-center gap-6 ${shake ? 'animate-shake' : ''}`}>

        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/15 flex items-center justify-center">
            <Wand2 size={30} className="text-violet-400" />
          </div>
          <h1 className="text-xl font-bold text-slate-100">Multi Image Gen</h1>
          <p className="text-sm text-slate-500 text-center">
            접근하려면 암호를 입력하세요.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <input
            type="password"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(false) }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="암호 입력"
            autoFocus
            className={`w-full bg-[#1a1d27] border rounded-xl px-4 py-3 text-sm text-center text-slate-200 placeholder:text-slate-600 outline-none tracking-widest transition-colors ${
              error ? 'border-red-500/60' : 'border-[#2a2d3a] focus:border-violet-500/50'
            }`}
          />
          {error && (
            <p className="text-xs text-red-400 text-center -mt-1">암호가 틀렸습니다.</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={!code}
            className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-[#2a2d3a] disabled:text-slate-600 text-sm text-white font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Lock size={14} />
            입장
          </button>
        </div>

      </div>
    </div>
  )
}
