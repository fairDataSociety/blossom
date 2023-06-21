import React from 'react'
import { ThemeProvider } from '@mui/system'
import { HashRouter } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import defaultTheme from '../common/styles/light-theme'
import CenteredWrapper from '../common/components/centered-wrapper/centered-wrapper.component'
import Locales from '../common/components/locales/locales'
import Wallet from '../common/components/wallet/components/wallet'

const App = () => (
  <HashRouter>
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <React.StrictMode>
        <Locales>
          <CenteredWrapper>
            <Wallet />
          </CenteredWrapper>
        </Locales>
      </React.StrictMode>
    </ThemeProvider>
  </HashRouter>
)

export default App
