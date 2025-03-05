import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Dialog, DialogTrigger} from '@radix-ui/react-dialog';
import {Edit, Edit3, EllipsisVertical, Trash2} from 'lucide-react';
import EditCouponDialog from '@/components/dialog/EditCouponDialog';

const OptionDropdown = () => {
  return (
    <Dialog>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="cursor-pointer p-1">
              <EllipsisVertical className="size-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-24">
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <Edit3 className="size-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>
                <Trash2 className="size-4 text-red-600" />
                <span className="text-red-600">Delete</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              coupon and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-white shadow-xs">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <EditCouponDialog />
    </Dialog>
  );
};

export default OptionDropdown;
