import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-transparent bg-clip-padding text-xs font-bold uppercase tracking-[0.06em] whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default: 'bg-[#000000] text-white hover:opacity-85 border border-[#000000]',
        outline:
          'border border-[#000000] bg-transparent text-[#000000] hover:bg-[#000000] hover:text-white',
        secondary:
          'bg-[#333333] text-white hover:bg-[#000000]',
        ghost:
          'hover:bg-[#eeeeee] text-[#000000]',
        destructive:
          'bg-[#000000] text-white border border-[#000000] hover:bg-[#333333]',
        link: 'text-[#000000] underline-offset-4 hover:underline lowercase tracking-normal font-normal',
      },
      size: {
        default:
          'h-9 gap-2 px-5 py-2',
        xs: "h-6 gap-1 px-2.5 text-[10px] [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1.5 px-3.5 text-[11px] [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-11 gap-2.5 px-6 text-sm',
        icon: 'size-9',
        'icon-xs': "size-6 [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-7',
        'icon-lg': 'size-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
