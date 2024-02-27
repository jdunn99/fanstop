import { useRouter } from "next/router";
import Button from "./ui/button";
import { FaPlusCircle, FaStickyNote } from "react-icons/fa";

export function CreatePostButton() {
  const router = useRouter();

  async function onClick() {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: "Untitled Post", description: "" }),
    });

    const { id } = await response.json();

    router.push(`/editor/${id}`);
  }

  return (
    <Button onClick={onClick} className="text-sm gap-2 py-2" size="xs">
      <FaPlusCircle />
      Create post
    </Button>
  );
}
