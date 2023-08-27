import { Post } from "@/pages/api/posts";
import EditorJS from "@editorjs/editorjs";
import React from "react";
import { Layout } from "./layout";
import Link from "next/link";
import { Navbar, AuthedNav } from "./nav";
import Button from "./ui/button";

interface EditorProps {
    id: string;
    title: string;
    content?: any;
}

export function Editor({ id, title, content }: EditorProps) {
    const [isMounted, setIsMounted] = React.useState<boolean>(false);
    const editorRef = React.useRef<EditorJS>();

    const initEditor = React.useCallback(async () => {
        const EditorJS = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const Paragraph = (await import("@editorjs/paragraph" as any)).default;
        const Image = (await import("@editorjs/image" as any)).default;

        if (!editorRef.current) {
            const editor = new EditorJS({
                holder: "editor",
                onReady() {
                    editorRef.current = editor;
                },
                tools: {
                    header: Header,
                    image: Image,
                    paragraph: Paragraph,
                },
            });
        }
    }, []);

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            setIsMounted(true);
        }
    }, []);

    React.useEffect(() => {
        if (isMounted) {
            initEditor();

            return () => {
                editorRef.current?.destroy();
                editorRef.current = undefined;
            };
        }
    }, [isMounted, initEditor]);

    return (
        <form>
            <div className="grid w-full gap-2 pt-4">
                <header className="sticky top-0 z-40 bg-white ">
                    <div className="max-w-screen-xl flex h-16 items-center mx-auto w-full justify-between py-4">
                        <Link href="/">HGi</Link>
                        <Button>Publish</Button>
                    </div>
                </header>
                <div className="prose prose-stone mx-auto w-[800px] dark:prose-invert">
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
                    />
                    <div id="editor" className="min-h-[500px]" />
                </div>
            </div>
        </form>
    );
}
