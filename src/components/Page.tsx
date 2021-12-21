import { FC, PropsWithChildren, ReactNode } from "react";

export interface PageProps {
  title?: () => ReactNode | string;
}

export const Page: FC<PropsWithChildren<PageProps>> = ({ children, title }) => {
  return (
    <>
      {title && <header>{title()}</header>}
      <main>
        {children}
        {/* <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            </div>
        </div> */}
      </main>
    </>
  );
};
