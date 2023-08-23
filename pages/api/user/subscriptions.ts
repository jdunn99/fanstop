import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { z } from "zod";
import { db } from "@/lib/db";

export async function getSubscriptionsForUser(userId: string) {
    return await db.subscriber.findMany({
        where: { userId: { equals: userId } },
    });
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { method } = req;

        if (method !== "GET") {
            return res.status(400).send({ message: "Invalid request" });
        }

        const session = await getServerSession(req, res, authOptions);

        if (session === null) {
            return res.status(403).send({ message: "Not authorized" });
        }

        return res
            .status(200)
            .json(await getSubscriptionsForUser(session.user.id));
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error });
    }
}
