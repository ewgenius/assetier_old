import type { NextPageExtended } from "@utils/types";
import { Page } from "@components/Page";
import { Spinner } from "@components/Spinner";

export const Home: NextPageExtended = () => {
  return (
    <Page>
      <div className="flex justify-center py-4">
        <Spinner />
      </div>
    </Page>
  );
};

Home.type = "app";
Home.navId = "projects";

export default Home;
