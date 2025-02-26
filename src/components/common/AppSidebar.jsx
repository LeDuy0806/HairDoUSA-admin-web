import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { sidebarData } from '@/constants/sidebar-data';
import { GalleryVerticalEnd } from 'lucide-react';
import { useNavigate } from 'react-router';

const AppSidebar = () => {
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleSidebar} size="lg" asChild>
              <a>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-md font-semibold">Hairdo USA</span>
                  <span className="text-sm">Hair Salon</span>
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
                className="py-6 group-data-[collapsible=icon]:my-1"
                asChild>
                <a
                  onClick={e => {
                    e.preventDefault();
                    // Use programmatic navigation instead
                    navigate(item.url);
                  }}
                  href={item.url}>
                  <item.icon className="size-5" />
                  <span className="text-base">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
