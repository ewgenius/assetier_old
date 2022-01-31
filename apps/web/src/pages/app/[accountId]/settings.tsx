import type { NextPageExtended } from "@assetier/types";
import { Page } from "@components/Page";
import { LayoutBlock } from "@components/LayoutBlock";
import { PageHeader } from "@components/PageHeader";

export const AccountSettingsPage: NextPageExtended = () => {
  return (
    <Page title={() => <PageHeader>Account Settings</PageHeader>}>
      <LayoutBlock padding="lg"></LayoutBlock>
    </Page>
  );
};

AccountSettingsPage.type = "app";

export default AccountSettingsPage;
