import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await db.tags.createMany({
      data: [
        {
          name: "Technology",
        },
        {
          name: "Health & Wellness",
        },
        {
          name: "Home & Garden",
        },
        {
          name: "Business",
        },
        {
          name: "Sports",
        },
      ],
    });

    res.status(200).json({ message: "HI" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}
