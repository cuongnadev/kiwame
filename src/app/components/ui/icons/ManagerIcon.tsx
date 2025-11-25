import React from 'react';

export const ManagerIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        fill="currentColor"
        d="M16 1a1 1 0 00-1 1v1H9V2a1 1 0 00-2 0v1H4a2 2 0 00-2 2v15a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2h-3V2a1 1 0 00-1-1ZM4 8V5h3v1a1 1 0 002 0V5h6v1a1 1 0 002 0V5h3v3H4Zm0 12V10h16v10H4Zm12-6.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5Zm0 1.75a.75.75 0 110 1.5.75.75 0 010-1.5Z"
      />
    </svg>
  );
};
