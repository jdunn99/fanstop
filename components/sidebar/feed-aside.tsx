export function FeedAside() {
  return (
    <aside className="w-96 flex-shrink-0 xl:block hidden px-6 pt-12">
      <nav className="fixed h-full space-y-6">
        <ul className="space-y-4">
          <li className="font-semibold  text-slate-800">
            Suggested Communities
          </li>
          {[0, 1, 2, 3, 4].map((item) => (
            <li className="flex items-center gap-2" key={item}>
              <div className="w-10 h-10 rounded-lg bg-slate-100" />
              <p className="text-sm text-slate-600 font-medium">
                Community {item}
              </p>
            </li>
          ))}
        </ul>

        <ul className="space-y-4">
          <li className="font-semibold  text-slate-800">Popular Posts</li>
          {[0, 1, 2, 3, 4].map((item) => (
            <li className="flex items-center gap-4" key={item}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-rose-500" />

                  <p className="text-xs text-slate-600 font-medium">
                    Jack Dunn
                  </p>
                </div>
                <h1 className=" font-semibold text-slate-800">
                  This is a post title
                </h1>
                <p className="text-xs text-slate-600 font-medium">12 Mar.</p>
              </div>
              <div className="w-16 h-12 bg-slate-100 rounded-lg " />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
