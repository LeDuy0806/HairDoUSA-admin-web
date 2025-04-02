import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
import {
  APPLIED_COUPON_STATUS,
  APPOINTMENT_STATUS,
  PAYMENT_STATUS,
} from '@/constants/value';
import useDebounce from '@/hooks/use-debounce';
import {cn} from '@/lib/utils';
import {
  useGetAllAppointmentsQuery,
  useUpdateAppointmentMutation,
} from '@/services/appointment';
import {formatUSPhoneNumber} from '@/utils/PhoneNumberFormatter';
import moment from 'moment-timezone';
import {lazy, Suspense, useEffect, useMemo, useState} from 'react';
import {toast} from 'sonner';

const ProcessAppointmentPaymentDialog = lazy(
  () => import('@/components/dialog/ProcessAppointmentPaymentDialog'),
);

const columns = [
  {
    accessorKey: 'customer',
    header: <div className="pl-4 text-left">Customer</div>,
    cell: ({row}) => {
      const customer = row.getValue('customer');
      return (
        <div className="min-w-max pl-4 text-left">
          {customer
            ? `${customer?.firstName} ${customer?.lastName || ''} (${formatUSPhoneNumber(customer?.phoneNumber)})`
            : 'Deleted Customer'}
        </div>
      );
    },
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total ($)',
    cell: ({row}) => row.getValue('totalAmount'),
  },
  {
    accessorKey: 'coupon',
    header: row => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex justify-center gap-2">
              <span className="font-medium">Applied Coupon</span>
              <ChevronDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="flex flex-col gap-2">
              <DropdownMenuCheckboxItem
                checked={row.column.getFilterValue() === undefined}
                onCheckedChange={() => row.column.setFilterValue('')}>
                All
              </DropdownMenuCheckboxItem>
              {Object.values(APPLIED_COUPON_STATUS).map(st => (
                <DropdownMenuCheckboxItem
                  key={st}
                  checked={row.column.getFilterValue() === st}
                  onCheckedChange={() => row.column.setFilterValue(st)}>
                  {st.replace(/_/g, ' ')}
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    cell: ({row}) => {
      const coupon = row.getValue('coupon');

      return coupon ? coupon.code : 'None';
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({row}) => (
      <p className="min-w-max">
        {moment(row.getValue('date')).format('MM-DD-YYYY hh:mm A')}
      </p>
    ),
  },
  {
    accessorKey: 'status',
    header: row => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium">Service Status</span>
              <ChevronDown className="size-5" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="flex flex-col gap-2">
              <DropdownMenuCheckboxItem
                checked={row.column.getFilterValue() === undefined}
                onCheckedChange={() => row.column.setFilterValue('')}>
                ALL
              </DropdownMenuCheckboxItem>
              {Object.values(APPOINTMENT_STATUS).map(st => (
                <DropdownMenuCheckboxItem
                  key={st}
                  checked={row.column.getFilterValue() === st}
                  onCheckedChange={() => row.column.setFilterValue(st)}>
                  {st.replace(/_/g, ' ')}
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
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

      const renderStatusColor = status => {
        switch (status) {
          case 'WAITING':
            return 'text-yellow-500';
          case 'COMPLETED':
            return 'text-green-500';
          case 'IN_SERVICE':
            return 'text-orange-500';
          default:
            return '';
        }
      };

      return (
        <Select
          defaultValue={status}
          value={status}
          onValueChange={updateAppointmentStatus}>
          <SelectTrigger
            className={cn(
              renderStatusColor(status),
              'relative justify-center font-medium',
              '[&>svg]:absolute [&>svg]:right-3',
            )}>
            <SelectValue placeholder="Change status" />
          </SelectTrigger>
          <SelectContent className="capitalize">
            {Object.values(APPOINTMENT_STATUS).map(st => (
              <SelectItem
                className={cn(renderStatusColor(st), 'font-medium')}
                key={st}
                value={st}>
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
    header: row => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium">Payment Status</span>
              <ChevronDown className="size-5" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="flex flex-col gap-2">
              <DropdownMenuCheckboxItem
                checked={row.column.getFilterValue() === undefined}
                onCheckedChange={() => row.column.setFilterValue('')}>
                ALL
              </DropdownMenuCheckboxItem>
              {Object.values(PAYMENT_STATUS).map(st => (
                <DropdownMenuCheckboxItem
                  key={st}
                  checked={row.column.getFilterValue() === st}
                  onCheckedChange={() => {
                    row.column.setFilterValue(st);
                  }}>
                  {st.replace(/_/g, ' ')}
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    cell: ({row}) => {
      const status = row.getValue('paymentStatus');

      return (
        <div
          className={
            status === 'PAID'
              ? 'font-medium text-cyan-500'
              : 'font-medium text-red-500'
          }>
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({row}) => (
      <p className="min-w-max">
        {moment(row.getValue('createdAt')).format('MM-DD-YYYY hh:mm A')}
      </p>
    ),
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
                  {row.getValue('paymentStatus') === 'PAID'
                    ? 'View'
                    : 'Checkout'}
                </Link>
              </Button>
              {row.getValue('paymentStatus') === 'UNPAID' ? (
                <AddAppointmentDialog
                  defaultOpen={false}
                  isEdit
                  data={appointment}
                  // phoneNumber={appointmentPhoneNumber}
                />
              ) : null}
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

  const [{pageIndex, pageSize}, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [columnFilters, setColumnFilters] = useState([]);

  const [keyword, setKeyword] = useState('');

  const debouncedKeyword = useDebounce(keyword);

  useEffect(() => {
    setPagination(prev => ({...prev, pageIndex: 0}));
  }, [debouncedKeyword, columnFilters]);

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

    if (debouncedKeyword) {
      q.phoneNumber = debouncedKeyword;
    }

    columnFilters.forEach(filter => {
      const {id, value} = filter;
      if (id !== 'coupon') {
        q[id] = value;
      } else {
        switch (value) {
          case APPLIED_COUPON_STATUS.NO:
            q.coupon = 'null';
            break;
          case APPLIED_COUPON_STATUS.YES:
            q['coupon[ne]'] = 'null';
            break;
          default:
            break;
        }
      }
    });

    return q;
  }, [pageIndex, pageSize, debouncedKeyword, columnFilters]);

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
    manualFiltering: true,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnVisibility,
      pagination,
      columnFilters,
    },
  });

  return (
    <>
      <div className="w-full">
        <h3 className="text-2xl font-semibold">Appointment</h3>

        <div className="flex flex-col items-center gap-4 py-4 md:flex-row">
          <Input
            placeholder="Search by phone number..."
            className="flex-1 py-2"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
          <div className="flex items-center gap-2">
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
                      <TableHead className="text-center" key={header.id}>
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
                      <TableCell
                        key={cell.id}
                        className="min-w-max text-center">
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
        <div className="flex flex-col items-center justify-between gap-4 py-4 md:flex-row">
          <div className="text-muted-foreground flex items-center gap-1 text-sm md:gap-2">
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
            <p className="min-w-max">of {totalPages === 0 ? 1 : totalPages}</p>{' '}
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
