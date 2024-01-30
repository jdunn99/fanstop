import { CommunityProfile } from "@/pages/api/communities/[communityId]";
import { PostItem } from "@/pages/api/user/feed";
import { usePathname } from "next/navigation";
import {
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  useMenu,
} from "../ui/menu";
import { FaComment, FaEllipsisH } from "react-icons/fa";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdThumbUp } from "react-icons/md";
import { BsEyeFill } from "react-icons/bs";
import { truncateString } from "@/lib/truncate";
import { Avatar } from "../ui/avatar";

interface PostComponentProps extends PostItem {
  isOwn?: boolean;
  isCol?: boolean;
  isFeatured?: boolean;
  includeAuthor?: boolean;
}

function OwnPostMenu({ id }: { id: string }) {
  const { isOpen, toggle, onClose } = useMenu();
  const { push } = useRouter();

  function onEditClick() {
    push(`/editor/${id}`);
  }

  return (
    <Menu onClose={onClose}>
      <MenuButton size="xs" variant="ghost" onClick={toggle}>
        <FaEllipsisH />
      </MenuButton>
      {isOpen ? (
        <MenuList>
          <MenuItem onClick={onEditClick}>Edit</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuList>
      ) : null}
    </Menu>
  );
}

const FEATURED_CX =
  "flex-shrink !basis-1/2 object-cover aspect-video overflow-hidden border border-slate-100 rounded-lg shadow-sm";
const BASE_CX =
  "object-fill border border-slate-200 rounded-lg w-[260px] h-[156px]";

export function PostComponent({
  id,
  title,
  description,
  author,
  isOwn,
  image,
  views,
  createdAt,
  isFeatured,
  includeAuthor,
  isCol,
  _count,
}: PostComponentProps) {
  return (
    <div className="flex">
      <div
        className={`flex gap-8 flex-col w-full ${
          isFeatured ? "items-center" : ""
        } ${isCol ? "flex-col" : "md:flex-row"}`}
      >
        {image ? (
          <img src={image} className={isFeatured ? FEATURED_CX : BASE_CX} />
        ) : // <div className="w-[260px] h-[156px]" />
        null}
        <div
          className={`flex items-start w-full ${
            isFeatured ? "basis-1/2" : "flex-1"
          }`}
        >
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
      {isOwn ? (
        <div className="pl-4 justify-end">
          <OwnPostMenu id={id} />
        </div>
      ) : null}
    </div>
  );
}
