import ProfileDialog from '@/components/dialog/ProfileDialogContent';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Dialog, DialogTrigger} from '@radix-ui/react-dialog';
import {useState} from 'react';

const AppHeaderBar = () => {
  const [open, setOpen] = useState(false);

  const handleDialogConfirmClick = () => {
    setOpen(false);
  };

  const handleOpenChanged = open => {
    setOpen(open);
  };

  return (
    <div className="flex justify-end p-10">
      <h1 className="mr-5 text-2xl font-semibold">Good morning, SuperAdmin!</h1>
      <Dialog open={open} onOpenChange={handleOpenChanged}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-60"
            align="end" // Aligns to the end (right) of the trigger
            alignOffset={-5} // Shifts the menu left by 5px
            sideOffset={5}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DialogTrigger asChild>
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
          <ProfileDialog onConfirmClick={handleDialogConfirmClick} />
        </DropdownMenu>
      </Dialog>
    </div>
  );
};

export default AppHeaderBar;
