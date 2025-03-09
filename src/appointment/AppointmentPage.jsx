import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {ChevronDown, MoreHorizontal} from 'lucide-react';
import {Link, useLocation, useNavigate} from 'react-router';

import AddAppointmentDialog from '@/components/dialog/AddAppointmentDialog';
import ConfirmDeleteAppointmentDialog from '@/components/dialog/ConfirmDeleteAppointmentDialog';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Input} from '@/components/ui/input';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Separator} from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {ROUTE} from '@/constants/route';
import {APPOINTMENT_STATUS} from '@/constants/value';
import useDebounce from '@/hooks/use-debounce';
import {
  useGetAllAppointmentsQuery,
  useUpdateAppointmentMutation,
} from '@/services/appointment';
import moment from 'moment-timezone';
import {lazy, Suspense, useEffect, useMemo, useState} from 'react';
import {toast} from 'sonner';

const ProcessAppointmentPaymentDialog = lazy(
  () => import('@/components/dialog/ProcessAppointmentPaymentDialog'),
);

export const columns = [
  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: ({row}) => {
      const customer = row.getValue('customer');
      return `${customer?.lastName} - ${customer?.phoneNumber}`;
    },
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total',
    cell: ({row}) => row.getValue('totalAmount'),
  },
  {
    accessorKey: 'coupon',
    header: 'Applied coupon',
    cell: ({row}) => {
      const coupon = row.getValue('coupon');

      return coupon ? coupon.code : 'None';
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({row}) => moment(row.getValue('date')).format('MM-DD-YYYY hh:mm A'),
  },
  {
    accessorKey: 'status',
    header: 'Service status',
    cell: ({row}) => {
      const status = row.getValue('status');

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const updateAppointmentMutation = useUpdateAppointmentMutation(
        row.original._id,
      );

      const updateAppointmentStatus = st => {
        updateAppointmentMutation.mutate(
          {status: st},
          {
            onSuccess: res => {
              if (res.success) {
                toast.success('Appointment status updated');
              } else {
                toast.error(res.message);
              }
            },
            onError: err => {
              toast.error(
                err?.response?.data?.message || 'Something went wrong',
              );
            },
          },
        );
      };

      return (
        <Select defaultValue={status} onValueChange={updateAppointmentStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Change status" />
          </SelectTrigger>
          <SelectContent className="capitalize">
            {Object.values(APPOINTMENT_STATUS).map(st => (
              <SelectItem key={st} value={st}>
                {st.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment status',
    cell: ({row}) => row.getValue('paymentStatus'),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created at',
    cell: ({row}) =>
      moment(row.getValue('createdAt')).format('MM-DD-YYYY hh:mm A'),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({row}) => {
      const appointment = row.original;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [open, setOpen] = useState(false);

      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link to={ROUTE.APPOINTMENT.PAYMENT(appointment._id)}>
                  View
                </Link>
              </Button>
              <ConfirmDeleteAppointmentDialog
                id={appointment._id}
                onSuccess={() => setOpen(false)}
              />
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
];

const AppointmentPage = () => {
  const navigate = useNavigate();
  const {search, ...location} = useLocation();
  const searchParams = new URLSearchParams(search);
  const appointmentId = searchParams.get('appointmentId');
  const isProcessPayment = !!appointmentId;
  const [showProcessPayment, setShowProcessPayment] =
    useState(isProcessPayment);

  useEffect(() => {
    setShowProcessPayment(isProcessPayment);
  }, [isProcessPayment]);

  const state = location.state;

  const appointmentPhoneNumber = state?.customerPhoneNumber;
  const action = state?.action ?? 'none';

  console.log({state});

  const [{pageIndex, pageSize}, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [keyword, setKeyword] = useState('');

  const debouncedKeyword = useDebounce(keyword);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const query = useMemo(() => {
    const q = {
      page: pageIndex + 1,
      limit: pageSize,
      populate: 'customer,coupon',
    };

    if (debouncedKeyword && debouncedKeyword.length > 4) {
      q.phoneNumber = debouncedKeyword;
    }

    return q;
  }, [pageIndex, pageSize, debouncedKeyword]);

  const appointmentQuery = useGetAllAppointmentsQuery(query);
  const appointments = useMemo(
    () => appointmentQuery.data?.data?.items ?? [],
    [appointmentQuery.data],
  );

  const _pagination = appointmentQuery?.data?.data?.pagination;
  const totalPages = _pagination?.totalPages ?? 1;
  const totalItems = _pagination?.totalItems;

  const [columnVisibility, setColumnVisibility] = useState({
    createdAt: false,
  });

  const table = useReactTable({
    data: appointments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    pageCount: totalPages,
    onPaginationChange: setPagination,
    state: {
      columnVisibility,
      pagination,
    },
  });

  return (
    <>
      <div className="w-full">
        <h3 className="text-2xl font-semibold">Appointment</h3>

        <div className="flex items-center gap-4 py-4">
          <Input
            placeholder="Search by phone number..."
            className="flex-1"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={value =>
                        column.toggleVisibility(!!value)
                      }>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <AddAppointmentDialog
            defaultOpen={action === 'new' && !!appointmentPhoneNumber}
            phoneNumber={appointmentPhoneNumber}
          />
        </div>
        <div className="grid grid-cols-1 rounded-md border">
          <Table
            className="relative w-full overflow-auto"
            isLoading={appointmentQuery.isFetching}>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="min-w-max">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center">
                    {appointmentQuery.isFetching ? 'Loading...' : 'No results.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <p className="min-w-max">Page</p>
            <Select
              value={pageIndex}
              onValueChange={v =>
                setPagination(prev => ({...prev, pageIndex: v}))
              }>
              <SelectTrigger>
                <SelectValue placeholder="Select page size" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({length: totalPages}, (_, i) => i).map(p => (
                  <SelectItem key={p} value={p}>
                    {p + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="min-w-max">of {totalPages}</p>{' '}
            <Separator orientation="vertical" className="!h-5 w-2" />
            <p className="min-w-max">Page size</p>
            <Select
              value={pageSize}
              onValueChange={v =>
                setPagination(prev => ({...prev, pageSize: v}))
              }>
              <SelectTrigger>
                <SelectValue placeholder="Select page size" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map(p => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Separator orientation="vertical" className="!h-5 w-2" />
            <p className="min-w-max">Total: {totalItems ?? 0}</p>
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        {showProcessPayment && (
          <ProcessAppointmentPaymentDialog
            onClose={() => {
              setShowProcessPayment(false);
              navigate(ROUTE.APPOINTMENT.ROOT);
            }}
          />
        )}
      </Suspense>
    </>
  );
};

export default AppointmentPage;
