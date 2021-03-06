import { NowRequest, NowResponse } from '@now/node';
import Web3 from 'web3'
import BigNumber from 'bignumber.js'

const chefABI = require('../contracts/chef')

const getBalanceNumber = (balance: any, decimals = 18) => {
  const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals))
  return displayBalance.toNumber()
}

const web3 = new Web3(
    new Web3.providers.HttpProvider(
        "https://bsc-dataseed.binance.org"
    )
);

const pending = async (pid: number, address: string) => {
    const chef = new web3.eth.Contract(chefABI, '0x73feaa1eE314F8c655E354234017bE2193C9E24E');
    const pending = await chef.methods.pendingCake(pid, address).call()
    const poolInfo = await chef.methods.poolInfo(pid).call()
    return {
        pending: getBalanceNumber(new BigNumber(pending)),
        poolInfo
    }

}

export default async (_req: NowRequest, res: NowResponse) => {
  const { address = '0x0F9399FC81DaC77908A2Dde54Bb87Ee2D17a3373', pid='1' } = _req.query
  const data = await pending(pid, address)
  res.status(200).send(data);
};
