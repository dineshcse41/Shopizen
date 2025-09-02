import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Context Providers
import { CartProvider } from "./components/context/CartContext.jsx";
import { WishlistProvider } from "./components/context/WishlistContext.jsx";
import { AuthProvider } from "../src/components/context/AuthContext.jsx"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider >
      <WishlistProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  </StrictMode>,
)
