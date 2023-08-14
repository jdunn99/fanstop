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
    }
);
MenuButton.displayName = "MenuButton";

const MenuList = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...rest }, ref) => {
    return (
        <div
            {...rest}
            ref={ref}
            className={`${className} absolute right-0 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5`}
        >
            <div
                className="py-1"
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
                className={`${className} w-full text-left block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900`}
            />
        );
    }
);
MenuItem.displayName = "MenuItem";

const MENU_TEXT_VARIANTS = {
    sm: "text-slate-600 text-sm",
    base: "text-slate-600",
    heading: "text-slate-800 text-lg font-semibold",
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
    }
);
MenuText.displayName = "MenuText";

interface MenuGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    border?: boolean;
}
const MenuGroup = React.forwardRef<HTMLDivElement, MenuGroupProps>(
    ({ border, className, ...rest }, ref) => {
        return (
            <div
                {...rest}
                ref={ref}
                className={`${className} ${border && "border-b"} py-2`}
            />
        );
    }
);
MenuGroup.displayName = "MenuGroup";

export { MenuList, MenuButton, MenuItem, MenuGroup, MenuText };
