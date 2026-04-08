import { useState, useMemo, useEffect } from 'react'
import { Search, Sun, Moon } from 'lucide-react'
import { IMAGE_MODELS, groupByProvider } from './data/imageModels'
import ApiKeyInput from './components/ApiKeyInput'
import ProviderSection from './components/ProviderSection'
import SelectedSection from './components/SelectedSection'
import PromptPanel from './components/PromptPanel'
import ResultsPanel from './components/ResultsPanel'
import { useImageGen, type ApiKeys } from './hooks/useImageGen'
import { useQuota } from './hooks/useQuota'
import PasscodeModal from './components/PasscodeModal'
import AppGateModal, { isGateUnlocked } from './components/AppGateModal'

type SortMode = 'default' | 'price'

// sessionStorage: cleared automatically when browser tab/window closes
function loadApiKeys(): ApiKeys {
  return {
    together: sessionStorage.getItem('key_together') ?? '',
    openai:   sessionStorage.getItem('key_openai')   ?? '',
  }
}

export default function App() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(loadApiKeys)
  const [search, setSearch]   = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('price')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const [prompt, setPrompt]   = useState('')
  const [width, setWidth]     = useState(1024)
  const [height, setHeight]   = useState(1024)
  const [steps, setSteps]     = useState(4)

  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') !== 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const { loading, results, error, generateAll }          = useImageGen(apiKeys)
  const { remaining, isExhausted, cap, ADD_AMOUNT, consume, tryUnlock } = useQuota()
  const [showPasscode, setShowPasscode] = useState(false)
  const [gateOpen, setGateOpen] = useState(isGateUnlocked)

  function handleApiKeysChange(keys: ApiKeys) {
    setApiKeys(keys)
    sessionStorage.setItem('key_together', keys.together)
    sessionStorage.setItem('key_openai',   keys.openai)
  }

  function toggleModel(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filteredGroups = useMemo(() => {
    const q = search.toLowerCase()
    let models = IMAGE_MODELS.filter(
      (m) => m.name.toLowerCase().includes(q) || m.author.toLowerCase().includes(q),
    )
    if (sortMode === 'price') {
      models = [...models].sort((a, b) => a.pricePerImage - b.pricePerImage)
    }
    return groupByProvider(models)
  }, [search, sortMode])

  const selectedModels = IMAGE_MODELS.filter((m) => selectedIds.has(m.id))

  function handleGenerate() {
    if (isExhausted) { setShowPasscode(true); return }
    const capped = selectedModels.slice(0, remaining)
    if (!consume(capped.length)) return
    generateAll(
      capped.map((m) => ({ modelId: m.modelId, name: m.name, provider: m.provider, noSteps: m.noSteps })),
      prompt, width, height, steps,
    )
  }

  if (!gateOpen) return <AppGateModal onUnlock={() => setGateOpen(true)} />

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1117]">
      {showPasscode && (
        <PasscodeModal onUnlock={tryUnlock} onClose={() => setShowPasscode(false)} addAmount={ADD_AMOUNT} />
      )}

      {/* top bar */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-[#0f1117]/90 backdrop-blur border-b border-slate-200 dark:border-[#2a2d3a] px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-3">
          <h1 className="text-base font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">
            🎨 Multi Image Gen
          </h1>

          {/* sort toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#1a1d27] border border-slate-200 dark:border-[#2a2d3a] rounded-xl p-1">
            <span className="text-xs text-slate-400 dark:text-slate-500 px-2">정렬</span>
            {(['default', 'price'] as SortMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setSortMode(mode)}
                className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                  sortMode === mode
                    ? 'bg-white dark:bg-[#2a2d3a] text-slate-700 dark:text-slate-200'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {mode === 'default' ? '기본' : '가격 낮은 순'}
              </button>
            ))}
          </div>

          {/* search */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#1a1d27] border border-slate-200 dark:border-[#2a2d3a] rounded-xl px-3 py-2 flex-1 min-w-[180px]">
            <Search size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="모델 또는 회사 검색..."
              className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 text-xs">✕</button>
            )}
          </div>

          {/* api keys */}
          <ApiKeyInput apiKeys={apiKeys} onChange={handleApiKeysChange} />

          {/* theme toggle */}
          <button
            onClick={() => setIsDark(v => !v)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-[#1a1d27] border border-slate-200 dark:border-[#2a2d3a] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            title={isDark ? '라이트 모드' : '다크 모드'}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-5 flex flex-col gap-4">
        {/* prompt panel */}
        <PromptPanel
          prompt={prompt}
          onPromptChange={setPrompt}
          width={width}
          height={height}
          steps={steps}
          onWidthChange={setWidth}
          onHeightChange={setHeight}
          onStepsChange={setSteps}
          selectedCount={selectedModels.length}
          loading={loading}
          onGenerate={handleGenerate}
          remaining={remaining}
          cap={cap}
        />

        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
            {error}
          </div>
        )}

        {/* ── selected models (top) ── */}
        <SelectedSection
          selectedModels={selectedModels}
          onDeselect={toggleModel}
          onClearAll={() => setSelectedIds(new Set())}
        />

        {/* ── provider sections ── */}
        <div className="flex flex-col gap-3">
          {filteredGroups.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-10">검색 결과가 없습니다.</p>
          ) : (
            filteredGroups.map((group) => (
              <ProviderSection
                key={group.provider}
                group={group}
                selectedIds={selectedIds}
                onToggle={toggleModel}
              />
            ))
          )}
        </div>

        <ResultsPanel results={results} loading={loading} selectedCount={selectedModels.length} />
      </main>
    </div>
  )
}
