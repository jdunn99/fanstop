import React from "react";
import Button from "./ui/button";
import Link from "next/link";

interface EmptyProps {
  heading: string;
  children: React.ReactNode;
  href?: string;
  buttonValue?: string;
}
export function Empty({ heading, children, href, buttonValue }: EmptyProps) {
  return (
    <div className="h-[calc(100vh-256px)] flex flex-col items-center justify-center mx-auto">
      <p className="text-slate-800 font-medium text-lg mb-4">{heading}</p>
      <p className="text-slate-600 max-w-md leading-loose text-center text-sm">
        {children}
      </p>
      {!!buttonValue && !!href ? (
        <Link href={href}>
          <Button className="mt-4">{buttonValue}</Button>
        </Link>
      ) : null}
    </div>
  );
}
