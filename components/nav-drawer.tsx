import React from "react";
import Button from "./ui/button";
import ReactDOM from "react-dom";
import { FaBars } from "react-icons/fa";
import { Portal } from "./ui/portal";
import { Sidebar } from "./sidebar/sidebar";

interface NavDrawerProps {
  isOpen: boolean;
  setIsOpen(value: boolean): void;
}
export function NavDrawer({ isOpen, setIsOpen }: NavDrawerProps) {
  return (
    <Portal>
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
        <div className="mt-6 pl-4 pr-32">
          <Sidebar />
        </div>
      </div>
    </Portal>
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
