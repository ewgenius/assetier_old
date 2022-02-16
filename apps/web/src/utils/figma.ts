import { FigmaAuthCredentials } from "@assetier/prisma";
import { fetcher } from "@utils/fetcher";
import { prisma } from "@utils/prisma";

export const FIGMA_API = "https://api.figma.com";

export class FigmaClient {
  private clientId: string;
  private clientSecret: string;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  private async refresh(credentials: FigmaAuthCredentials) {
    const refresh = await fetcher<{
      access_token: string;
      expires_in: number;
    }>(
      `https://www.figma.com/api/oauth/refresh?client_id=${this.clientId}&client_secret=${this.clientSecret}&refresh_token=${credentials.refreshToken}`,
      {
        method: "POST",
      }
    );

    return await prisma.figmaAuthCredentials.update({
      where: {
        id: credentials.id,
      },
      data: {
        accessToken: refresh.access_token,
      },
    });
  }

  public async fetch<T = any>(
    endpoint: string,
    credentials: FigmaAuthCredentials
  ) {
    console.log(endpoint);
    console.log(credentials);
    return fetcher<T>(`${FIGMA_API}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`,
      },
    }).catch(async (err) => {
      if (err.status === 403) {
        const refreshed = await this.refresh(credentials);

        return fetcher<T>(`${FIGMA_API}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${refreshed.accessToken}`,
          },
        });
      }

      throw err;
    });
  }
}

export const figma = new FigmaClient(
  process.env.FIGMA_CLIENT_ID as string,
  process.env.FIGMA_CLIENT_SECRET as string
);
