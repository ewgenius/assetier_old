import "tailwindcss/tailwind.css";
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";

import { AppPropsExtended } from "@utils/types";
import { LayoutBlock } from "@components/LayoutBlock";
import { AuthBlock } from "@components/AuthBlock";
import { AppTopBar } from "@components/AppTopBar";

function AppWithAuth({ Component: Page, pageProps }: AppPropsExtended) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="min-h-full">
        <LayoutBlock>
          <AuthBlock />
        </LayoutBlock>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <AppTopBar currentNavId={Page.navId} />
      <Page {...pageProps} />
    </div>
  );
}

function AppDefault({ Component: Page, pageProps }: AppPropsExtended) {
  return (
    <div className="min-h-full">
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
        </SessionProvider>
      );
    }

    case "site":
    default: {
      return <AppDefault {...props} />;
    }
  }
}

export default App;
