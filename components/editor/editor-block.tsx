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

interface EditorBlockProps {
    index: number;
    block: Block;
    callback(data: string, index: number): void;
}
export function EditorBlock({ block, callback, index }: EditorBlockProps) {
    return (
        <EditorTag
            tag={block.tag}
            callback={callback}
            index={index}
            dangerouslySetInnerHTML={{ __html: block.data.text || "" }}
        />
    );
}
