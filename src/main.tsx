import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './theme/ThemeProvider'
import { LoadingProvider } from './theme/LoadingProvider'
import { ToastProvider } from './components/feedback/Toast'
import { Provider } from 'react-redux'
import { store } from './store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <LoadingProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </LoadingProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
