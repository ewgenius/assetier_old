import { useEffect } from "react";
import type { GetServerSideProps, NextPage } from "next";

import type { FigmaOauthConnection, FigmaUser } from "@assetier/types";
import { fetcher } from "@utils/fetcher";
import { prisma } from "@utils/prisma";
import { Spinner } from "@components/Spinner";

export interface FigmaOauthSetupProps {
  success: boolean;
}

export const FigmaOauthSetup: NextPage<FigmaOauthSetupProps> = ({
  success,
}) => {
  useEffect(() => {
    if (success) {
      window.close();
    }
  }, [success]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <Spinner />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  FigmaOauthSetupProps
> = async (context) => {
  const organizationId = context.query.state as string;
  const code = context.query.code as string;

  const connection = await fetcher<FigmaOauthConnection>(
    `https://www.figma.com/api/oauth/token?client_id=${process.env.NEXT_PUBLIC_FIGMA_CLIENT_ID}&client_secret=${process.env.FIGMA_CLIENT_SECRET}&redirect_uri=${process.env.NEXT_PUBLIC_FIGMA_REDIRECT_URI}&code=${code}&grant_type=authorization_code`,
    {
      method: "POST",
    }
  );

  const figmaUser = await fetcher<FigmaUser>("https://api.figma.com/v1/me", {
    headers: {
      Authorization: `Bearer ${connection.access_token}`,
    },
  });

  await prisma.figmaOauthConnection.create({
    data: {
      organizationId,
      userId: connection.user_id,
      accessToken: connection.access_token,
      refreshToken: connection.refresh_token,
      expiresIn: connection.expires_in,
      userEmail: figmaUser.email,
      userHandle: figmaUser.handle,
      userImage: figmaUser.img_url,
    },
  });

  return {
    props: {
      success: true,
    },
  };
};

export default FigmaOauthSetup;
