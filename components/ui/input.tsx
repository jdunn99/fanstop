import React from "react";
import { FaSearch } from "react-icons/fa";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...rest }, ref) => {
    return type === "search" ? (
      <div className="flex justify-start items-center relative w-full flex-1">
        <FaSearch className="text-slate-500 absolute left-4 h-4 w-4 pointer-events-none" />
        <input
          type={type}
          className={`${className} pl-10 flex h-10 rounded-lg max-sm:text-lg text-sm border bg-slate-50 px-3 py-2 ring-offset-white focus-visible:outline-none focus-visible:ring-1 outline-none ring-rose-400 dark:bg-slate-800 dark:border-slate-700`}
          ref={ref}
          {...rest}
        />
      </div>
    ) : (
      <input
        type={type}
        className={`${className} flex h-10 rounded-lg max-sm:text-lg text-sm border bg-slate-50 px-3 py-2 ring-offset-white focus-visible:outline-none focus-visible:ring-1 outline-none ring-rose-400 dark:bg-slate-800 dark:border-slate-700`}
        ref={ref}
        {...rest}
      />
    );
  }
);
Input.displayName = "Input";

export default Input;
