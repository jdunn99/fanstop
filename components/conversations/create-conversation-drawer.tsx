import React from "react";
import { Portal } from "../ui/portal";
import { BsPlus } from "react-icons/bs";
import Button from "../ui/button";
import { useMenu } from "../ui/menu";
import { ConversationSearch } from "./conversation-search";

interface CreateConversationDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export function CreateConversationDrawer({
  isOpen,
  onClose,
}: CreateConversationDrawerProps) {
  return (
    <Portal>
      <div
        className={`transform top-0 w-full fixed bg-white h-screen overflow-auto z-40 shadow ${
          isOpen ? "translate-y-16" : "translate-y-full"
        } transition-all duration-500`}
      >
        <Button
          variant="ghost"
          className="absolute left-2 top-5 !text-sm"
          size="sm"
          onClick={onClose}
        >
          Cancel
        </Button>
        <div className="mt-6 w-full space-y-4">
          <div className="text-center font-bold text-sm text-slate-800">
            New conversation
          </div>
          <ConversationSearch />
        </div>
      </div>
    </Portal>
  );
}

export function CreateConversationDrawerButton() {
  const { isOpen, onClose, onOpen } = useMenu();

  return (
    <React.Fragment>
      <Button onClick={onOpen}>
        <BsPlus />
      </Button>

      <CreateConversationDrawer isOpen={isOpen} onClose={onClose} />
    </React.Fragment>
  );
}
