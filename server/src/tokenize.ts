import { sign } from "jsonwebtoken";
import { User } from "./Model/User";

/**
 * Generate JWTs
 * @param {User} user - The user the tokens are being generated for.
 * @returns Object containing the refresh and access tokens.
 */
export const tokenize = (user: User) => {
  const refresh = sign({ userId: user._id }, "lollipop", { expiresIn: "7d" });
  const access = sign({ userId: user._id }, "licorice", {
    expiresIn: "15min",
  });

  return { refresh, access };
};
