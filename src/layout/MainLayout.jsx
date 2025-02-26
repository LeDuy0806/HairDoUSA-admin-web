import AppSidebar from '@/components/common/AppSidebar';
import {SidebarProvider} from '@/components/ui/sidebar';
import {Outlet} from 'react-router';

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
