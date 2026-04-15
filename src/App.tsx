import { useState, useMemo, useEffect } from 'react'
import { Search, Sun, Moon } from 'lucide-react'
import { COMPANY_COLORS, IMAGE_MODELS, groupByProvider } from './data/imageModels'
import ApiKeyInput from './components/ApiKeyInput'
import ProviderSection from './components/ProviderSection'
import SelectedSection from './components/SelectedSection'
import PromptPanel from './components/PromptPanel'
import PromptPlannerPanel from './components/PromptPlannerPanel'
import ResultsPanel from './components/ResultsPanel'
import { useImageGen, type ApiKeys, type HistoryEntry } from './hooks/useImageGen'
import { useOpenRouterPricing } from './hooks/useOpenRouterPricing'
import { useTogetherPricing } from './hooks/useTogetherPricing'
import { usePromptPlanner } from './hooks/usePromptPlanner'
import { useQuota } from './hooks/useQuota'
import { loadHistoryEntries, saveHistoryEntries } from './utils/historyDb'
import PasscodeModal from './components/PasscodeModal'
import AppGateModal, { isGateUnlocked } from './components/AppGateModal'

type SortMode = 'default' | 'price'

// sessionStorage: cleared automatically when browser tab/window closes
function loadApiKeys(): ApiKeys {
  return {
    together: sessionStorage.getItem('key_together') ?? '',
    openai:   sessionStorage.getItem('key_openai')   ?? '',
    openrouter: sessionStorage.getItem('key_openrouter') ?? '',
  }
}

