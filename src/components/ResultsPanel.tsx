import { useState } from 'react'
<<<<<<< Updated upstream
import { Download, AlertCircle, Loader2, Terminal, ChevronDown, Repeat2 } from 'lucide-react'
=======
import { Download, AlertCircle, Loader2, Terminal, ChevronDown, FolderDown } from 'lucide-react'
import JSZip from 'jszip'
>>>>>>> Stashed changes
import type { GeneratedResult, HistoryEntry } from '../hooks/useImageGen'

interface Props {
  results: GeneratedResult[]
  loading: boolean
  selectedCount: number
  history: HistoryEntry[]
  onSimilarImage?: (url: string) => void
  analyzing?: boolean
}

function download(r: GeneratedResult) {
  if (!r.url) return
  const a = document.createElement('a')
  a.href = r.url
  a.download = `${r.modelName.replace(/\s+/g, '_')}.png`
  a.click()
}

<<<<<<< Updated upstream
function ResultGrid({
  results,
  onSimilarImage,
  analyzing,
}: {
  results: GeneratedResult[]
  onSimilarImage?: (url: string) => void
  analyzing?: boolean
}) {
=======
async function downloadZip(results: GeneratedResult[], label: string) {
  const images = results.filter((r) => !r.error && !r.loading && r.url)
  if (images.length === 0) return

  const zip = new JSZip()

  for (const r of images) {
    // base64 data URL → binary
    const base64 = r.url.replace(/^data:image\/\w+;base64,/, '')
    const filename = `${r.modelName.replace(/\s+/g, '_')}.png`
    zip.file(filename, base64, { base64: true })
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${label.replace(/\s+/g, '_')}.zip`
  a.click()
  URL.revokeObjectURL(a.href)
}

function ZipButton({ results, label }: { results: GeneratedResult[]; label: string }) {
  const [zipping, setZipping] = useState(false)
  const available = results.filter((r) => !r.error && !r.loading && r.url)
  if (available.length === 0) return null

  async function handleClick() {
    setZipping(true)
    try { await downloadZip(results, label) } finally { setZipping(false) }
  }

  return (
    <button
      onClick={handleClick}
      disabled={zipping}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
        zipping
          ? 'bg-slate-100 dark:bg-[#2a2d3a] text-slate-400 cursor-not-allowed'
          : 'bg-slate-100 dark:bg-[#2a2d3a] hover:bg-slate-200 dark:hover:bg-[#3a3d4a] text-slate-600 dark:text-slate-300'
      }`}
    >
      <FolderDown size={13} />
      {zipping ? 'ZIP 생성 중...' : `전체 ZIP (${available.length}장)`}
    </button>
  )
}

