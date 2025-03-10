import {Eye, EyeOff} from 'lucide-react';
import {forwardRef, useState} from 'react';
import {Button} from './button';
import {Input} from './input';

const InputPassword = forwardRef(({...props}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <Input ref={ref} type={showPassword ? 'text' : 'password'} {...props} />
      <Button
        type="button"
        tabIndex="-1"
        variant="ghost"
        size="sm"
        className="absolute top-0 right-1 h-full hover:bg-transparent"
        onClick={() => setShowPassword(prev => !prev)}>
        {showPassword ? (
          <EyeOff className="size-5" />
        ) : (
          <Eye className="size-5" />
        )}
        <span className="sr-only">
          {showPassword ? 'Hide password' : 'Show password'}
        </span>
      </Button>
    </div>
  );
});

export default InputPassword;
