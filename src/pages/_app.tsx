import "tailwindcss/tailwind.css";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import type { Organization } from "@prisma/client";

import { AppPropsExtended } from "@utils/types";
import { LayoutBlock } from "@components/LayoutBlock";
import { AuthBlock } from "@components/AuthBlock";
import { AppTopBar } from "@components/AppTopBar";
import { Footer } from "@components/Footer";
import { useMe } from "@hooks/useMe";
import { AppContext } from "../appContext";

function AppWithAuth({ Component: Page, pageProps }: AppPropsExtended) {
  const { data: session } = useSession();
  const { user } = useMe();
  const [organization, setOrganization] = useState(user?.personalOrganization);

  useEffect(() => {
    if (user) {
      setOrganization(user.personalOrganization);
    }
  }, [user]);

  if (!session || !user || !organization) {
    return (
      <div className="min-h-screen">
        <LayoutBlock>
          <AuthBlock />
        </LayoutBlock>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        organization: organization,
      }}
    >
      <div className="min-h-screen">
        <AppTopBar currentNavId={Page.navId} />
        <Page {...pageProps} />
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
