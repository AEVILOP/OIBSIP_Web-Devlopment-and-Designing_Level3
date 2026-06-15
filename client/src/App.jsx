import { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import {
  Login,
  Register,
  VerifyEmail,
  ForgotPassword,
  ResetPassword,
} from './pages/AuthPages';
import Menu from './pages/Menu';
import Builder from './pages/Builder';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminInventory from './pages/AdminInventory';
import NotFound from './pages/NotFound';

export default function App() {
  useEffect(() => {
    const offline = () => toast.error('You appear to be offline');
    const online = () => toast.success('Back online');
    window.addEventListener('offline', offline);
    window.addEventListener('online', online);
    return () => {
      window.removeEventListener('offline', offline);
      window.removeEventListener('online', online);
    };
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#141414',
            color: '#F5F5F5',
            border: '1px solid #252525',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#34D399', secondary: '#141414' } },
          error: { iconTheme: { primary: '#F87171', secondary: '#141414' } },
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="menu" element={<Menu />} />

          <Route element={<PrivateRoute roles={['user']} />}>
            <Route path="dashboard" element={<Navigate to="/menu" replace />} />
            <Route path="build" element={<Builder />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
          </Route>

          <Route element={<PrivateRoute roles={['admin']} />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/orders" element={<AdminOrders />} />
            <Route path="admin/inventory" element={<AdminInventory />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
