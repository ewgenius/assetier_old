import { FC, PropsWithChildren } from "react";

export const PageHeader: FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-bold leading-tight text-gray-900">
      {children}
    </h1>
  </div>
);
