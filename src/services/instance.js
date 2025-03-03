import {STORAGE_KEY} from '@/constants/storage-key';
import axios from 'axios';

const prefixUrl = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: prefixUrl,
  timeout: 60000, // 60 seconds
  headers: {
    'Content-Type': 'application/json',
    'X-Locale': Intl.DateTimeFormat().resolvedOptions().locale,
    'X-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
});

instance.interceptors.request.use(config => {
  // Add token to request header
  const accessToken = localStorage.getItem(STORAGE_KEY.AUTH.ACCESS_TOKEN);

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

instance.interceptors.response.use(
  response => {
    if (response.data?.data?.accessToken) {
      localStorage.setItem(
        STORAGE_KEY.AUTH.ACCESS_TOKEN,
        response.data?.data?.accessToken,
      );
    }

    return response;
  },
  error => {
    // const originalRequest = error.config;
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   const refreshToken = STORAGE.getString(
    //     STORAGE_KEY.AUTH.REFRESH_TOKEN,
    //   );
    //   return instance
    //     .post('/auth/refresh-token', {
    //       refresh_token: refreshToken,
    //     })
    //     .then(res => {
    //       if (res.data.data.access_token) {
    //         STORAGE.set(
    //           STORAGE_KEY.AUTH.ACCESS_TOKEN,
    //           res.data.data.access_token,
    //         );
    //         originalRequest.headers.Authorization = `Bearer ${res.data.data.access_token}`;
    //         return instance(originalRequest);
    //       }
    //     })
    //     .catch(() => {
    //       STORAGE.delete(STORAGE_KEY.AUTH.ACCESS_TOKEN);
    //       STORAGE.delete(STORAGE_KEY.AUTH.REFRESH_TOKEN);
    //       navigateFromRef('Onboarding');
    //     });
    // }
    return Promise.reject(error);
  },
);

export default instance;
