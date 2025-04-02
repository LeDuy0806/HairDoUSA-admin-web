import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {ChevronDown, MoreHorizontal} from 'lucide-react';

import AddCustomerDialog from '@/components/dialog/AddCustomerDialog';
import ConfirmDeleteCustomerDialog from '@/components/dialog/ConfirmDeleteCustomerDialog';
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
import useDebounce from '@/hooks/use-debounce';
import {useGetAllCustomersQuery} from '@/services/customer';
import {formatUSPhoneNumber} from '@/utils/PhoneNumberFormatter';
import moment from 'moment-timezone';
import {useEffect, useMemo, useState} from 'react';

export const columns = [
  {
    accessorKey: 'firstName',
    header: <div className="pl-4 text-left">First Name</div>,
    cell: ({row}) => (
      <div className="pl-4 text-left">{row.getValue('firstName')}</div>
    ),
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    cell: ({row}) => (
      <div className="text-left">{row.getValue('lastName') || '-'}</div>
    ),
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    cell: ({row}) => (
      <div className="min-w-max text-left">
        {formatUSPhoneNumber(row.getValue('phoneNumber'))}
      </div>
    ),
  },
  {
    accessorKey: 'birthDate',
    header: 'Birth Date',
    cell: ({row}) => {
      const birthDate = row.getValue('birthDate');
      return (
        <div className="min-w-max text-left">
          {birthDate ? moment(birthDate).format('MM-DD-YYYY') : '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'state',
    header: 'State',
    cell: ({row}) => (
      <div className="text-left">{row.getValue('state') || '-'}</div>
    ),
  },

  {
    accessorKey: 'city',
    header: 'City',
    cell: ({row}) => (
      <div className="text-left">{row.getValue('city') || '-'}</div>
    ),
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({row}) => (
      <div className="line-clamp-1 text-left">
        {row.getValue('address') || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'zipCode',
    header: 'Zip Code',
    cell: ({row}) => (
      <div className="line-clamp-1 text-left">
        {row.getValue('zipCode') || '-'}
      </div>
    ),
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
      const customer = row.original;

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
              <AddCustomerDialog isEdit data={customer} />
              <ConfirmDeleteCustomerDialog
                id={customer._id}
                onSuccess={() => setOpen(false)}
              />
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
];

const CustomerPage = () => {
  const [{pageIndex, pageSize}, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [keyword, setKeyword] = useState('');

  const debouncedKeyword = useDebounce(keyword);

  useEffect(() => {
    setPagination(prev => ({...prev, pageIndex: 0}));
  }, [debouncedKeyword]);

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
    };

    if (debouncedKeyword) {
      q.phoneNumber = debouncedKeyword;
    }

    return q;
  }, [pageIndex, pageSize, debouncedKeyword]);

  const customerQuery = useGetAllCustomersQuery(query);

  const customers = useMemo(
    () => customerQuery.data?.data?.items ?? [],
    [customerQuery.data],
  );

  const _pagination = customerQuery?.data?.data?.pagination;
  const totalPages = _pagination?.totalPages ?? 1;
  const totalItems = _pagination?.totalItems;

  const [columnVisibility, setColumnVisibility] = useState({
    createdAt: false,
    city: false,
    zipCode: false,
  });

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    pageCount: totalPages,
    onPaginationChange: setPagination,
    state: {
      columnVisibility: columnVisibility,
      pagination,
    },
  });

  return (
    <div className="w-full">
      <h3 className="text-2xl font-semibold">Customer</h3>

      <div className="flex flex-col items-center gap-4 py-4 md:flex-row">
        <Input
          placeholder="Search by phone number..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          className="flex-1 py-2"
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
          <AddCustomerDialog />
        </div>
      </div>
      <div className="grid grid-cols-1 rounded-md border">
        <Table
          className="relative w-full overflow-auto"
          isLoading={customerQuery.isFetching}>
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
                  {customerQuery.isFetching ? 'Loading...' : 'No results.'}
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
  );
};

export default CustomerPage;
