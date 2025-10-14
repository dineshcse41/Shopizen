import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Context Providers
import { CartProvider } from "../src/components/context/CartContext.jsx";
import { WishlistProvider } from "../src/components/context/WishlistContext.jsx";
import { AuthProvider } from "../src/components/context/AuthContext.jsx";
import { UserNotificationProvider } from '../src/components/context/UserNotificationContext.jsx';
import { AdminNotificationProvider } from '../src/components/context/AdminNotificationContext.jsx';
import { UserOrderProvider } from '../src/components/context/UserOrderContext.jsx';
import { AdminOrderProvider } from '../src/components/context/AdminOrderContext.jsx';
import { UserMessageProvider } from '../src/components/context/UserMessageContext.jsx';
import { AdminMessageProvider } from '../src/components/context/AdminMessageContext.jsx';
import { ToastProvider } from '../src/components/context/ToastContext.jsx';
import { ComparisonProvider } from "../src/components/context/ComparisonContext.jsx";
import { DataProvider } from "../src/components/context/DataContext.jsx";
import { LoadingProvider } from "../src/components/context/LoadingContext.jsx";
import { DarkModeProvider } from "../src/components/context/DarkModeContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DarkModeProvider>
      <DataProvider>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <ComparisonProvider>

                  {/* User Contexts */}
                  <UserNotificationProvider>
                    <UserOrderProvider>
                      <UserMessageProvider>

                        {/* Admin Contexts */}
                        <AdminNotificationProvider>
                          <AdminOrderProvider>
                            <AdminMessageProvider>

                              <LoadingProvider>
                                <App />
                              </LoadingProvider>

                            </AdminMessageProvider>
                          </AdminOrderProvider>
                        </AdminNotificationProvider>

                      </UserMessageProvider>
                    </UserOrderProvider>
                  </UserNotificationProvider>

                </ComparisonProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </DataProvider>
    </DarkModeProvider>
  </StrictMode>
);

