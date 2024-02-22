import { z } from "zod";

export type PaginationArgs = {
  cursor?: string;
  take?: number;
};

export type PaginationArgsWithID = PaginationArgs & {
  id: string;
};

export type PaginationResponse<T> = {
  response: T;
  cursor: string;
};

export const PaginationSchema = z.object({
  cursor: z.string().cuid().optional(),
});

export function paginationArgs({ cursor, take }: PaginationArgs) {
  return {
    take,
    skip: cursor ? 1 : undefined,
    cursor: cursor
      ? {
          id: cursor,
        }
      : undefined,
  };
}
