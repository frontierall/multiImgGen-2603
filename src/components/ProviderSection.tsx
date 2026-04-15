import { useState } from 'react'
import { ChevronDown, RefreshCw } from 'lucide-react'
import type { ProviderGroup } from '../data/imageModels'
import { COMPANY_COLORS } from '../data/imageModels'
import type { TogetherPriceMap } from '../hooks/useTogetherPricing'
import ModelCard from './ModelCard'

interface Props {
  group: ProviderGroup
  selectedIds: Set<string>
  onToggle: (id: string) => void
  togetherPrices?: TogetherPriceMap
  togetherPricesLoading?: boolean
  togetherPricesError?: string | null
  togetherPricesLastUpdated?: string | null
  onRefreshTogetherPrices?: () => void
}

export default function ProviderSection({
  group,
  selectedIds,
  onToggle,
  togetherPrices,
  togetherPricesLoading,
  togetherPricesError,
  togetherPricesLastUpdated,
  onRefreshTogetherPrices,
}: Props) {
  const [open, setOpen] = useState(true)

  const totalSelected = group.companies
    .flatMap((c) => c.models)
    .filter((m) => selectedIds.has(m.id)).length

  const showCompanyLabel = group.companies.length > 1

  return (
    <div className="border border-slate-200 dark:border-[#2a2d3a] rounded-2xl overflow-hidden">
      {/* section header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-slate-100 dark:bg-[#14161f] hover:bg-slate-200 dark:hover:bg-[#1a1d27] transition-colors"
      >
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform shrink-0 ${open ? '' : '-rotate-90'}`}
        />
        <span
          className="text-sm font-bold px-3 py-0.5 rounded-full"
          style={{ backgroundColor: group.color + '28', color: group.color }}
        >
          {group.label}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{group.apiKeyLabel}</span>

        {group.provider === 'together' && onRefreshTogetherPrices && (
          <div className="ml-auto flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {togetherPricesError && (
              <span className="text-xs text-red-400 max-w-[160px] truncate" title={togetherPricesError}>
                {togetherPricesError}
              </span>
            )}
            {togetherPricesLastUpdated && !togetherPricesError && (
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {togetherPricesLastUpdated}
              </span>
            )}
            <button
              onClick={onRefreshTogetherPrices}
              disabled={togetherPricesLoading}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-[#2a2d3a] hover:bg-slate-300 dark:hover:bg-[#353849] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
              title="Together AI 가격 최신화"
            >
              <RefreshCw size={11} className={togetherPricesLoading ? 'animate-spin' : ''} />
              가격 갱신
            </button>
          </div>
        )}

        {totalSelected > 0 && (
          <span className={`${group.provider === 'together' && onRefreshTogetherPrices ? '' : 'ml-auto'} flex items-center gap-1 text-xs font-medium text-violet-400 bg-violet-500/15 px-2.5 py-0.5 rounded-full`}>
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {totalSelected}개 선택
          </span>
        )}
      </button>

      {/* model grid */}
      {open && (
        <div className="bg-slate-50 dark:bg-[#0f1117] px-3 pb-3">
          {group.companies.map((company) => (
            <div key={company.name}>
              {showCompanyLabel && (
                <div className="flex items-center gap-2 pt-3 pb-1.5">
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                    style={{
                      color: COMPANY_COLORS[company.name] ?? '#94a3b8',
                      backgroundColor: (COMPANY_COLORS[company.name] ?? '#94a3b8') + '20',
                    }}
                  >
                    {company.name}
                  </span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-[#2a2d3a]" />
                </div>
              )}
              {!showCompanyLabel && <div className="pt-3" />}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {company.models.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    selected={selectedIds.has(model.id)}
                    onToggle={onToggle}
                    overridePrice={togetherPrices?.[model.modelId]}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
