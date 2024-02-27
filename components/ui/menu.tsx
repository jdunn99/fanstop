import React from "react";
import { BUTTON_BASE_STYLE, BUTTON_VARIANTS, ButtonProps } from "./button";

interface MenuProps {
  children?: React.ReactNode;
  onClose(): void;
}
export function Menu({ onClose, children }: MenuProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-right">
      {children}
    </div>
  );
}

export function useMenu() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  function onOpen() {
    setIsOpen(true);
  }

  function onClose() {
    setIsOpen(false);
  }

  function toggle() {
    setIsOpen(!isOpen);
  }

  return { isOpen, onOpen, onClose, toggle };
}

export interface MenuButtonProps extends ButtonProps {}
const MenuButton = React.forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ className, variant = "primary", size = "base", ...rest }, ref) => {
    return (
      <button
        {...rest}
        ref={ref}
        className={`${className} ${BUTTON_BASE_STYLE} ${BUTTON_VARIANTS.variant[variant]} ${BUTTON_VARIANTS.size[size]}`}
      />
    );
  },
);
MenuButton.displayName = "MenuButton";

export interface MenuDirection {
  direction?: "left" | "right";
}
const MenuList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & MenuDirection
>(({ className, direction = "right", children, ...rest }, ref) => {
  const dir = direction === "right" ? "right-0" : "left-0";

  return (
    <div
      {...rest}
      ref={ref}
      className={`${className} z-[99] absolute ${dir} mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-slate-800 dark:border-slate-700`}
    >
      <div
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      >
        {children}
      </div>
    </div>
  );
});
MenuList.displayName = "MenuList";

export interface MenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ className, ...rest }, ref) => {
    return (
      <button
        {...rest}
        ref={ref}
        role="menuitem"
        className={`${className} disabled:bg-slate-50 disabled:text-slate-400 w-full text-left block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-slate-100 dark:text-slate-300`}
      />
    );
  },
);
MenuItem.displayName = "MenuItem";

const MENU_TEXT_VARIANTS = {
  sm: "text-slate-600 text-sm dark:text-slate-400",
  base: "text-slate-600 dark:text-slate-300",
  heading: "text-slate-800 text-lg font-semibold dark:text-slate-200",
};

interface MenuTextProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof MENU_TEXT_VARIANTS;
}
const MenuText = React.forwardRef<HTMLDivElement, MenuTextProps>(
  ({ variant = "base", className, ...rest }, ref) => {
    return (
      <div
        {...rest}
        ref={ref}
        role="menuitem"
        className={`${className} ${MENU_TEXT_VARIANTS[variant]} w-full text-left block px-4`}
      />
    );
  },
);
MenuText.displayName = "MenuText";

interface MenuGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  border?: boolean;
}
// ??? weird any type error
const MenuGroup: any = React.forwardRef<HTMLDivElement, MenuGroupProps>(
  ({ border, className, ...rest }, ref) => {
    return (
      <div
        {...rest}
        ref={ref}
        className={`${className} ${border && "border-b"} dark:border-slate-700`}
      />
    );
  },
);
MenuGroup.displayName = "MenuGroup";

export { MenuList, MenuButton, MenuItem, MenuGroup, MenuText };
