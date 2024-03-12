import { Menu, MenuButton, MenuItem, MenuList, useMenu } from "../ui/menu";
import { FaComment, FaEllipsisH } from "react-icons/fa";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdThumbUp } from "react-icons/md";
import { BsEyeFill } from "react-icons/bs";
import { truncateString } from "@/lib/truncate";
import { useDeletePostMutation } from "@/lib/mutations/post-mutations";
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
  const { mutateAsync: deletePostAsync } = useDeletePostMutation(id, "");

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
