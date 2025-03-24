import instance from '../instance';

export const couponService = {
  getAll: async query =>
    await instance.get('/coupon/list', {
      params: query,
    }),
  getDetail: async id => await instance.get(`/coupon/${id}`),
  getAvailableByAppointment: async query =>
    await instance.get('/coupon/available', {params: query}),
  create: async data => await instance.post('/coupon', data),
  update: async (id, data) => await instance.put(`/coupon/${id}`, data),
  delete: async id => await instance.delete(`/coupon/${id}`),
  apply: async code => await instance.post('/coupon/apply', code),
};