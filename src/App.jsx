import { useEffect, useMemo, useState } from 'react'
import metrics from './data/engineeringMetrics.json'
import { messages, makeFormatters } from './i18n'
import DegreesChart from './components/DegreesChart'
import RetentionChart from './components/RetentionChart'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function LangToggle({ lang, setLang, label }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex overflow-hidden rounded-lg border border-white/40"
    >
      {['en', 'fr'].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`px-3.5 py-1.5 text-sm font-bold tracking-wide transition-colors ${
            lang === code
              ? 'bg-white text-garnet'
              : 'bg-transparent text-white/85 hover:bg-white/10'
          }`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

function StatTile({ label, value, delta, deltaTone, hero }) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-5 shadow-sm">
      <p className="text-xs font-semibold tracking-[0.08em] text-ink-3 uppercase">{label}</p>
      <p
        className={`font-expanded mt-2 font-extrabold break-words text-ink ${
          hero ? 'text-5xl' : 'text-3xl'
        }`}
      >
        {value}
      </p>
      {delta && (
        <p className="mt-1.5 text-sm font-medium">
          <span className={deltaTone === 'down' ? 'text-down' : 'text-up'}>{delta[0]}</span>{' '}
          <span className="text-ink-3">{delta[1]}</span>
        </p>
      )}
    </div>
  )
}

function ChartCard({ title, context, children }) {
  return (
    <section className="rounded-xl border border-hairline bg-card p-6 shadow-sm sm:p-7">
      <h2 className="font-expanded text-xl font-extrabold text-ink">{title}</h2>
      <p className="mt-1.5 mb-6 max-w-prose text-sm text-ink-2">{context}</p>
      {children}
    </section>
  )
}

export default function App() {
  const [lang, setLang] = useState('en')
  const t = messages[lang]
  const fmt = useMemo(() => makeFormatters(lang), [lang])
  const reducedMotion = prefersReducedMotion()

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const stats = useMemo(() => {
    const degrees = metrics.degreesConferred
    const programs = Object.keys(degrees[0]).filter((k) => k !== 'year')
    const total = (row) => programs.reduce((sum, k) => sum + row[k], 0)
    const first = degrees[0]
    const last = degrees[degrees.length - 1]
    const retention = metrics.retentionRates
    return {
      total2024: total(last),
      totalGrowthPct: Math.round(((total(last) - total(first)) / total(first)) * 100),
      csGrowthPct: Math.round(
        ((last.ComputerScience - first.ComputerScience) / first.ComputerScience) * 100,
      ),
      intlLatest: retention[retention.length - 1].International,
      intlDeltaPts: retention[retention.length - 1].International - retention[0].International,
    }
  }, [])

  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      <a
        href="#charts"
        className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:m-3 focus:rounded focus:bg-card focus:px-3 focus:py-2"
      >
        {lang === 'fr' ? 'Passer aux graphiques' : 'Skip to charts'}
      </a>

      <header className="border-b-4 border-ink-3/40 bg-garnet text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-x-8 gap-y-5 px-5 pt-9 pb-7 sm:px-8">
          <div>
            <p className="text-[13px] font-semibold tracking-[0.14em] text-white/80 uppercase">
              {t.eyebrow}
            </p>
            <h1 className="font-expanded mt-2 text-4xl font-black tracking-tight text-balance sm:text-5xl">
              {t.title}
            </h1>
            <p className="mt-3 max-w-xl text-[15px] text-white/85">{t.tagline}</p>
          </div>
          <LangToggle lang={lang} setLang={setLang} label={t.langLabel} />
        </div>
      </header>

      <main id="charts" className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatTile
            hero
            label={t.stats.totalLabel}
            value={fmt.number(stats.total2024)}
            delta={[fmt.signedPercent(stats.totalGrowthPct), t.stats.totalDelta]}
          />
          <StatTile
            label={t.stats.growthLabel}
            value={t.stats.growthValue}
            delta={[fmt.signedPercent(stats.csGrowthPct), t.stats.growthDelta]}
          />
          <StatTile
            label={t.stats.retentionLabel}
            value={fmt.percent(stats.intlLatest)}
            deltaTone="down"
            delta={[fmt.signedNumber(stats.intlDeltaPts), t.stats.retentionDelta]}
          />
        </div>

        <div className="mt-6 grid gap-6">
          <ChartCard title={t.degrees.title} context={t.degrees.context}>
            <DegreesChart
              data={metrics.degreesConferred}
              t={t}
              fmt={fmt}
              reducedMotion={reducedMotion}
            />
          </ChartCard>

          <ChartCard title={t.retention.title} context={t.retention.context}>
            <RetentionChart
              data={metrics.retentionRates}
              t={t}
              fmt={fmt}
              reducedMotion={reducedMotion}
            />
          </ChartCard>
        </div>
      </main>

      <footer className="mx-auto max-w-6xl px-5 pb-10 sm:px-8">
        <p className="border-t border-hairline pt-4 text-xs text-ink-3">{t.footer}</p>
      </footer>
    </div>
  )
}
