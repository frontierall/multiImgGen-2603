import { Wand2 } from 'lucide-react'

interface Props {
  prompt: string
  onPromptChange: (v: string) => void
  width: number
  height: number
  steps: number
  onWidthChange: (v: number) => void
  onHeightChange: (v: number) => void
  onStepsChange: (v: number) => void
  selectedCount: number
  loading: boolean
  onGenerate: () => void
  remaining: number
  cap: number
}

const SIZE_PRESETS = [
  { label: '1:1', w: 1024, h: 1024 },
  { label: '16:9', w: 1344, h: 768 },
  { label: '9:16', w: 768, h: 1344 },
  { label: '4:3', w: 1152, h: 896 },
]

const SAMPLE_PROMPTS = [
  {
    label: '🌅 풍경',
    text: 'A breathtaking sunset over misty mountains, golden hour light, cinematic photography, ultra-detailed, 8k resolution',
  },
  {
    label: '🤖 사이버펑크',
    text: 'A futuristic cyberpunk city at night, neon lights reflecting on wet streets, flying cars, ultra-realistic, cinematic',
  },
  {
    label: '🌸 인물',
    text: 'Portrait of a young woman with flowing hair in a flower garden, soft natural light, bokeh background, hyperrealistic',
  },
]

export default function PromptPanel({
  prompt,
  onPromptChange,
  width,
  height,
  steps,
  onWidthChange,
  onHeightChange,
  onStepsChange,
  selectedCount,
  loading,
  onGenerate,
  remaining,
  cap,
}: Props) {
  const isExhausted = remaining === 0
  const willExceed  = selectedCount > remaining
  const barPct      = Math.round(((cap - remaining) / cap) * 100)

  return (
    <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-4 flex flex-col gap-3">
      {/* quota bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-[#0f1117] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isExhausted ? 'bg-red-500' : remaining <= 3 ? 'bg-amber-500' : 'bg-violet-500'
            }`}
            style={{ width: `${barPct}%` }}
          />
        </div>
        <span className={`text-xs font-medium whitespace-nowrap ${
          isExhausted ? 'text-red-400' : remaining <= 3 ? 'text-amber-400' : 'text-slate-400'
        }`}>
          {isExhausted ? '한도 소진' : `잔여 ${remaining} / ${cap}장`}
        </span>
      </div>

      {/* sample prompts */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-500">샘플:</span>
        {SAMPLE_PROMPTS.map((s) => (
          <button
            key={s.label}
            onClick={() => onPromptChange(s.text)}
            className="text-xs px-2.5 py-1 rounded-lg border border-[#2a2d3a] text-slate-400 hover:border-violet-500/50 hover:text-violet-300 hover:bg-violet-500/5 transition-all"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* prompt */}
      <textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="이미지 프롬프트를 입력하세요... (예: a beautiful sunset over mountains, photorealistic)"
        rows={3}
        className="w-full bg-[#0f1117] border border-[#2a2d3a] rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none resize-none focus:border-violet-500/50 transition-colors"
      />

      <div className="flex flex-wrap items-center gap-3">
        {/* size presets */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500">크기</span>
          {SIZE_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                onWidthChange(p.w)
                onHeightChange(p.h)
              }}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                width === p.w && height === p.h
                  ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                  : 'border-[#2a2d3a] text-slate-400 hover:border-slate-500'
              }`}
            >
              {p.label}
            </button>
          ))}
          <span className="text-xs text-slate-600 ml-1">
            {width}×{height}
          </span>
        </div>

        {/* steps */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Steps</span>
          <input
            type="number"
            min={1}
            max={50}
            value={steps}
            onChange={(e) => onStepsChange(Number(e.target.value))}
            className="w-14 bg-[#0f1117] border border-[#2a2d3a] rounded-lg px-2 py-1 text-xs text-slate-300 outline-none focus:border-violet-500/50 text-center"
          />
        </div>

        {/* generate button */}
        <div className="ml-auto flex flex-col items-end gap-1">
          {willExceed && !isExhausted && (
            <p className="text-xs text-amber-400">
              {selectedCount}개 선택, 잔여 {remaining}장 — {remaining}개 모델까지만 생성됩니다
            </p>
          )}
          <button
            onClick={onGenerate}
            disabled={loading || selectedCount === 0}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              loading || selectedCount === 0
                ? 'bg-[#2a2d3a] text-slate-600 cursor-not-allowed'
                : isExhausted
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20'
            }`}
          >
            <Wand2 size={15} />
            {loading
              ? '생성 중...'
              : isExhausted
              ? '🔒 한도 소진 — 암호로 충전'
              : selectedCount === 0
              ? '모델 선택 필요'
              : `${Math.min(selectedCount, remaining)}개 모델로 생성`}
          </button>
        </div>
      </div>
    </div>
  )
}
