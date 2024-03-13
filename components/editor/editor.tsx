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
import { Container } from "../layout/container";
import { Sidebar } from "../sidebar/sidebar";
import { LayoutPane } from "../layout/content";
import { LayoutHeader } from "../layout/header";
import {
  Drawer,
  DrawerClose,
  DrawerContentNoOverlay,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { BsX } from "react-icons/bs";
import { PostUpdateForm } from "../forms/post-update-form";

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
  }, [content]);

  const [editorState, dispatch] = React.useReducer(editorReducer, {
    metadata: null,
    currentIndex: 0,
    blocks,
  });

  const { mutateAsync } = useSavePostMutation(id);
  const { toast } = useToast();

  const focusedRef = React.useRef<HTMLDivElement>();

  const handleSavePress = React.useCallback(
    async (event: KeyboardEvent) => {
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
    },
    [editorState, editorTitle, mutateAsync, toast]
  );

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleSavePress);

      return () => {
        window.removeEventListener("keydown", handleSavePress);
      };
    }
  }, [handleSavePress]);

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
  }

  return (
    <EditorContext.Provider value={{ dispatch, editorState }}>
      <Container>
        <Sidebar />
        <LayoutPane>
          <LayoutHeader
            paths={[
              { href: "/", value: "Home" },
              { href: "/", value: "Create Post", disabled: true },
            ]}
          >
            <Button variant="secondary" onClick={onSave}>
              Save
            </Button>
            <Drawer direction="right">
              <DrawerTrigger>
                <Button onClick={async () => await onClick()}>Publish</Button>
              </DrawerTrigger>
              <DrawerPortal>
                <DrawerOverlay />

                <DrawerContentNoOverlay className="lg:w-1/3 w-3/4 break-words  fixed right-0 top-0 dark:border-slate-800 h-full !m-0 !rounded-t-none">
                  <DrawerHeader className="flex items-center w-full justify-between">
                    <DrawerTitle>Publish Post</DrawerTitle>
                    <DrawerClose>
                      <Button variant="ghost">
                        <BsX />
                      </Button>
                    </DrawerClose>
                  </DrawerHeader>
                  <PostUpdateForm
                    commentsVisible={true}
                    description={editorDescription}
                    title={editorTitle}
                    id={id}
                    image={
                      editorState.blocks[0].tag === "img"
                        ? (editorState.blocks[0].data.src as string)
                        : null
                    }
                    isPublished={false}
                    subscribersOnly={false}
                  />
                </DrawerContentNoOverlay>
              </DrawerPortal>
            </Drawer>
          </LayoutHeader>

          <div className="grid w-full gap-2 pt-4 ">
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
        </LayoutPane>
      </Container>
    </EditorContext.Provider>
  );
}
