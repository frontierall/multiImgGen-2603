import { Download, AlertCircle, Loader2 } from 'lucide-react'
import type { GeneratedResult } from '../hooks/useImageGen'

interface Props {
  results: GeneratedResult[]
  loading: boolean
  selectedCount: number
}

export default function ResultsPanel({ results, loading, selectedCount }: Props) {
  if (!loading && results.length === 0) return null

  function download(r: GeneratedResult) {
    if (!r.url) return
    const a = document.createElement('a')
    a.href = r.url
    a.download = `${r.modelName.replace(/\s+/g, '_')}.png`
    a.click()
  }

  return (
    <div className="mt-2">
      <h2 className="text-sm font-semibold text-slate-400 mb-3">생성 결과</h2>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: selectedCount }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-[#1a1d27] border border-[#2a2d3a] flex items-center justify-center">
              <Loader2 size={24} className="text-violet-400 animate-spin" />
            </div>
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {results.map((r) => (
            <div key={r.modelId} className="group relative rounded-xl overflow-hidden border border-[#2a2d3a] bg-[#1a1d27]">
              {r.error ? (
                <div className="aspect-square flex flex-col items-center justify-center gap-2 p-3">
                  <AlertCircle size={24} className="text-red-400" />
                  <p className="text-xs text-red-400 text-center">{r.error}</p>
                </div>
              ) : (
                <>
                  <img src={r.url} alt={r.modelName} className="w-full aspect-square object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end">
                    <div className="w-full p-2 translate-y-full group-hover:translate-y-0 transition-transform flex items-center justify-between">
                      <span className="text-xs text-white font-medium truncate max-w-[70%]">{r.modelName}</span>
                      <button
                        onClick={() => download(r)}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  </div>
                </>
              )}
              <div className="px-2 py-1.5 border-t border-[#2a2d3a]">
                <p className="text-xs text-slate-400 truncate">{r.modelName}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
