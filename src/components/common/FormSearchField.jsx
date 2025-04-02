import {Button} from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {forwardRef, useImperativeHandle, useState} from 'react';

const FormSearchField = forwardRef(
  (
    {
      form,
      name,
      label,
      emptyText,
      placeholder,
      searchPlaceholder,
      disabled = false,
      required = false,
      options = [],
      onValueSelected,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      setOpen: setOpen,
    }));

    return (
      <FormField
        control={form.control}
        name={name}
        render={() => (
          <FormItem className="gap-1">
            <div className="grid grid-cols-5 items-center gap-4">
              <FormLabel className="col-span-2">
                {label}{' '}
                {required ? <span className="text-red-500">*</span> : ''}
              </FormLabel>
              <FormControl className="col-span-3">
                <div className="w-full">
                  <Popover modal={true} open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        disabled={disabled}
                        variant="outline"
                        aria-expanded={open}
                        className="w-full justify-start text-left">
                        {form.getValues(name)
                          ? options.find(
                              option => option === form.getValues(name),
                            )
                          : placeholder}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList>
                          <CommandEmpty>{emptyText}</CommandEmpty>
                          <CommandGroup>
                            {options.map(option => (
                              <CommandItem
                                key={option}
                                value={option}
                                onSelect={currentValue => {
                                  form.setValue(
                                    name,
                                    currentValue === form.getValues(name)
                                      ? form.getValues(name)
                                      : currentValue,
                                  );
                                  setOpen(false);
                                  onValueSelected();
                                }}>
                                {option}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </FormControl>
            </div>
          </FormItem>
        )}
      />
    );
  },
);

export default FormSearchField;