export default function App() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(loadApiKeys)
  const [search, setSearch]   = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('price')
  const [companyFilter, setCompanyFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const [prompt, setPrompt]   = useState('')
  const [negPrompt, setNegPrompt] = useState('')
  const [sourceContent, setSourceContent] = useState('')
  const [width, setWidth]     = useState(1024)
  const [height, setHeight]   = useState(1024)
  const [steps, setSteps]     = useState(4)
  const [openrouterModel, setOpenrouterModel] = useState('google/gemini-2.5-flash-lite')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [historyReady, setHistoryReady] = useState(false)

  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') !== 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    let cancelled = false

    loadHistoryEntries()
      .then((entries) => {
        if (!cancelled) setHistory(entries)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setHistoryReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!historyReady) return
    saveHistoryEntries(history).catch(() => {})
  }, [history, historyReady])

  const { loading, results, error, generateAll }          = useImageGen(apiKeys)
  const {
    loading: planning,
    summary: planningSummary,
    variants: promptVariants,
    error: planningError,
    generate: generatePromptVariants,
  } = usePromptPlanner()
  const {
    prices: openrouterPrices,
    loading: pricesLoading,
    error: pricesError,
    lastUpdated,
    refresh: refreshPrices,
  } = useOpenRouterPricing()
  const {
    prices: togetherPrices,
    loading: togetherPricesLoading,
    error: togetherPricesError,
    lastUpdated: togetherPricesLastUpdated,
    refresh: refreshTogetherPrices,
  } = useTogetherPricing()
  const { remaining, isExhausted, cap, ADD_AMOUNT, consume, tryUnlock } = useQuota()
  const [showPasscode, setShowPasscode] = useState(false)
  const [gateOpen, setGateOpen] = useState(isGateUnlocked)

  function handleApiKeysChange(keys: ApiKeys) {
    setApiKeys(keys)
    sessionStorage.setItem('key_together', keys.together)
    sessionStorage.setItem('key_openai',   keys.openai)
    sessionStorage.setItem('key_openrouter', keys.openrouter)
  }

  function toggleModel(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const companyFilters = useMemo(
    () => ['all', ...Array.from(new Set(IMAGE_MODELS.map((model) => model.author)))],
    [],
  )

  const filteredGroups = useMemo(() => {
    const q = search.toLowerCase()
    let models = IMAGE_MODELS.filter(
      (m) =>
        (m.name.toLowerCase().includes(q) || m.author.toLowerCase().includes(q)) &&
        (companyFilter === 'all' || m.author === companyFilter),
    )
    if (sortMode === 'price') {
      models = [...models].sort((a, b) => a.pricePerImage - b.pricePerImage)
    }
    return groupByProvider(models)
  }, [search, sortMode, companyFilter])

  const selectedModels = IMAGE_MODELS.filter((m) => selectedIds.has(m.id))
  const showNegPrompt  = selectedModels.some((m) => m.supportsNegative)

  async function handleGenerate() {
    if (isExhausted) { setShowPasscode(true); return }
    const capped = selectedModels.slice(0, remaining)
    if (!consume(capped.length)) return
    const finalResults = await generateAll(
      capped.map((m) => ({ modelId: m.modelId, name: m.name, provider: m.provider, noSteps: m.noSteps, supportsNegative: m.supportsNegative })),
      prompt, negPrompt, width, height, steps,
    )
    if (finalResults.length > 0) {
      setHistory((prev) => [
        { id: Date.now(), prompt, negPrompt, results: finalResults },
        ...prev,
      ].slice(0, 7))
    }
  }

  function handleAnalyzePrompts() {
    generatePromptVariants(sourceContent, apiKeys.openrouter, openrouterModel)
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
        <PromptPlannerPanel
          content={sourceContent}
          onContentChange={setSourceContent}
          selectedModel={openrouterModel}
          onModelChange={setOpenrouterModel}
          prices={openrouterPrices}
          pricesLoading={pricesLoading}
          pricesError={pricesError}
          lastUpdated={lastUpdated}
          onRefreshPrices={refreshPrices}
          loading={planning}
          summary={planningSummary}
          variants={promptVariants}
          error={planningError}
          onGenerate={handleAnalyzePrompts}
          onApplyPrompt={setPrompt}
        />

        {/* prompt panel */}
        <PromptPanel
          prompt={prompt}
          onPromptChange={setPrompt}
          negPrompt={negPrompt}
          onNegPromptChange={setNegPrompt}
          showNegPrompt={showNegPrompt}
          width={width}
          height={height}
          steps={steps}
          onWidthChange={setWidth}
          onHeightChange={setHeight}
          onStepsChange={setSteps}
          selectedCount={selectedModels.length}
          loading={loading || planning}
          onGenerate={handleGenerate}
          remaining={remaining}
          cap={cap}
        />

        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
            {error}
          </div>
        )}

        <ResultsPanel results={results} loading={loading} selectedCount={selectedModels.length} history={history} />

        {/* ── selected models (top) ── */}
        <SelectedSection
          selectedModels={selectedModels}
          onDeselect={toggleModel}
          onClearAll={() => setSelectedIds(new Set())}
        />

        <div className="bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-[#2a2d3a] rounded-2xl p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">모델 선택</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                회사 필터와 가격 정렬로 빠르게 모델을 고를 수 있습니다.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 dark:text-slate-500">정렬</span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0f1117] border border-slate-200 dark:border-[#2a2d3a] rounded-xl p-1">
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
                    {mode === 'default' ? '기본순' : '가격순'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {companyFilters.map((company) => {
              const isSelected = companyFilter === company
              const isAll = company === 'all'
              const color = isAll ? '#64748b' : (COMPANY_COLORS[company] ?? '#64748b')

              return (
                <button
                  key={company}
                  onClick={() => setCompanyFilter(company)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors ${
                    isSelected
                      ? 'text-white border-transparent'
                      : 'border-slate-200 dark:border-[#2a2d3a] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#0f1117]'
                  }`}
                  style={isSelected ? { backgroundColor: color } : undefined}
                >
                  {isAll ? '전체' : company}
                </button>
              )
            })}
          </div>

          <div className="text-xs text-slate-400 dark:text-slate-500">
            {companyFilter === 'all'
              ? `전체 회사 ${filteredGroups.reduce((acc, group) => acc + group.companies.length, 0)}개`
              : `${companyFilter} 필터 적용`}
          </div>

          {filteredGroups.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-10">검색 결과가 없습니다.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredGroups.map((group) => (
                <ProviderSection
                  key={group.provider}
                  group={group}
                  selectedIds={selectedIds}
                  onToggle={toggleModel}
                  togetherPrices={togetherPrices}
                  togetherPricesLoading={togetherPricesLoading}
                  togetherPricesError={togetherPricesError}
                  togetherPricesLastUpdated={togetherPricesLastUpdated}
                  onRefreshTogetherPrices={() => refreshTogetherPrices(apiKeys.together)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
