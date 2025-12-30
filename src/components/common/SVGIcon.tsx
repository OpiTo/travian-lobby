import { ReactNode } from 'react';

/**
 * SVG Icon wrapper component (b component in original)
 * Wraps SVG content with optional outline effect.
 */
interface SVGIconProps {
  className?: string;
  viewBox: string;
  preserveAspectRatio?: string;
  onClick?: (e: React.MouseEvent) => void;
  outline?: boolean;
  children: ReactNode;
}

const SVGIcon = ({
  className,
  viewBox,
  preserveAspectRatio,
  onClick,
  outline,
  children,
}: SVGIconProps) => {
  return (
    <svg
      className={className}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      onClick={onClick}
    >
      {outline ? (
        <>
          <g className="outline">{children}</g>
          <g className="icon">{children}</g>
        </>
      ) : (
        children
      )}
    </svg>
  );
};

export default SVGIcon;
