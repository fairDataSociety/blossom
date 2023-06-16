var blossom = new window.blossom.Blossom()

function setText(id, text) {
  const element = document.getElementById(id)
  element.innerText = text
  element.setAttribute('complete', 'true')
}

async function getBalance(elementId) {
  try {
    const balance = await blossom.wallet.getUserBalance()
    setText(elementId, balance)
  } catch (error) {
    setText(elementId, error.toString())
  }
}

async function sendTransaction(elementId) {
  try {
    // send 0.1 ETH
    await blossom.wallet.sendTransaction('0xb0B56d5fde62617907617d10479EaaE0DeE17773', '10000000000000000')
    await getBalance(elementId)
  } catch (error) {
    setText(elementId, error.toString())
  }
}

function getInitialBalance() {
  return getBalance('balance')
}

function sendTransaction1() {
  return sendTransaction('updated-balance-1')
}

function sendTransaction2() {
  return sendTransaction('updated-balance-2')
}
