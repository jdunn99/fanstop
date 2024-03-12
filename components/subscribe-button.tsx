import Button from "./ui/button";
import {
  useSubscribeToCommunityMutation,
  useUnsubscribeToCommunityMutation,
} from "@/lib/mutations/subscription-mutations";
import { useSession } from "next-auth/react";

interface SubscribeButtonProps {
  slug: string;
}

export function UnsubscribeButton({ slug }: SubscribeButtonProps) {
  const { mutate } = useUnsubscribeToCommunityMutation(slug);
  const { data: session } = useSession();

  function onClick() {
    console.log("CLICK FIRED BROSEPH");
    if (session !== null) mutate();
  }

  return (
    <Button className="border border-slate-200" onClick={onClick}>
      Unsubscribe
    </Button>
  );
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
