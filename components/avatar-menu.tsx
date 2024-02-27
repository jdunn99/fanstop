import { signOut, useSession } from "next-auth/react";
import {
  Menu,
  MenuList,
  MenuGroup,
  MenuText,
  MenuItem,
  useMenu,
  MenuDirection,
} from "./ui/menu";
import { AvatarImage } from "./ui/avatar";
import { useSidebarRoutes } from "@/config/dashboard";
import Link from "next/link";
import { FaDoorOpen, FaHome } from "react-icons/fa";

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

export function AvatarMenu({ direction }: MenuDirection) {
  const { isOpen, toggle, onClose } = useMenu();
  const { data } = useSession();
  const routes = useSidebarRoutes();

  if (!data) return null;

  return (
    <Menu onClose={onClose}>
      <AvatarButton onClick={toggle} image={data.user.image || ""} />
      {isOpen ? (
        <MenuList className="w-60" direction={direction}>
          <MenuGroup className="py-2">
            <MenuText variant="heading">{data.user.name}</MenuText>
            <MenuText variant="sm">{data.user.email}</MenuText>
          </MenuGroup>
          <MenuGroup>
            {routes.map(({ href, image, value }) => (
              <Link href={href} key={href}>
                <MenuItem className="inline-flex gap-2 items-center !py-2">
                  <span className="text-sm">{image}</span>
                  <span>{value}</span>
                </MenuItem>
              </Link>
            ))}
          </MenuGroup>
          <MenuItem
            className="inline-flex gap-2 items-center"
            onClick={() => void signOut()}
          >
            <span className="">
              <FaDoorOpen />
            </span>
            <span>Sign Out</span>
          </MenuItem>
        </MenuList>
      ) : null}
    </Menu>
  );
}
