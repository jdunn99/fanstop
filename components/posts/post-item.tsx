import { Menu, MenuButton, MenuItem, MenuList, useMenu } from "../ui/menu";
import { FaComment, FaEllipsisH } from "react-icons/fa";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdThumbUp } from "react-icons/md";
import { BsEyeFill } from "react-icons/bs";
import { truncateString } from "@/lib/truncate";
import { useDeletePostMutation } from "@/lib/mutations/useDeletePostMutation";
import { PostItem } from "@/lib/api/validators";

interface PostComponentProps extends PostItem {
  includeAuthor?: boolean;
  isOwn?: boolean;
}

export function OwnPostMenu({
  id,
  isPublished,
}: {
  id: string;
  isPublished?: boolean;
}) {
  const { isOpen, toggle, onClose } = useMenu();
  const { push } = useRouter();
  const { mutateAsync: deletePostAsync } = useDeletePostMutation(id);

  function onEditClick() {
    push(`/editor/${id}`);
  }

  function onPublishClick() {
    push(`/editor/${id}/publish`);
  }

  async function onDeleteClick() {
    await deletePostAsync();
    push(`/profile`);
  }

  return (
    <Menu onClose={onClose}>
      <MenuButton size="xs" variant="ghost" onClick={toggle}>
        <FaEllipsisH />
      </MenuButton>
      {isOpen ? (
        <MenuList>
          <MenuItem onClick={onEditClick}>Edit</MenuItem>
          <MenuItem onClick={onDeleteClick}>Delete</MenuItem>
          {!isPublished ? (
            <MenuItem onClick={onPublishClick}>Publish</MenuItem>
          ) : null}
        </MenuList>
      ) : null}
    </Menu>
  );
}

const BASE_CX = "object-fill rounded-xl w-[320px] h-[210px] ";

function Post({
  id,
  title,
  description,
  _count,
  views,
  image,
  author,
  createdAt,
  group,
}: PostComponentProps) {
  return (
    <Link
      className="flex transition-colors rounded-lg p-8 hover:border-rose-100 border border-transparent hover:bg-white dark:hover:bg-slate-800 dark:hover:border-slate-700"
      href={`/${author.community.slug}/${id}`}
    >
      <div className="flex gap-8 w-full flex-col md:flex-row">
        {image ? (
          <img
            src={image}
            className={`${BASE_CX} max-sm:mx-auto max-sm:my-auto`}
          />
        ) : null}
        <div className="flex items-center w-full">
          <div className="space-y-2">
            <div className="flex-1 block w-full space-y-2">
              {!!group ? (
                <p className="text-rose-500 font-semibold">{group.name}</p>
              ) : null}
              <h1 className="text-2xl font-bold max-w-xs wrap text-slate-800 dark:text-white">
                {title}
              </h1>
              <p className="text-xs text-rose-500 ">
                {new Date(createdAt).toLocaleString()}
              </p>
              <p className="text-base text-slate-600 dark:text-slate-300">
                {truncateString(description || "", 250)}
              </p>
              <div className="w-full flex gap-4 pt-2  text-xs text-slate-500 dark:text-slate-400">
                <div className="flex gap-1 items-center">
                  <MdThumbUp className="dark:text-white text-slate-800" />
                  <p>{_count.likes} Likes</p>
                </div>
                <div className="flex gap-1 items-center">
                  <FaComment className="dark:text-white text-slate-800" />
                  <p>{_count.comments} Comments</p>
                </div>
                <div className="flex gap-1 items-center">
                  <BsEyeFill className="dark:text-white text-slate-800" />
                  <p>{views} Views</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function PostComponent({ ...rest }: PostComponentProps) {
  return <Post {...rest} />;
}
