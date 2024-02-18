import React from "react";
import ReactDOM from "react-dom";

interface PortalProps {
  children: React.ReactNode;
}
export function Portal({ children }: PortalProps) {
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

  return ReactDOM.createPortal(children, rootRef.current);
}
