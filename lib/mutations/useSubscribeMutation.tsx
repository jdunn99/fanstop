import { useMutation, useQueryClient } from "react-query";
import { CommunityResponse, CommunitySearchResult } from "../api/validators";
import { useSession } from "next-auth/react";

export function useSubscribeMutation(communityId: string) {
  const queryClient = useQueryClient();
  const { data } = useSession();

  return useMutation(["subscribers", communityId], {
    async mutationFn({ isSubscriber }: { isSubscriber: boolean }) {
      const result = await fetch("/api/subscriber", {
        headers: {
          "Content-Type": "application/json",
        },
        method: isSubscriber ? "DELETE" : "POST",
        body: JSON.stringify({ communityId }),
      });
      return await result.json();
    },
    onSuccess(data, { isSubscriber }) {
      queryClient.setQueryData(["community", communityId], (oldData) => {
        const temp = oldData as unknown as CommunityResponse;

        if (typeof temp === "undefined") {
          return temp;
        }

        if (isSubscriber) {
          temp.isSubscriber = false;
        } else {
          temp.isSubscriber = true;
        }

        return temp;
      });
      queryClient.setQueryData(["popular-communities"], (oldData) => {
        const temp = oldData as unknown as CommunityResponse[];
        if (!temp) {
          return temp;
        }

        console.log(temp);
        const index = temp.findIndex(
          ({ community }) => community.slug === communityId
        );

        if (index === -1) {
          return temp;
        }

        temp[index].isSubscriber = !isSubscriber;
        return temp;
      });
    },
  });
}
