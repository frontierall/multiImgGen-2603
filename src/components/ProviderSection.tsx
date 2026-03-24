import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { ProviderGroup } from '../data/imageModels'
import { COMPANY_COLORS } from '../data/imageModels'
import ModelCard from './ModelCard'

interface Props {
  group: ProviderGroup
  selectedIds: Set<string>
  onToggle: (id: string) => void
}

export default function ProviderSection({ group, selectedIds, onToggle }: Props) {
  const [open, setOpen] = useState(true)

  const totalSelected = group.companies
    .flatMap((c) => c.models)
    .filter((m) => selectedIds.has(m.id)).length

  // single-company providers (OpenAI, Google) don't need company sub-labels
  const showCompanyLabel = group.companies.length > 1

  return (
    <div className="border border-[#2a2d3a] rounded-2xl overflow-hidden">
      {/* section header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-[#14161f] hover:bg-[#1a1d27] transition-colors"
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
        <span className="text-xs text-slate-500 font-mono">{group.apiKeyLabel}</span>

        {totalSelected > 0 && (
          <span className="ml-auto flex items-center gap-1 text-xs font-medium text-violet-400 bg-violet-500/15 px-2.5 py-0.5 rounded-full">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {totalSelected}개 선택
          </span>
        )}
      </button>

      {/* model grid */}
      {open && (
        <div className="bg-[#0f1117] px-3 pb-3">
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
                  <div className="flex-1 h-px bg-[#2a2d3a]" />
                </div>
              )}
              {!showCompanyLabel && <div className="pt-3" />}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {company.models.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    selected={selectedIds.has(model.id)}
                    onToggle={onToggle}
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
