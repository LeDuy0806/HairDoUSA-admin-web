import FilterSelect from '@/components/common/FilterSelect';
import CouponCard from '@/components/coupon/CouponCard';
import {Button} from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {Input} from '@/components/ui/input';
import useDebounce from '@/hooks/use-debounce';
import {isoStringToShortDate} from '@/utils/DateTimeConverter';
import {ChevronDown} from 'lucide-react';
import {useEffect, useState} from 'react';

const filterOptions = [
  {label: 'All', value: 'ALL'},
  {label: 'Active', value: 'ACTIVE'},
  {label: 'Last created', value: 'LAST_CREATED'},
];

const tempCoupons = [
  {
    id: 1,
    title: 'Happy Birthday Coupon',
    description:
      'This coupon will be automatically sent to customers whose birthday in the month',
    validFrom: '2025-03-03T13:54:00.000Z',
    expiredDate: '2024-03-31T23:59:59.000Z',
  },
  {
    id: 2,
    title: 'New Member Coupon',
    description: 'This coupon will be automatically sent to new customers',
    validFrom: '2024-03-15T00:00:00.000Z',
    expiredDate: '2024-04-15T23:59:59.000Z',
  },
  {
    id: 3,
    title: 'Coupon ABCXYZ',
    description: 'This coupon will automatically send to.....',
    validFrom: '2024-03-10T00:00:00.000Z',
    expiredDate: '2024-05-31T23:59:59.000Z',
  },
  {
    id: 4,
    title: 'Loyalty Reward',
    description: '30% off for members on their birthday month',
    validFrom: '2024-01-01T00:00:00.000Z',
    expiredDate: '2024-12-31T23:59:59.000Z',
  },
  {
    id: 5,
    title: 'Spring Collection',
    description: '15% off on all hair coloring services',
    validFrom: '2024-04-01T00:00:00.000Z',
    expiredDate: '2024-05-15T23:59:59.000Z',
  },
];

const CouponPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const debounceSearchValue = useDebounce(searchValue);

  useEffect(() => {
    console.log('Debounce search value: ', debounceSearchValue);
  }, [debounceSearchValue]);

  const handleSearchChange = e => {
    setSearchValue(e.target.value);
  }

  return (
    <div className="h-full w-full">
      <h3 className="text-2xl font-semibold">Coupon</h3>
      <Button className="my-6">+ Add New Coupon</Button>
      <div className="mb-5 flex items-center justify-between">
        <Input onChange={handleSearchChange} className="w-86" placeholder="Search by name, category,..." />
        <FilterSelect
          options={filterOptions}
          onValueChange={value => console.log(value)}
        />
      </div>
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="my-5 [&[data-state=open]>div>svg]:-rotate-180">
          <div className="flex cursor-pointer items-center">
            <ChevronDown className="mr-2 size-6 transition-transform duration-200" />
            <p className="text-lg font-semibold">Permanent Coupons</p>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="grid grid-cols-3 gap-5">
          {tempCoupons.map(coupon => (
            <CouponCard
              key={coupon.id}
              title={coupon.title}
              description={coupon.description}
              validFrom={isoStringToShortDate(new Date().toISOString())}
              expiredDate={isoStringToShortDate(coupon.expiredDate)}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="my-5 [&[data-state=open]>div>svg]:-rotate-180">
          <div className="flex cursor-pointer items-center">
            <ChevronDown className="mr-2 size-6 transition-transform duration-200" />
            <p className="text-lg font-semibold">Seasonal Coupons</p>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="grid grid-cols-3 gap-5">
          {tempCoupons.map(coupon => (
            <CouponCard
              key={coupon.id}
              title={coupon.title}
              description={coupon.description}
              validFrom={isoStringToShortDate(new Date().toISOString())}
              expiredDate={isoStringToShortDate(coupon.expiredDate)}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CouponPage;
