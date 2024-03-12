import { useMutation, useQueryClient } from "react-query";
import { CommunityResponse } from "../api/validators";

function useSubscribeToCommunityMutation(slug: string) {
  const queryClient = useQueryClient();
  return useMutation(
    ["subscription", slug],
    () =>
      fetch(`/api/communities/${slug}/subscribers`, {
        headers: {
          "Content-type": "application/json",
          accept: "application/json",
        },
        method: "POST",
      }).then((res) => res.json()),
    {
      onSuccess() {
        queryClient.setQueryData(["community", slug], (oldData: unknown) => {
          const temp = oldData as CommunityResponse;
          temp.isSubscriber = true;
          return temp;
        });
        queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      },
    }
  );
}

function useUnsubscribeToCommunityMutation(slug: string) {
  const queryClient = useQueryClient();
  return useMutation(
    ["subscription", slug],
    () =>
      fetch(`/api/communities/${slug}/subscribers`, {
        headers: {
          "Content-type": "application/json",
          accept: "application/json",
        },
        method: "DELETE",
      }),
    {
      onSuccess() {
        queryClient.setQueryData(["community", slug], (oldData: unknown) => {
          const temp = oldData as CommunityResponse;
          temp.isSubscriber = false;
          return temp;
        });

        queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      },
    }
  );
}

export { useSubscribeToCommunityMutation, useUnsubscribeToCommunityMutation };
