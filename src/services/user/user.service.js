import instance from '../instance';

export const userService = {
  createAdmin: async data => await instance.post('/user/admin', data),
  getAllAdmins: async query =>
    await instance.get('/user/admin/list', {params: query}),
  updateAdmin: async (id, data) =>
    await instance.put(`/user/admin/${id}`, data),
  deleteAdmin: async id => await instance.delete(`/user/admin/${id}`),
};
