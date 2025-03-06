import {LayoutDashboard, Receipt, Settings2, Ticket, Users} from 'lucide-react';
import {ROUTE} from './route';

export const sidebarData = [
  {
    title: 'Dashboard',
    url: ROUTE.DASHBOARD,
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: 'Customer',
    url: ROUTE.CUSTOMER.ROOT,
    icon: Users,
  },
  {
    title: 'Appointment',
    url: ROUTE.APPOINTMENT.ROOT,
    icon: Receipt,
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
  },
];
