import React from "react";
import { FC } from "react";
import { classNames } from "../utils/classNames";

export interface PageProps {
  layout?: "column" | "center";
}

export const Page: FC<React.PropsWithChildren<PageProps>> = ({
  children,
  layout,
}) => (
  <div
    className={classNames(
      layout === "center" && "justify-center items-center",
      "h-full flex flex-col"
    )}
  >
    {children}
  </div>
);

Page.defaultProps = {
  layout: "column",
};
