import path from 'path'
import { copyFile, readFile } from 'fs/promises'
import { exec } from 'child_process'
import axios from 'axios'
import { BEE_DEBUG_URL, BEE_URL } from './constants'

const libraryPath = path.join('library', 'build', 'index.js')
const dappsPath = path.join('test', 'dapps')
const dapps = ['fdp-storage']
const dappReferenceVariables = ['FDP_STORAGE_PAGE_REFERENCE']

function execPromise(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (error) => {
      if (error) {
        return reject(error)
      }
      resolve()
    })
  })
}

function sleep(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

function compileLibrary(): Promise<void> {
  return execPromise('cd library && npm run build')
}

async function copyLibrary(): Promise<void> {
  await Promise.all(dapps.map((dapp) => copyFile(libraryPath, path.join(dappsPath, dapp, 'blossom.js'))))
}

async function createPostageBatch(): Promise<string> {
  const response = await axios.post(`${BEE_DEBUG_URL}/stamps/10000000/18`)

  return response.data.batchID
}

async function zipPages(): Promise<void> {
  await Promise.all(
    dapps.map((dapp) => execPromise(`cd ${path.join(dappsPath, dapp)} && tar -cf ../${dapp}.tar.gz *`)),
  )
}

async function uploadPages(batchId: string): Promise<void> {
  await Promise.all(
    dapps.map(async (dapp, index) => {
      const buffer = await readFile(path.join(dappsPath, `${dapp}.tar.gz`))

      const response = await axios.post(`${BEE_URL}/bzz`, buffer, {
        headers: {
          'Content-Type': 'application/x-tar',
          'Swarm-Index-Document': 'index.html',
          'Swarm-Error-Document': 'index.html',
          'Swarm-Collection': 'true',
          'Swarm-Postage-Batch-Id': batchId,
        },
      })

      global[dappReferenceVariables[index]] = response.data.reference
    }),
  )
}

async function setup(): Promise<void> {
  await compileLibrary()

  console.log('Library compiled')

  await copyLibrary()

  console.log('Library copied to individal dApp directories')

  if (process.env.POSTAGE_BATCH_ID) {
    global.__POSTAGE_BATCH_ID__ = process.env.POSTAGE_BATCH_ID
  } else {
    console.log(
      'No postage batch ID provided, creating one...You can provide postage batch as env variable POSTAGE_BATCH_ID',
    )

    global.__POSTAGE_BATCH_ID__ = await createPostageBatch()

    console.log(`Postage batch created ${global.__POSTAGE_BATCH_ID__}`)

    console.log('Waiting for batch to become ready...')

    await sleep(200)
  }

  await zipPages()

  console.log('Created zip.tar files for each dApp')

  await uploadPages(global.__POSTAGE_BATCH_ID__)

  console.log('dApps have been deployed')
}

export default setup
