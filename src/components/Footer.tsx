import type { FC } from "react";
import type { LayoutBlockProps } from "./LayoutBlock";
import { LayoutBlock } from "./LayoutBlock";

export const Footer: FC<Pick<LayoutBlockProps, "mode">> = ({ mode }) => {
  return (
    <LayoutBlock className="mt-16" mode={mode} borderTop padding="lg">
      <footer>
        <div className="text-sm text-gray-400">
          <p>Copyright &copy; 2022 assetier.app</p>
        </div>
      </footer>
    </LayoutBlock>
  );
};
