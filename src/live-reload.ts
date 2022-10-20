const RELOAD_ADDRESS = 'ws://localhost:18888'

function setupLiveReloadConnections(address: string): void {
  let connection = new WebSocket(address)
  connection.onclose = () => {
    connection = new WebSocket(address)
  }
  connection.onmessage = () => {
    console.log('Service worker script changed. Reloading extension...')
    chrome.runtime.reload()
  }
  connection.onerror = () => {
    console.error(`Couldn't open WebSocket connection to ${RELOAD_ADDRESS}`)
  }
}

if (process.env.ENVIRONMENT === 'development') {
  setupLiveReloadConnections(RELOAD_ADDRESS)
}
