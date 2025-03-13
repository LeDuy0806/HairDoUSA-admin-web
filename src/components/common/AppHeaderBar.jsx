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
import {useAuthContext} from '@/context/AuthContext';
import {Dialog, DialogTrigger} from '@radix-ui/react-dialog';
import {useState} from 'react';
import {SidebarTrigger} from '../ui/sidebar';

const AppHeaderBar = () => {
  const [open, setOpen] = useState(false);
  const {logout, user} = useAuthContext();

  const handleDialogConfirmClick = () => {
    setOpen(false);
  };

  const handleOpenChanged = open => {
    setOpen(open);
  };

  return (
    <div className="sticky top-0 z-50 flex w-full items-center justify-between border-b bg-white p-4">
      <SidebarTrigger />
      <div className="flex items-center gap-4">
        <h2 className="text-base font-semibold md:text-2xl">
          Good morning, {user?.name}!
        </h2>
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
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
            <ProfileDialog onConfirmClick={handleDialogConfirmClick} />
          </DropdownMenu>
        </Dialog>
      </div>
    </div>
  );
};

export default AppHeaderBar;
