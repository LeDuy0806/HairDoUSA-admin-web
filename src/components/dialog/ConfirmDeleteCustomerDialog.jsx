import {useDeleteCustomerMutation} from '@/services/customer';
import {Trash2} from 'lucide-react';
import {useState} from 'react';
import {toast} from 'sonner';
import {Button} from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

const ConfirmDeleteCustomerDialog = ({id, onSuccess}) => {
  const [open, setOpen] = useState(false);
  const deleteCustomerMutation = useDeleteCustomerMutation();
  const onDelete = () => {
    deleteCustomerMutation.mutate(id, {
      onSuccess: res => {
        if (res.success) {
          toast.success(res.message);
          setOpen(false);
          onSuccess();
        } else {
          toast.error(res.message);
        }
      },
      onError: err => {
        toast.error(err?.response?.data?.message || 'Something went wrong');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="justify-left text-destructive">
          <Trash2 />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive text-lg">
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            customer and remove the data from the system.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={onDelete}
            variant="destructive"
            isLoading={deleteCustomerMutation.isPending}>
            {deleteCustomerMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteCustomerDialog;
