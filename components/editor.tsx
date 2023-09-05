// import React from "react";
// import Link from "next/link";
// import Button from "./ui/button";
// import { EditorBlock } from "./editor/editor-block";
// import { Block } from "./editor/editor-block";

// interface EditorProps {
//     id: string;
//     title: string;
//     content?: any;
// }
// export function Editor({ id, title, content }: EditorProps) {
//     const ref = React.useRef<HTMLDivElement>();
//     const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
//     const [shouldFocus, setShouldFocus] = React.useState<boolean>(false);
//     const [temp, setTemp] = React.useState<Block[]>([
//         {
//             id: "test",
//             tag: "p",
//             data: {
//                 text: "",
//             },
//         },
//     ]);

//     React.useEffect(() => {
//         if (ref.current && shouldFocus) {
//             ref.current.focus();
//             setShouldFocus(false);
//         }
//     }, [shouldFocus]);

//     function callback(data: string, index: number, insert?: boolean) {
//         const arr = [...temp];
//         arr[index].data.text = data;

//         if (insert) {
//             arr.splice(index + 1, 0, {
//                 id: Math.random().toString(), // this is bad but for now i dont want to add uuid
//                 data: {
//                     text: "",
//                 },
//                 tag: "p",
//             });
//             setShouldFocus(true);
//         }
//         setTemp(arr);
//         setSelectedIndex(index + 1);
//     }

//     return (
//         <div>
//             <div className="grid w-full gap-2 pt-4 px-8">
//                 <header className="sticky top-0 z-40 bg-white ">
//                     <div className="max-w-screen-xl flex h-16 items-center mx-auto w-full justify-between py-4">
//                         <Link href="/">Back</Link>
//                         <Button>Publish</Button>
//                     </div>
//                 </header>
//                 <article className="prose mx-auto w-full max-w-screen-lg ">
//                     <textarea
//                         autoFocus
//                         defaultValue={title}
//                         id="title"
//                         placeholder="Post title"
//                         className="w-full text-slate-900 resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
//                     />
//                     <textarea
//                         autoFocus
//                         id="description"
//                         placeholder="Post description"
//                         className="w-full resize-none appearance-none bg-transparent focus:outline-none font-semibold"
//                         onKeyDown={(e) => {}}
//                     />
//                     <div className="w-full ">
//                         {temp.map((block, index) => (
//                             <EditorBlock
//                                 ref={selectedIndex === index ? ref : null}
//                                 callback={callback}
//                                 block={block}
//                                 key={index}
//                                 index={index}
//                             />
//                         ))}
//                     </div>
//                 </article>
//             </div>
//         </div>
//     );
// }
import React, { useReducer, useState, useRef } from "react";

type ValidTags = "h1" | "p" | "a";

interface Block {
    id: string;
    tag: ValidTags;
    data: {
        text?: string;
    };
}

interface EditorProps {
    id: string;
    title: string;
    content?: any;
}

interface EditorState {
    blocks: Block[];
}

enum EditorActionType {
    AddBlock,
    UpdateBlockText,
    ChangeBlockTag,
    ChangeBlockOrder,
    DeleteBlock,
}

