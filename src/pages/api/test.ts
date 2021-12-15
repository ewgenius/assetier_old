import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  NEXTAUTH_URL: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ NEXTAUTH_URL: process.env.NEXTAUTH_URL || "" });
}
