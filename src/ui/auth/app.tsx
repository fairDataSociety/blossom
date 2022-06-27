import React from 'react'
import { ThemeProvider } from '@mui/system'
import { HashRouter } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import defaultTheme from '../common/styles/light-theme'
import Routes from './routes/routes'
import CenteredWrapper from '../common/components/centered-wrapper/centered-wrapper.component'
import Locales from '../common/components/locales/locales'

const App = () => (
  <HashRouter>
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <React.StrictMode>
        <Locales>
          <CenteredWrapper>
            <Routes />
          </CenteredWrapper>
        </Locales>
      </React.StrictMode>
    </ThemeProvider>
  </HashRouter>
)

export default App
