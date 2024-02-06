import { useRouter } from "next/router";
import Button from "./ui/button";

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
    <Button
      className="whitespace-nowrap"
      size="sm"
      onClick={onClick}
      variant="outline"
    >
      Create post
    </Button>
  );
}
