import React from 'react'
import { ThemeProvider } from '@mui/system'
import { HashRouter } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import defaultTheme from '../common/styles/light-theme'
import Login from './pages/login/login'

const App = () => (
  <HashRouter>
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <React.StrictMode>
        <Login />
      </React.StrictMode>
    </ThemeProvider>
  </HashRouter>
)

export default App
