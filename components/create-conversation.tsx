import React from "react";
import { useMenu } from "./ui/menu";
import Button from "./ui/button";
import { BsPlus } from "react-icons/bs";
import ReactDOM from "react-dom";

interface CreateConversationModalProps {
  isOpen: boolean;
  onClose(): void;
}
function CreateConversationModal({
  isOpen,
  onClose,
}: CreateConversationModalProps) {
  const rootRef = React.useRef<Element | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleOutsideClick(event: MouseEvent) {
      if (ref.current) {
        const target = event.target as Node;

        if (target.nodeName !== "BUTTON" && !ref.current.contains(target)) {
          onClose();
        }
      }
    }

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  React.useEffect(() => {
    rootRef.current = document.getElementById("root");
    return () => {
      rootRef.current = null;
    };
  }, []);

  if (!rootRef.current) return null;

  return ReactDOM.createPortal(
    isOpen ? (
      <div className="fixed top-0 z-[99] bg-black/40 w-full h-full ">
        <div className="h-full flex justify-center items-center">
          <div className="p-4 rounded bg-white" ref={ref}>
            Test
          </div>
        </div>
      </div>
    ) : null,
    rootRef.current
  );
}

interface CreateConversationButtonProps {
  variant?: "small" | "base";
}
export function CreateConversationButton({
  variant = "base",
}: CreateConversationButtonProps) {
  const { onOpen, isOpen, onClose } = useMenu();

  return (
    <React.Fragment>
      <CreateConversationModal isOpen={isOpen} onClose={onClose} />
      <Button onClick={onOpen}>
        {variant === "base" ? (
          "Start a new conversation"
        ) : (
          <BsPlus className="text-xl" />
        )}
      </Button>
    </React.Fragment>
  );
}
