import { z } from "zod";

export type PaginationArgs = {
  cursor?: number;
  take?: number;
};

export type PaginationArgsWithID = PaginationArgs & {
  id: string;
};

export type PaginationResponse<T> = {
  response: T;
  cursor?: number;
  hasMore: boolean;
};

export const PaginationSchema = z.object({
  cursor: z
    .string()
    .optional()
    .transform((val) => {
      if (val) {
        return parseInt(val);
      }

      return undefined;
    }),
  take: z
    .string()
    .optional()
    .transform((val) => {
      if (val) {
        return parseInt(val);
      }

      return undefined;
    }),
});

export function paginationArgs({ cursor, take }: PaginationArgs) {
  return {
    take,
    skip: cursor ? 1 : undefined,
    cursor: cursor
      ? {
          sequence: cursor,
        }
      : undefined,
  };
}

export function getPaginatedMetadata<T extends { sequence: number }>(
  data: T[],
  take?: number
) {
  const hasMore = typeof take !== "undefined" && data.length >= Math.abs(take);
  const cursor = hasMore ? data[data.length - 1].sequence : undefined;

  return { hasMore, cursor };
}
