import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });

  if (token) {
    res.setHeader("Set-Cookie", [
      `next-auth.session-token=deleted; Max-Age=0; Path=/`,
      `next-auth.csrf-token=deleted; Max-Age=0; Path=/`,
    ]);
  }

  res.status(200).json({ message: "Signed out" });
};
