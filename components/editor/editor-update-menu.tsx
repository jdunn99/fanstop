import {
    EditorAction,
    EditorActionType,
    ValidTags,
    useEditor,
} from "@/lib/useEditor";
import Button from "../ui/button";
import { Menu, MenuList, MenuGroup, MenuItem, useMenu } from "../ui/menu";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

interface EditorCreateButtonProps {
    index: number;
    tag: ValidTags;
}
export function EditorUpdateButton({ tag, index }: EditorCreateButtonProps) {
    const { isOpen, toggle, onClose } = useMenu();
    const { editorState, dispatch } = useEditor();

    function HeadingGroup() {
        function changeTag(newTag: Exclude<ValidTags, "p">) {
            dispatch({
                type: EditorActionType.ChangeBlockTag,
                payload: {
                    index,
                    newTag,
                },
            });
        }

        return (
            <React.Fragment>
                <MenuItem onClick={() => changeTag("h1")}>Heading 1</MenuItem>
                <MenuItem onClick={() => changeTag("h2")}>Heading 2</MenuItem>
                <MenuItem onClick={() => changeTag("h3")}>Heading 3</MenuItem>
                <MenuItem onClick={() => changeTag("h4")}>Heading 4</MenuItem>
                <MenuItem onClick={() => changeTag("h5")}>Heading 5</MenuItem>
            </React.Fragment>
        );
    }

    function handleDelete() {
        if (index === 0 && editorState.blocks.length === 1) return;

        dispatch({
            type: EditorActionType.DeleteBlock,
            payload: { index },
        });
        toggle();
    }

    function handleMoveUp() {
        if (index > 0) {
            dispatch({
                type: EditorActionType.ChangeBlockOrder,
                payload: {
                    oldIndex: index,
                    newIndex: index - 1,
                },
            });
        }
        toggle();
    }

    function handleMoveDown() {
        if (index < editorState.blocks.length - 1) {
            dispatch({
                type: EditorActionType.ChangeBlockOrder,
                payload: {
                    oldIndex: index,
                    newIndex: index + 1,
                },
            });
        }
        toggle();
    }

    return (
        <Menu onClose={onClose}>
            <Button onClick={toggle} variant="ghost" size="sm">
                <BsThreeDotsVertical />
            </Button>
            {isOpen ? (
                <MenuList>
                    <MenuGroup>
                        <MenuItem disabled={index === 0} onClick={handleMoveUp}>
                            Move Up
                        </MenuItem>
                        <MenuItem
                            onClick={handleDelete}
                            disabled={
                                index === 0 && editorState.blocks.length === 1
                            }
                        >
                            Delete
                        </MenuItem>
                        <MenuItem
                            onClick={handleMoveDown}
                            disabled={index === editorState.blocks.length - 1}
                        >
                            Move Down
                        </MenuItem>
                        {tag !== "p" ? <HeadingGroup /> : null}
                    </MenuGroup>
                </MenuList>
            ) : null}
        </Menu>
    );
}
