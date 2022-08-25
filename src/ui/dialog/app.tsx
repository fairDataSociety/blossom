import React from 'react'
import { ThemeProvider } from '@mui/system'
import { CssBaseline } from '@mui/material'
import defaultTheme from '../common/styles/light-theme'
import Locales from '../common/components/locales/locales'
import Dialog from './components/dialog'

const App = () => (
  <ThemeProvider theme={defaultTheme}>
    <CssBaseline />
    <React.StrictMode>
      <Locales>
        <Dialog />
      </Locales>
    </React.StrictMode>
  </ThemeProvider>
)

export default App
