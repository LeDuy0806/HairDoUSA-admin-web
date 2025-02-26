import AppSidebar from '@/components/common/AppSidebar';
import {Outlet} from 'react-router';

const MainLayout = () => {
  return (
    <main className="flex">
      <aside className="w-64">
        <AppSidebar />
      </aside>
      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

export default MainLayout;
