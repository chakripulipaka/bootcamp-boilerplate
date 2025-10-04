import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './ExampleTheme.ts'
import ExampleDashboardLocal from './ExampleDashboardLocal.tsx'
import OurDash from './OurDash.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<OurDash />} />
      </Routes>
    </ThemeProvider>
  </StrictMode>
  </BrowserRouter>
)
