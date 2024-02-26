import { allowMethods } from "@/lib/middleware/methods-middleware";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import {
  NextApiRequestWithValidation,
  validate,
} from "@/lib/middleware/validation-middleware";
import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import { CommunityQuerySchema } from ".";
import { z } from "zod";
import { TagsService } from "@/lib/services/tags-service";

const methods = ["GET"];

async function handler(
  req: NextApiRequestWithValidation<z.infer<typeof CommunityQuerySchema>>,
  res: NextApiResponse
) {
  const { validatedQuery } = req;
  const { slug } = validatedQuery;

  res.status(200).json(
    await TagsService.getTags({
      communities: {
        some: {
          slug,
        },
      },
    })
  );
  return;
}

export default use(
  getServerErrors,
  allowMethods(methods),
  validate({ query: CommunityQuerySchema }),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
