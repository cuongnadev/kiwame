'use client';

import React from 'react'
import { Input } from '../input/Input'
import { Button } from '../button/Button'
import { Mic, SearchIcon } from 'lucide-react'

export const Search = () => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className="hidden md:flex flex-1 max-w-2xl items-center gap-2">
      <div className={`flex w-full items-center rounded-full`}>
        <div className={`flex items-center h-full py-2 flex-1 border-2 border-[#222] rounded-tl-full rounded-bl-full ${isFocused ? 'border-[#555]' : 'pl-4 border-r-0'}`}>
          <Input
            placeholder="Tìm kiếm"
            type="text"
            variant='bare'
            prefix={isFocused ? <SearchIcon size={20} className="ml-3 text-gray-400" /> : null}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            clearable={true}
            className='pr-8'
          />
        </div>

        <Button
          icon={<SearchIcon size={20} />}
          variant="dark"
          radius="full"
          className="py-3! px-6! rounded-tl-none! rounded-bl-none!"
        />
      </div>

      <Button
        text=""
        icon={<Mic size={20} />}
        variant="dark"
        radius="full"
        className="p-3!"
      />
    </div>
  )
}
