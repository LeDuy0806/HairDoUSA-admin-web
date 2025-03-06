import instance from '../instance';

export const userService = {
  createAdmin: async data => await instance.post('/user/admin', data),
  getAllAdmins: async () => await instance.get('/user/admin/list'),
  updateAdmin: async (id, data) =>
    await instance.put(`/user/admin/${id}`, data),
  deleteAdmin: async id => await instance.delete(`/user/admin/${id}`),
};
