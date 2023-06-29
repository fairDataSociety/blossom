import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import { CircularProgress, Fade, Tab, Tabs, styled } from '@mui/material'
import { getWalletTransactions } from '../../../../../../messaging/content-api.messaging'
import { Box } from '@mui/system'
import ErrorMessage from '../../../error-message/error-message.component'
import { Transactions } from '../../../../../../model/storage/wallet.model'
import TransactionList from './transaction-list.component'

export interface TransactionHistoryProps {
  networkLabel: string
}

const TabWrapper = styled('div')(() => ({
  width: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
}))

const TransactionHistory = ({ networkLabel }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transactions | null>(null)
  const [tab, setTab] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      const transactions = await getWalletTransactions(networkLabel)

      setTransactions(transactions)
    } catch (error) {
      setError(String(error))
    }
  }

  useEffect(() => {
    loadData()
  }, [networkLabel])

  return (
    <>
      {transactions === null && !error && <CircularProgress />}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {transactions && (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tab} onChange={(event, tab) => setTab(tab)}>
              <Tab label={intl.get('ACTIVITY')} />
              <Tab label={intl.get('TOKENS')} />
              <Tab label={intl.get('NFTS')} />
            </Tabs>
          </Box>
          <Box sx={{ position: 'relative' }}>
            <Fade in={tab === 0}>
              <TabWrapper>
                <TransactionList transactions={transactions.regular} />
              </TabWrapper>
            </Fade>
            <Fade in={tab === 1}>
              <TabWrapper>Tokens</TabWrapper>
            </Fade>
            <Fade in={tab === 2}>
              <TabWrapper>NFTs</TabWrapper>
            </Fade>
          </Box>
        </>
      )}
    </>
  )
}

export default TransactionHistory
