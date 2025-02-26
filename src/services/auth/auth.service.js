import instance from '../instance';

export const authService = {
  // example
  login: async data => await instance.post('/auth/login', data),
};
