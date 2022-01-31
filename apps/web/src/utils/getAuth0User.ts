import type { Auth0User } from "@assetier/types";
import { fetcher } from "@utils/fetcher";

export async function getAuth0User(userId: string, managementToken: string) {
  const user = fetcher<Auth0User>(
    `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${managementToken}`,
      },
    }
  );

  return user;
}
