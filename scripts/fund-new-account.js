const { providers, utils, Wallet } = require('ethers')

const RPC_PROVIDER_URL = 'http://localhost:9545/'
const privateKey = '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'

if (process.argv.length < 4) {
  throw new Error('Usage: node fund-new-account.js <to_account> <ethers_amount>')
}

const toAccount = process.argv[2]
const amount = process.argv[3]

const provider = new providers.JsonRpcProvider(RPC_PROVIDER_URL)
const wallet = new Wallet(privateKey, provider)

wallet
  .sendTransaction({
    to: toAccount,
    value: utils.parseEther(amount),
  })
  .then(() => console.log('Successfully transfered funds'))
  .catch(console.error)
