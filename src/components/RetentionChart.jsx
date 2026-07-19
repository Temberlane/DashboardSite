import { useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from 'recharts'

const GROUP_ORDER = ['Female', 'Male', 'International', 'Domestic']
const BAR_GARNET = '#8f001a'
const BAR_GREY = '#8d8983'

function RetentionTooltip({ active, payload, fmt, cohortName }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-hairline bg-card px-3.5 py-2.5 shadow-lg shadow-ink/10">
      <p className="mb-1.5 text-xs font-semibold tracking-wide text-ink-3">
        {payload[0].payload.label}
      </p>
      <ul className="space-y-1">
        {payload.map((row) => (
          <li key={row.dataKey} className="flex items-center gap-2 text-sm">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-[3px]"
              style={{ backgroundColor: row.fill }}
            />
            <span className="font-semibold tabular-nums text-ink">{fmt.percent(row.value)}</span>
            <span className="text-ink-2">{cohortName(row.name)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CohortSelect({ id, label, value, onChange, options }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-xs font-semibold tracking-[0.08em] text-ink-3 uppercase">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          className="cursor-pointer appearance-none rounded-lg border border-hairline bg-card py-1.5 pr-8 pl-3 text-sm font-medium text-ink shadow-sm transition-colors hover:border-ink-3"
        >
          {options}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className="pointer-events-none absolute top-1/2 right-2.5 h-3 w-3 -translate-y-1/2 text-ink-3"
        >
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  )
}

export default function RetentionChart({ data, t, fmt, reducedMotion }) {
  const cohorts = data.map((d) => d.cohort)
  const [cohort, setCohort] = useState(cohorts[cohorts.length - 1])
  const [compare, setCompare] = useState('none')

  const compareYear = compare === 'none' ? null : Number(compare)
  const cohortName = (year) => `${t.retention.cohortPrefix} ${year}`

  // One Bar per selected cohort, oldest on the left. Recharts keeps bars in the
  // order they first mounted, so the Bars use fixed role keys (left/right) and
  // the cohorts are assigned to roles chronologically instead of reordering Bars.
  const series = useMemo(() => {
    const picked = [{ year: cohort, fill: BAR_GARNET }]
    if (compareYear !== null && compareYear !== cohort) {
      picked.push({ year: compareYear, fill: BAR_GREY })
    }
    picked.sort((a, b) => a.year - b.year)
    return picked.map((s, i) => ({ ...s, role: i === 0 ? 'left' : 'right' }))
  }, [cohort, compareYear])

  const chartData = useMemo(
    () =>
      GROUP_ORDER.map((key) => {
        const row = { key, label: t.groups[key] }
        for (const s of series) {
          row[s.role] = data.find((d) => d.cohort === s.year)[key]
        }
        return row
      }),
    [data, series, t],
  )

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <CohortSelect
          id="cohort-select"
          label={t.retention.cohortLabel}
          value={cohort}
          onChange={(e) => {
            const year = Number(e.target.value)
            setCohort(year)
            if (year === compareYear) setCompare('none')
          }}
          options={cohorts.map((c) => (
            <option key={c} value={c}>
              {cohortName(c)}
            </option>
          ))}
        />
        <CohortSelect
          id="compare-select"
          label={t.retention.compareLabel}
          value={compare}
          onChange={(e) => setCompare(e.target.value)}
          options={[
            <option key="none" value="none">
              {t.retention.compareNone}
            </option>,
            ...cohorts
              .filter((c) => c !== cohort)
              .map((c) => (
                <option key={c} value={c}>
                  {cohortName(c)}
                </option>
              )),
          ]}
        />
      </div>

      {series.length > 1 && (
        <ul className="mb-3 flex items-center gap-4">
          {series.map((s) => (
            <li key={s.year} className="flex items-center gap-1.5 text-xs font-medium text-ink-2">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-[3px]"
                style={{ backgroundColor: s.fill }}
              />
              {cohortName(s.year)}
            </li>
          ))}
        </ul>
      )}

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barGap={2}
            margin={{ top: 20, right: 8, bottom: 0, left: 0 }}
          >
            <CartesianGrid vertical={false} stroke="#e6e3de" strokeWidth={1} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: '#c9c5be', strokeWidth: 1 }}
              tick={{ fill: '#59544f', fontSize: 12 }}
              tickMargin={8}
              interval={0}
            />
            <YAxis
              width={44}
              domain={[70, 100]}
              ticks={[70, 75, 80, 85, 90, 95, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#8d8983', fontSize: 12 }}
              tickFormatter={(v) => fmt.percent(v)}
            />
            <Tooltip
              cursor={{ fill: 'rgba(143, 0, 26, 0.05)' }}
              content={<RetentionTooltip fmt={fmt} cohortName={cohortName} />}
            />
            {series.map((s) => (
              <Bar
                key={s.role}
                dataKey={s.role}
                name={s.year}
                fill={s.fill}
                barSize={series.length > 1 ? 18 : 24}
                radius={[4, 4, 0, 0]}
                isAnimationActive={!reducedMotion}
                animationDuration={500}
                animationEasing="ease-out"
              >
                {series.length === 1 && (
                  <LabelList
                    dataKey={s.role}
                    position="top"
                    formatter={(v) => fmt.percent(v)}
                    style={{ fill: '#1c1a1a', fontSize: 12, fontWeight: 600 }}
                  />
                )}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <details className="mt-4 border-t border-hairline pt-3">
        <summary className="cursor-pointer text-sm font-medium text-ink-2 hover:text-ink">
          {t.retention.tableToggle}
        </summary>
        <table className="mt-3 w-full text-sm">
          <caption className="sr-only">{t.retention.tableCaption}</caption>
          <thead>
            <tr className="border-b border-hairline text-left text-xs text-ink-3">
              <th scope="col" className="py-1.5 pr-2 font-semibold">
                {t.retention.cohortHeader}
              </th>
              {GROUP_ORDER.map((key) => (
                <th scope="col" key={key} className="py-1.5 pr-2 text-right font-semibold">
                  {t.groups[key]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.cohort}
                className={`border-b border-hairline/60 ${
                  series.some((s) => s.year === row.cohort) ? 'bg-garnet/[0.04]' : ''
                }`}
              >
                <th scope="row" className="py-1.5 pr-2 text-left font-medium text-ink-2">
                  {row.cohort}
                </th>
                {GROUP_ORDER.map((key) => (
                  <td key={key} className="py-1.5 pr-2 text-right tabular-nums text-ink">
                    {fmt.percent(row[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  )
}
