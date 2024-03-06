import { FaPooStorm } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { NavConfig } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarDropdownProps {
  value: string;
  image: JSX.Element;
  children: NavConfig;
}

export function SidebarDropdown({
  value,
  image,
  children,
}: SidebarDropdownProps) {
  const path = usePathname();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="1" className="border-none">
        <AccordionTrigger className="no-underline hover:no-underline group m-0 flex min-h-[1.25rem] w-full cursor-pointer items-center rounded p-1.5 focus:outline-non text-slate-800 hover:bg-slate-100 font-medium text-sm data-[state=open]:bg-slate-100 data-[state=open]:text-rose-500">
          <div className="flex items-center gap-3">
            {image}
            {value}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <ul className="mt-4 px-5 border-l ml-3 w-full space-y-4">
            {children.map(({ href, value, image }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${
                    path === href ? "text-rose-500" : "text-slate-500"
                  } font-medium hover:text-slate-700 inline-flex items-center gap-2`}
                >
                  {image}
                  {value}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
