import React from 'react'
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
import Send from '@mui/icons-material/Send'
import { Transaction } from '../../../../../../model/storage/wallet.model'
import { convertToDecimal, displayAddress } from '../../../../utils/ethers'
import { BigNumber } from 'ethers'

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
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableBody data-testid="transaction-history">
          {transactions.map(({ id, time, content, token }) => (
            <StyledTableRow key={id}>
              <StyledTableCell component="th" scope="row">
                <Send />
              </StyledTableCell>
              <StyledTableCell align="right">{displayAddress(content.to)}</StyledTableCell>
              <StyledTableCell align="right">
                {`${convertToDecimal(BigNumber.from(content.value), token?.decimals)} ${
                  token ? token.symbol : 'ETH'
                }`}
              </StyledTableCell>
              <StyledTableCell align="right">{new Date(time).toDateString()}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TransactionList
