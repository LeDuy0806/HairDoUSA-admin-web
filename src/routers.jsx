import {BrowserRouter, Route, Routes} from 'react-router';
import {ROUTE} from './constants/route';
import AuthLayout from './layout/AuthLayout';
import MainLayout from './layout/MainLayout';
import ForgotPasswordLayout from './layout/ForgotPasswordLayout';

import ForgotPassword from './pages/auth/ForgotPassword';
import LoginPage from './pages/auth/LoginPage';
import ResetPassword from './pages/auth/ResetPassword';
import TwoFactorAuthPage from './pages/auth/TwoFactorAuthPage';

import AppointmentPage from './pages/appointment/AppointmentPage';
import CouponPage from './pages/coupon/CouponPage';
import CustomerDetailPage from './pages/customer/CustomerDetailPage';
import CustomerPage from './pages/customer/CustomerPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import SettingsPage from './pages/settings/SettingsPage';

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path={ROUTE.AUTH.LOGIN} element={<LoginPage />} />
          <Route
            path={ROUTE.AUTH.TWO_FACTOR_AUTH}
            element={<TwoFactorAuthPage />}
          />
        </Route>
        <Route element={<ForgotPasswordLayout />}>
          <Route
            path={ROUTE.AUTH.FORGOT_PASSWORD}
            element={<ForgotPassword />}
          />
          <Route path={ROUTE.AUTH.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path={ROUTE.DASHBOARD} element={<DashboardPage />} />

          <Route path={ROUTE.CUSTOMER.ROOT}>
            <Route index element={<CustomerPage />} />
            <Route path=":customerId" element={<CustomerDetailPage />} />
          </Route>

          <Route path={ROUTE.APPOINTMENT.ROOT} element={<AppointmentPage />} />

          <Route path={ROUTE.COUPON.ROOT} element={<CouponPage />} />
          <Route path={ROUTE.SETTINGS.ROOT} element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
