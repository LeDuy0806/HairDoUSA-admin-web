import {BrowserRouter, Route, Routes} from 'react-router';
import {ROUTE} from './constants/route';
import MainLayout from './layout/MainLayout';
import AuthLayout from './layout/AuthLayout';

import LoginPage from './pages/auth/LoginPage';
import TwoFactorAuthPage from './pages/auth/TwoFactorAuthPage';

import CustomerDetailPage from './pages/customer/CustomerDetailPage';
import CustomerPage from './pages/customer/CustomerPage';
import DashboardPage from './pages/dashboard/DashboardPage';

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path={ROUTE.AUTH.LOGIN} element={<LoginPage />} />
          <Route path={ROUTE.AUTH.TWO_FACTOR_AUTH} element={<TwoFactorAuthPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path={ROUTE.DASHBOARD} element={<DashboardPage />} />

          <Route path={ROUTE.CUSTOMER.ROOT}>
            <Route index element={<CustomerPage />} />
            <Route path=":customerId" element={<CustomerDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
