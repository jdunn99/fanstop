import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { db } from "@/lib/db";

async function getCommunitiesForUser(id: string) {
  return await db.community.findFirst({
    where: { creatorId: { equals: id } },
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;

    const session = await getServerSession(req, res, authOptions);

    if (!session) return res.status(403).send({ message: "Not authorized" });

    if (method !== "GET") {
      return res.status(400).send({ message: "Invalid Method" });
    }

    return res.status(200).json(await getCommunitiesForUser(session.user.id));
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong!" });
  }
}
