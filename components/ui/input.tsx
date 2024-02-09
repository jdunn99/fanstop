import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...rest }, ref) => {
    return (
      <input
        type={type}
        className={`${className} flex h-10 lg:rounded-lg rounded border bg-slate-50 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 outline-none ring-rose-200`}
        ref={ref}
        {...rest}
      />
    );
  }
);
Input.displayName = "Input";

export default Input;
