import instance from '../instance';

export const customerService = {
  getAll: async () => await instance.get('/customer'),
};
