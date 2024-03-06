import { useSession } from "next-auth/react";
import React from "react";
import { AvatarMenu } from "../avatar-menu";
import { CreatePostButton } from "../create-post-button";

export function SidebarHeader() {
  const { data: session } = useSession();

  return (
    <li className="flex flex-col gap-4 text-sm mb-2">
      {!!session ? (
        <React.Fragment>
          <div className="flex items-center gap-2">
            <AvatarMenu direction="left" />
            <div>
              <p>{session.user.name}</p>
              <p className="text-rose-500 font-semibold">
                @{session.user.slug}
              </p>
            </div>
          </div>
          <CreatePostButton />
        </React.Fragment>
      ) : null}
    </li>
  );
}
