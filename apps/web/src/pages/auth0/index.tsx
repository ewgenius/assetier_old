import type { Auth0User } from "@assetier/types";
import { getSession, useUser } from "@auth0/nextjs-auth0";
import { GetServerSideProps, NextPage } from "next";
import { withPageAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";
import { fetcher } from "@utils/fetcher";
import { FigmaFile } from "../api/organizations/[organizationId]/projects/[projectId]/figma";

export const Auth0Page: NextPage = () => {
  const user = useUser();
  return (
    <div>
      <p>auth:</p>
      <div>
        <a href="/api/auth/login?returnTo=/auth0">login</a>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res }) {
    const session = await getSession(req, res);

    // get auth0 managament token
    const data = new URLSearchParams();
    data.set("grant_type", "client_credentials");
    data.set("client_id", process.env.AUTH0_M2M_CLIENT_ID as string);
    data.set("client_secret", process.env.AUTH0_M2M_CLIENT_SECRET as string);
    data.set("audience", `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`);
    const mangementToken = await fetcher(
      `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: data,
      }
    );

    // get auth0 oauth user (for figma authorization)
    const user = await fetcher<Auth0User>(
      `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${session?.user.sub}`,
      {
        headers: {
          Authorization: `Bearer ${mangementToken.access_token}`,
        },
      }
    );
    console.log(user);

    const figmaFile = await fetcher<FigmaFile>(
      `https://api.figma.com/v1/files/gzaT3ulGZJeWaR83Cd7Fti`,
      {
        headers: {
          Authorization: `Bearer ${user.identities[0].access_token}`,
        },
      }
    );

    console.log(figmaFile);

    return {
      props: {},
    };
  },
});

export default Auth0Page;
