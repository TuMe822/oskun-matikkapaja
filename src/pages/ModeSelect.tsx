import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ChoiceGroup } from '../components/ChoiceGroup'
import { format } from '../i18n/format'
import { useI18n } from '../i18n/context'
import { COUNTS, MODE_IDS, MODES, TABLES, TIMES, type ModeId } from '../modes'
import { Icon } from '../components/Icon'

export function ModeSelect() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [mode, setMode] = useState<ModeId>('practice')
  const [table, setTable] = useState<number>(TABLES[0])
  const [count, setCount] = useState<number>(COUNTS[0])
  const [time, setTime] = useState<number>(TIMES[1])
  const config = MODES[mode]

  const start = () => {
    const params = new URLSearchParams({ mode })
    if (config.table) params.set('table', String(table))
    if (config.option === 'count') params.set('count', String(count))
    if (config.option === 'time') params.set('time', String(time))
    navigate(`/play?${params}`)
  }

  return (
    <main className="page">
      <header className="page-header">
        <Link className="icon-button" to="/" aria-label={t.modes.back}>
          <Icon name="back" />
        </Link>
        <h1>{t.modes.title}</h1>
      </header>

      {/* Tapping a selected tile keeps it selected: no toggle-off */}
      <div className="tiles" role="group" aria-label={t.modes.title}>
        {MODE_IDS.map((id) => (
          <button key={id} type="button" className="tile" aria-pressed={id === mode} onClick={() => setMode(id)}>
            <span className="tile__name">{t.modes[id].name}</span>
            <span className="tile__desc">{t.modes[id].desc}</span>
          </button>
        ))}
      </div>

      {config.table && <ChoiceGroup label={t.options.table} values={TABLES} selected={table} onSelect={setTable} />}
      {config.option === 'count' && (
        <ChoiceGroup
          label={t.options.count}
          values={COUNTS}
          selected={count}
          onSelect={setCount}
          format={(n) => format(t.options.countValue, { n })}
        />
      )}
      {config.option === 'time' && (
        <ChoiceGroup
          label={t.options.time}
          values={TIMES}
          selected={time}
          onSelect={setTime}
          format={(n) => format(t.options.timeValue, { n })}
        />
      )}

      <button type="button" className="push-bottom" onClick={start}>
        {t.options.start}
      </button>
    </main>
  )
}
