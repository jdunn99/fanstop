import Button from "./ui/button";
import { FaPlusCircle } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
} from "./ui/dialog";
import { CreateGroupForm } from "./forms/create-group-form";
import React from "react";

export function CreateGroupDialog() {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="!text-sm gap-2 py-2"
          size="xs"
          onClick={() => setOpen(true)}
        >
          <FaPlusCircle />
          Create group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Create Group</DialogHeader>
        <CreateGroupForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
