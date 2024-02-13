import { Socials } from "@/lib/api/validators";
import Link from "next/link";
import {
  BsFacebook,
  BsGlobe,
  BsInstagram,
  BsTiktok,
  BsTwitter,
} from "react-icons/bs";

export function Socials({
  facebook,
  instagram,
  twitter,
  website,
  tiktok,
}: Socials) {
  return (
    <div className="inline-flex gap-4 text-xs text-slate-500 font-semibold">
      {!!facebook ? (
        <Link href={facebook} target="_blank">
          <BsFacebook />
        </Link>
      ) : null}

      {!!instagram ? (
        <Link href={instagram} target="_blank">
          <BsInstagram />
        </Link>
      ) : null}
      {!!twitter ? (
        <Link href={twitter} target="_blank">
          <BsTwitter />
        </Link>
      ) : null}
      {!!tiktok ? (
        <Link href={tiktok} target="_blank">
          <BsTiktok />
        </Link>
      ) : null}
      {!!website ? (
        <Link href={website} target="_blank">
          <BsGlobe />
        </Link>
      ) : null}
    </div>
  );
}
