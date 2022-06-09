import intl from 'react-intl-universal'

type Dictionary = { [label: string]: string }

export interface LocaleData {
  lang: string
  locales: Dictionary
}

export class Locales {
  private loadingPromise: Promise<LocaleData> = null

  constructor() {
    this.getLocales()
  }

  public getLocales() {
    if (this.loadingPromise) {
      return this.loadingPromise
    }

    return (this.loadingPromise = this.load())
  }

  private async load() {
    // TODO Should support other languages
    const lang = 'en-US'
    const locales = await this.loadLocaleJsonFile(lang)

    await intl.init({
      currentLocale: lang,
      locales: {
        [lang]: locales,
      },
    })

    return {
      lang,
      locales,
    }
  }

  private async loadLocaleJsonFile(language: string): Promise<Dictionary> {
    return (await fetch(`locales/${language}.json`)).json()
  }
}
