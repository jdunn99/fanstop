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
import { EditorControlItem } from "./editor-control";
import { TAG_WITH_TEXT } from "./editor-tag";

interface EditorCreateButtonProps {
  index: number;
  tag: ValidTags;
}
export function EditorUpdateButton({ tag, index }: EditorCreateButtonProps) {
  const { isOpen, toggle, onClose } = useMenu();
  const { editorState, dispatch } = useEditor();

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
              disabled={index === 0 && editorState.blocks.length === 1}
            >
              Delete
            </MenuItem>
            <MenuItem
              onClick={handleMoveDown}
              disabled={index === editorState.blocks.length - 1}
            >
              Move Down
            </MenuItem>
            {Object.keys(TAG_WITH_TEXT).map((tag) => (
              <EditorControlItem
                key={tag}
                tag={tag as ValidTags}
                action={EditorActionType.ChangeBlockTag}
                index={index}
              >
                {TAG_WITH_TEXT[tag as ValidTags]}
              </EditorControlItem>
            ))}
          </MenuGroup>
        </MenuList>
      ) : null}
    </Menu>
  );
}
