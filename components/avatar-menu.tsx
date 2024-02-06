import { signOut, useSession } from "next-auth/react";
import {
  Menu,
  MenuList,
  MenuGroup,
  MenuText,
  MenuItem,
  useMenu,
} from "./ui/menu";
import { Avatar } from "./ui/avatar";
import { dashboardConfig } from "@/config/dashboard";
import Link from "next/link";

interface AvatarButtonProps {
  name: string;
  image?: string;
  onClick(): void;
}
function AvatarButton({ name, image, onClick }: AvatarButtonProps) {
  return (
    <Avatar
      role="button"
      onClick={onClick}
      className="inline-flex justify-center items-center text-white font-bold"
    >
      {name.at(0)}
    </Avatar>
  );
}

export function AvatarMenu() {
  const { isOpen, toggle, onClose } = useMenu();
  const { data } = useSession();

  if (!data) return null;

  return (
    <Menu onClose={onClose}>
      <AvatarButton name={data.user.name || ""} onClick={toggle} />
      {isOpen ? (
        <MenuList className="w-60">
          <MenuGroup border>
            <MenuText variant="heading">{data.user.name}</MenuText>
            <MenuText variant="sm">{data.user.email}</MenuText>
          </MenuGroup>
          <MenuGroup border>
            {dashboardConfig.sidebar.map(({ href, value }) => (
              <Link href={href} key={href}>
                <MenuItem>{value}</MenuItem>
              </Link>
            ))}
          </MenuGroup>
          <MenuItem onClick={() => void signOut()}>Sign Out</MenuItem>
        </MenuList>
      ) : null}
    </Menu>
  );
}
