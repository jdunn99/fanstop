import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest } from "next";
import { Middleware } from "next-api-route-middleware";
import { Session, getServerSession } from "next-auth";

export type NextApiRequestWithSession = NextApiRequest & {
  session: Session;
};

export const useServerAuth: Middleware<NextApiRequestWithSession> = async (
  req,
  res,
  next
) => {
  const session = await getServerSession(req, res, authOptions);
  if (session === null) {
    res.status(401).json({ message: "Not logged in" });
    return;
  }
  req.session = session;
  next();
};
