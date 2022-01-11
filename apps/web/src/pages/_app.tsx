import "tailwindcss/tailwind.css";
import { useCallback, useEffect, useState } from "react";
import { SessionProvider, signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const { user } = useMe();
  const [organization, setOrganization] = useState(user?.personalOrganization);

  const selectOrganization = useCallback(
    (org: OrganizationWithPlan) =>
      push("/app/[organizationId]", `/app/${org.id}`).then(() =>
        setOrganization(org)
      ),
    [setOrganization, push]
  );

  useEffect(() => {
    if (session === null) {
      signIn();
    }
  }, [session, push]);

  useEffect(() => {
    if (user && !organization) {
      if (query?.organizationId) {
        const org = user.organizations.find(
          (o) => o.id === query.organizationId
        );
        if (org) {
          selectOrganization(org);
        }
      } else {
        selectOrganization(user.personalOrganization);
      }
    }
  }, [user, query?.organizationId, selectOrganization, organization]);

  if (!session || !user || !organization) {
    return (
      <div className="min-h-screen">
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!user.user.verified) {
    return (
      <div className="min-h-screen">
        <LayoutBlock>Hello {user.user.name}, you are in waitlist</LayoutBlock>
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
      const { session } = props.pageProps;
      return (
        <SessionProvider session={session}>
          <AppWithAuth {...props} />
          <Footer mode="primary" />
        </SessionProvider>
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
      return <AppDefault {...props} />;
    }
  }
}

export default App;
