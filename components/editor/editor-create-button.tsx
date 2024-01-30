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

interface EditorCreateButtonProps {
  index: number;
}
export function EditorCreateButton({ index }: EditorCreateButtonProps) {
  const { isOpen, toggle, onClose } = useMenu();
  const { dispatch } = useEditor();
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const [file, setFile] = React.useState<File>();

  function addBlock(tag: ValidTags) {
    dispatch({ type: EditorActionType.AddBlock, payload: { index, tag } });
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      const reader = new FileReader();
      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("upload_preset", "fanstop");

      reader.onload = (event) => {
        const { target } = event;
        if (!target) {
          return;
        }

        dispatch({
          type: EditorActionType.AddImageBlock,
          payload: {
            index,
            src: target.result!.toString(),
            formData,
          },
        });
      };

      reader.readAsDataURL(selectedFile);
    }
  }

  return (
    <Menu onClose={onClose}>
      <Button onClick={toggle} variant="ghost" size="sm">
        <BsPlus />
      </Button>
      {isOpen ? (
        <MenuList>
          <MenuGroup>
            <MenuItem onClick={() => addBlock("p")}>Text</MenuItem>
            <MenuItem onClick={() => addBlock("h1")}>Heading</MenuItem>
            <MenuItem
              onClick={() => {
                imageInputRef.current?.click();
              }}
            >
              Image
            </MenuItem>
            <input
              type="file"
              ref={imageInputRef}
              className="hidden"
              onChange={onFileChange}
            />
          </MenuGroup>
        </MenuList>
      ) : null}
    </Menu>
  );
}
