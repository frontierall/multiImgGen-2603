import { useState } from 'react'
import { Eye, EyeOff, Key, ChevronDown } from 'lucide-react'
import type { ApiKeys } from '../hooks/useImageGen'

interface Props {
  apiKeys: ApiKeys
  onChange: (keys: ApiKeys) => void
}

const PROVIDERS = [
  { key: 'together' as keyof ApiKeys, label: 'Together AI', color: '#7c3aed' },
  { key: 'openai' as keyof ApiKeys, label: 'OpenAI', color: '#10a37f' },
]

export default function ApiKeyInput({ apiKeys, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState<Record<string, boolean>>({})

  const setCount = Object.values(apiKeys).filter(Boolean).length

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-slate-100 dark:bg-[#1a1d27] border border-slate-200 dark:border-[#2a2d3a] rounded-xl px-3 py-2 hover:border-slate-300 dark:hover:border-[#3a3d4a] transition-colors"
      >
        <Key size={14} className="text-violet-400" />
        <span className="text-sm text-slate-600 dark:text-slate-300">API Keys</span>
        {setCount > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
            {setCount}/3
          </span>
        )}
        <ChevronDown size={13} className={`text-slate-400 dark:text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-80 bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-[#2a2d3a] rounded-2xl p-3 flex flex-col gap-2.5 z-50 shadow-xl">
          {PROVIDERS.map((p) => (
            <div key={p.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold" style={{ color: p.color }}>
                  {p.label}
                </span>
                {apiKeys[p.key] && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                    SET
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0f1117] border border-slate-200 dark:border-[#2a2d3a] rounded-xl px-3 py-2 focus-within:border-violet-500/40">
                <input
                  type={show[p.key] ? 'text' : 'password'}
                  value={apiKeys[p.key]}
                  onChange={(e) => onChange({ ...apiKeys, [p.key]: e.target.value })}
                  placeholder={`${p.label} API Key`}
                  className="flex-1 bg-transparent text-xs text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none min-w-0"
                />
                <button
                  onClick={() => setShow((v) => ({ ...v, [p.key]: !v[p.key] }))}
                  className="text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400"
                >
                  {show[p.key] ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
