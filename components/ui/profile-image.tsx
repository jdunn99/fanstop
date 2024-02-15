import Image from "next/image";

export function ProfileImage({ src }: { src: string }) {
  return (
    <div className="h-24 w-24 overflow-hidden rounded-full mx-auto flex items-center justify-center border bg-white">
      <Image alt="img" src={src} height={256} width={256} />
    </div>
  );
}
