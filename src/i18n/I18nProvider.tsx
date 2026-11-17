import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { I18nContext, type Lang } from './context'
import { en } from './en'
import { fi } from './fi'

const messages = { fi, en }

export function I18nProvider({ children, initialLang = 'fi' }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  // Screen readers and speech synthesis use the page language
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(() => ({ lang, t: messages[lang], setLang }), [lang])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
