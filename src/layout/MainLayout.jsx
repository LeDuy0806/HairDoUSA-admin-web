import AppHeaderBar from '@/components/common/AppHeaderBar';
import AppSidebar from '@/components/common/AppSidebar';
import {SidebarProvider} from '@/components/ui/sidebar';
import {ROUTE} from '@/constants/route';
import {useAuthContext} from '@/context/AuthContext';
import {Loader} from 'lucide-react';
import {useEffect} from 'react';
import {Outlet} from 'react-router';

const MainLayout = () => {
  const {isAuthenticated, isLoadingUser} = useAuthContext();

  useEffect(() => {
    if (!isAuthenticated && !isLoadingUser) {
      location.href = ROUTE.AUTH.LOGIN;
    }
  }, [isAuthenticated, isLoadingUser]);

  return isLoadingUser ? (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  ) : (
    <SidebarProvider>
      <main className="flex h-screen w-full overflow-x-hidden">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppHeaderBar />
          <div className="px-10 pb-10">
            <Outlet />
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
};

export default MainLayout;
