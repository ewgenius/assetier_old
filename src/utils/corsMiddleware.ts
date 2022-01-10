import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { runMiddleware } from "@utils/runMiddleware";

const cors = Cors({
  origin: "*",
});

export function runCors(req: NextApiRequest, res: NextApiResponse) {
  return runMiddleware(req, res, cors);
}
