import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-clip-padding text-xs font-medium whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm border border-slate-900',
        outline:
          'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-xs',
        secondary:
          'bg-slate-100 text-slate-900 hover:bg-slate-200/80 border border-slate-200/60',
        cobalt:
          'bg-blue-600 text-white hover:bg-blue-700 shadow-xs border border-blue-600',
        ghost:
          'hover:bg-slate-100 text-slate-700 hover:text-slate-900',
        destructive:
          'bg-red-600 text-white border border-red-600 hover:bg-red-700 shadow-xs',
        link: 'text-blue-600 underline-offset-4 hover:underline font-normal',
      },
      size: {
        default:
          'h-8.5 gap-2 px-3.5 py-1.5',
        xs: "h-6 gap-1 px-2 text-[10px] [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7.5 gap-1.5 px-3 text-[11px] [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-10 gap-2.5 px-5 text-sm',
        icon: 'size-8.5',
        'icon-xs': "size-6 [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-7.5',
        'icon-lg': 'size-10',
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
