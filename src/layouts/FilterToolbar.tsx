import type { ReactNode } from 'react';
import { Button } from '../components/primitives/Button';

export function FilterToolbar({
  search,
  filters,
  children,
  onOpenFilters,
}: {
  search?: ReactNode;
  filters?: ReactNode;
  children?: ReactNode;
  onOpenFilters?: () => void;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-3">
      {search}
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2">{filters}</div>
        {onOpenFilters && (
          <div className="sm:hidden">
            <Button variant="secondary" onClick={onOpenFilters}>Filters</Button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}


