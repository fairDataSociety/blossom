import { useEffect, useState } from 'react'
import { getLocalAccounts } from '../../../messaging/content-api.messaging'
import { AccountResponse } from '../../../model/internal-messages.model'

export interface AccountData {
  accounts: AccountResponse[]
}

export function useAccounts(): AccountData {
  const [accounts, setAccounts] = useState<AccountResponse[]>(null)

  const fetchAccounts = async () => {
    const accountList = await getLocalAccounts()
    setAccounts(accountList)
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  if (accounts) {
    return { accounts }
  }

  return { accounts: null }
}
