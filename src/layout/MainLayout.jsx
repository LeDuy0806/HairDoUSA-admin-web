import AppHeaderBar from '@/components/common/AppHeaderBar';
import AppSidebar from '@/components/common/AppSidebar';
import {SidebarProvider} from '@/components/ui/sidebar';
import {Outlet} from 'react-router';

const MainLayout = () => {
  return (
    <SidebarProvider>
      <main className="flex h-screen w-full">
        {/* <aside className="w-64">
          <AppSidebar />
        </aside> */}
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
