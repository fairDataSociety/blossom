import http from 'http'

export function createPostageBatch(beeUrl): Promise<void> {
  return new Promise((resolve, reject) => {
    http.get(`${beeUrl}/stamps/10000000/18`, () => resolve()).on('error', (error) => reject(error))
  })
}
