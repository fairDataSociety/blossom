import { Page } from 'puppeteer'
import { openExtensionOptionsPage } from './extension.util'
import { click, getElementByTestId } from './page'

export async function fillUsernamePasswordForm(
  page: Page,
  username: string,
  password: string,
): Promise<void> {
  const usernameInput = await getElementByTestId(page, 'username')

  await usernameInput.click()
  await usernameInput.type(username)

  const passwordInput = await getElementByTestId(page, 'password')

  await passwordInput.click()
  await passwordInput.type(password)
  await (await getElementByTestId(page, 'submit')).click()
}

export async function login(username: string, password: string): Promise<void> {
  const page = await openExtensionOptionsPage(global.__BLOSSOM_ID__, 'auth.html')

  await click(page, 'login')

  await fillUsernamePasswordForm(page, username, password)

  await page.close()
}
