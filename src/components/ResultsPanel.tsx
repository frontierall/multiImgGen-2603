import { Download, AlertCircle, Loader2, Terminal } from 'lucide-react'
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
      <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">생성 결과</h2>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: selectedCount }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-slate-100 dark:bg-[#1a1d27] border border-slate-200 dark:border-[#2a2d3a] flex items-center justify-center">
              <Loader2 size={24} className="text-violet-400 animate-spin" />
            </div>
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {results.map((r) => (
              <div key={r.modelId} className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-[#2a2d3a] bg-white dark:bg-[#1a1d27]">
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
                <div className="px-2 py-1.5 border-t border-slate-200 dark:border-[#2a2d3a]">
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{r.modelName}</p>
                </div>
              </div>
            ))}
          </div>

          {/* error log */}
          {results.some((r) => r.error) && (
            <div className="mt-4 bg-slate-50 dark:bg-[#0f1117] border border-red-500/20 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-red-500/20 bg-red-500/5">
                <Terminal size={13} className="text-red-400" />
                <span className="text-xs font-semibold text-red-400">에러 로그</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">
                  {results.filter((r) => r.error).length}개 실패
                </span>
              </div>
              <div className="p-3 flex flex-col gap-1.5 font-mono text-xs">
                {results.filter((r) => r.error).map((r) => (
                  <div key={r.modelId} className="flex gap-3">
                    <span className="text-red-500 shrink-0">✗</span>
                    <span className="text-slate-500 dark:text-slate-400 shrink-0 max-w-[160px] truncate">{r.modelName}</span>
                    <span className="text-red-300 break-all">{r.error}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
