import React from "react";
import { EditorTag } from "./editor-tag";
import { Block, EditorActionType, useEditor } from "@/lib/useEditor";
import { Menu, MenuGroup, MenuItem, MenuList, useMenu } from "../ui/menu";
import Button from "../ui/button";
import { EditorCreateButton } from "./editor-create-button";
import { EditorUpdateButton } from "./editor-update-menu";

interface EditorBlockProps extends React.HTMLAttributes<HTMLDivElement> {
    index: number;
    block: Block;
}

export const EditorBlock = React.forwardRef(
    ({ index, block, ...rest }: EditorBlockProps, ref: React.Ref<any>) => {
        return (
            <div className="flex items-center my-4 relative">
                <div className="absolute right-[100%] flex mr-2 gap-1">
                    <EditorCreateButton index={index} />
                    <EditorUpdateButton index={index} tag={block.tag} />
                </div>
                <EditorTag ref={ref} tag={block.tag} index={index} {...rest} />
            </div>
        );
    }
);
EditorBlock.displayName = "EditorBlock";
