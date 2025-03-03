import {Button} from '@/components/ui/button';
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {DialogDescription} from '@radix-ui/react-dialog';
import PassChangeDialog from './PassChangeDialog';

const ProfileDialogContent = ({onConfirmClick}) => {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-center">Profile</DialogTitle>
        <DialogDescription />
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            readOnly
            defaultValue="Hairdo USA Admin"
            className="bg-background col-span-3 cursor-default focus:ring-0"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            readOnly
            defaultValue="hairdo1usa@hairdousa1.com"
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <PassChangeDialog />
        <Button onClick={onConfirmClick}>Confirm</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ProfileDialogContent;
