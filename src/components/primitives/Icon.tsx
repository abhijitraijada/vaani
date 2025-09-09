import type { SVGAttributes } from 'react';

export type IconProps = SVGAttributes<SVGSVGElement> & { name: 'check' | 'x' | 'arrow-right' | 'search' | 'chevron-down' | 'eye' | 'eye-off' | 'download' };

const paths: Record<IconProps['name'], string> = {
  check: 'M5 13l4 4L19 7',
  x: 'M6 18L18 6M6 6l12 12',
  'arrow-right': 'M5 12h14M13 5l7 7-7 7',
  search: 'M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z',
  'chevron-down': 'M6 9l6 6 6-6',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6z',
  'eye-off': 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24 M1 1l22 22',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
};

export function Icon({ name, width = 20, height = 20, stroke = 'currentColor', strokeWidth = 2, fill = 'none', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={width} height={height} stroke={stroke} strokeWidth={strokeWidth} fill={fill} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d={paths[name]} />
    </svg>
  );
}


