import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]";

const methods = ["DELETE"];
const QuerySchema = z.object({ subscriptionId: z.string() });

const SubscriptionArgsSchema = z.object({
  subscriptionId: z.string().cuid(),
  userId: z.string().cuid(),
});

type SubArgs = z.infer<typeof SubscriptionArgsSchema>;

async function unsubscribe({ subscriptionId, userId }: SubArgs) {
  await db.subscriber.delete({ where: { id: subscriptionId, userId } });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, query } = req;
    const { subscriptionId } = QuerySchema.parse(query);

    if (!methods.includes(method!)) {
      return res.status(400).send({ message: "Invalid Method" });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(403).json({ message: "Not authorized" });
    }

    return res
      .status(200)
      .json(await unsubscribe({ subscriptionId, userId: session.user.id }));
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong!" });
  }
}
