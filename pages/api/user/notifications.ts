import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getNotificationsForUser } from "@/lib/api/notification";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;
    const session = await getServerSession(req, res, authOptions);
    if (method !== "GET") {
      return res.status(400).json({ message: "Invalid method" });
    }

    if (session === null) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const result = await getNotificationsForUser(session.user.id);

    console.log(result);
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
    return;
  }
}
