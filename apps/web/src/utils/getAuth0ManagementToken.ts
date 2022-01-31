import { fetcher } from "@utils/fetcher";

export async function getAuth0ManagementToken() {
  const data = new URLSearchParams();
  data.set("grant_type", "client_credentials");
  data.set("client_id", process.env.AUTH0_M2M_CLIENT_ID as string);
  data.set("client_secret", process.env.AUTH0_M2M_CLIENT_SECRET as string);
  data.set("audience", `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`);
  const managementToken = await fetcher(
    `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: data,
    }
  );

  return managementToken;
}
