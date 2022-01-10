import type { NextPageExtended } from "lib-types";
import { Page } from "@components/Page";
import { getProviders, signIn } from "next-auth/react";
import type { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import type { GetServerSideProps } from "next";
import type { BuiltInProviderType } from "next-auth/providers";
import { GitHubIcon } from "@components/GitHubIcon";
import { useRouter } from "next/router";
import { useCallback } from "react";

export interface SignInPageProps {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}

export const SignInPage: NextPageExtended<SignInPageProps> = ({
  providers,
}) => {
  const { query } = useRouter();

  const signInHandler = useCallback(
    (id: LiteralUnion<BuiltInProviderType, string>) =>
      signIn(id, {
        callbackUrl: query?.callbackUrl as string,
      }),
    [query?.callbackUrl]
  );

  return (
    <Page>
      <div className="h-screen flex flex-col justify-center items-center">
        {providers && (
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">Sign in to Assetier</h1>
            <div className="mt-4 flex flex-col">
              {Object.values(providers).map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => signInHandler(provider.id)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-md font-medium rounded-md shadow-sm text-white bg-[#24292e] hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
                >
                  <GitHubIcon className="w-5 h-5 mr-2" />
                  <span>Continue with {provider.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

SignInPage.type = "auth";

export default SignInPage;
