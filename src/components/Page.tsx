import { FC, PropsWithChildren, ReactNode } from "react";

export interface PageProps {
  title?: () => ReactNode | string;
}

export const Page: FC<PropsWithChildren<PageProps>> = ({ children, title }) => {
  return (
    <>
      {title ? title() : null}
      <main>{children}</main>
    </>
  );
};
