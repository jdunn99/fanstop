import { Group, PostItem } from "@/lib/api/validators";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { usePostsForAuthedUserQuery } from "@/lib/queries/post-queries";
import { useFlattenedPaginatedData } from "@/lib/useFlattenedPaginatedData";
import { CreatePostButton } from "../create-post-button";
import React from "react";
import { Badge } from "../ui/badge";
import { truncateString } from "@/lib/truncate";
import { PostEditMenu } from "../posts/post-edit-menu";

export const columns: ColumnDef<PostItem>[] = [
  {
    accessorKey: "image",
    header() {
      return null;
    },
    cell() {
      return null;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell(props) {
      const { row } = props;
      const { image, title } = row.original;
      return (
        <div className="md:flex-row flex-col flex flex-1 w-full gap-2 items-center relative flex-shrink-0">
          {image !== null ? <img src={image} className="w-12 rounded" /> : null}
          <span className="font-semibold text-slate-800">{title}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell({ cell }) {
      return truncateString(cell.getValue() as string, 40);
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell(props) {
      const { cell } = props;
      return new Date(cell.getValue() as string).toLocaleString();
    },
  },
  {
    accessorKey: "isPublished",
    header: "Publication Status",
    cell(props) {
      const { cell } = props;
      const isPublished = cell.getValue() as Boolean;
      return isPublished ? (
        <Badge>Published</Badge>
      ) : (
        <Badge variant="secondary">Unpublished</Badge>
      );
    },
  },
  {
    accessorKey: "_count.likes",
    header: "Likes",
  },
  {
    accessorKey: "_count.comments",
    header: "Comments",
  },
  {
    accessorKey: "subscribersOnly",
    header: "Visiblity",
    cell(props) {
      const { cell } = props;
      const subscribersOnly = cell.getValue() as Boolean;
      return subscribersOnly ? "Subscribers Only" : "Anyone";
    },
  },
  {
    accessorKey: "commentsVisible",
    header: "Comments Enabled",
    cell(props) {
      const { cell } = props;
      const commentsVisible = cell.getValue() as Boolean;
      return commentsVisible ? "Enabled" : "Disabled";
    },
  },
  {
    accessorKey: "group",
    header: "Group",
    cell: ({ cell }) => {
      const value = cell.getValue() as Group;

      return value !== null ? (
        <Badge>{value.name}</Badge>
      ) : (
        <Badge variant="secondary">None</Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <PostEditMenu {...row.original} />;
    },
  },
];

export function PostTable() {
  const { data } = usePostsForAuthedUserQuery();
  const flattened = useFlattenedPaginatedData(data, "post");

  return (
    <div className="w-full py-10">
      <DataTable
        columns={columns}
        data={flattened}
        filterKey="title"
        placeholder="Search posts"
      >
        <CreatePostButton />
      </DataTable>
    </div>
  );
}
