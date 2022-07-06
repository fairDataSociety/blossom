import { styled } from '@mui/system'

const Wrapper = styled('div')(({ theme }) => ({
  marginTop: '50px',
  padding: '50px',
  borderRadius: '20px',
  border: `1px solid ${theme.palette.border.main}`,
}))

export default Wrapper
