import React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<any, any>(
  ({ className, value, unstyled, ...rest }, ref) => {
    return (
      <textarea
        className={`${className} ${
          unstyled
            ? ""
            : "overflow-auto flex rounded-lg border bg-slate-50 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 outline-none ring-rose-200"
        }`}
        ref={ref}
        {...rest}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export default Textarea;
