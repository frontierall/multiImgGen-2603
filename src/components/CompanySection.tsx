import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { CompanyGroup, ImageModel } from '../data/imageModels'
import { PROVIDER_LABELS } from '../data/imageModels'
import ModelCard from './ModelCard'

interface Props {
  group: CompanyGroup
  selectedIds: Set<string>
  onToggle: (id: string) => void
}

export default function CompanySection({ group, selectedIds, onToggle }: Props) {
  const [open, setOpen] = useState(true)
  const selectedCount = group.models.filter((m) => selectedIds.has(m.id)).length

  return (
    <div className="border border-[#2a2d3a] rounded-2xl overflow-hidden">
      {/* header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-[#14161f] hover:bg-[#1a1d27] transition-colors"
      >
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform ${open ? '' : '-rotate-90'}`}
        />
        <span
          className="text-sm font-semibold px-2.5 py-0.5 rounded-full"
          style={{ backgroundColor: group.color + '33', color: group.color }}
        >
          {group.company}
        </span>
        <span className="text-xs text-slate-500 font-mono">{PROVIDER_LABELS[group.provider]}</span>

        {selectedCount > 0 && (
          <span className="ml-auto flex items-center gap-1 text-xs font-medium text-violet-400 bg-violet-500/15 px-2.5 py-0.5 rounded-full">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {selectedCount}개 선택
          </span>
        )}
      </button>

      {/* model grid */}
      {open && (
        <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 bg-[#0f1117]">
          {group.models.map((model: ImageModel) => (
            <ModelCard
              key={model.id}
              model={model}
              selected={selectedIds.has(model.id)}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}
