import React, { useMemo } from 'react'
import intl from 'react-intl-universal'
import Clear from '@mui/icons-material/Clear'
import { PodPermission } from '../../../../../model/storage/dapps.model'
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

export interface PodPermissionsTableProps {
  podPermissions: Record<string, PodPermission>
  disabled: boolean
  onDelete: (podName: string) => void
}

const PodPermissionsTable = ({ podPermissions, disabled, onDelete }: PodPermissionsTableProps) => {
  const podPermissionArray = useMemo(() => Object.values(podPermissions), [podPermissions])

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{intl.get('POD')}</TableCell>
            <TableCell>{intl.get('ACCESS')}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {podPermissionArray.map(({ podName, allowedActions }) => (
            <TableRow key={podName} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell sx={{ maxWidth: '300px', overflow: 'hidden' }}>{podName}</TableCell>
              <TableCell>{allowedActions}</TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  size="small"
                  disabled={disabled}
                  onClick={() => onDelete(podName)}
                >
                  <Clear />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default PodPermissionsTable
