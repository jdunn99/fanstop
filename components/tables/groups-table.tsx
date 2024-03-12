import { PostItem } from "@/lib/api/validators";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { usePostsForAuthedUserQuery } from "@/lib/queries/post-queries";
import {
  useFlattenedData,
  useFlattenedPaginatedData,
} from "@/lib/useFlattenedPaginatedData";
import { CreatePostButton } from "../create-post-button";
import React from "react";
import { Badge } from "../ui/badge";
import {
  useGroupsForAuthedUser,
  useGroupsForCommunity,
} from "@/lib/queries/group-queries";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useServerAuth } from "@/lib/middleware/session-middleware";
import { FaPlusCircle } from "react-icons/fa";
import Button from "../ui/button";
import { CreateGroupDialog } from "../create-group-dialog";

export const columns: ColumnDef<any>[] = [
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
    accessorKey: "name",
    header: "Name",
    cell(props) {
      const { row } = props;
      const { image, name } = row.original;
      return (
        <div className="md:flex-row flex-col flex flex-1 w-full gap-2 items-center relative flex-shrink-0">
          {image !== null ? <img src={image} className="w-12 rounded" /> : null}
          <span className="font-semibold text-slate-800">{name}</span>
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
    accessorKey: "_count.posts",
    header: "Posts",
  },
];

export function GroupsTable() {
  const { data } = useGroupsForAuthedUser();
  const flattened = useFlattenedData(data);

  return (
    <div className="w-full py-10">
      <DataTable
        columns={columns}
        data={flattened}
        filterKey="name"
        placeholder="Search groups"
      >
        <CreateGroupDialog />
      </DataTable>
    </div>
  );
}
