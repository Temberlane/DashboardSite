import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// Colour-blind-safe palette; adjacent series stay distinguishable
// only in this order, so keep it fixed.
const PROGRAM_ORDER = [
  'ComputerScience',
  'Electrical',
  'Mechanical',
  'Civil',
  'Chemical',
]

const PROGRAM_COLORS = {
  ComputerScience: '#b3122f',
  Electrical: '#2a78d6',
  Mechanical: '#eda100',
  Civil: '#008300',
  Chemical: '#4a3aa7',
}

function DegreesTooltip({ active, payload, label, t, fmt }) {
  if (!active || !payload?.length) return null
  const rows = [...payload].sort((a, b) => b.value - a.value)
  return (
    <div className="rounded-lg border border-hairline bg-card px-3.5 py-2.5 shadow-lg shadow-ink/10">
      <p className="mb-1.5 text-xs font-semibold tracking-wide text-ink-3">{label}</p>
      <ul className="space-y-1">
        {rows.map((row) => (
          <li key={row.dataKey} className="flex items-center gap-2 text-sm">
            <span
              aria-hidden="true"
              className="h-0.5 w-4 rounded-full"
              style={{ backgroundColor: PROGRAM_COLORS[row.dataKey] }}
            />
            <span className="font-semibold tabular-nums text-ink">
              {fmt.number(row.value)}
            </span>
            <span className="text-ink-2">{t.programs[row.dataKey]}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function DegreesChart({ data, t, fmt, reducedMotion }) {
  const [visible, setVisible] = useState(() => new Set(PROGRAM_ORDER))

  const toggle = (key) => {
    setVisible((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div>
      <fieldset className="mb-5">
        <legend className="mb-2 text-xs font-semibold tracking-[0.08em] text-ink-3 uppercase">
          {t.degrees.controlsLabel}
        </legend>
        <div className="flex flex-wrap gap-2">
          {PROGRAM_ORDER.map((key) => {
            const on = visible.has(key)
            return (
              <label
                key={key}
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition duration-150 select-none hover:shadow-md hover:shadow-ink/10 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 active:shadow-none has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-garnet-bright ${
                  on
                    ? 'border-transparent bg-ink/[0.05] text-ink'
                    : 'border-hairline bg-transparent text-ink-3 hover:text-ink-2'
                }`}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(key)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full border-2 transition-colors"
                  style={{
                    borderColor: PROGRAM_COLORS[key],
                    backgroundColor: on ? PROGRAM_COLORS[key] : 'transparent',
                  }}
                />
                {t.programs[key]}
              </label>
            )
          })}
        </div>
      </fieldset>

      {visible.size === 0 ? (
        <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-hairline text-sm text-ink-3">
          {t.degrees.empty}
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="#e6e3de" strokeWidth={1} />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={{ stroke: '#c9c5be', strokeWidth: 1 }}
                tick={{ fill: '#8d8983', fontSize: 12 }}
                tickMargin={8}
              />
              <YAxis
                width={44}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#8d8983', fontSize: 12 }}
                tickFormatter={(v) => fmt.number(v)}
                label={{
                  value: t.degrees.yAxis,
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#8d8983', fontSize: 12 },
                }}
              />
              <Tooltip
                cursor={{ stroke: '#c9c5be', strokeWidth: 1 }}
                content={<DegreesTooltip t={t} fmt={fmt} />}
              />
              {PROGRAM_ORDER.filter((key) => visible.has(key)).map((key) => (
                <Line
                  key={key}
                  dataKey={key}
                  name={t.programs[key]}
                  stroke={PROGRAM_COLORS[key]}
                  strokeWidth={2}
                  strokeLinecap="round"
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                  isAnimationActive={!reducedMotion}
                  animationDuration={450}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <details className="mt-4 border-t border-hairline pt-3">
        <summary className="cursor-pointer text-sm font-medium text-ink-2 hover:text-ink">
          {t.degrees.tableToggle}
        </summary>
        <table className="mt-3 w-full text-sm">
          <caption className="sr-only">{t.degrees.tableCaption}</caption>
          <thead>
            <tr className="border-b border-hairline text-left text-xs text-ink-3">
              <th scope="col" className="py-1.5 pr-2 font-semibold">
                {t.degrees.yearHeader}
              </th>
              {PROGRAM_ORDER.map((key) => (
                <th scope="col" key={key} className="py-1.5 pr-2 text-right font-semibold">
                  {t.programs[key]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.year} className="border-b border-hairline/60">
                <th scope="row" className="py-1.5 pr-2 text-left font-medium text-ink-2">
                  {row.year}
                </th>
                {PROGRAM_ORDER.map((key) => (
                  <td key={key} className="py-1.5 pr-2 text-right tabular-nums text-ink">
                    {fmt.number(row[key])}
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
