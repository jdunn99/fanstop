import { useEditor, EditorActionType } from "@/lib/useEditor";
import { MenuItem } from "../ui/menu";

interface UpdateButtonProps {
  index: number;
  toggle(): void;
}

export function MoveUpButton({ index, toggle }: UpdateButtonProps) {
  const { dispatch } = useEditor();

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

  return (
    <MenuItem disabled={index === 0} onClick={handleMoveUp}>
      Move Up
    </MenuItem>
  );
}

export function MoveDownButton({ index, toggle }: UpdateButtonProps) {
  const { dispatch, editorState } = useEditor();

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
    <MenuItem
      onClick={handleMoveDown}
      disabled={index === editorState.blocks.length - 1}
    >
      Move Down
    </MenuItem>
  );
}

export function DeleteButton({ index, toggle }: UpdateButtonProps) {
  const { dispatch, editorState } = useEditor();

  function handleDelete() {
    if (index === 0 && editorState.blocks.length === 1) return;

    dispatch({
      type: EditorActionType.DeleteBlock,
      payload: { index },
    });
    toggle();
  }

  return (
    <MenuItem
      onClick={handleDelete}
      disabled={index === 0 && editorState.blocks.length === 1}
    >
      Delete
    </MenuItem>
  );
}
