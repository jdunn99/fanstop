import {
    EditorActionType,
    EditorContext,
    ValidTags,
    editorReducer,
} from "@/lib/useEditor";
import React from "react";
import { EditorBlock } from "./editor-block";
import Button from "../ui/button";
import Link from "next/link";

interface EditorProps {
    id: string;
    title: string;
    content?: any;
}

export const BASE_EDITOR_TAG_CONFIG =
    "flex-1  m-0 bg-transparent focus:outline-none overflow-hidden";

export function Editor({ id, title, content }: EditorProps) {
    const [editorState, dispatch] = React.useReducer(editorReducer, {
        metadata: {
            title,
            description: "",
            authorId: "",
        },
        currentIndex: 0,
        blocks: [
            {
                id: "1",
                tag: "p",
                data: {
                    text: "",
                },
            },
        ],
    });

    return (
        <EditorContext.Provider value={{ dispatch, editorState }}>
            {JSON.stringify(editorState)}
            <div>
                <div className="grid w-full gap-2 pt-4 px-8">
                    <header className="sticky top-0 z-40 bg-white ">
                        <div className="max-w-screen-xl flex h-16 items-center mx-auto w-full justify-between py-4">
                            <Link href="/">Back</Link>
                            <Button>Publish</Button>
                        </div>
                    </header>
                    <article className="prose mx-auto w-full max-w-screen-lg ">
                        <textarea
                            autoFocus
                            defaultValue={title}
                            id="title"
                            placeholder="Post title"
                            className="w-full text-slate-900 resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
                        />
                        <textarea
                            autoFocus
                            id="description"
                            placeholder="Post description"
                            className="w-full resize-none appearance-none bg-transparent focus:outline-none font-semibold"
                            onKeyDown={(e) => {}}
                        />
                        <div className="w-full ">
                            {editorState.blocks.map((block, index) => (
                                <EditorBlock
                                    block={block}
                                    key={index}
                                    index={index}
                                />
                            ))}
                        </div>
                    </article>
                </div>
            </div>
        </EditorContext.Provider>
    );
}
