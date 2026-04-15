import { CheckCircle2, Sparkles } from 'lucide-react'
import type { PromptVariant } from '../hooks/usePromptPlanner'
import type { OpenRouterPrice } from '../hooks/useOpenRouterPricing'

export const OPENROUTER_MODELS = [
  { id: 'google/gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite', desc: '기본 운영', badge: 'Default' },
  { id: 'deepseek/deepseek-v3.2', label: 'DeepSeek V3.2', desc: '가성비 대안', badge: 'Budget' },
  { id: 'anthropic/claude-sonnet-4.6', label: 'Claude Sonnet 4.6', desc: '품질 비교', badge: 'Quality' },
  { id: 'minimax/minimax-m2.5', label: 'MiniMax M2.5', desc: '고성능 대안', badge: 'Alt' },
  { id: 'minimax/minimax-m2.5:free', label: 'MiniMax M2.5 Free', desc: '무료 테스트', badge: 'Free' },
]

interface Props {
  content: string
  onContentChange: (value: string) => void
  selectedModel: string
  onModelChange: (value: string) => void
  prices: Record<string, OpenRouterPrice>
  pricesLoading: boolean
  pricesError: string | null
  lastUpdated: string | null
  onRefreshPrices: () => void
  loading: boolean
  summary: string
  variants: PromptVariant[]
  error: string | null
  onGenerate: () => void
  onApplyPrompt: (prompt: string) => void
}

export default function PromptPlannerPanel({
  content,
  onContentChange,
  selectedModel,
  onModelChange,
  prices,
  pricesLoading,
  pricesError,
  lastUpdated,
  onRefreshPrices,
  loading,
  summary,
  variants,
  error,
  onGenerate,
  onApplyPrompt,
}: Props) {
  function formatPerMillion(value: number) {
    if (value === 0) return '무료'
    return `$${(value * 1_000_000).toFixed(2)}/1M`
  }

  function getBadgeClasses(badge: string, selected: boolean) {
    if (selected) return 'bg-emerald-600 text-white'

    switch (badge) {
      case 'Default':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
      case 'Budget':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
      case 'Quality':
        return 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300'
      case 'Free':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
      default:
        return 'bg-slate-200 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300'
    }
  }

  return (
    <div className="bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-[#2a2d3a] rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">AI 프롬프트 분석</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            내용만 입력하면 OpenRouter가 이미지 프롬프트 후보 3개를 만듭니다.
          </p>
        </div>
        <button
          onClick={onGenerate}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            loading
              ? 'bg-slate-200 dark:bg-[#2a2d3a] text-slate-400 dark:text-slate-500 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          <Sparkles size={15} />
          {loading ? '분석 중...' : '프롬프트 3개 생성'}
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap rounded-xl border border-slate-200 dark:border-[#2a2d3a] bg-slate-50 dark:bg-[#0f1117] px-3 py-2">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          OpenRouter Models API 기준 실시간 가격
          {lastUpdated ? ` · 마지막 갱신 ${lastUpdated}` : ''}
        </div>
        <button
          onClick={onRefreshPrices}
          disabled={pricesLoading}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            pricesLoading
              ? 'bg-slate-200 dark:bg-[#2a2d3a] text-slate-400 dark:text-slate-500 cursor-not-allowed'
              : 'bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white'
          }`}
        >
          {pricesLoading ? '가격 불러오는 중...' : '가격 최신화'}
        </button>
      </div>

      {pricesError && (
        <div className="text-xs text-amber-600 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5">
          {pricesError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        {OPENROUTER_MODELS.map((model) => {
          const isSelected = selectedModel === model.id
          const price = prices[model.id]
          return (
            <button
              key={model.id}
              onClick={() => onModelChange(model.id)}
              className={`text-left rounded-2xl border px-3 py-3 min-h-[148px] flex flex-col transition-all ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-sm shadow-emerald-500/10'
                  : 'border-slate-200 dark:border-[#2a2d3a] bg-slate-50 dark:bg-[#0f1117] hover:border-slate-300 dark:hover:border-[#3a3d4a]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-xs font-semibold leading-snug text-slate-700 dark:text-slate-200">
                  {model.label}
                </div>
                {isSelected && <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />}
              </div>

              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getBadgeClasses(model.badge, isSelected)}`}>
                  {model.badge}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{model.desc}</span>
              </div>

              <div className="mt-auto pt-3 text-[11px] leading-relaxed">
                {price ? (
                  <div className="space-y-1 text-slate-500 dark:text-slate-400">
                    <div>입력 {formatPerMillion(price.input)}</div>
                    <div>출력 {formatPerMillion(price.output)}</div>
                  </div>
                ) : (
                  <div className="text-slate-400 dark:text-slate-500">가격 정보 로딩 전</div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="예: 신제품 런칭 배너용 이미지를 만들고 싶어요. 프리미엄 느낌의 화장품 병이 중앙에 있고, 은은한 조명과 미니멀한 배경, 광고 컷 같은 구도를 원합니다."
        rows={5}
        className="w-full bg-slate-50 dark:bg-[#0f1117] border border-slate-200 dark:border-[#2a2d3a] rounded-xl px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none resize-none focus:border-emerald-500/50 transition-colors"
      />

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
          {error}
        </div>
      )}

      {(summary || variants.length > 0) && (
        <div className="flex flex-col gap-3">
          {summary && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
              <div className="text-xs font-semibold text-emerald-500 mb-1">분석 요약</div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{summary}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {variants.map((variant) => (
              <div
                key={variant.id}
                className="rounded-2xl border border-slate-200 dark:border-[#2a2d3a] bg-slate-50 dark:bg-[#0f1117] p-4 flex flex-col gap-3"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{variant.title}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{variant.focus}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">
                      English Prompt
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {variant.prompt}
                    </p>
                  </div>
                  {variant.promptKo && (
                    <div className="rounded-xl bg-slate-100 dark:bg-[#151925] border border-slate-200 dark:border-[#2a2d3a] px-3 py-2">
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">
                        Korean Guide
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {variant.promptKo}
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onApplyPrompt(variant.prompt)}
                  className="mt-auto rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-3 py-2 transition-colors"
                >
                  이 프롬프트 적용
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
