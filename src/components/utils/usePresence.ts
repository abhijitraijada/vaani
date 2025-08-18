import { useEffect, useRef, useState } from 'react';

export function usePresence(open: boolean, durationMs = 200) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // double RAF to ensure CSS transitions are applied after mount
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setMounted(false), durationMs);
    }
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [open, durationMs]);

  return { mounted, visible };
}


