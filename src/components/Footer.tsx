import { FC } from "react";
import { LayoutBlock, LayoutBlockProps } from "./LayoutBlock";

export const Footer: FC<Pick<LayoutBlockProps, "mode">> = ({ mode }) => {
  return (
    <LayoutBlock mode={mode} borderTop padding="lg">
      <footer>
        <div className="text-sm text-gray-400">
          <p>Copyright &copy; 2021 assetier.app</p>
        </div>
      </footer>
    </LayoutBlock>
  );
};
