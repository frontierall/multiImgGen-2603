import { useState } from 'react'
import { Lock, Unlock } from 'lucide-react'

interface Props {
  onUnlock: (code: string) => boolean
  onClose: () => void
}

export default function PasscodeModal({ onUnlock, onClose }: Props) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function handleSubmit() {
    const ok = onUnlock(code)
    if (ok) {
      onClose()
    } else {
      setError(true)
      setShake(true)
      setCode('')
      setTimeout(() => setShake(false), 400)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className={`w-80 bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-6 flex flex-col gap-4 shadow-2xl ${
          shake ? 'animate-shake' : ''
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-violet-500/15 flex items-center justify-center">
            <Lock size={22} className="text-violet-400" />
          </div>
          <h2 className="text-base font-semibold text-slate-100">한도 초과</h2>
          <p className="text-sm text-slate-400 text-center">
            무료 사용 10장을 모두 사용했습니다.
            <br />
            암호를 입력하면 계속 사용할 수 있습니다.
          </p>
        </div>

        <input
          type="password"
          value={code}
          onChange={(e) => { setCode(e.target.value); setError(false) }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="암호 입력"
          autoFocus
          className={`w-full bg-[#0f1117] border rounded-xl px-4 py-2.5 text-sm text-center text-slate-200 placeholder:text-slate-600 outline-none tracking-widest transition-colors ${
            error ? 'border-red-500/60' : 'border-[#2a2d3a] focus:border-violet-500/50'
          }`}
        />

        {error && (
          <p className="text-xs text-red-400 text-center -mt-2">암호가 틀렸습니다.</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-[#2a2d3a] text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!code}
            className="flex-1 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-[#2a2d3a] disabled:text-slate-600 text-sm text-white font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Unlock size={14} />
            잠금 해제
          </button>
        </div>
      </div>
    </div>
  )
}
