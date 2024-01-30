import {
  EditorAction,
  EditorActionType,
  ValidTags,
  useEditor,
} from "@/lib/useEditor";
import Button from "../ui/button";
import { Menu, MenuList, MenuGroup, MenuItem, useMenu } from "../ui/menu";
import React from "react";
import { BsPlus } from "react-icons/bs";
import { EditorControlItem } from "./editor-control";
import { TAG_WITH_TEXT } from "./editor-tag";

interface EditorCreateButtonProps {
  index: number;
}
export function EditorCreateButton({ index }: EditorCreateButtonProps) {
  const { isOpen, toggle, onClose } = useMenu();

  return (
    <Menu onClose={onClose}>
      <Button onClick={toggle} variant="ghost" size="sm">
        <BsPlus />
      </Button>
      {isOpen ? (
        <MenuList>
          <MenuGroup>
            {Object.keys(TAG_WITH_TEXT).map((tag) => (
              <EditorControlItem
                key={tag}
                tag={tag as ValidTags}
                action={EditorActionType.AddBlock}
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
