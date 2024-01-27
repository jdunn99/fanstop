import React from "react";
import { BASE_EDITOR_TAG_CONFIG } from "./editor";

export const EditorParagraph = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ ...rest }, ref) => {
  return <p className={BASE_EDITOR_TAG_CONFIG} ref={ref} {...rest} />;
});
EditorParagraph.displayName = "EditorParagraph";
