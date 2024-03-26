import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { z } from "zod";
import { CommunityPostsPage } from ".";
import {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerContentNoOverlay,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { useRouter } from "next/router";
import { usePostQuery } from "@/lib/queries/post-queries";
import Button from "@/components/ui/button";
import { BsX } from "react-icons/bs";
import { PostUpdateForm } from "@/components/forms/post-update-form";

export default function CommunityPostPageWithDrawer({
  postId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = usePostQuery(postId);
  const router = useRouter();

  function onClick() {
    router.push("/community/posts");
  }

  return (
    <CommunityPostsPage>
      <Drawer direction="right" open onClose={onClick}>
        <DrawerPortal>
          <DrawerOverlay onClick={onClick} />
          {typeof data === "undefined" ? null : (
            <DrawerContentNoOverlay className="lg:w-1/3 w-3/4 break-words  fixed right-0 top-0 dark:border-slate-800 h-full !m-0 !rounded-t-none">
              <DrawerHeader className="flex items-center w-full justify-between">
                <DrawerTitle>Post</DrawerTitle>
                <DrawerClose onClick={onClick}>
                  <Button variant="ghost">
                    <BsX />
                  </Button>
                </DrawerClose>
              </DrawerHeader>
              <PostUpdateForm {...data.post} />
            </DrawerContentNoOverlay>
          )}
        </DrawerPortal>
      </Drawer>
    </CommunityPostsPage>
  );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const postId = z.string().parse(query.postId);

  return {
    props: {
      postId,
    },
  };
}
