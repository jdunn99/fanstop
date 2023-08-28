import React from "react";
import Link from "next/link";
import Button from "./ui/button";
import { EditorBlock } from "./editor/editor-block";
import { Block } from "./editor/editor-block";

interface EditorProps {
    id: string;
    title: string;
    content?: any;
}
export function Editor({ id, title, content }: EditorProps) {
    const [blocks, setBlocks] = React.useState<Block[]>([
        {
            id: "1",
            tag: "p",
            data: {
                text: "",
            },
        },
    ]);

    function handleBlockChange(data: string, index: number) {
        const updatedBlocks = [...blocks];
        updatedBlocks[index].data.text = data;
        updatedBlocks.splice(index + 1, 0, {
            id: Math.random().toString(), // this is bad but for now i dont want to add uuid
            data: {
                text: "",
            },
            tag: "p",
        });
        setBlocks(updatedBlocks);
    }

    return (
        <form>
            <div className="grid w-full gap-2 pt-4">
                <header className="sticky top-0 z-40 bg-white ">
                    <div className="max-w-screen-xl flex h-16 items-center mx-auto w-full justify-between py-4">
                        <Link href="/">HGi</Link>
                        <Button>Publish</Button>
                    </div>
                </header>
                <div className="prose prose-stone mx-auto  dark:prose-invert">
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
                    <div className="w-full bg-orange-500">
                        {blocks.map((block, index) => (
                            <EditorBlock
                                callback={handleBlockChange}
                                block={block}
                                key={index}
                                index={index}
                            />
                        ))}
                    </div>
                    {/* <div id="editor" className="min-h-[500px]" /> */}
                </div>
            </div>
        </form>
    );
}
