import { EditorActionType, ValidTags, useEditor } from "@/lib/useEditor";
import React from "react";
import { MenuGroup, MenuItem } from "../ui/menu";

interface EditorBlockItemProps {
  tag: ValidTags;
  index: number;
  action:
    | EditorActionType.AddBlock
    | EditorActionType.AddImageBlock
    | EditorActionType.ChangeBlockTag;
  children?: React.ReactNode;
  onClose?(): void;
}

export function EditorControlImage({
  tag,
  index,
  action,
}: EditorBlockItemProps) {
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const { dispatch } = useEditor();

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

        const src = target.result!.toString();

        if (action === EditorActionType.AddBlock) {
          dispatch({
            type: EditorActionType.AddImageBlock,
            payload: {
              index,
              src,
              formData,
            },
          });
        } else {
          dispatch({
            type: EditorActionType.ChangeBlockTag,
            payload: {
              newTag: tag,
              index,
              imgData: {
                src,
                formData,
              },
            },
          });
        }
      };

      reader.readAsDataURL(selectedFile);
    }
  }

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}

export function EditorControlItem({
  action,
  index,
  tag,
  children,
  onClose,
}: EditorBlockItemProps) {
  const { dispatch } = useEditor();

  function changeTag(tag: ValidTags) {
    dispatch({
      type: EditorActionType.ChangeBlockTag,
      payload: {
        index,
        newTag: tag,
      },
    });
  }
  function addBlock(tag: ValidTags) {
    dispatch({ type: EditorActionType.AddBlock, payload: { index, tag } });
  }

  function onClick() {
    if (action === EditorActionType.AddBlock) {
      addBlock(tag);
    } else {
      changeTag(tag);
    }
    onClose && onClose();
  }

  return tag === "img" ? (
    <EditorControlImage action={action} index={index} tag={tag} />
  ) : (
    <MenuItem onClick={onClick}>{children}</MenuItem>
  );
}
