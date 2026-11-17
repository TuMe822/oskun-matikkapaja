import { Link, Navigate, useSearchParams } from 'react-router'
import { Osku } from '../components/Osku'
import { format } from '../i18n/format'
import { useI18n } from '../i18n/context'
import { isModeId } from '../modes'

// Placeholder until the practice view is built
export function Play() {
  const { t } = useI18n()
  const [params] = useSearchParams()
  const mode = params.get('mode')
  if (!isModeId(mode)) return <Navigate to="/modes" replace />

  const table = params.get('table')
  const count = params.get('count')
  const time = params.get('time')

  return (
    <main className="page">
      <h1>{t.modes[mode].name}</h1>
      <div className="hero">
        <Osku size="md" />
        <p className="bubble">{t.play.comingSoon}</p>
      </div>
      <ul className="summary">
        {table && <li>{format(t.play.tableValue, { n: table })}</li>}
        {count && <li>{format(t.options.countValue, { n: count })}</li>}
        {time && <li>{format(t.options.timeValue, { n: time })}</li>}
      </ul>
      <Link className="button push-bottom" to="/">
        {t.play.home}
      </Link>
    </main>
  )
}
