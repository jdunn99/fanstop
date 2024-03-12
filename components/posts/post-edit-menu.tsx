import { PostItem } from "@/lib/api/validators";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import Button from "../ui/button";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import Link from "next/link";
import { useDeletePostMutation } from "@/lib/mutations/post-mutations";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useToast } from "../ui/toast";

export function PostEditMenu(post: PostItem) {
  const { mutateAsync } = useDeletePostMutation(
    post.id,
    post.author.community.slug
  );

  const { toast } = useToast();

  async function deletePost() {
    await mutateAsync();
    toast({
      title: "Success",
      description: "Post was deleted successfully.",
      timeout: 1000,
      variant: "success",
    });
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span>
              <BsThreeDots />
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-[99]">
          <Link href={`/editor/${post.id}`}>
            <DropdownMenuItem className="cursor-pointer gap-2">
              <FaPen className="text-xs" />
              Edit
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="cursor-pointer gap-2">
              <FaTrashAlt className="text-xs" />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. It will permanently delete this post.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deletePost()}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
