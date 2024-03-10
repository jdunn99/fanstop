import { InfiniteData } from "react-query";
import { PaginationResponse } from "./pagination";
import React from "react";

export function useFlattenedPaginatedData<T, Key extends keyof T>(
  data: InfiniteData<PaginationResponse<T[]>> | undefined,
  key: Key
): Exclude<T[Key][], "boolean"> {
  return React.useMemo(() => {
    if (typeof data === "undefined") {
      return [];
    }

    const flattened = [] as T[Key][];
    for (const page of data.pages) {
      for (const response of page.response) {
        flattened.push(response[key]);
      }
    }

    return flattened;
  }, [data]);
}
