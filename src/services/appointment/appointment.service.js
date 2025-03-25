import instance from '../instance';

export const appointmentService = {
  getAll: async query =>
    await instance.get('/appointment/list', {params: query}),
  getDetail: async id => await instance.get(`/appointment/${id}`),
  create: async data => await instance.post('/appointment', data),
  update: async (id, data) => await instance.put(`/appointment/${id}`, data),
  updateCustomerOfAppointment: async (id, identifier) =>
    await instance.put(`/appointment/${id}/customer/${identifier}`),
  delete: async id => await instance.delete(`/appointment/${id}`),
  checkout: async id => await instance.post(`/appointment/checkout/${id}`),
  applyCoupon: async (id, couponCode) =>
    await instance.post(`/appointment/${id}/coupon/${couponCode}`),
  removeCoupon: async id => await instance.delete(`/appointment/${id}/coupon`),
};
