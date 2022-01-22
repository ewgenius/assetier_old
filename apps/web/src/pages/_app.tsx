import "tailwindcss/tailwind.css";
import { useCallback, useEffect, useState } from "react";
import { UserProvider, useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";

import type { AppPropsExtended, OrganizationWithPlan } from "@assetier/types";
import { LayoutBlock } from "@components/LayoutBlock";
import { AppTopBar } from "@components/AppTopBar";
import { Footer } from "@components/Footer";
import { useMe } from "@hooks/useMe";
import { AppContext } from "../appContext";
import { Spinner } from "@components/Spinner";

function AppWithAuth({ Component: Page, pageProps }: AppPropsExtended) {
  const { push, query } = useRouter();
  const user = useUser();
  const { user: me } = useMe();
  const [organization, setOrganization] = useState(me?.personalOrganization);

  const selectOrganization = useCallback(
    (org: OrganizationWithPlan) =>
      push("/app/[organizationId]", `/app/${org.id}`).then(() =>
        setOrganization(org)
      ),
    [setOrganization, push]
  );

  useEffect(() => {
    if (!user.isLoading && (user.error || !user.user)) {
      location.replace("/api/auth/login?returnTo=/app");
    }
  }, [user, user.isLoading, push]);

  useEffect(() => {
    if (me && !organization) {
      if (query?.organizationId) {
        const org = me.organizations.find((o) => o.id === query.organizationId);
        if (org) {
          selectOrganization(org);
        }
      } else {
        selectOrganization(me.personalOrganization);
      }
    }
  }, [me, query?.organizationId, selectOrganization, organization]);

  if (!user || !me || !organization) {
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
        organization: organization,
        setOrganization: selectOrganization,
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
