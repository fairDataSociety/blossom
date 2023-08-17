import React, { useEffect, useMemo, useState } from 'react'
import intl from 'react-intl-universal'
import { CircularProgress, Fade, Tab, Tabs, styled } from '@mui/material'
import { getWalletTransactions } from '../../../../../../messaging/content-api.messaging'
import { Box } from '@mui/system'
import ErrorMessage from '../../../error-message/error-message.component'
import { Token, Transaction, Transactions } from '../../../../../../model/storage/wallet.model'
import TransactionList from './transaction-list.component'
import Tokens from './tokens/tokens.component'

export interface TransactionHistoryProps {
  networkLabel: string
  selectedToken: Token | null
  onTokenSelect: (token: Token | null) => void
}

const TabWrapper = styled('div')(() => ({
  width: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
}))

const TransactionHistory = ({ selectedToken, networkLabel, onTokenSelect }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transactions | null>(null)
  const [tab, setTab] = useState<number>(selectedToken ? 1 : 0)
  const [error, setError] = useState<string | null>(null)

  const displayedTransactions: Transaction[] = useMemo(() => {
    if (!transactions) {
      return []
    }

    return selectedToken
      ? transactions.asset.filter(({ token }) => token?.name === selectedToken.name)
      : transactions.regular
  }, [transactions, selectedToken])

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
              <Tab label={intl.get('ACTIVITY')} data-testid="activity-tab" />
              <Tab label={intl.get('TOKENS')} data-testid="tokens-tab" />
              {/* <Tab label={intl.get('NFTS')} /> */}
            </Tabs>
          </Box>
          <Box sx={{ position: 'relative' }}>
            <Fade in={tab === 0}>
              <TabWrapper>
                <TransactionList transactions={displayedTransactions} />
              </TabWrapper>
            </Fade>
            <Fade in={tab === 1}>
              <TabWrapper>
                <Tokens
                  networkLabel={networkLabel}
                  selectedToken={selectedToken}
                  onTokenSelect={onTokenSelect}
                />
              </TabWrapper>
            </Fade>
            {/* <Fade in={tab === 2}>
              <TabWrapper>NFTs</TabWrapper>
            </Fade> */}
          </Box>
        </>
      )}
    </>
  )
}

export default TransactionHistory
