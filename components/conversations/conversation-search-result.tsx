import { UserSearchResult } from "@/lib/api/validators";
import { useCreateConversationMutation } from "@/lib/mutations/useCreateConversationMutation";
import { useRouter } from "next/router";
import { AvatarImage } from "../ui/avatar";

export function SearchResult({
  image,
  name,
  community,
  id,
  conversations,
}: UserSearchResult) {
  const router = useRouter();
  const conversation = conversations.length > 0 ? conversations[0].id : null;
  const { mutateAsync } = useCreateConversationMutation();

  async function onClick() {
    if (conversation === null) {
      const data = await mutateAsync([id]);

      console.log(data);
      if (typeof data !== "undefined") {
        router.push(`/messages/${data.id}`);
      }
    } else {
      router.push(`/messages/${conversation}`);
    }
  }

  return (
    <div
      onClick={onClick}
      className="flex items-center w-full gap-2 hover:bg-slate-50 cursor-pointer p-4 rounded-lg"
    >
      <AvatarImage src={image} />
      <div>
        <p className="font-semibold text-slate-800 text-sm">{name}</p>
        <p className="font-bold text-rose-500 text-sm">@{community.slug}</p>
      </div>
    </div>
  );
}
