import React from "react";
import { Sidebar } from "./sidebar";
import Button from "./ui/button";
import ReactDOM from "react-dom";
import { FaBars } from "react-icons/fa";

interface NavDrawerProps {
  isOpen: boolean;
  setIsOpen(value: boolean): void;
}
export function NavDrawer({ isOpen, setIsOpen }: NavDrawerProps) {
  const rootRef = React.useRef<Element | null>(null);

  React.useEffect(() => {
    rootRef.current = document.getElementById("root");
    return () => {
      rootRef.current = null;
    };
  }, []);

  if (!rootRef.current) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className={`transform top-0 w-full fixed bg-white h-screen overflow-auto z-50 p-1 ${
        isOpen ? "translate-y-0" : "-translate-y-full"
      } transition-all duration-500`}
    >
      <Button
        variant="ghost"
        className="absolute right-6 top-4"
        onClick={() => setIsOpen(false)}
      >
        x
      </Button>
      <div className="mt-6 pl-8 pr-32">
        <Sidebar />
      </div>
    </div>,
    rootRef.current
  );
}

export function NavDrawerOpenButton() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <React.Fragment>
      <Button
        variant="ghost"
        className="relative flex lg:hidden ml-auto"
        onClick={() => setIsOpen(true)}
      >
        <FaBars />
      </Button>
      <NavDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
    </React.Fragment>
  );
}
