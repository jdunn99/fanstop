import { useMutation } from "react-query";

export function useSubscribeToCommunityMutation(slug: string) {
  return useMutation(["subscription", slug], () =>
    fetch(`/api/communities/${slug}/subscribers`, {
      headers: {
        "Content-type": "application/json",
        accept: "application/json",
      },
      method: "POST",
    }).then((res) => res.json())
  );
}
