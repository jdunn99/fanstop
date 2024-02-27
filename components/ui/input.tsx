import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...rest }, ref) => {
    return (
      <input
        type={type}
        className={`${className} flex h-10 rounded-lg max-sm:text-lg text-sm border bg-slate-50 px-3 py-2 ring-offset-white focus-visible:outline-none focus-visible:ring-1 outline-none ring-rose-400 dark:bg-slate-800 dark:border-slate-700`}
        ref={ref}
        {...rest}
      />
    );
  },
);
Input.displayName = "Input";

export default Input;
