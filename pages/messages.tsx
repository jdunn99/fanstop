import { Layout } from "@/components/layout";
import { ProfileNav } from "@/components/nav";
import { Sidebar } from "@/components/sidebar";
import { Avatar } from "@/components/ui/avatar";

function Temp() {
  return (
    <div className="flex items-center gap-2 border-b px-4 py-4 cursor-pointer hover:bg-slate-50">
      <Avatar />
      <div className="flex justify-between w-full">
        <div className="space-y-1">
          <h1 className="text-sm font-semibold text-slate-800">Test User</h1>
          <p className="text-slate-500 text-xs">This is a test message</p>
        </div>
        <p className="text-slate-500 text-xs">10 min</p>
      </div>
    </div>
  );
}

export default function Messages() {
  return (
    <div className="antialised" id="root">
      <div className="flex ">
        <aside className=" inset-y-0 z-10 flex-shrink-0 w-64 bg-white border-r lg:static fixed">
          <Sidebar />
        </aside>
        <aside className="fixed inset-y-0 z-10 flex-shrink-0 w-72 bg-white border-r lg:static">
          <div className="relative ">
            <Temp />
          </div>
        </aside>

        <div className="flex-1 space-y-6 py-8 flex flex-col pl-16 z-50 h-screen overflow-auto bg-slate-50"></div>
      </div>
    </div>
  );
}

// export async function getServerSideProps {

// }
