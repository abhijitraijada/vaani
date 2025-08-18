import type { PropsWithChildren, ReactElement } from 'react';
import React from 'react';

export function DataList({ children, align = 'left' }: PropsWithChildren<{ align?: 'left' | 'center' | 'right' }>) {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  return <ul className={`divide-y divide-gray-200 dark:divide-gray-800 ${alignClass}`}>{children}</ul>;
}

export function ListItem({ children, align = 'left', icon }: PropsWithChildren<{ align?: 'left' | 'center' | 'right'; icon?: React.ReactNode }>) {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  return (
    <li className={`px-4 hover:bg-gray-50 dark:hover:bg-gray-800 ${alignClass}`}>
      <div className="flex items-start gap-2">
        {icon ? <span className="mt-1 inline-flex shrink-0">{icon}</span> : null}
        <div className="grow">{children}</div>
      </div>
    </li>
  );
}

export function UnorderedList({ children, align = 'left', bullet }: PropsWithChildren<{ align?: 'left' | 'center' | 'right'; bullet?: React.ReactNode }>) {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  const items = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const el = child as ReactElement<{ icon?: React.ReactNode }>;
      const defaultBullet = (
        <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-gray-400" />
      );
      const resolved = bullet ?? defaultBullet;
      // If a raw <li> is passed, unwrap its children into our ListItem to avoid li nesting
      if (typeof el.type === 'string' && el.type.toLowerCase() === 'li') {
        return <ListItem icon={resolved}>{(el.props as any).children}</ListItem>;
      }
      if ((el.props as any).icon === undefined) {
        return React.cloneElement(el, { icon: resolved });
      }
      return el;
    }
    return child;
  });
  return <ul className={`list-none ${alignClass}`}>{items}</ul>;
}

type OrderedVariant = 'decimal' | 'lower-alpha' | 'upper-alpha' | 'lower-roman' | 'upper-roman';

function toAlpha(index: number, upper: boolean): string {
  const i = index - 1;
  const ch = String.fromCharCode(97 + (i % 26));
  const s = ch.repeat(1); // simple a–z; extend later as needed
  return upper ? s.toUpperCase() : s;
}

function toRoman(index: number, upper: boolean): string {
  const romans: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let n = index;
  let res = '';
  for (const [v, sym] of romans) {
    while (n >= v) { res += sym; n -= v; }
  }
  return upper ? res : res.toLowerCase();
}

function markerFor(index: number, variant: OrderedVariant): string {
  switch (variant) {
    case 'decimal':
      return String(index);
    case 'lower-alpha':
      return toAlpha(index, false);
    case 'upper-alpha':
      return toAlpha(index, true);
    case 'lower-roman':
      return toRoman(index, false);
    case 'upper-roman':
      return toRoman(index, true);
  }
}

export function OrderedList({ children, align = 'left', variant = 'decimal', start = 1 }: PropsWithChildren<{ align?: 'left' | 'center' | 'right'; variant?: OrderedVariant; start?: number }>) {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  const nodes = React.Children.toArray(children);
  return (
    <ol className={`list-none ${alignClass}`}>
      {nodes.map((child, idx) => {
        const index = start + idx;
        const badge = (
          <span className="mt-0.5 inline-flex min-w-4 justify-center text-xs font-semibold text-gray-600 dark:text-gray-300">
            {markerFor(index, variant)}.
          </span>
        );
        if (React.isValidElement(child)) {
          // If it's already our ListItem, inject marker if missing
          if (child.type === ListItem) {
            const el = child as ReactElement<{ icon?: React.ReactNode }>;
            return React.cloneElement(el, { icon: (el.props as any).icon ?? badge, key: idx });
          }
          // If a raw <li> slipped in, unwrap its content to avoid nested li
          if (typeof child.type === 'string' && child.type.toLowerCase() === 'li') {
            return (
              <ListItem key={idx} icon={badge}>{(child.props as any).children}</ListItem>
            );
          }
        }
        // Fallback: wrap any other node
        return (
          <ListItem key={idx} icon={badge}>{(child as React.ReactNode)}</ListItem>
        );
      })}
    </ol>
  );
}


