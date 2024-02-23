import { Middleware } from "next-api-route-middleware";

export const getServerErrors: Middleware = async (req, res, next) => {
  try {
    await next();
  } catch (error) {
    console.error(error);
    console.log("AN ERROR HAS BEEN FOUND");
    res.status(500).send({ message: "Server error" });
    return;
  }
};
