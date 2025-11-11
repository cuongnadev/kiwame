import React from 'react';

export const LiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="12"
    width="12"
    viewBox="0 0 12 12"
    aria-hidden="true"
    className={className}
  >
    <g clipPath="url(#a_yt14011)">
      <path d="M7.5 6a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0Z"></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 6a3 3 0 00-.879-2.12l.707-.708a4 4 0 010 5.657l-.707-.707A3 3 0 009 6ZM3 6a3 3 0 01.879-2.12l-.707-.708a4 4 0 000 5.657l.707-.707A3 3 0 013 6Z"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 6a5 5 0 00-1.464-3.535l.707-.707a6 6 0 010 8.485l-.707-.707A5 5 0 0011 6ZM1 6a5 5 0 011.464-3.535l-.707-.707a6 6 0 000 8.485l.707-.707A5 5 0 011 6Z"
      ></path>
    </g>
    <defs>
      <clipPath id="a_yt14011">
        <path d="M0 0h12v12H0z"></path>
      </clipPath>
    </defs>
  </svg>
);
