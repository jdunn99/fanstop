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
import Textarea from "../ui/textarea";
import TextareaAutosize from "react-textarea-autosize";
import { usePublishPostMutation } from "@/lib/mutations/usePublishPostMutation";

interface EditorProps {
  id: string;
  title: string;
  content?: any;
  description: string | null;
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
  "flex-1  m-0 bg-transparent focus:outline-none ";

export function Editor({ id, title, content, description }: EditorProps) {
  const [editorTitle, setEditorTitle] = React.useState<string>(title);
  const [editorDescription, setEditorDescription] = React.useState<string>(
    description || ""
  );

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
    metadata: null,
    currentIndex: 0,
    blocks,
  });

  const focusedRef = React.useRef<HTMLDivElement>();
  const { mutate } = usePublishPostMutation(id);

  function onClick() {
    mutate({ title: editorTitle, description: editorDescription, editorState });
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
          <article className="prose mx-auto w-full max-w-screen-lg">
            <TextareaAutosize
              autoFocus
              defaultValue={title}
              onChange={(e: any) => setEditorTitle(e.target.value)}
              id="title"
              placeholder="Post title"
              className="w-full text-slate-900 resize-none appearance-none  bg-transparent text-5xl font-bold focus:outline-none"
            />
            <TextareaAutosize
              id="description"
              placeholder="Post description"
              className="w-full resize-none appearance-none bg-transparent focus:outline-none font-semibold m-0"
              defaultValue={description || ""}
              onChange={(e) => setEditorDescription(e.target.value)}
            />
            <input type="file" />
            <div className="w-full ">
              {editorState.blocks.map((block, index) => (
                <EditorBlock
                  ref={editorState.currentIndex === index ? focusedRef : null}
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
