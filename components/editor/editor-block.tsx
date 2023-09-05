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
        const { isOpen, toggle, onClose } = useMenu();

        return (
            <div className="flex items-center justify-center">
                <EditorCreateButton index={index} />
                <EditorUpdateButton index={index} tag={block.tag} />
                <EditorTag ref={ref} tag={block.tag} index={index} {...rest} />
            </div>
        );
    }
);
EditorBlock.displayName = "EditorBlock";
