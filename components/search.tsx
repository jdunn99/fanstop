import React from "react";
import Input from "./ui/input";
import { SearchResult } from "@/lib/api/search";
import { useQuery } from "react-query";
import Link from "next/link";
import { useRouter } from "next/router";

interface SearchResultItemProps {
  value: string;
  children?: React.ReactNode;
}
function SearchResultItem({ value, children }: SearchResultItemProps) {
  return (
    <div className="py-2 px-4 text-sm flex flex-col text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer">
      {value}
      {children}
    </div>
  );
}

interface SearchProps {
  defaultValue?: string;
}
export function Search({ defaultValue }: SearchProps) {
  const { push } = useRouter();
  const [searchQuery, setSearchQuery] = React.useState<string>();
  const { data } = useQuery<SearchResult>(
    ["search", searchQuery],
    () =>
      fetch(`/api/communities/search?searchQuery=${searchQuery}`).then((res) =>
        res.json()
      ),
    {
      enabled: typeof searchQuery === "string" && searchQuery !== "",
    }
  );

  function onSubmit(event: any) {
    event.preventDefault();
    console.log(searchQuery);
    push(`/explore/search/${searchQuery}`);
  }

  return (
    <form className="relative" onSubmit={onSubmit}>
      <Input
        onChange={(e) => setSearchQuery(e.target.value)}
        type="search"
        className="w-full bg-white"
        defaultValue={defaultValue}
        placeholder="Search"
      />
      {data ? (
        <div className="w-full absolute top-11 z-10 bg-white border border-slate-100 rounded-lg shadow">
          {data.communities.length > 0 || data.tags.length > 0 ? (
            <div className="space-y-1">
              {data.tags.length > 0 ? (
                <div>
                  <h1 className="uppercase px-4 pt-4 text-xs font-bold text-rose-500">
                    Tags
                  </h1>
                  {data.tags.map(({ id, name }) => (
                    <a href={`/explore/search/${name}`}>
                      <SearchResultItem value={name} key={id} />
                    </a>
                  ))}
                </div>
              ) : null}

              {data.communities.length > 0 ? (
                <div>
                  <h1 className="uppercase px-4 pt-4 text-xs font-bold text-rose-500">
                    Communities
                  </h1>

                  {data.communities.map(({ id, slug, name }) => (
                    <Link href={`/${slug}`}>
                      <SearchResultItem key={id} value={name}>
                        <span className="text-xs text-rose-500">@{slug}</span>
                      </SearchResultItem>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="p-16 text-center text-sm text-slate-500">
              No results found.
            </p>
          )}
        </div>
      ) : null}
    </form>
  );
}
