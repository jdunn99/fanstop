import { Post } from "@/pages/api/posts";
import EditorJS from "@editorjs/editorjs";
import React from "react";
import { Layout } from "./layout";
import Link from "next/link";
import { Navbar, AuthedNav } from "./nav";
import Button from "./ui/button";
import { EditorBlock } from "./editor/editor-block";
import { Block } from "./editor/editor-block";

interface EditorProps {
    id: string;
    title: string;
    content?: any;
}

interface Props {
    tag: keyof JSX.IntrinsicElements;
    handleKey(e: any): void;
}
function Test({ tag, handleKey }: Props) {
    const Tag = tag;

    return <Tag contentEditable onKeyDown={handleKey} />;
}

export function Editor({ id, title, content }: EditorProps) {
    const [temp, setTemp] = React.useState<Block[]>([
        {
            id: "test",
            tag: "p",
            data: {
                text: "",
            },
        },
    ]);

    function callback(data: string, index: number) {
        const arr = [...temp];
        arr[index].data.text = data;
        arr.splice(index + 1, 0, {
            id: "test2",
            data: {
                text: "Pasta",
            },
            tag: "h1",
        });
        console.log(index, arr);
        setTemp(arr);
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
                        {temp.map((block, index) => (
                            <EditorBlock
                                callback={callback}
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
