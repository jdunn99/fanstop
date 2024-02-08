import Image from "next/image";
import React from "react";

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...rest }, ref) => (
  <div
    className={`${className} relative flex h-10 w-10 shrink-0 object-cover overflow-hidden rounded-full bg-rose-500`}
    {...rest}
    ref={ref}
  />
));
Avatar.displayName = "Avatar";
export { Avatar };

export function CommunityAvatar({ name }: { name: string }) {
  return (
    <Avatar className="inline-flex justify-center items-center text-white font-bold">
      {name.at(0)}
    </Avatar>
  );
}

export function AvatarImage({ src }: { src: string }) {
  return (
    <div
      role="button"
      className="p-1 h-10 w-10 flex rounded-full border object-cover"
    >
      <Image alt="Avatar" src={src} width={32} height={32} />
    </div>
  );
}
