import { ReturnModelType } from "@typegoose/typegoose";
import { User } from "./Model/User";
import { Response } from "express";
import { Post } from "./Model/Post";

type UserID = {
  userId: string;
};

export interface Context {
  UserModel: ReturnModelType<typeof User, {}>;
  PostModel: ReturnModelType<typeof Post, {}>;
  req: Request & UserID;
  res: Response;
}
