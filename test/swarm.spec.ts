describe('Swarm extension API tests', () => {
  it('Test extension', async () => {
    const page = await global.__BROWSER__.newPage()

    await page.goto('chrome://extensions')

    // TODO Add test
  })
})
