import fs from 'fs'
import os from 'os'
import path from 'path'
import puppeteer from 'puppeteer'
import NodeEnvironment from 'jest-environment-node'

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

class PuppeteerEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup()
    // get the wsEndpoint
    const wsEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8')

    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found')
    }

    // connect to puppeteer
    this.global.__BROWSER__ = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    })
  }
}

module.exports = PuppeteerEnvironment