interface AddBlockAction {
    type: EditorActionType.AddBlock;
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

type EditorAction =
    | AddBlockAction
    | UpdateBlockTextAction
    | ChangeBlockTagAction
    | DeleteBlockAction
    | UpdateBlockOrderAction;

const editorReducer = (
    state: EditorState,
    action: EditorAction
): EditorState => {
    switch (action.type) {
        case EditorActionType.AddBlock:
            return {
                blocks: [
                    ...state.blocks,
                    {
                        id: Math.random().toString(),
                        tag: "p",
                        data: { text: "" },
                    },
                ],
            };
        case EditorActionType.UpdateBlockText:
            const { index, text } = action.payload;
            const updatedBlocks = [...state.blocks];
            updatedBlocks[index].data.text = text;
            return { blocks: updatedBlocks };
        case EditorActionType.ChangeBlockTag:
            const { blockIndex, newTag } = action.payload;
            const blocksWithNewTag = [...state.blocks];
            blocksWithNewTag[blockIndex].tag = newTag;
            return { blocks: blocksWithNewTag };
        case EditorActionType.DeleteBlock:
            const { blockIdxToDelete } = action.payload;
            const blocksAfterDelete = state.blocks.filter(
                (_, idx) => idx !== blockIdxToDelete
            );
            return { blocks: blocksAfterDelete };
        case EditorActionType.ChangeBlockOrder:
            const { oldIndex, newIndex } = action.payload;
            const reorderedBlocks = [...state.blocks];
            const [movedBlock] = reorderedBlocks.splice(oldIndex, 1);
            reorderedBlocks.splice(newIndex, 0, movedBlock);
            return { blocks: reorderedBlocks };
        default:
            return state;
    }
};

type EditorTagProps = {
    tag: ValidTags;
    callback(data: string, index: number): void;
    index: number;
} & React.HTMLProps<
    HTMLHeadingElement | HTMLParagraphElement | HTMLAnchorElement
>;

const EditorTag: React.ForwardRefRenderFunction<any, EditorTagProps> = (
    { tag, callback, index, ...otherProps },
    ref
) => {
    const [text, setText] = useState<string>("");

    const contentRef = useRef<
        HTMLHeadingElement | HTMLParagraphElement | HTMLAnchorElement
    >(null);

    const handleKeyDown = (
        event: React.KeyboardEvent<
            HTMLHeadingElement | HTMLParagraphElement | HTMLAnchorElement
        >
    ) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (contentRef.current) {
                callback(contentRef.current.innerHTML, index);
            }
        }
    };

    const handleBlur = (
        event: React.FocusEvent<
            HTMLHeadingElement | HTMLParagraphElement | HTMLAnchorElement
        >
    ) => {
        setText(event.target.innerHTML);
    };

    return React.createElement(tag, {
        ...otherProps,
        contentEditable: true,
        autoFocus: true,
        ref: contentRef,
        onKeyDown: handleKeyDown,
        onBlur: handleBlur,
        dangerouslySetInnerHTML: { __html: text },
    });
};

EditorTag.displayName = "EditorTag";
interface EditorBlockProps extends React.HTMLAttributes<HTMLDivElement> {
    index: number;
    block: Block;
    length: number;
    dispatch: React.Dispatch<EditorAction>;
}

const EditorBlock: React.ForwardRefRenderFunction<any, EditorBlockProps> = (
    { index, block, length, dispatch, ...otherProps },
    ref
) => {
    const handleTextChange = (text: string) => {
        dispatch({
            type: EditorActionType.UpdateBlockText,
            payload: {
                index,
                text,
            },
        });
    };

    const handleTagChange = (newTag: ValidTags) => {
        dispatch({
            type: EditorActionType.ChangeBlockTag,
            payload: {
                blockIndex: index,
                newTag,
            },
        });
    };

    const handleDeleteBlock = () => {
        dispatch({
            type: EditorActionType.DeleteBlock,
            payload: {
                blockIdxToDelete: index,
            },
        });
    };

    const handleMoveUp = () => {
        if (index > 0) {
            dispatch({
                type: EditorActionType.ChangeBlockOrder,
                payload: {
                    oldIndex: index,
                    newIndex: index - 1,
                },
            });
        }
    };

    const handleMoveDown = () => {
        if (index < length - 1) {
            dispatch({
                type: EditorActionType.ChangeBlockOrder,
                payload: {
                    oldIndex: index,
                    newIndex: index + 1,
                },
            });
        }
    };

    return (
        <div>
            <EditorTag
                ref={ref}
                tag={block.tag}
                callback={handleTextChange}
                index={index}
                {...otherProps}
                dangerouslySetInnerHTML={{ __html: block.data.text || "" }}
            />
            <button onClick={handleDeleteBlock}>Delete Block</button>
            <button onClick={() => handleTagChange("h1")}>Change to h1</button>
            <button onClick={() => handleTagChange("p")}>Change to p</button>
            <button onClick={handleMoveUp} disabled={index === 0}>
                Move Up
            </button>
            <button onClick={handleMoveDown} disabled={index === length - 1}>
                Move Down
            </button>
        </div>
    );
};

EditorBlock.displayName = "EditorBlock";

/**
 * A rich text editor component.
 * @param {EditorProps} props - The component's props.
 * @returns {JSX.Element} The rendered component.
 */
export function Editor({ id, title, content }: EditorProps) {
    const [editorState, dispatch] = useReducer(editorReducer, {
        blocks: [
            {
                id: "test",
                tag: "p",
                data: {
                    text: "",
                },
            },
        ],
    });

    const handleAddBlock = () => {
        dispatch({
            type: EditorActionType.AddBlock,
        });
    };

    return (
        <div className="prose">
            {/* ... */}
            <div className="w-full bg-orange-500">
                {editorState.blocks.map((block, index) => (
                    <EditorBlock
                        length={editorState.blocks.length}
                        dispatch={dispatch}
                        block={editorState.blocks[index]}
                        key={index}
                        index={index}
                    />
                ))}
            </div>
            <button onClick={handleAddBlock}>Add Block</button>
            {/* ... */}
        </div>
    );
}
