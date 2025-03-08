export const ROUTE = {
  AUTH: {
    LOGIN: '/login',
    TWO_FACTOR_AUTH: '/two-factor-authentication',
  },
  DASHBOARD: '/',
  COUPON: {
    ROOT: '/coupon',
  },
  CUSTOMER: {
    ROOT: '/customer',
    DETAIL: id => `/customer/${id}`,
  },
  APPOINTMENT: {
    ROOT: '/appointment',
    PAYMENT: id => '/appointment?appointmentId=' + id,
  },
  SETTINGS: {
    ROOT: '/settings',
  },
};
