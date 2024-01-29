import React from "react";
import Button from "./button";

interface ToastProps {
  children?: React.ReactNode;
  timeout?: number;
}

const BASE_TOAST_STYLE =
  "flex flex-col gap-2 p-4 rounded-lg shadow-md space-y-1";
const TOAST_VARIANTS = {
  base: "bg-slate-300 text-slate-800",
  error: "bg-red-300 text-red-800",
  success: "bg-green-300 text-green-800",
};

interface ToastOpenProps {
  variant?: keyof typeof TOAST_VARIANTS;
  title: string;
  description: string;
  timeout?: number;
}
type Toast = {
  id: string;
} & ToastOpenProps;

interface ToastService {
  toast(props: ToastOpenProps): void;
  close(id: string): void;
}

const ToastContext = React.createContext<ToastService>({
  toast: () => null,
  close: () => null,
});

export function useToast() {
  return React.useContext(ToastContext);
}

const ToastItem = React.forwardRef<
  HTMLDivElement,
  ToastOpenProps & React.HTMLAttributes<HTMLDivElement>
>(({ className, title, description, variant = "base", ...rest }, ref) => {
  return (
    <div
      {...rest}
      ref={ref}
      className={`${className} ${BASE_TOAST_STYLE} ${TOAST_VARIANTS[variant]}`}
    >
      <h1 className="text-lg font-semibold">{title}</h1>
      <p>{description}</p>
    </div>
  );
});
ToastItem.displayName = "Toast";

export default function ToastProvider({ children }: ToastProps) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  function toast({ title, variant, description, timeout }: ToastOpenProps) {
    const id = Date.now().toString();
    setToasts((toasts) => [...toasts, { id, title, variant, description }]);

    if (timeout) {
      console.log("CLOSING IN: ", timeout);
      setTimeout(() => close(id), timeout);
    }
  }

  function close(id: string) {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  return (
    <ToastContext.Provider value={{ toast, close }}>
      {children}
      <div className="space-y-2 z-50 fixed bottom-2 right-2">
        {toasts.map(({ id, description, title, variant }) => (
          <div key={id} className="">
            <Button
              size="xs"
              className="absolute top-2 right-2 "
              variant="ghost"
              onClick={() => close(id)}
            >
              X
            </Button>
            <ToastItem
              id={id}
              description={description}
              title={title}
              variant={variant}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
