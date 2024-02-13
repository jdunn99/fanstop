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
import {
  DeleteButton,
  MoveDownButton,
  MoveUpButton,
} from "./editor-update-buttons";

export interface EditorCreateButtonProps {
  index: number;
}
export function EditorUpdateButton({ index }: EditorCreateButtonProps) {
  const { isOpen, toggle, onClose } = useMenu();

  return (
    <Menu onClose={onClose}>
      <Button onClick={toggle} variant="ghost" size="sm">
        <BsThreeDotsVertical />
      </Button>
      {isOpen ? (
        <MenuList className="w-32">
          <MenuGroup>
            <MoveUpButton index={index} toggle={toggle} />
            <MoveDownButton index={index} toggle={toggle} />
            <DeleteButton index={index} toggle={toggle} />
            {Object.keys(TAG_WITH_TEXT).map((tag) => (
              <EditorControlItem
                key={tag}
                tag={tag as ValidTags}
                action={EditorActionType.ChangeBlockTag}
                onClose={onClose}
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
