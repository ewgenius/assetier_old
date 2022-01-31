import { fetcher } from "@utils/fetcher";

export async function getAuth0ApiToken() {
  const user = fetcher(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.AUTH0_M2M_CLIENT_ID,
      client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
      audience: process.env.AUTH0_API_AUDIENCE,
      grant_type: "client_credentials",
    }),
  });

  return user;
}
