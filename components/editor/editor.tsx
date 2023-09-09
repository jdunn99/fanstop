import {
    Block,
    EditorActionType,
    EditorContext,
    ValidTags,
    editorReducer,
} from "@/lib/useEditor";
import React from "react";
import { EditorBlock } from "./editor-block";
import Button from "../ui/button";
import Link from "next/link";
import { ZodType, z } from "zod";
import { Cloudinary } from "@cloudinary/url-gen";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";

interface EditorProps {
    id: string;
    title: string;
    content?: any;
}

const EditorContentSchema = z
    .object({
        id: z.string(),
        tag: z.string(),
        data: z.object({
            text: z.string().optional(),
        }),
    })
    .array()
    .nullable();
export type EditorContent = z.infer<typeof EditorContentSchema>;

export const BASE_EDITOR_TAG_CONFIG =
    "flex-1  m-0 bg-transparent focus:outline-none overflow-hidden";

export function Editor({ id, title, content }: EditorProps) {
    const cld = new Cloudinary({ cloud: { cloudName: "dw7064r1g " } });
    const blocks: Block[] = React.useMemo(() => {
        const parsedContent = content;
        if (parsedContent) {
            return parsedContent as Block[];
        }

        return [
            {
                id: "1",
                tag: "p",
                data: {
                    text: "",
                },
            },
        ];
    }, []);

    const [editorState, dispatch] = React.useReducer(editorReducer, {
        metadata: {
            title,
            description: "",
            authorId: "",
        },
        currentIndex: 0,
        blocks,
    });

    const focusedRef = React.useRef<HTMLDivElement>();

    async function onClick() {
        const content = await Promise.all(
            editorState.blocks.map(async (block) => {
                const temp = { ...block };
                if (temp.tag === "img" && temp.data.formData) {
                    temp.data.src = await uploadImage(temp.data.formData!);
                    temp.data.formData = undefined;
                }

                return temp;
            })
        );

        const result = await fetch(`/api/posts/${id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                title,
                description: "",
                content,
            }),
        });

        console.log(await result.json());
    }

    async function uploadImage(formData: FormData) {
        const result = await fetch(
            "https://api.cloudinary.com/v1_1/dw7064r1g/upload",
            {
                method: "POST",
                body: formData,
            }
        );
        const json = await result.json();
        return json["secure_url"];
    }

    return (
        <EditorContext.Provider value={{ dispatch, editorState, cld }}>
            <div>
                <div className="grid w-full gap-2 pt-4 px-8">
                    <header className="sticky top-0 z-40 bg-white ">
                        <div className="max-w-screen-xl flex h-16 items-center mx-auto w-full justify-between py-4">
                            <Link href="/">Back</Link>
                            <Button onClick={onClick}>Publish</Button>
                        </div>
                    </header>
                    <article className="prose mx-auto w-full max-w-screen-lg ">
                        <textarea
                            autoFocus
                            defaultValue={title}
                            id="title"
                            placeholder="Post title"
                            className="w-full text-slate-900 resize-none appearance-none  bg-transparent text-5xl font-bold focus:outline-none h-14"
                        />
                        <textarea
                            autoFocus
                            id="description"
                            placeholder="Post description"
                            className="w-full resize-none appearance-none bg-transparent focus:outline-none font-semibold m-0"
                            onKeyDown={(e) => {}}
                        />
                        <div className="w-full ">
                            {editorState.blocks.map((block, index) => (
                                <EditorBlock
                                    ref={
                                        editorState.currentIndex === index
                                            ? focusedRef
                                            : null
                                    }
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
