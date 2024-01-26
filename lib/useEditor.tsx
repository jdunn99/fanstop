import React from "react";
import { Cloudinary } from "@cloudinary/url-gen";

export type ValidTags = "h1" | "h2" | "h3" | "h4" | "h5" | "p" | "img";

export interface Block {
  id: string;
  tag: ValidTags;
  data: {
    text?: string;
    src?: string;
    formData?: FormData;
  };
}

export interface EditorState {
  blocks: Block[];
  metadata: {
    title: string;
    description: string;
    authorId: string;
  } | null;
  currentIndex: number;
}

export enum EditorActionType {
  UpdateTitle,
  UpdateDescription,
  AddBlock,
  AddImageBlock,
  UpdateBlockText,
  ChangeBlockTag,
  ChangeBlockOrder,
  DeleteBlock,
}

interface AddBlockAction {
  type: EditorActionType.AddBlock;
  payload: {
    tag: ValidTags;
    index: number;
  };
}

interface AddImageBlockAction {
  type: EditorActionType.AddImageBlock;
  payload: {
    formData: FormData;
    src: string;
    index: number;
  };
}

interface UpdateBlockTextAction {
  type: EditorActionType.UpdateBlockText;
  payload: {
    index: number;
    text: string;
  };
}

interface ChangeBlockTagAction {
  type: EditorActionType.ChangeBlockTag;
  payload: {
    index: number;
    newTag: ValidTags;
  };
}

interface DeleteBlockAction {
  type: EditorActionType.DeleteBlock;
  payload: {
    index: number;
  };
}

interface UpdateBlockOrderAction {
  type: EditorActionType.ChangeBlockOrder;
  payload: {
    oldIndex: number;
    newIndex: number;
  };
}

interface UpdateTitleAction {
  type: EditorActionType.UpdateTitle;
  payload: {
    title: string;
  };
}

export type EditorAction =
  | AddBlockAction
  | AddImageBlockAction
  | UpdateBlockTextAction
  | ChangeBlockTagAction
  | DeleteBlockAction
  | UpdateTitleAction
  | UpdateBlockOrderAction;

export function editorReducer(state: EditorState, action: EditorAction) {
  switch (action.type) {
    case EditorActionType.AddBlock: {
      const { index, tag } = action.payload;
      const blocks = [...state.blocks];

      blocks.splice(index + 1, 0, {
        id: Math.random().toString(),
        data: {
          text: "",
        },
        tag,
      });

      return {
        ...state,
        currentIndex: index + 1,
        blocks,
      };
    }
    case EditorActionType.UpdateTitle: {
      return {
        ...state,
      };
    }
    case EditorActionType.AddImageBlock: {
      const { index, formData, src } = action.payload;

      const blocks = [...state.blocks];
      blocks.splice(index + 1, 0, {
        id: Math.random().toString(),
        data: {
          src,
          formData,
        },
        tag: "img",
      });
      return {
        ...state,
        blocks,
        currentIndex: index + 1,
      };
    }
    case EditorActionType.UpdateBlockText: {
      const { index, text } = action.payload;
      const updatedBlocks = [...state.blocks];

      updatedBlocks[index].data.text = text;

      return {
        ...state,
        currentIndex: index,
        blocks: updatedBlocks,
      };
    }
    case EditorActionType.ChangeBlockTag: {
      const { index, newTag } = action.payload;

      const updatedBlocks = [...state.blocks];
      updatedBlocks[index].tag = newTag;

      return {
        ...state,
        currentIndex: index,
        blocks: updatedBlocks,
      };
    }

    case EditorActionType.ChangeBlockOrder: {
      const { oldIndex, newIndex } = action.payload;

      const blocks = [...state.blocks];
      const temp = blocks[oldIndex];
      blocks[oldIndex] = blocks[newIndex];
      blocks[newIndex] = temp;

      return { ...state, blocks };
    }
    case EditorActionType.DeleteBlock: {
      const { index } = action.payload;

      return {
        ...state,
        currentIndex: index === 0 ? 0 : index - 1,
        blocks: state.blocks.filter((_, idx) => index !== idx),
      };
    }

    default:
      return state;
  }
}
export const EditorContext = React.createContext<
  | {
      editorState: EditorState;
      dispatch: React.Dispatch<EditorAction>;
      cld: Cloudinary;
    }
  | undefined
>(undefined);

export function useEditor() {
  const context = React.useContext(EditorContext);
  // TODO: ENV THIS

  if (context === undefined) {
    throw new Error("Context must be called within a Provider");
  }

  const { dispatch, editorState } = context;
  return { dispatch, editorState };
}
