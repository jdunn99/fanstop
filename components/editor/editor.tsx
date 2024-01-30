import { Block, EditorContext, editorReducer } from "@/lib/useEditor";
import React from "react";
import { EditorBlock } from "./editor-block";
import Button from "../ui/button";
import { z } from "zod";
import TextareaAutosize from "react-textarea-autosize";
import { usePublishPostMutation } from "@/lib/mutations/usePublishPostMutation";
import { Layout } from "../layout";
import { Breadcrumbs } from "../ui/breadcrumbs";
import { useRouter } from "next/router";
import { useToast } from "../ui/toast";
import { useSavePostMutation } from "@/lib/mutations/useSavePostMutation";

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
  const editorTitleRef = React.useRef<HTMLTextAreaElement>(null);

  const [editorDescription, setEditorDescription] = React.useState<string>(
    description || ""
  );
  const editorDescriptionRef = React.useRef<HTMLTextAreaElement>(null);

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

  const { mutateAsync } = useSavePostMutation(id);
  const { toast } = useToast();

  const router = useRouter();
  const focusedRef = React.useRef<HTMLDivElement>();

  const handleSavePress = React.useCallback(async (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === "s") {
      event.preventDefault();

      if (editorTitleRef.current && editorDescriptionRef.current) {
        await mutateAsync({
          title: editorTitleRef.current.value,
          description: editorDescriptionRef.current.value,
          editorState,
        });

        toast({
          variant: "success",
          title: `${editorTitle} saved`,
          description:
            "Your post was saved. For others to view it, be sure to publish it.",
          timeout: 1000,
        });
      }
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleSavePress);

      return () => {
        window.removeEventListener("keydown", handleSavePress);
      };
    }
  }, [window]);

  async function onSave() {
    await mutateAsync({
      title: editorTitle,
      description: editorDescription,
      editorState,
    });
    toast({
      variant: "success",
      title: `${editorTitle} saved`,
      description:
        "Your post was saved. For others to view it, be sure to publish it.",
      timeout: 1000,
    });
  }

  async function onClick() {
    await mutateAsync({
      title: editorTitle,
      description: editorDescription,
      editorState,
    });
    router.push(`/editor/${id}/publish`);
  }

  return (
    <EditorContext.Provider value={{ dispatch, editorState }}>
      <Layout>
        <div>
          <div className="grid w-full gap-2 pt-4 px-8">
            <header className="sticky top-0 z-40 bg-slate-50 ">
              <div className="max-w-screen-xl flex h-16 items-center mx-auto w-full justify-between py-4">
                <Breadcrumbs paths={[{ href: "/", value: "Home" }]} />
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={onSave}>
                    Save
                  </Button>
                  <Button onClick={onClick}>Publish</Button>
                </div>
              </div>
            </header>
            <article className="prose mx-auto w-full max-w-screen-lg">
              <TextareaAutosize
                autoFocus
                ref={editorTitleRef}
                defaultValue={title}
                onChange={(e: any) => setEditorTitle(e.target.value)}
                id="title"
                placeholder="Post title"
                className="w-full text-slate-900 resize-none appearance-none  bg-transparent text-5xl font-bold focus:outline-none"
              />
              <TextareaAutosize
                id="description"
                ref={editorDescriptionRef}
                placeholder="Post description"
                className="w-full resize-none appearance-none bg-transparent focus:outline-none font-semibold m-0"
                defaultValue={description || ""}
                onChange={(e) => setEditorDescription(e.target.value)}
              />
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
      </Layout>
    </EditorContext.Provider>
  );
}
