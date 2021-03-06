import { useCallback, useEffect, useState, useMemo } from 'react'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getFarms } from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([] as Array<BigNumber>)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const sushi = useSushi()
  const farms = useMemo(() => getFarms(sushi), [sushi])
  const block = useBlock()

  const fetchAllBalances = useCallback(async () => {
    const balances: Array<BigNumber> = await Promise.all(
      farms.map(({ poolContract }: { poolContract: Contract }) =>
        getEarned(poolContract, account),
      ),
    )
    setBalance(balances)
  }, [account, farms])

  useEffect(() => {
    if (account && sushi) {
      fetchAllBalances()
    }
  }, [account, block, setBalance, sushi, fetchAllBalances])

  return balances
}

export default useAllEarnings
