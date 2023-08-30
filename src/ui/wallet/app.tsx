import React from 'react'
import { ThemeProvider } from '@mui/system'
import { HashRouter } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import defaultTheme from '../common/styles/light-theme'
import Locales from '../common/components/locales/locales'
import Routes from './routes/routes'
import { EnvironmentProvider } from '../common/context/environment.context'
import PageWrapper from '../common/components/page-wrapper/page-wrapper.component'

const App = () => (
  <HashRouter>
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <React.StrictMode>
        <EnvironmentProvider>
          <Locales>
            <PageWrapper>
              <Routes />
            </PageWrapper>
          </Locales>
        </EnvironmentProvider>
      </React.StrictMode>
    </ThemeProvider>
  </HashRouter>
)

export default App
