import React from 'react'
import intl from 'react-intl-universal'
import { Button, ButtonProps } from '@mui/material'

const SaveButton = (props: ButtonProps) => {
  return (
    <Button color="primary" variant="contained" type="submit" size="small" {...props}>
      {intl.get('SAVE')}
    </Button>
  )
}

export default SaveButton
