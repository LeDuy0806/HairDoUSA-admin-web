import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const FilterSelect = ({
  options = [],
  onValueChange,
  ...props
}) => {
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="w-32" {...props}>
        <SelectValue placeholder={options[0]?.label || 'Filters'} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options?.map((option) => (
            <SelectItem key={option?.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default FilterSelect;
