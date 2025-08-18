import type { InputHTMLAttributes, PropsWithChildren, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Field({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('space-y-1 text-left', className)}>{children}</div>;
}

export function FieldLabel({ children }: PropsWithChildren) {
  return <label className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300">{children}</label>;
}

export function FieldHint({ children }: PropsWithChildren) {
  return <p className="text-xs text-gray-500">{children}</p>;
}

export function FieldError({ children }: PropsWithChildren) {
  if (!children) return null;
  return <p className="text-left text-xs text-red-600">{children}</p>;
}

const inputBase = 'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100';

export function TextInput({ className, 'aria-invalid': ariaInvalid, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const invalid = ariaInvalid === true || ariaInvalid === 'true';
  return <input {...props} aria-invalid={ariaInvalid} className={cn(inputBase, invalid && 'border-red-500 focus:ring-red-500', className)} />;
}

export function EmailInput({ className, 'aria-invalid': ariaInvalid, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const invalid = ariaInvalid === true || ariaInvalid === 'true';
  return <input type="email" {...props} aria-invalid={ariaInvalid} className={cn(inputBase, invalid && 'border-red-500 focus:ring-red-500', className)} />;
}

export function NumberInput({ className, 'aria-invalid': ariaInvalid, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const invalid = ariaInvalid === true || ariaInvalid === 'true';
  return <input type="number" {...props} aria-invalid={ariaInvalid} className={cn(inputBase, invalid && 'border-red-500 focus:ring-red-500', className)} />;
}

export function PhoneInput({ className, 'aria-invalid': ariaInvalid, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const invalid = ariaInvalid === true || ariaInvalid === 'true';
  return <input type="tel" {...props} aria-invalid={ariaInvalid} className={cn(inputBase, invalid && 'border-red-500 focus:ring-red-500', className)} />;
}

export function Textarea({ className, 'aria-invalid': ariaInvalid, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const invalid = ariaInvalid === true || ariaInvalid === 'true';
  return <textarea {...props} aria-invalid={ariaInvalid} className={cn(inputBase, 'min-h-[88px]', invalid && 'border-red-500 focus:ring-red-500', className)} />;
}

export function Select({ className, 'aria-invalid': ariaInvalid, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  const invalid = ariaInvalid === true || ariaInvalid === 'true';
  return <select {...props} aria-invalid={ariaInvalid} className={cn(inputBase, invalid && 'border-red-500 focus:ring-red-500', className)} />;
}

export function Checkbox(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input type="checkbox" {...props} className={cn('h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500', props.className)} />;
}

export function Radio(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input type="radio" {...props} className={cn('h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500', props.className)} />;
}

export function Switch(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" {...props} className="peer sr-only" />
      <div className="relative h-6 w-10 rounded-full bg-gray-300 transition peer-checked:bg-blue-600 peer-checked:[&>span]:translate-x-4">
        <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition" />
      </div>
    </label>
  );
}


