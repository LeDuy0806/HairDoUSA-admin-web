import AppHeaderBar from '@/components/common/AppHeaderBar';
import AppSidebar from '@/components/common/AppSidebar';
import {SidebarProvider} from '@/components/ui/sidebar';
import {Outlet} from 'react-router';

const MainLayout = () => {
  return (
    <SidebarProvider>
      <main className="flex w-full">
        {/* <aside className="w-64">
          <AppSidebar />
        </aside> */}
        <AppSidebar />
        <div className="flex-1">
          <AppHeaderBar />
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default MainLayout;
