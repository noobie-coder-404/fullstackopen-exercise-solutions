import ReactDOM from 'react-dom/client'
import App from './App'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { AnecdoteContextProvider } from './AnecdoteContext'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <AnecdoteContextProvider>
      <App />
    </AnecdoteContextProvider>
  </ QueryClientProvider>
)