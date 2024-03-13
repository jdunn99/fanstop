import { allowMethods } from "@/lib/middleware/methods-middleware";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import {
  NextApiRequestWithSession,
  useServerAuth,
} from "@/lib/middleware/session-middleware";
import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import {
  NextApiRequestWithValidation,
  validate,
} from "@/lib/middleware/validation-middleware";
import { z } from "zod";
import { UserService } from "@/lib/services/user-service";

export const AccountInputSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string(),
  })
  .strict();

const methods = ["POST"];

async function handler(
  req: NextApiRequestWithValidation<{}, z.infer<typeof AccountInputSchema>>,
  res: NextApiResponse
) {
  const { validatedBody } = req;
  return res.status(200).json(await UserService.register(validatedBody));
}

export default use(
  getServerErrors,
  allowMethods(methods),
  validate({ body: AccountInputSchema }),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
