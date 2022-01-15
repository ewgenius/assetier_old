import React from "react";
import type { FC } from "react";
import { Page } from "../components/Page";
import { Spinner } from "../components/Spinner";

export const BootPage: FC = () => {
  return (
    <Page layout="center">
      <Spinner />
    </Page>
  );
};
