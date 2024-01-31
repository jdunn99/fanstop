import { getPostByID, updatePost } from "@/lib/api/post";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { z } from "zod";
import { PostVailidators } from "@/lib/api/validators";

const methods = ["GET", "PUT", "DELETE"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, body, query } = req;
    const { postId } = z.object({ postId: z.string() }).parse(query);
    const session = await getServerSession(req, res, authOptions);

    if (!method || !methods.includes(method)) {
      res.status(400).json({ message: "Invalid method" });
      return;
    }

    switch (method) {
      case "GET": {
        const result = await getPostByID({
          id: postId,
          authorId: session?.user.id,
        });
        res.status(200).json(result);
        return;
      }
      case "PUT": {
        if (session === null) {
          res.status(401).json({ message: "Not logged in" });
          return;
        }

        const test = PostVailidators.PostUpdateSchema.parse({
          ...body,
          authorId: session.user.id,
          id: postId,
        });

        console.log(test);

        const result = await updatePost({
          authorId: session.user.id,
          id: postId,
          ...body,
        });
        res.status(200).json(result);
        return;
      }
      default: {
        return;
      }
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });

    return;
  }
}
