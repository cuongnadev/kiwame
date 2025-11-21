import React from 'react'

export default function Authlayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='relative w-full min-h-screen flex items-center justify-center bg-linear-to-br from-[#0F172A] via-[#581C87] to-[#0F172A] overflow-hidden'>
      {children}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500">
        © 2025 Kiwame — Watch. Stream. Anywhere.
      </div>
    </div>
  )
}

