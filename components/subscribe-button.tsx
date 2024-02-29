import { useSubscribeMutation } from "@/lib/mutations/useSubscribeMutation";
import { BsHeartFill, BsHeart } from "react-icons/bs";
import Button from "./ui/button";

interface SubscribeButtonProps {
  slug: string;
  isSubscriber: boolean;
}

export function SubscribeButton({ slug, isSubscriber }: SubscribeButtonProps) {
  const { mutate } = useSubscribeMutation(slug);
  function onClick() {
    mutate({
      isSubscriber,
    });
  }

  return (
    <Button variant="secondary" onClick={onClick}>
      Subscribe
    </Button>
  );
}
