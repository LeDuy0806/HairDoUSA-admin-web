import instance from '../instance';

export const authService = {
  login: async data => await instance.post('/auth/login', data),
  verifyLoginOtp: async data =>
    await instance.post('/auth/verify-login-otp', data),
  getMe: async () => await instance.get('/auth/me'),
  changePassword: async data =>
    await instance.post('/auth/change-password', data),
  forgotPassword: async data =>
    await instance.post('/auth/forgot-password', data),
  resetPassword: async data =>
    await instance.post('/auth/reset-password', data),
};
