console.log('Content script...')

chrome.runtime.sendMessage('abc', (response) => {
  console.log('FDP Content Script: ', response)
})
