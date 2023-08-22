import React, { useState } from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  styled,
  tableCellClasses,
} from '@mui/material'
import { Transaction } from '../../../../../../model/storage/wallet.model'
import { convertToDecimal, displayAddress } from '../../../../utils/ethers'
import { BigNumber } from 'ethers'
import TransactionDetailsModal from './transaction-details.component'

export interface TransactionListProps {
  transactions: Transaction[]
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '4px 10px',
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

const TransactionList = ({ transactions }: TransactionListProps) => {
  const [displayedTransaction, setDisplayedTransaction] = useState<Transaction | null>(null)

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 200 }}>
        <Table size="small">
          <TableBody data-testid="transaction-history">
            {transactions.map((transsaction) => (
              <StyledTableRow
                hover
                key={transsaction.id}
                onClick={() => setDisplayedTransaction(transsaction)}
                sx={{ cursor: 'pointer' }}
              >
                <StyledTableCell align="right">{displayAddress(transsaction.content.to)}</StyledTableCell>
                <StyledTableCell align="right">
                  {`${convertToDecimal(
                    BigNumber.from(transsaction.content.value),
                    transsaction.token?.decimals,
                  )} ${transsaction.token ? transsaction.token.symbol : 'ETH'}`}
                </StyledTableCell>
                <StyledTableCell align="right" sx={{ minWidth: '100px' }}>
                  {new Date(transsaction.time).toDateString()}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TransactionDetailsModal
        open={Boolean(displayedTransaction)}
        onClose={() => setDisplayedTransaction(null)}
        transaction={displayedTransaction}
      />
    </>
  )
}

export default TransactionList
