import type { Middleware } from "@assetier/types";
import jwt from "express-jwt";
import { expressJwtSecret } from "jwks-rsa";
import { NextApiRequest, NextApiResponse } from "next";

export const auth0JwtMiddleware: Middleware = (
  req: NextApiRequest,
  res: NextApiResponse
) =>
  new Promise((resolve, reject) => {
    jwt({
      secret: expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json`,
      }),
      audience: process.env.AUTH0_API_AUDIENCE,
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
      algorithms: ["RS256"],
    })(req as any, res as any, (err) => {
      if (err) {
        reject({
          details: {
            AUTH0_API_AUDIENCE: process.env.AUTH0_API_AUDIENCE,
            AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
          },
          ...err,
        });
      } else {
        resolve({});
      }
    });
  });
