import "tailwindcss/tailwind.css";
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";

import { AppPropsExtended } from "@utils/types";
import { LayoutBlock } from "@components/LayoutBlock";
import { AuthBlock } from "@components/AuthBlock";
import { AppTopBar } from "@components/AppTopBar";
import { Footer } from "@components/Footer";
import { useMe } from "@hooks/useMe";

function AppWithAuth({ Component: Page, pageProps }: AppPropsExtended) {
  const { data: session } = useSession();
  const { user } = useMe();
  console.log(user);

  if (!session) {
    return (
      <div className="min-h-screen">
        <LayoutBlock>
          <AuthBlock />
        </LayoutBlock>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppTopBar currentNavId={Page.navId} />
      <Page {...pageProps} />
    </div>
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
    default: {
      return (
        <>
          <AppDefault {...props} />
          <Footer mode="secondary" />
        </>
      );
    }
  }
}

export default App;
