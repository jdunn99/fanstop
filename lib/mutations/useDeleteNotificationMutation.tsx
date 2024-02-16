import { useMutation, useQueryClient } from "react-query";

import { Notifcation as UserNotification } from "../api/validators";

export function useDeleteNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation(["notifications"], {
    async mutationFn({
      notificationId,
      userId,
    }: {
      notificationId: string;
      userId: string;
    }) {
      const result = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });

      return await result.json();
    },
    onSuccess(_data, { notificationId, userId }) {
      queryClient.setQueryData(["notifications", userId], (oldData) => {
        const temp = oldData as unknown as UserNotification[];
        return temp.filter(({ id }) => id !== notificationId);
      });
    },
  });
}
