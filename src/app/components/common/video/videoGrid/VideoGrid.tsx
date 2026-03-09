import clsx from 'clsx';
import React from 'react';

export function VideoGrid({
  children,
  videoCount,
}: {
  children: React.ReactNode;
  videoCount: number;
}) {
  const getColsClass = () => {
    if (videoCount <= 1) return 'grid-cols-1';
    if (videoCount === 2) return 'grid-cols-1 md:grid-cols-2';
    if (videoCount === 3) return 'grid-cols-1 md:grid-cols-3';
    return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4';
  };

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-main bg-[#0f0f0f]">
      <div className="w-full px-6 py-4">
        <div
          className={clsx(
            'grid gap-x-4 gap-y-8',
            getColsClass()
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
