'useClient';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

interface PopupProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Popup: React.FC<PopupProps> = ({
  trigger,
  children,
  position = 'bottom',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutSide = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutSide);

    return () => removeEventListener('mousedown', handleClickOutSide);
  });

  return (
    <div ref={ref} className='relative inline-block'>
      <div onClick={() => setOpen(!open)}>{trigger}</div>

      <div
        className={clsx(
          'absolute z-50 mt-2 min-w-[260px] rounded-lg bg-black/90 shadow-lg border border-gray-200 transition-all duration-200',
          open
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none',
          position === 'bottom' && 'top-full left-1/2 -translate-x-1/2',
          position === 'top' && 'bottom-full left-1/2 -translate-x-1/2 mb-2',
          position === 'left' && 'right-full top-1/2 -translate-y-1/2 mr-2',
          position === 'right' && 'left-full top-1/2 -translate-y-1/2 ml-2'
        )}
      >
        {children}
      </div>
    </div>
  )
}
