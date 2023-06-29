import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from '@mui/material'
import Send from '@mui/icons-material/Send'
import { Transaction } from '../../../../../../model/storage/wallet.model'
import { displayAddress, roundEther } from '../../../../utils/ethers'
import { utils } from 'ethers'

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
  console.log(transactions)

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableBody>
          {transactions.map(({ id, time, content }) => (
            <StyledTableRow key={id}>
              <StyledTableCell component="th" scope="row">
                <Send />
              </StyledTableCell>
              <StyledTableCell align="right">{displayAddress(content.to)}</StyledTableCell>
              <StyledTableCell align="right">
                {roundEther(utils.formatEther(content.value))} ETH
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
