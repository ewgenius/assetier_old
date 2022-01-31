import { Middleware } from "@assetier/types";
import type { NextApiRequest, NextApiResponse } from "next";

export type WithMiddleware = <
  RequestType extends NextApiRequest,
  ResponseType extends NextApiResponse
>(
  handler: (req: RequestType, res: ResponseType) => void | Promise<void>,
  middlewares?: Middleware[]
) => (req: RequestType, res: ResponseType) => void | Promise<void>;

export const withMiddleware: WithMiddleware =
  (handler, middlewares) => async (req, res) => {
    if (middlewares) {
      for (let middleware of middlewares) {
        await middleware(req, res);
      }
    }

    return handler(req, res);
  };
