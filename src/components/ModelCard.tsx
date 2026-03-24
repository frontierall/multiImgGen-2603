import type { ImageModel } from '../data/imageModels'

interface Props {
  model: ImageModel
  selected: boolean
  onToggle: (id: string) => void
}

export default function ModelCard({ model, selected, onToggle }: Props) {
  return (
    <button
      onClick={() => onToggle(model.id)}
      className={`
        relative flex flex-col gap-1 p-3 rounded-xl border text-left transition-all
        ${
          selected
            ? 'border-violet-500 bg-violet-500/10 shadow-[0_0_0_1px_rgba(139,92,246,0.5)]'
            : 'border-[#2a2d3a] bg-[#1a1d27] hover:border-[#3a3d4a] hover:bg-[#1e2130]'
        }
      `}
    >
      {/* checkbox */}
      <div
        className={`
          absolute top-2.5 left-2.5 w-4 h-4 rounded flex items-center justify-center border
          ${selected ? 'bg-violet-500 border-violet-500' : 'border-[#3a3d4a] bg-transparent'}
        `}
      >
        {selected && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      <span className="pl-6 pr-2 text-sm font-medium text-slate-100 leading-tight flex items-start gap-1.5 flex-wrap">
        {model.name}
        {model.isNew && (
          <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium self-center">
            NEW
          </span>
        )}
      </span>
      <span className={`pl-6 text-xs font-semibold ${selected ? 'text-violet-400' : 'text-slate-400'}`}>
        ${model.pricePerImage.toFixed(3)}
      </span>
    </button>
  )
}
