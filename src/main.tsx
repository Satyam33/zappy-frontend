import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { store } from './store'
import { hydrateAuth } from './store/slices/authSlice'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:  1000 * 60 * 2,
      retry:      1,
      refetchOnWindowFocus: false,
    },
  },
})

const persistedAuth = localStorage.getItem('zappy_auth')
if (persistedAuth) {
  try {
    store.dispatch(hydrateAuth(JSON.parse(persistedAuth)))
  } catch {
    localStorage.removeItem('zappy_auth')
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#fff',
              color: '#111827',
              border: '1px solid rgba(26,173,82,0.35)',
              borderRadius: '12px',
              fontSize: '13.5px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
            },
            success: { iconTheme: { primary: '#1aad52', secondary: '#fff' } },
            error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
          }}
        />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
)
