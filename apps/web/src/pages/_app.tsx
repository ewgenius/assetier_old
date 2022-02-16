import "tailwindcss/tailwind.css";
import { useCallback, useEffect, useState } from "react";
import { UserProvider, useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";

import type { AppPropsExtended, AccountWithPlan } from "@assetier/types";
import { LayoutBlock } from "@components/LayoutBlock";
import { AppTopBar } from "@components/AppTopBar";
import { Footer } from "@components/Footer";
import { useMe } from "@hooks/useMe";
import { AppContext } from "../appContext";
import { Spinner } from "@components/Spinner";
import * as Fathom from "fathom-client";

function useFathom() {
  const router = useRouter();

  useEffect(() => {
    Fathom.load("CSHPPVVG", {
      includedDomains: ["www.assetier.app"],
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }

    router.events.on("routeChangeComplete", onRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, []);
}

function AppWithAuth({ Component: Page, pageProps }: AppPropsExtended) {
  const { push, query } = useRouter();
  const user = useUser();
  const { user: me } = useMe();
  const [account, setAccount] = useState(me?.personalAccount);

  useFathom();

  const selectAccount = useCallback(
    (acc: AccountWithPlan) =>
      push("/app/[accountId]", `/app/${acc.id}`).then(() => setAccount(acc)),
    [setAccount, push, query.accountId]
  );

  useEffect(() => {
    if (!user.isLoading && (user.error || !user.user)) {
      location.replace("/api/auth/login?returnTo=/app");
    }
  }, [user, user.isLoading, push]);

  useEffect(() => {
    if (me && !account) {
      if (query?.accountId) {
        const acc = me.accounts.find((o) => o.id === query.accountId);
        if (acc) {
          selectAccount(acc);
        }
      } else {
        selectAccount(me.personalAccount);
      }
    }
  }, [me, query?.accountId, selectAccount, account]);

  if (!user || !me || !account) {
    return (
      <div className="min-h-screen">
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!me.user.verified) {
    return (
      <div className="min-h-screen">
        <LayoutBlock>Hello {me.user.name}, you are in waitlist</LayoutBlock>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        account: account,
        setAccount: selectAccount,
      }}
    >
      <div className="min-h-screen">
        <AppTopBar currentNavId={Page.navId} />
        {Page.Wrapper ? (
          <Page.Wrapper {...Page.wrapperProps}>
            <Page {...pageProps} />
          </Page.Wrapper>
        ) : (
          <Page {...pageProps} />
        )}
      </div>
    </AppContext.Provider>
  );
}

function AppDefault({ Component: Page, pageProps }: AppPropsExtended) {
  return (
    <div className="min-h-screen">
      <Page {...pageProps} />
    </div>
  );
}

function AppAuth({ Component: Page, pageProps }: AppPropsExtended) {
  return (
    <div className="min-h-screen">
      <Page {...pageProps} />
    </div>
  );
}

function App(props: AppPropsExtended) {
  useFathom();

  switch (props.Component.type) {
    case "app": {
      return (
        <UserProvider>
          <AppWithAuth {...props} />
          <Footer mode="primary" />
        </UserProvider>
      );
    }

    case "auth":
      return (
        <>
          <AppAuth {...props} />
          <Footer mode="secondary" />
        </>
      );

    case "site":
      return (
        <>
          <AppDefault {...props} />
          <Footer mode="secondary" />
        </>
      );

    default: {
      return (
        <UserProvider>
          <AppDefault {...props} />
        </UserProvider>
      );
    }
  }
}

export default App;
