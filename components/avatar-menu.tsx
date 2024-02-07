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
import { dashboardConfig, useSidebarRoutes } from "@/config/dashboard";
import Link from "next/link";
import Image from "next/image";
import Button from "./ui/button";
import { BsDoorOpen, BsDoorOpenFill } from "react-icons/bs";
import { MdDoorBack, MdDoorFront } from "react-icons/md";

interface AvatarButtonProps {
  name: string;
  image?: string;
  onClick(): void;
}
function AvatarButton({ name, image, onClick }: AvatarButtonProps) {
  return (
    <div
      role="button"
      onClick={onClick}
      className="p-1 h-10 w-10 flex items-center justify-center rounded-full border object-cover"
    >
      <Image alt="Avatar" src={image || ""} width={32} height={32} />
    </div>
  );
}

export function AvatarMenu() {
  const { isOpen, toggle, onClose } = useMenu();
  const { data } = useSession();
  const routes = useSidebarRoutes();

  if (!data) return null;

  return (
    <Menu onClose={onClose}>
      <AvatarButton
        name={data.user.name || ""}
        onClick={toggle}
        image={data.user.image || ""}
      />
      {isOpen ? (
        <MenuList className="w-60">
          <MenuGroup border>
            <MenuText variant="heading">{data.user.name}</MenuText>
            <MenuText variant="sm">{data.user.email}</MenuText>
          </MenuGroup>
          <MenuGroup border>
            {routes.map(({ href, image, value }) => (
              <Link href={href} key={href}>
                <MenuItem className="inline-flex gap-2">
                  <span className="text-xl">{image}</span>
                  <span>{value}</span>
                </MenuItem>
              </Link>
            ))}
          </MenuGroup>
          <MenuItem
            className="inline-flex gap-2"
            onClick={() => void signOut()}
          >
            <span className="text-xl">
              <BsDoorOpenFill />
            </span>
            <span>Sign Out</span>
          </MenuItem>
        </MenuList>
      ) : null}
    </Menu>
  );
}
