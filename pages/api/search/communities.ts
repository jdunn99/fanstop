import { allowMethods } from "@/lib/middleware/methods-middleware";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import {
  NextApiRequestWithValidation,
  validate,
} from "@/lib/middleware/validation-middleware";
import { PaginationSchema } from "@/lib/pagination";
import { CommunityService } from "@/lib/services/community-service";
import {
  SearchQuery,
  SearchQuerySchema,
  SearchQueryWithPagination,
  SearchService,
} from "@/lib/services/search-service";
import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";

const methods = ["GET"];

async function handler(
  req: NextApiRequestWithValidation<SearchQueryWithPagination>,
  res: NextApiResponse
) {
  const { validatedQuery } = req;
  const { query, cursor } = validatedQuery;
  console.log(query, cursor);

  const result = await CommunityService.getCommunities({
    query,
    take: 5,
    cursor,
  });
  res.status(200).json(result);
}

export default use(
  getServerErrors,
  allowMethods(methods),
  validate({ query: SearchQuerySchema.merge(PaginationSchema) }),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
