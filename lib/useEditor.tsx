import React from "react";

export type ValidTags = "h1" | "h2" | "h3" | "h4" | "h5" | "p";

export interface Block {
    id: string;
    tag: ValidTags;
    data: {
        text?: string;
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
    AddBlock,
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
        blockIndex: number;
        newTag: ValidTags;
    };
}

interface DeleteBlockAction {
    type: EditorActionType.DeleteBlock;
    payload: {
        blockIdxToDelete: number;
    };
}

interface UpdateBlockOrderAction {
    type: EditorActionType.ChangeBlockOrder;
    payload: {
        oldIndex: number;
        newIndex: number;
    };
}

export type EditorAction =
    | AddBlockAction
    | UpdateBlockTextAction
    | ChangeBlockTagAction
    | DeleteBlockAction
    | UpdateBlockOrderAction;

export function editorReducer(state: EditorState, action: EditorAction) {
    switch (action.type) {
        case EditorActionType.AddBlock:
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
                blocks,
            };
        case EditorActionType.UpdateBlockText: {
            const { index, text } = action.payload;
            const updatedBlocks = [...state.blocks];

            updatedBlocks[index].data.text = text;

            return {
                ...state,
                blocks: updatedBlocks,
            };
        }
        case EditorActionType.ChangeBlockTag: {
            const { blockIndex, newTag } = action.payload;

            const updatedBlocks = [...state.blocks];
            updatedBlocks[blockIndex].tag = newTag;

            return { ...state, blocks: updatedBlocks };
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
            const { blockIdxToDelete } = action.payload;

            return {
                ...state,
                blocks: state.blocks.filter(
                    (_, index) => index !== blockIdxToDelete
                ),
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
      }
    | undefined
>(undefined);

export function useEditor() {
    const context = React.useContext(EditorContext);

    if (context === undefined) {
        throw new Error("Context must be called within a Provider");
    }

    const { dispatch, editorState } = context;
    return { dispatch, editorState };
}
