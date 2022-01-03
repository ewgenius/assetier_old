import type { NextPageExtended } from "@utils/types";
import { Page } from "@components/Page";
import { LayoutBlock } from "@components/LayoutBlock";
import { PageHeader } from "@components/PageHeader";

export const OrganizationSettingsPage: NextPageExtended = () => {
  return (
    <Page title={() => <PageHeader>Organization Settings</PageHeader>}>
      <LayoutBlock padding="lg"></LayoutBlock>
    </Page>
  );
};

OrganizationSettingsPage.type = "app";

export default OrganizationSettingsPage;