function ResultGrid({ results }: { results: GeneratedResult[] }) {
>>>>>>> Stashed changes
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {results.map((r, idx) => (
        <div
          key={`${r.modelId}-${idx}`}
          className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-[#2a2d3a] bg-white dark:bg-[#1a1d27]"
        >
          {r.loading ? (
            /* 생성 중 — 스피너 */
            <div className="aspect-square flex flex-col items-center justify-center gap-2">
              <Loader2 size={24} className="text-violet-400 animate-spin" />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[80%] text-center">{r.modelName}</p>
            </div>
          ) : r.error ? (
            /* 에러 */
            <div className="aspect-square flex flex-col items-center justify-center gap-2 p-3">
              <AlertCircle size={24} className="text-red-400" />
              <p className="text-xs text-red-400 text-center">{r.error}</p>
            </div>
          ) : (
            /* 완료 — 이미지 */
            <>
              <img src={r.url} alt={r.modelName} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end">
                <div className="w-full p-2 translate-y-full group-hover:translate-y-0 transition-transform flex items-center justify-between">
                  <span className="text-xs text-white font-medium truncate max-w-[55%]">{r.modelName}</span>
                  <div className="flex items-center gap-1">
                    {onSimilarImage && (
                      <button
                        onClick={() => onSimilarImage(r.url)}
                        disabled={analyzing}
                        title="유사 이미지 생성"
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors disabled:opacity-40"
                      >
                        {analyzing ? <Loader2 size={13} className="animate-spin" /> : <Repeat2 size={13} />}
                      </button>
                    )}
                    <button
                      onClick={() => download(r)}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                    >
                      <Download size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          {!r.loading && (
            <div className="px-2 py-1.5 border-t border-slate-200 dark:border-[#2a2d3a]">
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{r.modelName}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function ResultsPanel({ results, history, onSimilarImage, analyzing }: Props) {
  const [openHistory, setOpenHistory] = useState<Set<number>>(new Set())

  function toggleHistory(id: number) {
    setOpenHistory((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const hasCurrentResults = results.length > 0
  const errors = results.filter((r) => r.error)

  if (!hasCurrentResults && history.length === 0) return null

  return (
    <div className="mt-2 flex flex-col gap-6">

      {/* ── 현재 결과 ── */}
      {hasCurrentResults && (
        <div>
<<<<<<< Updated upstream
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">생성 결과</h2>
          <ResultGrid results={results} onSimilarImage={onSimilarImage} analyzing={analyzing} />
=======
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">생성 결과</h2>
            <ZipButton results={results} label="generated" />
          </div>
          <ResultGrid results={results} />
>>>>>>> Stashed changes

          {/* 에러 로그 */}
          {errors.length > 0 && (
            <div className="mt-4 bg-slate-50 dark:bg-[#0f1117] border border-red-500/20 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-red-500/20 bg-red-500/5">
                <Terminal size={13} className="text-red-400" />
                <span className="text-xs font-semibold text-red-400">에러 로그</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">{errors.length}개 실패</span>
              </div>
              <div className="p-3 flex flex-col gap-1.5 font-mono text-xs">
                {errors.map((r) => (
                  <div key={r.modelId} className="flex gap-3">
                    <span className="text-red-500 shrink-0">✗</span>
                    <span className="text-slate-500 dark:text-slate-400 shrink-0 max-w-[160px] truncate">{r.modelName}</span>
                    <span className="text-red-300 break-all">{r.error}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 이전 생성 기록 ── */}
      {history.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-400 dark:text-slate-500 mb-2">
            이전 생성 기록
            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-[#2a2d3a] text-slate-500 dark:text-slate-400 font-normal">
              {history.length}
            </span>
          </h2>

          <div className="flex flex-col gap-2">
            {history.map((entry) => {
              const isOpen = openHistory.has(entry.id)
              const successCount = entry.results.filter((r) => !r.error && !r.loading).length
              const shortPrompt = entry.prompt.length > 60 ? entry.prompt.slice(0, 60) + '…' : entry.prompt
              const modelNames = Array.from(new Set(entry.results.map((r) => r.modelName)))
              const shortModelNames = modelNames.slice(0, 4)
              const remainingModelCount = Math.max(0, modelNames.length - shortModelNames.length)
              const imageResults = entry.results.filter((r) => !r.error && r.url)

              return (
                <div
                  key={entry.id}
                  className="border border-slate-200 dark:border-[#2a2d3a] rounded-xl overflow-hidden"
                >
                  {/* 헤더 — 클릭으로 펼치기 */}
                  <button
                    onClick={() => toggleHistory(entry.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 bg-slate-50 dark:bg-[#14161f] hover:bg-slate-100 dark:hover:bg-[#1a1d27] transition-colors text-left"
                  >
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 shrink-0 transition-transform ${isOpen ? '' : '-rotate-90'}`}
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-300 flex-1 truncate">{shortPrompt}</span>
                    {entry.plannerLabel && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 shrink-0">
                        AI {entry.plannerLabel}
                      </span>
                    )}
                    {entry.negPrompt && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-rose-500/15 text-rose-400 shrink-0">🚫 neg</span>
                    )}
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                      {successCount}/{entry.results.length}개
                    </span>
                  </button>

                  {/* 펼쳐진 미니 그리드 */}
                  {isOpen && (
                    <div className="p-3 bg-white dark:bg-[#0f1117]">
                      <div className="mb-3 flex items-center gap-2 flex-wrap">
                        {entry.plannerLabel && (
                          <>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">프롬프트 AI</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                              {entry.plannerLabel}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="mb-3 flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">생성 모델</span>
                        {shortModelNames.map((name) => (
                          <span
                            key={name}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#1a1d27] text-slate-500 dark:text-slate-400"
                          >
                            {name}
                          </span>
                        ))}
                        {remainingModelCount > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#1a1d27] text-slate-500 dark:text-slate-400">
                            +{remainingModelCount}
                          </span>
                        )}
                      </div>
                      {entry.negPrompt && (
                        <p className="text-[10px] text-rose-400 mb-2 truncate">🚫 {entry.negPrompt}</p>
                      )}
                      {imageResults.length === 0 ? (
                        <div className="text-xs text-slate-400 dark:text-slate-500 rounded-xl border border-dashed border-slate-200 dark:border-[#2a2d3a] px-3 py-4">
                          저장된 이미지가 없거나 생성이 모두 실패한 기록입니다.
                        </div>
                      ) : (
                        <>
                        <div className="flex justify-end mb-2">
                          <ZipButton results={entry.results} label={`history_${entry.id}`} />
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                          {imageResults.map((r, idx) => (
                          <div key={`${r.modelId}-${idx}`} className="group relative rounded-lg overflow-hidden">
                            <img src={r.url} alt={r.modelName} className="w-full aspect-square object-cover" />
<<<<<<< Updated upstream
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end">
                              <div className="w-full p-1 translate-y-full group-hover:translate-y-0 transition-transform flex items-center justify-between">
                                <span className="text-[9px] text-white truncate max-w-[50%]">{r.modelName}</span>
                                <div className="flex items-center gap-0.5">
                                  {onSimilarImage && (
                                    <button
                                      onClick={() => onSimilarImage(r.url)}
                                      disabled={analyzing}
                                      title="유사 이미지 생성"
                                      className="p-1 rounded bg-white/20 hover:bg-white/30 text-white disabled:opacity-40"
                                    >
                                      {analyzing ? <Loader2 size={10} className="animate-spin" /> : <Repeat2 size={10} />}
                                    </button>
                                  )}
                                  <button
                                    onClick={() => download(r)}
                                    className="p-1 rounded bg-white/20 hover:bg-white/30 text-white"
                                  >
                                    <Download size={10} />
                                  </button>
                                </div>
=======
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all flex items-end">
                              <div className="w-full p-1.5 translate-y-full group-hover:translate-y-0 transition-transform flex items-end justify-between gap-2">
                                <div className="min-w-0">
                                  {entry.plannerLabel && (
                                    <p className="text-[8px] text-emerald-200 truncate">AI {entry.plannerLabel}</p>
                                  )}
                                  <p className="text-[9px] text-white truncate">{r.modelName}</p>
                                </div>
                                <button
                                  onClick={() => download(r)}
                                  className="p-1 rounded bg-white/20 hover:bg-white/30 text-white"
                                >
                                  <Download size={10} />
                                </button>
>>>>>>> Stashed changes
                              </div>
                            </div>
                          </div>
                          ))}
                        </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
