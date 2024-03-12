import React from "react";
import { EditorHeader } from "../editor/editor-header";
import { EditorParagraph } from "../editor/editor-paragraph";
import { Block, ValidTags, useEditor } from "@/lib/useEditor";
import { EditorTag } from "../editor/editor-tag";

interface PostTagProps {
  block: Block;
  tag: ValidTags;
}

export const PostTag = React.forwardRef<HTMLDivElement, PostTagProps>(
  ({ tag, block, ...rest }, ref) => {
    if (tag === "p")
      return (
        <EditorParagraph
          {...rest}
          dangerouslySetInnerHTML={{
            __html: block.data.text || "",
          }}
        />
      );
    else if (tag === "img") return <img src={block.data.src} />;
    else
      return (
        <EditorHeader
          tag={tag}
          {...rest}
          dangerouslySetInnerHTML={{
            __html: block.data.text || "",
          }}
        />
      );
  }
);
PostTag.displayName = "PostTag";
