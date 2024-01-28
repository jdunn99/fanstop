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

interface PostComponentProps extends PostItem {
  isOwn?: boolean;
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

export function PostComponent({
  id,
  title,
  description,
  author,
  isOwn,
  views,
  createdAt,
  _count,
}: PostComponentProps) {
  return (
    <div>
      <div className="flex">
        <div />
        <Link
          href={`/${author.community.slug}/${id}`}
          className="hover:underline"
        >
          <div className="space-y-2">
            <h1 className="text-base font-semibold max-w-xs wrap text-slate-800">
              {title}
            </h1>
            <p className="text-xs text-rose-500 ">
              {new Date(createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-slate-600">{description}</p>
          </div>
        </Link>
        {isOwn ? (
          <div className="pl-4">
            <OwnPostMenu id={id} />
          </div>
        ) : null}
      </div>
      <div className="w-full flex gap-4 pt-2  text-xs text-slate-600">
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
  );
}
