import type { SVGAttributes } from 'react';

export type IconProps = SVGAttributes<SVGSVGElement> & { name: 'check' | 'x' | 'arrow-right' | 'search' | 'chevron-down' };

const paths: Record<IconProps['name'], string> = {
  check: 'M5 13l4 4L19 7',
  x: 'M6 18L18 6M6 6l12 12',
  'arrow-right': 'M5 12h14M13 5l7 7-7 7',
  search: 'M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z',
  'chevron-down': 'M6 9l6 6 6-6',
};

export function Icon({ name, width = 20, height = 20, stroke = 'currentColor', strokeWidth = 2, fill = 'none', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={width} height={height} stroke={stroke} strokeWidth={strokeWidth} fill={fill} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d={paths[name]} />
    </svg>
  );
}


