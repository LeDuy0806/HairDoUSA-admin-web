import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {ChevronDown, MoreHorizontal} from 'lucide-react';

import AddCouponDialog from '@/components/dialog/AddCouponDialog';
import ConfirmDeleteCouponDialog from '@/components/dialog/ConfirmDeleteCouponDialog';
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
import {Switch} from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  COUPON_ACTIVE_STATUS,
  COUPON_STATUS,
  COUPON_TYPE,
} from '@/constants/value';
import useDebounce from '@/hooks/use-debounce';
import {
  useGetAllCouponsQuery,
  useUpdateCouponMutation,
} from '@/services/coupon';
import moment from 'moment-timezone';
import {useEffect, useMemo, useState} from 'react';
import {toast} from 'sonner';

export const columns = [
  {
    accessorKey: 'name',
    header: <div className="pl-4 text-left">Name</div>,
    cell: ({row}) => (
      <div className="min-w-max pl-4 text-left">{row.getValue('name')}</div>
    ),
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
    accessorKey: 'discountType',
    header: row => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-center gap-1">
              <span className="font-medium">Coupon type</span>
              <ChevronDown className="size-5" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="flex flex-col gap-2">
              <DropdownMenuCheckboxItem
                checked={row.column.getFilterValue() === undefined}
                onCheckedChange={() => row.column.setFilterValue('')}>
                All
              </DropdownMenuCheckboxItem>
              {Object.values(COUPON_TYPE).map(st => (
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
    cell: ({row}) => row.getValue('discountType'),
  },
  {
    accessorKey: 'validFrom',
    header: 'Valid from',
    cell: ({row}) => (
      <p className="min-w-max">
        {moment(row.getValue('validFrom')).format('MM-DD-YYYY')}
      </p>
    ),
  },
  {
    accessorKey: 'validUntil',
    header: 'Valid to',
    cell: ({row}) => (
      <p className="min-w-max">
        {moment(row.getValue('validUntil')).format('MM-DD-YYYY')}
      </p>
    ),
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
    accessorKey: 'status',
    header: row => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-center gap-1">
              <span className="font-medium">Status</span>
              <ChevronDown className="size-5" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="flex flex-col gap-2">
              <DropdownMenuCheckboxItem
                checked={row.column.getFilterValue() === undefined}
                onCheckedChange={() => row.column.setFilterValue('')}>
                All
              </DropdownMenuCheckboxItem>
              {Object.values(COUPON_STATUS).map(st => (
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
      if (
        !moment
          .utc()
          .isBetween(row.getValue('validFrom'), row.getValue('validUntil'))
      ) {
        return <p className="font-medium text-red-500">Expired</p>;
      }

      if (row.getValue('usedCount') >= row.getValue('usageLimit')) {
        return <p className="font-medium text-orange-500">Out of Usage</p>;
      }

      if (!row.getValue('isActive')) {
        return <p className="font-medium text-yellow-500">Inactive</p>;
      }

      return <p className="font-medium text-cyan-500">Active</p>;
    },
  },
  {
    accessorKey: 'isActive',
    header: row => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium">Active status</span>
              <ChevronDown className="size-5" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="flex flex-col gap-2">
              <DropdownMenuCheckboxItem
                checked={row.column.getFilterValue() === undefined}
                onCheckedChange={() => row.column.setFilterValue('')}>
                All
              </DropdownMenuCheckboxItem>
              {Object.keys(COUPON_ACTIVE_STATUS).map(st => (
                <DropdownMenuCheckboxItem
                  key={st}
                  checked={
                    row.column.getFilterValue() === COUPON_ACTIVE_STATUS[st]
                  }
                  onCheckedChange={() =>
                    row.column.setFilterValue(COUPON_ACTIVE_STATUS[st])
                  }>
                  {st.replace(/_/g, ' ')}
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
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

  const [columnFilters, setColumnFilters] = useState([]);

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
      q.code = debouncedKeyword;
    }

    columnFilters.forEach(filter => {
      const {id, value} = filter;
      if (id !== 'status') {
        q[id] = value;
      } else {
        switch (value) {
          case COUPON_STATUS.ACTIVE:
            q.isActive = true;
            break;
          case COUPON_STATUS.INACTIVE:
            q.isActive = false;
            break;
          case COUPON_STATUS.OUT_OF_USAGE:
            q['$expr'] = JSON.stringify({$eq: ['$usedCount', '$usageLimit']});
            break;
          case COUPON_STATUS.EXPIRED:
            q['validUntil[lt]'] = moment(Date.now()).utc().format('YYYY-MM-DD');
            break;
          default:
            break;
        }
      }
    });

    return q;
  }, [pageIndex, pageSize, debouncedKeyword, columnFilters]);

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
    manualFiltering: true,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility,
      pagination,
      columnFilters,
    },
  });

  return (
    <>
      <div className="w-full">
        <h3 className="text-2xl font-semibold">Coupon</h3>

        <div className="flex flex-col items-center gap-4 py-4 md:flex-row">
          <Input
            placeholder="Search by code"
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
            <AddCouponDialog />
          </div>
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
                    {couponQuery.isFetching ? 'Loading...' : 'No results.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 py-4 md:flex-row">
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
