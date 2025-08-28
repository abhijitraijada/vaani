import { type PropsWithChildren, createContext, useContext } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from './Icon';

type AccordionContextValue = {
  value: string | null;
  onValueChange: (value: string | null) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

export function Accordion({ 
  type = 'single',
  value,
  onValueChange,
  className,
  children 
}: PropsWithChildren<{
  type?: 'single' | 'multiple';
  value: string | string[] | null;
  onValueChange: (value: string | string[] | null) => void;
  className?: string;
}>) {
  return (
    <AccordionContext.Provider value={{
      value: Array.isArray(value) ? value[0] : value,
      onValueChange: (newValue) => {
        if (type === 'multiple' && Array.isArray(value)) {
          onValueChange(newValue ? [...value, newValue] : value.filter(v => v !== newValue));
        } else {
          onValueChange(newValue);
        }
      }
    }}>
      <div className={cn('space-y-2', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

const AccordionItemContext = createContext<{ value: string } | null>(null);

export function AccordionItem({
  value,
  className,
  children
}: PropsWithChildren<{
  value: string;
  className?: string;
}>) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionItem must be used within an Accordion');

  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div className={cn('rounded-lg border border-gray-200 dark:border-gray-800', className)}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({
  className,
  children
}: PropsWithChildren<{
  className?: string;
}>) {
  const context = useContext(AccordionContext);
  const item = useContext(AccordionItemContext);
  if (!context || !item) throw new Error('AccordionTrigger must be used within an AccordionItem');

  const isOpen = context.value === item.value;

  return (
    <button
      type="button"
      onClick={() => context.onValueChange(isOpen ? null : item.value)}
      className={cn(
        'flex w-full items-center justify-between rounded-lg px-4 py-3 text-left',
        'bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800',
        'focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-50',
        isOpen && 'rounded-b-none',
        className
      )}
    >
      {children}
      <Icon
        name="chevron-down"
        className={cn(
          'h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400 transition-transform duration-200',
          isOpen && 'transform rotate-180'
        )}
      />
    </button>
  );
}

export function AccordionContent({
  className,
  children
}: PropsWithChildren<{
  className?: string;
}>) {
  const context = useContext(AccordionContext);
  const item = useContext(AccordionItemContext);
  if (!context || !item) throw new Error('AccordionContent must be used within an AccordionItem');

  const isOpen = context.value === item.value;

  return isOpen ? (
    <div
      className={cn(
        'overflow-hidden rounded-b-lg border-t border-gray-200 dark:border-gray-800',
        'bg-white dark:bg-gray-900 px-4 py-3',
        className
      )}
    >
      {children}
    </div>
  ) : null;
}
