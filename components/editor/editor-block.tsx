import React from "react";
import { EditorTag } from "./editor-tag";
import { Block, EditorActionType, useEditor } from "@/lib/useEditor";
import { Menu, MenuGroup, MenuItem, MenuList, useMenu } from "../ui/menu";
import Button from "../ui/button";
import { EditorCreateButton } from "./editor-create-button";
import { EditorUpdateButton } from "./editor-update-menu";
import { PostTag } from "../posts/post-tag";
import {
  EditorDrawerCreateButton,
  EditorDrawerUpdateButton,
} from "./editor-control-drawer";

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
          <React.Fragment>
            <div className="absolute right-[100%] mr-2 gap-1 hidden md:flex">
              <EditorCreateButton index={index} />
              <EditorUpdateButton index={index} />
            </div>

            <div className="absolute right-[100%] md:hidden flex">
              <EditorDrawerCreateButton index={index} />
              <EditorDrawerUpdateButton index={index} />
            </div>
          </React.Fragment>
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
