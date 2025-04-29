import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ButtonWithIconProps {
  icon: LucideIcon;
  children: React.ReactNode;
  onClick?: () => void;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
}

export function ButtonWithIcon({
  icon: Icon,
  children,
  onClick,
  variant = 'default',
  ...props
}: ButtonWithIconProps) {
  return (
    <Button onClick={onClick} variant={variant} {...props}>
      <Icon className="mr-2 h-4 w-4" /> {children}
    </Button>
  );
}
