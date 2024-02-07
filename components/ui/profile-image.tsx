import Image from "next/image";

export function ProfileImage({ src }: { src: string }) {
  return (
    <div className="h-16 w-16 rounded-lg mx-auto flex items-center justify-center">
      <Image alt="img" src={src} height={96} width={96} />
    </div>
  );
}
