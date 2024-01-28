import React from "react";

export const BUTTON_BASE_STYLE =
  "inline-flex items-center justify-center rounded-md text-sm hover:shadow-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

export const BUTTON_VARIANTS = {
  variant: {
    primary: "bg-rose-500 text-white hover:bg-rose-600",
    outline: "border border-rose-500 text-rose-500 bg-white hover:bg-slate-100",
    secondary: "bg-slate-100 hover:bg-slate-200",
    ghost: "bg-transparent hover:bg-slate-100 opacity-80 hover:opacity-100",
  },
  size: {
    base: "h-10 py-2 px-4 rounded-xl",
    sm: "h-9 px-3 rounded-xl",
    xs: " py-1 px-2 rounded-lg text-xs",
    lg: "h-10 px-8 rounded-2xl",
  },
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof (typeof BUTTON_VARIANTS)["variant"];
  size?: keyof (typeof BUTTON_VARIANTS)["size"];
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "base", ...rest }, ref) => {
    return (
      <button
        {...rest}
        ref={ref}
        className={`${className} ${BUTTON_BASE_STYLE} ${BUTTON_VARIANTS.variant[variant]} ${BUTTON_VARIANTS.size[size]}`}
      />
    );
  }
);
Button.displayName = "Button";

export default Button;
