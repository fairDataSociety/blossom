const RELOAD_ADDRESS = 'ws://localhost:18888'

function setupLiveReloadConnections(address: string): void {
  let connection = new WebSocket(address)
  connection.onclose = () => {
    connection = new WebSocket(address)
  }
  connection.onmessage = () => {
    chrome.runtime.reload()
  }
}

chrome.management.getSelf((self) => {
  if (self.installType === 'development') {
    setupLiveReloadConnections(RELOAD_ADDRESS)
  }
})
