import React from "react";
import { EditorTag } from "./editor-tag";
import { data } from "autoprefixer";

export interface Block {
    id: string;
    tag: "h1" | "p";
    data: {
        text?: string;
    };
}

interface EditorBlockProps extends React.HTMLAttributes<HTMLDivElement> {
    index: number;
    block: Block;
    callback(data: string, index: number): void;
}

export const EditorBlock = React.forwardRef(
    (
        { index, block, callback, ...rest }: EditorBlockProps,
        ref: React.Ref<any>
    ) => {
        return (
            <EditorTag
                ref={ref}
                tag={block.tag}
                callback={callback}
                index={index}
                {...rest}
                dangerouslySetInnerHTML={{ __html: block.data.text || "" }}
            />
        );
    }
);
EditorBlock.displayName = "EditorBlock";
