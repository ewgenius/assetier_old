import { classNames } from "@utils/classNames";
import { FC, PropsWithChildren } from "react";

export interface LayoutBlockProps {
  mode?: "primary" | "secondary";
  borderTop?: boolean;
  borderBottom?: boolean;
}

export const LayoutBlock: FC<PropsWithChildren<LayoutBlockProps>> = ({
  children,
  mode,
  borderTop,
  borderBottom,
}) => {
  return (
    <div
      className={classNames(
        mode === "secondary" ? "bg-gray-100" : "bg-white",
        (borderTop || borderBottom) && "border-gray-200",
        borderTop && "border-t",
        borderBottom && "border-b "
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </div>
    </div>
  );
};

LayoutBlock.defaultProps = {
  mode: "secondary",
};
