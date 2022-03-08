chrome.runtime.onMessage.addListener((message: unknown, sender, sendResponse) => {
  console.log(message)

  sendResponse('Works')
})
