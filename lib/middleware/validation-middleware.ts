import { NextApiRequest } from "next";
import { Middleware } from "next-api-route-middleware";
import { z } from "zod";
import { NextApiRequestWithSession } from "./session-middleware";

interface ValidationArgs {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
}

export type NextApiRequestWithValidation<T = {}, K = {}> = NextApiRequest & {
  validatedQuery: T;
  validatedBody: K;
};

export type NextApiRequestWithValidatedSession<
  T = {},
  K = {}
> = NextApiRequestWithSession & NextApiRequestWithValidation<T, K>;

export function validate({
  body,
  query,
}: ValidationArgs): Middleware<NextApiRequestWithValidation> {
  return async function (req, res, next) {
    if (req.query && query) {
      const result = query.safeParse(req.query);
      if (!result.success) {
        res.status(400).send({ message: result.error });
        return;
      }

      req.validatedQuery = result.data;
    }

    if (req.body && body && req.method !== "GET") {
      const result = body.safeParse(req.body);
      if (!result.success) {
        res.status(400).send({ message: result.error });
        return;
      }

      req.validatedBody = result.data;
    }

    next();
  };
}
