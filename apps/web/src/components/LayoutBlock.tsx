import { classNames } from "@utils/classNames";
import type { FC, PropsWithChildren } from "react";

export interface LayoutBlockProps {
  className?: string;
  mode?: "primary" | "secondary";
  borderTop?: boolean;
  borderBottom?: boolean;
  padding?: "none" | "sm" | "xs" | "lg";
  sticky?: boolean;
}

const PaddingMap = {
  none: "py-0",
  xs: "py-2",
  sm: "py-4",
  lg: "py-8",
};

export const LayoutBlock: FC<PropsWithChildren<LayoutBlockProps>> = ({
  className,
  children,
  mode,
  borderTop,
  borderBottom,
  padding,
  sticky,
}) => {
  return (
    <div
      className={classNames(
        className,
        mode === "secondary" ? "bg-white" : "bg-white",
        (borderTop || borderBottom) && "border-gray-200",
        borderTop && "border-t",
        borderBottom && "border-b",
        sticky && "sticky top-0"
      )}
    >
      <div
        className={classNames(
          "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
          PaddingMap[padding || "xs"]
        )}
      >
        {children}
      </div>
    </div>
  );
};

LayoutBlock.defaultProps = {
  mode: "secondary",
};
