import AppSidebar from '@/components/common/AppSidebar';
import {Outlet} from 'react-router';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

const MainLayout = () => {
  return (
    <SidebarProvider>
      <main className="flex">
        {/* <aside className="w-64">
          <AppSidebar />
        </aside> */}
        <AppSidebar />
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default MainLayout;
