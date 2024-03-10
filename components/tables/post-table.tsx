import { PostItem } from "@/lib/api/validators";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { usePostsForAuthedUserQuery } from "@/lib/queries/post-queries";
import { useFlattenedPaginatedData } from "@/lib/useFlattenedPaginatedData";
import Input from "../ui/input";
import { CreatePostButton } from "../create-post-button";
import React from "react";
import { Badge } from "../ui/badge";

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
    accessorKey: "group",
    header: "Group",
  },
];

export function PostTable() {
  const { data } = usePostsForAuthedUserQuery();
  const flattened = useFlattenedPaginatedData(data, "post");

  return (
    <div className="w-full py-10">
      <DataTable columns={columns} data={flattened} filterKey="title">
        <CreatePostButton />
      </DataTable>
    </div>
  );
}
