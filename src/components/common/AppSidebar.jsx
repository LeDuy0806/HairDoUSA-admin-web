import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {sidebarData} from '@/constants/sidebar-data';
import {ChevronLeft} from 'lucide-react';
import {useCallback} from 'react';
import {Link, useLocation} from 'react-router';

const AppSidebar = () => {
  const {toggleSidebar} = useSidebar();

  const location = useLocation();
  const {pathname} = location;

  const isActive = useCallback(
    href => {
      if (pathname === '/' && href === '/') return true;
      if (href !== '/' && pathname.startsWith(href)) return true;
      return false;
    },
    [pathname],
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleSidebar} size="lg" asChild>
              <a>
                <img
                  src="/apple-icon.png"
                  alt="logo"
                  className="size-8 rounded-full"
                />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-md font-semibold">Hairdo USA</span>
                  <span className="text-sm">Hair Salon</span>
                </div>
                <div className="ml-auto">
                  <ChevronLeft className="size-5" />
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="scrollbar-none">
        <SidebarMenu className="mx-2 my-4">
          {sidebarData.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={isActive(item.url)}
                className="py-5 group-data-[collapsible=icon]:my-1"
                asChild>
                <Link to={item.url}>
                  <item.icon className="size-4" />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
