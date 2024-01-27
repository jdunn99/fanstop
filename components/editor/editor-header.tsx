import React from "react";
import { BASE_EDITOR_TAG_CONFIG } from "./editor";

interface EditorHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  tag: "h1" | "h2" | "h3" | "h4" | "h5";
}

export const EditorHeader = React.forwardRef<
  HTMLHeadingElement,
  EditorHeaderProps
>(({ tag, ...rest }, ref) => {
  return React.createElement(tag, {
    className: BASE_EDITOR_TAG_CONFIG,
    ref,
    ...rest,
  });
});
EditorHeader.displayName = "EditorHeader";
