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
import {useGetAllCustomersQuery} from '@/services/customer';
import moment from 'moment-timezone';
import {useMemo, useState} from 'react';

export const columns = [
  {
    accessorKey: 'firstName',
    header: 'First name',
    cell: ({row}) => <div>{row.getValue('firstName')}</div>,
  },
  {
    accessorKey: 'lastName',
    header: 'Last name',
    cell: ({row}) => <div>{row.getValue('lastName')}</div>,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone number',
    cell: ({row}) => row.getValue('phoneNumber'),
  },
  {
    accessorKey: 'birthDate',
    header: 'Birth date',
    cell: ({row}) => moment(row.getValue('birthDate')).format('MM-DD-YYYY'),
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

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const customerQuery = useGetAllCustomersQuery({
    page: pageIndex + 1,
    limit: pageSize,
  });
  const customers = useMemo(
    () => customerQuery.data?.data?.items ?? [],
    [customerQuery.data],
  );

  const _pagination = customerQuery?.data?.data?.pagination;
  const totalPages = _pagination?.totalPages ?? 1;

  const [columnVisibility, setColumnVisibility] = useState({
    createdAt: false,
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
      columnVisibility,
      pagination,
    },
  });

  return (
    <div className="w-full">
      <h3 className="text-2xl font-semibold">Customer</h3>

      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Filter phone number..."
          value={table.getColumn('phoneNumber')?.getFilterValue() ?? ''}
          onChange={event =>
            table.getColumn('phoneNumber')?.setFilterValue(event.target.value)
          }
          className="flex-1"
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
                    onCheckedChange={value => column.toggleVisibility(!!value)}>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <AddCustomerDialog />
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
