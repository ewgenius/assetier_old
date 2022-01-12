import { Middleware } from "@assetier/types";
import type { NextApiRequest, NextApiResponse } from "next";
import type { HttpError } from "./httpErrors";

function handleError<E extends HttpError>(res: NextApiResponse, error: E) {
  console.error(error);
  if (error.status) {
    return res.status(error.status).json({
      error: error.message,
    });
  } else {
    throw error;
  }
}

export type WithHttpError = <
  RequestType extends NextApiRequest,
  ResponseType extends NextApiResponse
>(
  handler: (req: RequestType, res: ResponseType) => void | Promise<void>,
  middleware?: Middleware
) => (req: RequestType, res: ResponseType) => void | Promise<void>;

export const withHttpError: WithHttpError =
  (handler, middleware) => async (req, res) => {
    if (middleware) {
      await middleware(req, res);
    }

    try {
      return await handler(req, res);
    } catch (error) {
      return handleError(res, error as HttpError);
    }
  };
