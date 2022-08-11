import { TEST_WEB_SERVER_URL } from '../config/constants'

export async function logErrors(): Promise<void> {
  const page = await global.__BROWSER__.newPage()

  await page.goto(TEST_WEB_SERVER_URL, {
    waitUntil: 'networkidle0',
  })

  const cookies = await page.cookies()

  console.log('Application console.error() entries:')

  if (cookies.length === 0) {
    return
  }

  cookies.forEach(({ value }) => console.log(value))

  const client = await this.page.target().createCDPSession()
  await client.send('Network.clearBrowserCookies')

  await page.close()
}
