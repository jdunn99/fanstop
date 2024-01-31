import { NextApiResponse } from "next";
import { ValidMethods } from "./validators";

// export function validMethodCheck(
//   res: NextApiResponse,
//   method: ValidMethods,
//   methods: ValidMethods[]
// ) {
//   if (!methods.includes(method)) {
//     return res.status(400).json({ message: "Invalid method" });
//   }
// }

export function sendSuccess(res: NextApiResponse, data: any) {
  return res.status(200).json(data);
}

export function sendError(res: NextApiResponse, statusCode: number, data: any) {
  return res.status(statusCode).json(data);
}
