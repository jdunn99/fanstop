import Image from "next/image";

export function Logo() {
  return (
    <Image src={"/images/logo.svg"} alt="FanStop" width={32} height={32} />
  );
}
