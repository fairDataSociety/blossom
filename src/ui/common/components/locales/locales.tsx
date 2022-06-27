import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import BackgroundAction from '../../../../constants/background-actions.enum'
import { sendMessage } from '../../../../messaging/scripts.messaging'

export interface LocalesProps {
  children: React.ReactElement
}

const Locales = ({ children }: LocalesProps) => {
  const [loaded, setLoaded] = useState(false)

  const load = async () => {
    const { lang, locales } = await sendMessage<void, { lang: string; locales: { [key: string]: string } }>(
      BackgroundAction.GET_LOCALES,
    )

    console.log(lang)

    intl.init({
      currentLocale: lang,
      locales: {
        [lang]: locales,
      },
    })

    setLoaded(true)
  }

  useEffect(() => {
    load()
  }, [])

  if (!loaded) {
    return null
  }

  return children
}

export default Locales
