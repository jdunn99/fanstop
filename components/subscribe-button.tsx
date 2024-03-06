import { useSubscribeMutation } from "@/lib/mutations/useSubscribeMutation";
import { BsHeartFill, BsHeart } from "react-icons/bs";
import Button from "./ui/button";
import { useSubscribeToCommunityMutation } from "@/lib/mutations/subscription-mutations";
import { useSession } from "next-auth/react";

interface SubscribeButtonProps {
  slug: string;
  isSubscriber: boolean;
}

export function SubscribeButton({ slug }: SubscribeButtonProps) {
  const { mutate } = useSubscribeToCommunityMutation(slug);
  const { data: session } = useSession();

  function onClick() {
    if (session !== null) mutate();
  }

  return (
    <Button
      variant="secondary"
      className="border border-slate-200"
      onClick={onClick}
    >
      Subscribe
    </Button>
  );
}
