import { signOut, useSession } from "next-auth/react";
import {
  Menu,
  MenuList,
  MenuGroup,
  MenuText,
  MenuItem,
  useMenu,
} from "./ui/menu";
import { AvatarImage } from "./ui/avatar";
import { useSidebarRoutes } from "@/config/dashboard";
import Link from "next/link";
import { BsDoorOpenFill } from "react-icons/bs";

interface AvatarButtonProps {
  image?: string;
  onClick(): void;
}
function AvatarButton({ image, onClick }: AvatarButtonProps) {
  return (
    <div role="button" onClick={onClick}>
      <AvatarImage src={image!} />
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
      <AvatarButton onClick={toggle} image={data.user.image || ""} />
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
