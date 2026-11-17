import { createContext, useContext } from 'react'
import { fi, type Messages } from './fi'

export type Lang = 'fi' | 'en'

export interface I18n {
  lang: Lang
  t: Messages
  setLang: (lang: Lang) => void
}

export const I18nContext = createContext<I18n>({ lang: 'fi', t: fi, setLang: () => {} })

export const useI18n = () => useContext(I18nContext)
