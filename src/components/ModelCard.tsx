import { COMPANY_COLORS } from '../data/imageModels'
import type { ImageModel } from '../data/imageModels'

interface Props {
  model: ImageModel
  selected: boolean
  onToggle: (id: string) => void
  overridePrice?: number
}

export default function ModelCard({ model, selected, onToggle, overridePrice }: Props) {
  const displayPrice = overridePrice ?? model.pricePerImage
  const priceChanged = overridePrice !== undefined && overridePrice !== model.pricePerImage
  return (
    <button
      onClick={() => onToggle(model.id)}
      className={`
        relative flex flex-col gap-1 p-3 rounded-xl border text-left transition-all
        ${
          selected
            ? 'border-violet-500 bg-violet-500/10 shadow-[0_0_0_1px_rgba(139,92,246,0.5)]'
            : 'border-slate-200 dark:border-[#2a2d3a] bg-white dark:bg-[#1a1d27] hover:border-slate-300 dark:hover:border-[#3a3d4a] hover:bg-slate-50 dark:hover:bg-[#1e2130]'
        }
      `}
    >
      {/* checkbox */}
      <div
        className={`
          absolute top-2.5 left-2.5 w-4 h-4 rounded flex items-center justify-center border
          ${selected ? 'bg-violet-500 border-violet-500' : 'border-slate-300 dark:border-[#3a3d4a] bg-transparent'}
        `}
      >
        {selected && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      <span className="pl-6 pr-2 text-sm font-medium text-slate-800 dark:text-slate-100 leading-tight flex items-start gap-1.5 flex-wrap">
        {model.name}
        {model.isNew && (
          <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium self-center">
            NEW
          </span>
        )}
      </span>
      <div className="pl-6 pr-2">
        <span
          className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{
            color: COMPANY_COLORS[model.author] ?? '#94a3b8',
            backgroundColor: (COMPANY_COLORS[model.author] ?? '#94a3b8') + '20',
          }}
        >
          {model.author}
        </span>
      </div>
      <span className={`pl-6 text-xs font-semibold flex items-center gap-1 flex-wrap ${selected ? 'text-violet-400' : 'text-slate-500 dark:text-slate-400'}`}>
        ${displayPrice.toFixed(3)}
        {priceChanged && (
          <span className={`text-[9px] px-1 py-0.5 rounded font-medium ${
            overridePrice! > model.pricePerImage
              ? 'bg-red-500/15 text-red-400'
              : 'bg-emerald-500/15 text-emerald-400'
          }`}>
            {overridePrice! > model.pricePerImage ? '↑' : '↓'} ${model.pricePerImage.toFixed(3)}
          </span>
        )}
      </span>
    </button>
  )
}
