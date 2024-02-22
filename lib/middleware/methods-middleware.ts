import { Middleware } from "next-api-route-middleware";

export function allowMethods(methods: string[]): Middleware {
  return async function (req, res, next) {
    const { method } = req;
    if (!methods.includes(method!)) {
      res.status(405).send({ message: "Invalid method" });
      return;
    }

    next();
  };
}
