import { classNames } from "@utils/classNames";
import { FC, PropsWithChildren } from "react";

export interface LayoutBlockProps {
  mode?: "filled" | "transparent";
  border?: boolean;
}

export const LayoutBlock: FC<PropsWithChildren<LayoutBlockProps>> = ({
  children,
  mode,
  border,
}) => {
  return (
    <div
      className={classNames(
        mode === "transparent" ? "bg-gray-100" : "bg-white",
        border && "border-b border-gray-200"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </div>
    </div>
  );
};

LayoutBlock.defaultProps = {
  mode: "transparent",
  border: false,
};
