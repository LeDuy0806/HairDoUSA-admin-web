import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {ChevronDown, MoreHorizontal} from 'lucide-react';

import AddCouponDialog from '@/components/dialog/AddCouponDialog';
import ConfirmDeleteCouponDialog from '@/components/dialog/ConfirmDeleteCouponDialog';
import {Button} from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
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
import {
  useGetAllCouponsQuery,
  useUpdateCouponMutation,
} from '@/services/coupon';
import moment from 'moment-timezone';
import {useMemo, useState} from 'react';
import {toast} from 'sonner';

export const columns = [
  {
    accessorKey: 'name',
    header: <div className="text-left pl-4">Name</div>,
    cell: ({row}) => <div className="text-left pl-4">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({row}) => row.getValue('code'),
  },
  {
    accessorKey: 'discountValue',
    header: 'Discount',
    cell: ({row}) => {
      const discountType = row.original.discountType;
      const discountValue = row.getValue('discountValue');

      return `${discountValue} (${discountType === 'PERCENTAGE' ? '%' : '$'})`;
    },
  },
  {
    accessorKey: 'couponType',
    header: 'Coupon type',
    cell: ({row}) => row.getValue('couponType'),
  },
  {
    accessorKey: 'validFrom',
    header: 'Valid from',
    cell: ({row}) => moment(row.getValue('validFrom')).format('MM-DD-YYYY'),
  },
  {
    accessorKey: 'validUntil',
    header: 'Valid to',
    cell: ({row}) => moment(row.getValue('validUntil')).format('MM-DD-YYYY'),
  },
  {
    accessorKey: 'usageLimit',
    header: 'Usage limit',
    cell: ({row}) => row.getValue('usageLimit'),
  },
  {
    accessorKey: 'usedCount',
    header: 'Used count',
    cell: ({row}) => row.getValue('usedCount'),
  },
  {
    accessorKey: 'isActive',
    header: 'Active',
    cell: ({row}) => {
      const status = row.getValue('isActive');
      const coupon = row.original;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const updateCouponMutation = useUpdateCouponMutation(row.original._id);

      const updateCouponStatus = st => {
        updateCouponMutation.mutate(
          {...coupon, isActive: st},
          {
            onSuccess: res => {
              if (res.success) {
                toast.success('Coupon status updated');
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
        <Switch
          className="cursor-pointer"
          checked={status}
          onCheckedChange={updateCouponStatus}
        />
      );
    },
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
      const coupon = row.original;

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
              <AddCouponDialog isEdit data={coupon} />
              <ConfirmDeleteCouponDialog
                id={coupon._id}
                onSuccess={() => setOpen(false)}
              />
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
];

const CouponPage = () => {
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
    };

    if (debouncedKeyword) {
      q.code = debouncedKeyword;
    }

    return q;
  }, [pageIndex, pageSize, debouncedKeyword]);

  const couponQuery = useGetAllCouponsQuery(query);
  const coupons = useMemo(
    () => couponQuery.data?.data?.items ?? [],
    [couponQuery.data],
  );

  const _pagination = couponQuery?.data?.data?.pagination;
  const totalPages = _pagination?.totalPages ?? 1;
  const totalItems = _pagination?.totalItems;

  const [columnVisibility, setColumnVisibility] = useState({
    createdAt: false,
    couponType: false,
    usageLimit: false,
  });

  const table = useReactTable({
    data: coupons,
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
        <h3 className="text-2xl font-semibold">Coupon</h3>

        <div className="flex items-center gap-4 py-4">
          <Input
            placeholder="Search by code"
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
                      {column.columnDef.header}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <AddCouponDialog />
        </div>
        <div className="grid grid-cols-1 rounded-md border">
          <Table
            className="relative w-full overflow-auto"
            isLoading={couponQuery.isFetching}>
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
                      <TableCell key={cell.id} className="min-w-max text-center">
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
                    {couponQuery.isFetching ? 'Loading...' : 'No results.'}
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
    </>
  );
};

export default CouponPage;
