import { SVGProps } from "react";

// Defines props for an SVG icon component, adding an optional 'size' prop.
export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// Defines props for a card component displaying a numeric count and a title.
export interface CountCardProps {
  count:number;
  title:string;
}
