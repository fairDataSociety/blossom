import {
  BigNumber,
  Contract,
  ContractInterface,
  PopulatedTransaction,
  Wallet,
  providers,
  utils,
} from 'ethers'
import { Address, PrivateKey } from '../model/general.types'
import { Storage } from './storage/storage.service'
import { Transaction } from '../model/internal-messages.model'

export class Blockchain {
  private storage: Storage = new Storage()

  constructor(private rpcUrl?: string) {}

  public async getAccountBalance(address: Address): Promise<BigNumber> {
    return (await this.getProvider()).getBalance(address)
  }

  public async estimateGas({ to, value, data }: Transaction): Promise<BigNumber> {
    const provider = await this.getProvider()
    const [gasAmount, gasPrice] = await Promise.all([
      provider.estimateGas({ to, value, data }),
      provider.getFeeData(),
    ])

    return gasPrice.maxFeePerGas.mul(gasAmount)
  }

  public estimateTokenTransferGas(
    erc20Contract: Contract,
    to: Address,
    value: BigNumber,
  ): Promise<BigNumber> {
    return erc20Contract.estimateGas.transfer(to, utils.hexZeroPad(value.toHexString(), 32))
  }

  public async transferTokens(
    erc20Contract: Contract,
    to: Address,
    value: BigNumber,
  ): Promise<{ receipt: providers.TransactionReceipt; tx: PopulatedTransaction }> {
    const stringVlaue = utils.hexZeroPad(value.toHexString(), 32)

    const tx = await erc20Contract.transfer(to, stringVlaue)

    const receipt = await tx.wait()

    return { receipt, tx }
  }

  public async sendTransaction(
    privateKey: PrivateKey,
    to: Address,
    value: BigNumber,
  ): Promise<providers.TransactionReceipt> {
    const provider = await this.getProvider()

    const wallet = new Wallet(privateKey).connect(provider)

    const tx = await wallet.sendTransaction({ to, value })

    return tx.wait()
  }

  public async getContract(address: Address, abi: ContractInterface, privateKey?: string): Promise<Contract> {
    const provider = await this.getProvider()

    let contract = new Contract(address, abi, provider)

    if (privateKey) {
      contract = contract.connect(new Wallet(privateKey, provider))
    }

    return contract
  }

  private async getProvider(): Promise<providers.JsonRpcProvider> {
    let rpc = this.rpcUrl

    if (!rpc) {
      const network = await this.storage.getNetwork()
      rpc = network.rpc
    }

    return this.createProvider(rpc)
  }

  private createProvider(rpc: string) {
    return new providers.JsonRpcProvider(rpc)
  }
}
