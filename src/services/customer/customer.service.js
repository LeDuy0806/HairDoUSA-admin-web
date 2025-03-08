import instance from '../instance';

export const customerService = {
  getAll: async query =>
    await instance.get('/customer/list', {
      params: query,
    }),
  getDetail: async id => await instance.get(`/customer/${id}`),
  delete: async id => await instance.delete(`/customer/${id}`),
  create: async data => await instance.post('/customer', data),
  update: async (id, data) => await instance.put(`/customer/${id}`, data),
};
