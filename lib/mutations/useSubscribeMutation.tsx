import { useMutation, useQueryClient } from "react-query";
import { CommunityResponse } from "../api/validators";

export function useSubscribeMutation(communityId: string) {
  const queryClient = useQueryClient();

  return useMutation(["subscribers", communityId], {
    async mutationFn({ isSubscriber }: { isSubscriber: boolean }) {
      if (isSubscriber) {
        // return await fetch(`/api/subscriptions/`, {
        //   method: "DELETE",
        // });
      } else {
        const like = await fetch("/api/subscriber", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ communityId }),
        });
        return await like.json();
      }
    },
    onSuccess(data, { isSubscriber }) {
      queryClient.setQueryData(["community", communityId], (oldData) => {
        const temp = oldData as unknown as CommunityResponse;

        if (isSubscriber) {
          temp.isSubscriber = false;
        } else {
          temp.isSubscriber = true;
        }

        return temp;
      });
    },
  });
}
