import clsx from 'clsx';
import React from 'react'

export function VideoGrid({
  children,
  videoCount,
}: {
  children: React.ReactNode;
  videoCount: number;
}) {
  const gridClass =
    videoCount <= 3
      ? "grid-cols-[repeat(auto-fill,minmax(320px,530px))] justify-start"
      : "grid-cols-[repeat(auto-fit,minmax(400px,1fr))]";

  return (
    <div
      className={clsx(
        "w-full h-full grid gap-6 px-6 py-4 bg-[#0f0f0f] overflow-y-auto overflow-x-hidden scrollbar-main",
        gridClass
      )}
    >
      {children}
    </div>
  )
}

