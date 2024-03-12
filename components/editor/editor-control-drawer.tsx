import React from "react";
import ReactDOM from "react-dom";
import Button from "../ui/button";
import { TAG_WITH_TEXT } from "./editor-tag";
import { EditorControlItem } from "./editor-control";
import { EditorActionType, ValidTags } from "@/lib/useEditor";
import { BsPlus, BsThreeDotsVertical } from "react-icons/bs";
import {
  DeleteButton,
  MoveDownButton,
  MoveUpButton,
} from "./editor-update-buttons";

interface DrawerProps {
  isOpen: boolean;
  setIsOpen(value: boolean): void;
  index: number;
  children: React.ReactNode;
}

export function EditorControlDrawer({
  isOpen,
  setIsOpen,
  index,
  children,
}: DrawerProps) {
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
      className={`transform bottom-0 w-full fixed bg-slate-50  overflow-auto z-50 p-4  right-0 ${
        isOpen ? "translate-y-0" : "translate-y-full"
      } transition-all duration-500`}
    >
      {children}
    </div>,
    rootRef.current
  );
}

export function EditorDrawerCreateButton({ index }: { index: number }) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  function onClose() {
    setIsOpen(false);
  }
  return (
    <React.Fragment>
      <Button
        variant="ghost"
        className="relative flex lg:hidden "
        onClick={() => setIsOpen(true)}
      >
        <BsPlus />
      </Button>
      <EditorControlDrawer isOpen={isOpen} setIsOpen={setIsOpen} index={index}>
        {Object.keys(TAG_WITH_TEXT).map((tag) => (
          <EditorControlItem
            key={tag}
            tag={tag as ValidTags}
            onClose={onClose}
            action={EditorActionType.AddBlock}
            index={index}
          >
            {TAG_WITH_TEXT[tag as ValidTags]}
          </EditorControlItem>
        ))}
      </EditorControlDrawer>
    </React.Fragment>
  );
}

export function EditorDrawerUpdateButton({ index }: { index: number }) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  function onClose() {
    setIsOpen(false);
  }
  return (
    <React.Fragment>
      <Button
        variant="ghost"
        className="relative flex lg:hidden ml-auto"
        onClick={() => setIsOpen(true)}
      >
        <BsThreeDotsVertical />
      </Button>
      <EditorControlDrawer isOpen={isOpen} setIsOpen={setIsOpen} index={index}>
        <MoveUpButton index={index} toggle={onClose} />
        <MoveDownButton index={index} toggle={onClose} />
        <DeleteButton index={index} toggle={onClose} />
        {Object.keys(TAG_WITH_TEXT).map((tag) => (
          <EditorControlItem
            key={tag}
            tag={tag as ValidTags}
            onClose={onClose}
            action={EditorActionType.ChangeBlockTag}
            index={index}
          >
            {TAG_WITH_TEXT[tag as ValidTags]}
          </EditorControlItem>
        ))}
      </EditorControlDrawer>
    </React.Fragment>
  );
}
