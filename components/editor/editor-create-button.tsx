import {
    EditorAction,
    EditorActionType,
    ValidTags,
    useEditor,
} from "@/lib/useEditor";
import Button from "../ui/button";
import { Menu, MenuList, MenuGroup, MenuItem, useMenu } from "../ui/menu";
import React from "react";

interface EditorCreateButtonProps {
    index: number;
}
export function EditorCreateButton({ index }: EditorCreateButtonProps) {
    const { isOpen, toggle, onClose } = useMenu();
    const { dispatch } = useEditor();

    function addBlock(tag: ValidTags) {
        dispatch({ type: EditorActionType.AddBlock, payload: { index, tag } });
    }

    return (
        <Menu onClose={onClose}>
            <Button onClick={toggle} variant="ghost">
                +
            </Button>
            {isOpen ? (
                <MenuList>
                    <MenuGroup>
                        <MenuItem onClick={() => addBlock("p")}>Text</MenuItem>
                        <MenuItem onClick={() => addBlock("h1")}>
                            Heading
                        </MenuItem>
                    </MenuGroup>
                </MenuList>
            ) : null}
        </Menu>
    );
}
