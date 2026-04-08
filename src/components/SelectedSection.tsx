import type { ImageModel } from '../data/imageModels'

interface Props {
  selectedModels: ImageModel[]
  onDeselect: (id: string) => void
  onClearAll: () => void
}

export default function SelectedSection({ selectedModels, onDeselect, onClearAll }: Props) {
  if (selectedModels.length === 0) return null

  return (
    <div className="border border-violet-500/30 bg-violet-500/5 rounded-2xl overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-violet-500/20">
        <span className="text-xs font-semibold text-violet-300">
          선택된 모델
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/25 text-violet-300 font-medium">
          {selectedModels.length}개
        </span>
        <button
          onClick={onClearAll}
          className="ml-auto text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          전체 해제
        </button>
      </div>

      {/* selected cards — horizontal scroll on small screens, wrap on large */}
      <div className="p-3 flex flex-wrap gap-2">
        {selectedModels.map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl bg-violet-500/15 border border-violet-500/30 text-sm"
          >
            <span className="text-slate-700 dark:text-slate-200 font-medium text-xs">{m.name}</span>
            <span className="text-violet-400 text-xs font-semibold">${m.pricePerImage.toFixed(3)}</span>
            <button
              onClick={() => onDeselect(m.id)}
              className="w-4 h-4 rounded-full bg-violet-500/20 hover:bg-violet-500/50 flex items-center justify-center text-slate-400 hover:text-white transition-all"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 1L7 7M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
