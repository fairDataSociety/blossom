import React from 'react'
import { ThemeProvider } from '@mui/system'
import { HashRouter } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import defaultTheme from '../common/styles/light-theme'
import Routes from './routes/routes'
import Locales from '../common/components/locales/locales'
import MenuWrapper from './components/menu-wrapper/menu-wrapper'

const App = () => (
  <HashRouter>
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <React.StrictMode>
        <Locales>
          <MenuWrapper>
            <Routes />
          </MenuWrapper>
        </Locales>
      </React.StrictMode>
    </ThemeProvider>
  </HashRouter>
)

export default App
