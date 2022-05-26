import { Browser } from 'puppeteer'

declare global {
  var __BROWSER__: Browser
  var __BLOSSOM_ID__: string
}
