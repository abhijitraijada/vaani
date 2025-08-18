import type { ReactNode } from 'react';

export function MobileSplit({
  primary,
  secondary,
}: {
  primary: ReactNode;
  secondary: ReactNode;
  secondaryTitle?: ReactNode;
}) {
  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-6">
      <div>{primary}</div>
      <div className="hidden lg:block">{secondary}</div>
      {/* On mobile: secondary opens in a Drawer; the page can mount Drawer via state */}
    </div>
  );
}


