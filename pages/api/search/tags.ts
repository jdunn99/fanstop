import { allowMethods } from "@/lib/middleware/methods-middleware";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import {
  NextApiRequestWithValidation,
  validate,
} from "@/lib/middleware/validation-middleware";
import {
  SearchQuery,
  SearchQuerySchema,
  SearchService,
} from "@/lib/services/search-service";
import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";

const methods = ["GET"];

async function handler(
  req: NextApiRequestWithValidation<SearchQuery>,
  res: NextApiResponse
) {
  const { validatedQuery } = req;
  const { query } = validatedQuery;

  const result = await SearchService.getTagNames(query);

  res.status(200).json(result);
}

export default use(
  getServerErrors,
  allowMethods(methods),
  validate({ query: SearchQuerySchema }),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
