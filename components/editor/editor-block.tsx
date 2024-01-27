import React from "react";
import { EditorTag } from "./editor-tag";
import { Block, EditorActionType, useEditor } from "@/lib/useEditor";
import { Menu, MenuGroup, MenuItem, MenuList, useMenu } from "../ui/menu";
import Button from "../ui/button";
import { EditorCreateButton } from "./editor-create-button";
import { EditorUpdateButton } from "./editor-update-menu";
import { PostTag } from "../posts/post-tag";

interface EditorBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
  block: Block;
  isEditor?: boolean;
}

export const EditorBlock = React.forwardRef(
  (
    { index, block, isEditor = true, ...rest }: EditorBlockProps,
    ref: React.Ref<any>
  ) => {
    return (
      <div className="flex items-center my-4 relative">
        {isEditor ? (
          <div className="absolute right-[100%] flex mr-2 gap-1">
            <EditorCreateButton index={index} />
            <EditorUpdateButton index={index} tag={block.tag} />
          </div>
        ) : null}
        {isEditor ? (
          <EditorTag ref={ref} tag={block.tag} index={index} {...rest} />
        ) : (
          <PostTag tag={block.tag} block={block} {...rest} />
        )}
      </div>
    );
  }
);
EditorBlock.displayName = "EditorBlock";
