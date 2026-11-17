import { Link } from 'react-router'
import { Osku } from '../components/Osku'
import { useI18n } from '../i18n/context'

export function Home() {
  const { t } = useI18n()
  return (
    <main className="page">
      <h1>{t.appName}</h1>
      <div className="hero">
        <Osku size="lg" />
        <p className="bubble">{t.home.oskuSays}</p>
      </div>
      <Link className="button" to="/play?mode=daily">
        {t.home.daily}
      </Link>
      <Link className="button button--secondary" to="/modes">
        {t.home.choose}
      </Link>
    </main>
  )
}
