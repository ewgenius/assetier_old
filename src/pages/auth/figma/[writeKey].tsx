import type { NextPageExtended } from "@utils/types";
import { Page } from "@components/Page";
import type { GetServerSideProps, NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { prisma } from "@utils/prisma";
import { signIn } from "next-auth/react";
import { useEffect } from "react";

export interface FigmaIntegrationAuthProps {
  success: boolean;
}

export const FigmaIntegrationAuth: NextPageExtended<
  FigmaIntegrationAuthProps
> = ({ success }) => {
  useEffect(() => {
    if (!success) {
      signIn();
    }
  }, [success]);

  return (
    <Page>
      <div className="h-screen flex flex-col justify-center items-center">
        Figma plugin authorized, you can close this page now
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps<
  FigmaIntegrationAuthProps
> = async ({ req, params }) => {
  const token = await getToken({
    req: req as NextApiRequest,
    secret: process.env.NEXTAUTH_SECRET as string,
    raw: true,
  });

  if (!token) {
    return {
      props: {
        success: false,
      },
    };
  }

  const pair = await prisma.figmaReadWritePair.findUnique({
    where: {
      writeKey: params?.writeKey as string,
    },
  });

  if (!pair) {
    return {
      props: {
        success: false,
      },
    };
  }

  await prisma.figmaReadWritePair.update({
    where: {
      writeKey: params?.writeKey as string,
    },
    data: {
      token,
    },
  });

  return {
    props: {
      success: true,
    },
  };
};

FigmaIntegrationAuth.type = "auth";

export default FigmaIntegrationAuth;
