import { useQuery } from "react-query";
import { Notifcation as UserNotification } from "../api/validators";

export function useNotificationsQuery(userId: string) {
  return useQuery<UserNotification[]>(["notifications", userId], () =>
    fetch("/api/user/notifications").then((res) => res.json())
  );
}
