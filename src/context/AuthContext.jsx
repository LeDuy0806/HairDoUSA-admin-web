import {ROUTE} from '@/constants/route';
import {useGetMeQuery, useLogoutMutation} from '@/services/auth';
import {createContext, useContext} from 'react';
import {toast} from 'sonner';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  logout: () => {},
  isLoadingUser: false,
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({children}) => {
  const getMeQuery = useGetMeQuery();
  const logoutMutation = useLogoutMutation();

  const logout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Logout successfully');
        location.href = ROUTE.AUTH.LOGIN;
      },
      onError: () => {
        toast.error('Logout failed');
      },
    });
  };

  const value = {
    user: getMeQuery.data?.data,
    isAuthenticated: !!getMeQuery.data?.data,
    logout,
    isLoadingUser: getMeQuery.isLoading || getMeQuery.isFetching,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
