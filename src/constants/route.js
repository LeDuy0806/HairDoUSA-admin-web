export const ROUTE = {
  AUTH: {
    LOGIN: '/login',
  },
  DASHBOARD: '/',
  COUPON: {
    ROOT: '/coupon',
  },
  CUSTOMER: {
    ROOT: '/customer',
    DETAIL: id => `/customer/${id}`,
  },
  SETTINGS: {
    ROOT: '/settings',
  },
};
