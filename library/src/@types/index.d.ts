import { Browser } from 'puppeteer'

declare global {
  const __BROWSER__: Browser
  const __BLOSSOM_ID__: string
}
