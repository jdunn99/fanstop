import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface ProfileControlProps {
  slug: string;
  isOwn: boolean;
}

export function ProfileControls({ slug, isOwn }: ProfileControlProps) {
  const path = usePathname();
  const activePath = React.useMemo(() => {
    const split = path.split("/");
    return split;
  }, []);

  return (
    <div className="flex  items-center gap-16 text-center justify-center w-full border-b">
      <Link
        href={`/${slug}`}
        className="text-slate-600 font-semibold text-sm border-b border-rose-500 pb-2"
      >
        Home
      </Link>
      <Link
        href={`/${slug}/posts`}
        className="text-slate-600 font-semibold text-sm pb-2"
      >
        Posts
      </Link>

      <Link href="#" className="text-slate-600 font-semibold text-sm pb-2">
        Subscribers
      </Link>
    </div>
  );
}
