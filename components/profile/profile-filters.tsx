import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import Input from "../ui/input";
import React from "react";
import { FaSearch } from "react-icons/fa";
import Button from "../ui/button";
import { useGroupsForCommunity } from "@/lib/queries/group-queries";

interface ProfileSelectFilterProps {
  group: string;
  setGroup(group: string): void;
  slug: string;
}
export function ProfileSelectFilter({
  setGroup,
  group,
  slug,
}: ProfileSelectFilterProps) {
  const { data: groups } = useGroupsForCommunity(slug);

  return (
    <Select
      onValueChange={(value) => setGroup(value)}
      value={group}
      defaultValue="All"
    >
      <SelectTrigger className="lg:w-48 w-16 truncate flex-shrink-0 flex gap-2 bg-slate-50">
        <SelectValue placeholder="Group" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">All</SelectItem>
        {groups?.pages.map((page) =>
          page.response.map(({ name }) => (
            <SelectItem value={name} key={name}>
              {name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

interface ProfileFilterProps {
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  query: string;
  children?: React.ReactNode;
}
export function ProfileFilters({
  setSearchQuery,
  children,
  query,
}: ProfileFilterProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <div className="flex items-center gap-4 mt-16 mb-4 justify-between">
      {!isOpen ? (
        <h1 className="text-lg text-slate-800 font-semibold">Recent Posts</h1>
      ) : null}

      <div className={`flex gap-2 ${isOpen && "flex-1"}`}>
        {isOpen ? (
          <Input
            value={query}
            className="flex-1"
            autoFocus
            placeholder="Search posts by title..."
            onChange={(event) => setSearchQuery(event.target.value)}
            onBlur={() => setIsOpen(false)}
          />
        ) : (
          <Button
            variant="ghost"
            onClick={() => setIsOpen(true)}
            className="text-slate-700"
          >
            <FaSearch />
          </Button>
        )}
        {children}
      </div>
    </div>
  );
}
