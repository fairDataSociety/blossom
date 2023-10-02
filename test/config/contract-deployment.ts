import { BigNumber, Contract, ContractFactory, Wallet, providers, utils } from 'ethers'
import testTokenJson from '../contracts/TestToken.json'
import { PRIVATE_KEY, RPC_PROVIDER_URL } from './constants'

function deployContract(contractJson: any, privateKey: string): Promise<Contract> {
  const { abi, bytecode } = contractJson

  const contractFactory = new ContractFactory(abi, bytecode).connect(
    new Wallet(privateKey, new providers.JsonRpcProvider(RPC_PROVIDER_URL)),
  )

  return contractFactory.deploy()
}

export async function transferToken(
  tokenAddress: string,
  to: string,
  privateKey: string,
  amount: BigNumber,
): Promise<void> {
  const provider = new providers.JsonRpcProvider(RPC_PROVIDER_URL)

  const contract = new Contract(tokenAddress, testTokenJson.abi, provider).connect(
    new Wallet(privateKey, provider),
  )

  const tx = await contract.transfer(to, utils.hexZeroPad(amount.toHexString(), 32))

  await tx.wait()
}

export default async function deployContracts() {
  const testTokenContract = await deployContract(testTokenJson, PRIVATE_KEY)
  global.__TEST_TOKEN_ADDRESS__ = testTokenContract.address
  console.log('TestToken contract deployed to: ', testTokenContract.address)
}

// Useful for manual testing

// deployContracts().then(console.log).catch(console.error)

// transferToken(
//   '0x47a2Db5D68751EeAdFBC44851E84AcDB4F7299Cc',
//   '0xb0B56d5fde62617907617d10479EaaE0DeE17773',
//   PRIVATE_KEY,
//   BigNumber.from('100000000000'),
// )
//   .then(console.log)
//   .catch(console.error)
