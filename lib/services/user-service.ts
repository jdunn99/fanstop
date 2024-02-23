import { UserUpdateBody } from "@/pages/api/user";
import { db } from "../db";
import { hash } from "argon2";

export const USER_WITH_IMAGE = {
  id: true,
  name: true,
  image: true,
};

export const UserService = {
  getUser(id: string) {
    return db.user.findFirstOrThrow({
      where: {
        id,
      },
    });
  },

  async updateUser(id: string, { name, newPassword }: UserUpdateBody) {
    return db.user.update({
      where: {
        id,
      },
      data: {
        name,
        password:
          typeof newPassword !== "undefined"
            ? await hash(newPassword)
            : undefined,
      },
    });
  },
};
