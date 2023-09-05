import React from "react";
import Button from "../ui/button";
import { EditorHeader } from "./editor-header";
import { EditorParagraph } from "./editor-paragraph";
import { EditorActionType, ValidTags, useEditor } from "@/lib/useEditor";

interface EditorTagProps extends React.HTMLAttributes<HTMLElement> {
    tag: ValidTags;
    index: number;
}

export const EditorTag = React.forwardRef<HTMLDivElement, EditorTagProps>(
    ({ tag, index, ...rest }, ref) => {
        const { dispatch, editorState } = useEditor();

        function handleNewline(
            event: React.KeyboardEvent<
                HTMLHeadingElement | HTMLParagraphElement
            >
        ) {
            if (event.key === "Backspace") {
                if (event.currentTarget.innerHTML === "" && index !== 0) {
                    dispatch({
                        type: EditorActionType.DeleteBlock,
                        payload: {
                            blockIdxToDelete: index,
                        },
                    });
                }
            }
            if (event.key === "Enter") {
                event.preventDefault();
                dispatch({
                    type: EditorActionType.AddBlock,
                    payload: { index, tag },
                });
            }
        }

        function handleKeyChange(
            event: React.FocusEvent<HTMLHeadingElement | HTMLParagraphElement>
        ) {
            dispatch({
                type: EditorActionType.UpdateBlockText,
                payload: {
                    index,
                    text: event.target.innerHTML,
                },
            });
        }

        if (tag === "p")
            return (
                <EditorParagraph
                    ref={ref}
                    onBlur={handleKeyChange}
                    onKeyDown={handleNewline}
                    dangerouslySetInnerHTML={{
                        __html: editorState.blocks[index].data.text || "",
                    }}
                />
            );
        else
            return (
                <EditorHeader
                    tag={tag}
                    ref={ref}
                    onBlur={handleKeyChange}
                    onKeyDown={handleNewline}
                    dangerouslySetInnerHTML={{
                        __html: editorState.blocks[index].data.text || "",
                    }}
                />
            );
    }
);
EditorTag.displayName = "EditorTag";
