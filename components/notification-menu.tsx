import { useQuery } from "react-query";
import {
  Menu,
  MenuGroup,
  MenuItem,
  MenuList,
  MenuText,
  useMenu,
} from "./ui/menu";
import { useSession } from "next-auth/react";
import Button from "./ui/button";
import { BsBellFill } from "react-icons/bs";
import Link from "next/link";
import { AvatarImage } from "./ui/avatar";
import { useNotificationsQuery } from "@/lib/queries/useNotificationsQuery";
import { useDeleteNotificationMutation } from "@/lib/mutations/useDeleteNotificationMutation";

interface Props {
  userId: string;
}

export function NotificationMenu({ userId }: Props) {
  const { isOpen, toggle, onClose } = useMenu();
  const { data } = useNotificationsQuery(userId);
  const { mutate } = useDeleteNotificationMutation();

  if (typeof data === "undefined") {
    return null;
  }

  return (
    <Menu onClose={onClose}>
      <Button onClick={toggle} variant="ghost">
        <BsBellFill />
        {data.length > 0 ? (
          <div className="w-4 h-4 absolute top-0 right-0 rounded-full inline-flex items-center justify-center text-xs bg-rose-500 text-white">
            {data.length}
          </div>
        ) : null}
      </Button>
      {isOpen ? (
        <MenuList className="w-60">
          <MenuGroup border>
            <MenuText variant="heading">Notifications</MenuText>
          </MenuGroup>
          <MenuGroup>
            {data.length > 0 ? (
              data.map((item) => (
                <MenuItem className="!flex gap-2 items-center" key={item.id}>
                  <Link href={item.path} className="flex gap-2 hover:underline">
                    <AvatarImage src={item.creator.image} />
                    <span className="flex-1">{item.message}</span>
                  </Link>
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => mutate({ notificationId: item.id, userId })}
                  >
                    x
                  </Button>
                </MenuItem>
              ))
            ) : (
              <MenuText>No notifications</MenuText>
            )}
          </MenuGroup>
        </MenuList>
      ) : null}
    </Menu>
  );
}
