import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Context Providers
import { CartProvider } from "../components/context/CartContext.jsx";
import { WishlistProvider } from "../components/context/WishlistContext.jsx";
import { AuthProvider } from "../components/context/AuthContext.jsx";
import { NotificationProvider } from '../components/context/NotificationContext.jsx';
import { ToastProvider } from '../components/context/ToastContext.jsx';
import { ComparisonProvider } from "../components/context/ComparisonContext";
import { DataProvider } from "../components/context/DataContext.jsx";

createRoot(document.getElementById('root')).render(

  <DataProvider>
    <ToastProvider>
      <AuthProvider >
        <WishlistProvider>
          <ComparisonProvider>
            <CartProvider>
              <NotificationProvider>
                <App />
              </NotificationProvider>
            </CartProvider>
          </ComparisonProvider>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  </DataProvider>

)
