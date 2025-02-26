import {BrowserRouter, Route, Routes} from 'react-router';
import {ROUTE} from './constants/route';
import MainLayout from './layout/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import CustomerDetailPage from './pages/customer/CustomerDetailPage';
import CustomerPage from './pages/customer/CustomerPage';
import DashboardPage from './pages/dashboard/DashboardPage';

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE.AUTH.LOGIN} element={<LoginPage />} />

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
