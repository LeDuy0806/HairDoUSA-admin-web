import {
  ClipboardList,
  LayoutDashboard,
  Settings2,
  Ticket,
  Users,
} from 'lucide-react';
import {ROUTE} from './route';

export const sidebarData = isSuperAdmin => [
  {
    title: 'Dashboard',
    url: ROUTE.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: 'Customer',
    url: ROUTE.CUSTOMER.ROOT,
    icon: Users,
  },
  {
    title: 'Appointment',
    url: ROUTE.APPOINTMENT.ROOT,
    icon: ClipboardList,
  },
  {
    title: 'Coupon',
    url: ROUTE.COUPON.ROOT,
    icon: Ticket,
  },
  {
    title: 'Settings',
    url: ROUTE.SETTINGS.ROOT,
    icon: Settings2,
    isHidden: !isSuperAdmin,
  },
];
