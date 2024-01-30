import { CommunityProfile } from "@/pages/api/communities/[communityId]";
import { PostWithLikes } from "@/pages/api/posts";
import { useMutation, useQueryClient } from "react-query";

export function useSubscribeMutation(communityId: string) {
  const queryClient = useQueryClient();

  return useMutation(["subscribers", communityId], {
    async mutationFn({
      isDeletion,
      subscriptionId,
    }: {
      isDeletion: boolean;
      subscriptionId?: string;
    }) {
      if (isDeletion) {
        return await fetch(`/api/subscriptions/${subscriptionId}`, {
          method: "DELETE",
        });
      } else {
        const like = await fetch(
          `/api/communities/${communityId}/subscribers`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          }
        );
        return await like.json();
      }
    },
    onSuccess(data, { isDeletion, subscriptionId }) {
      queryClient.setQueryData(["community", communityId], (oldData) => {
        const temp = oldData as unknown as CommunityProfile;
        console.log(temp);
        if (isDeletion) {
          temp.subscribers = temp.subscribers.filter(
            (sub) => sub.id !== subscriptionId
          );
        } else {
          const { id, userId } = data;
          temp.subscribers = [...temp.subscribers, { id, userId }];
        }

        console.log(temp);
        return temp;
      });
    },
  });
}
