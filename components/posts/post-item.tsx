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
  isCol?: boolean;
  isFeatured?: boolean;
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

const FEATURED_CX =
  "flex-shrink !basis-1/2 object-fill lg:object-cover max-sm:w-[260px] max-sm:h-[156px]  md:aspect-video overflow-hidden border border-slate-100 rounded-lg shadow-sm";
const BASE_CX = "object-fill rounded-lg w-[260px] h-[156px] ";

function FeaturedPost({
  id,
  title,
  description,
  _count,
  views,
  image,
  author,
  createdAt,
}: PostComponentProps) {
  return (
    <Link
      href={`/${author.community.slug}/${id}`}
      className="p-4 lg:p-8 bg-slate-50 rounded-lg flex hover:underline"
    >
      <div className="flex gap-8 flex-col md:flex-row w-full items-center">
        {image ? <img src={image} className={FEATURED_CX} /> : null}
        <div className="flex items-start w-full basis-1/2">
          <div className="flex-1 block w-full space-y-2">
            <div className="flex items-center w-full">
              <h1 className="text-base font-semibold flex-1 max-w-xs wrap text-slate-800">
                {title}
              </h1>
            </div>
            <p className="text-xs text-rose-500 ">
              {new Date(createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-slate-600">
              {truncateString(description || "", 200)}
            </p>
            <div className="w-full flex gap-4 pt-2  text-xs text-slate-6 00">
              <div className="flex gap-1 items-center">
                <MdThumbUp />
                <p>{_count.likes} Likes</p>
              </div>
              <div className="flex gap-1 items-center">
                <FaComment />
                <p>{_count.comments} Comments</p>
              </div>
              <div className="flex gap-1 items-center">
                <BsEyeFill />
                <p>{views} Views</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function GridPost({
  id,
  title,
  description,
  _count,
  views,
  image,
  author,
  includeAuthor,
  createdAt,
}: PostComponentProps) {
  return (
    <Link
      className="flex bg-slate-50 rounded-lg p-4"
      href={`/${author.community.slug}/${id}`}
    >
      <div className="flex gap-8 flex-col w-full">
        <div className="flex items-center justify-center">
          {image ? <img src={image} className={BASE_CX} /> : null}
        </div>
        <div className="flex items-start w-full">
          <div className="space-y-2">
            {includeAuthor ? (
              <Link
                href={`/${author.community.slug}`}
                className="pt-4 flex items-center gap-2 opacity-80 hover:opacity-100"
              >
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {author.name}
                  </p>
                  <p className="text-xs font-semibold text-rose-500">
                    @{author.community.slug}
                  </p>
                </div>
              </Link>
            ) : null}
            <Link
              href={`/${author.community.slug}/${id}`}
              className="hover:underline flex-1 block w-full space-y-2"
            >
              <h1 className="text-base font-semibold max-w-xs wrap text-slate-800">
                {title}
              </h1>
              <p className="text-xs text-rose-500 ">
                {new Date(createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-slate-600">
                {truncateString(description || "", 200)}
              </p>
              <div className="w-full flex gap-4 pt-2  text-xs text-slate-6 00">
                <div className="flex gap-1 items-center">
                  <MdThumbUp />
                  <p>{_count.likes}</p>
                </div>
                <div className="flex gap-1 items-center">
                  <FaComment />
                  <p>{_count.comments}</p>
                </div>
                <div className="flex gap-1 items-center">
                  <BsEyeFill />
                  <p>{views}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Post({
  id,
  title,
  description,
  _count,
  views,
  image,
  author,
  includeAuthor,
  createdAt,
}: PostComponentProps) {
  return (
    <Link
      className="flex bg-slate-50 rounded-lg p-4"
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
            {includeAuthor ? (
              <Link
                href={`/${author.community.slug}`}
                className="pt-4 flex items-center gap-2 opacity-80 hover:opacity-100"
              >
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {author.name}
                  </p>
                  <p className="text-xs font-semibold text-rose-500">
                    @{author.community.slug}
                  </p>
                </div>
              </Link>
            ) : null}
            <Link
              href={`/${author.community.slug}/${id}`}
              className="hover:underline flex-1 block w-full space-y-2"
            >
              <h1 className="text-base font-semibold max-w-xs wrap text-slate-800">
                {title}
              </h1>
              <p className="text-xs text-rose-500 ">
                {new Date(createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-slate-600">
                {truncateString(description || "", 200)}
              </p>
              <div className="w-full flex gap-4 pt-2  text-xs text-slate-6 00">
                <div className="flex gap-1 items-center">
                  <MdThumbUp />
                  <p>{_count.likes} Likes</p>
                </div>
                <div className="flex gap-1 items-center">
                  <FaComment />
                  <p>{_count.comments} Comments</p>
                </div>
                <div className="flex gap-1 items-center">
                  <BsEyeFill />
                  <p>{views} Views</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function PostComponent({
  isFeatured,
  isCol,
  ...rest
}: PostComponentProps) {
  if (isFeatured) {
    return <FeaturedPost {...rest} />;
  }

  if (isCol) {
    return <GridPost {...rest} />;
  }

  return <Post {...rest} />;
}
