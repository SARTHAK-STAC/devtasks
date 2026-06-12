import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const StorageGauge = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [storageUsage, setStorageUsage] = useState(0);
  const [databaseBreakdown, setDatabaseBreakdown] = useState({});
  const { dark } = useTheme();

  useEffect(() => {
    const calculateStorageUsage = () => {
      const storage = window.localStorage;
      let totalBytes = 0;
      const databaseBreakdown = {};
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        const value = storage.getItem(key);
        const bytes = (key.length + value.length) * 2;
        if (key.startsWith('tasks') || key.startsWith('snippets') || key.startsWith('resources')) {
          const database = key.split('_')[0];
          databaseBreakdown[database] = (databaseBreakdown[database] || 0) + bytes;
        }
        totalBytes += bytes;
      }
      setStorageUsage(totalBytes);
      setDatabaseBreakdown(databaseBreakdown);
    };
    calculateStorageUsage();
    window.addEventListener('storage', calculateStorageUsage);
    return () => {
      window.removeEventListener('storage', calculateStorageUsage);
    };
  }, []);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    if (!e.relatedTarget || !e.relatedTarget.classList.contains('popover')) {
      setIsFocused(false);
    }
  };

  const showPopover = isHovered || isFocused;
  const storageQuota = 5 * 1024 * 1024;
  const percentageUsage = (storageUsage / storageQuota) * 100;
  const sortedBreakdown = Object.entries(databaseBreakdown).sort(([, a], [, b]) => b - a);

  return (
    <div className="relative">
      <button
        className={`p-2 rounded-lg transition-colors duration-200 ${
          dark
            ? 'bg-zinc-900 hover:bg-zinc-800 text-white'
            : 'bg-white hover:bg-neutral-100 text-black'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.657 4.03 3 9 3s9-1.343 9-3V5" />
          <path d="M3 12c0 1.657 4.03 3 9 3s9-1.343 9-3" />
        </svg>
      </button>

      {showPopover && (
        <div
          className={`absolute top-full right-0 z-10 mt-2 w-64 rounded-xl shadow-sm ${
            dark
              ? 'bg-zinc-900 border border-zinc-800 text-white'
              : 'bg-white border border-neutral-200 text-black'
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="p-4">

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-3.5 w-3.5 ${dark ? 'text-zinc-300' : 'text-neutral-600'}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M3 5v14c0 1.657 4.03 3 9 3s9-1.343 9-3V5" />
                  <path d="M3 12c0 1.657 4.03 3 9 3s9-1.343 9-3" />
                </svg>
                <span className={`text-[11px] font-bold tracking-widest uppercase ${dark ? 'text-zinc-300' : 'text-neutral-600'}`}>
                  Storage registry
                </span>
              </div>
              <span className={`text-[11px] font-bold ${dark ? 'text-zinc-300' : 'text-neutral-600'}`}>
                {percentageUsage.toFixed(2)}%
              </span>
            </div>

            {/* Divider below header */}
            <div className={`w-full h-px mb-3 ${dark ? 'bg-zinc-800' : 'bg-neutral-100'}`} />

            {/* Size labels — now ABOVE the bar */}
            <div className={`flex justify-between text-[11px] mb-1.5 ${dark ? 'text-zinc-500' : 'text-neutral-400'}`}>
              <span>{(storageUsage / 1024).toFixed(2)} KB</span>
              <span>{(storageQuota / 1024).toFixed(2)} KB</span>
            </div>

            {/* Main progress bar */}
            <div className={`w-full h-[3px] rounded-full mb-4 ${dark ? 'bg-zinc-700' : 'bg-neutral-200'}`}>
              <div
                className={`h-[3px] rounded-full ${dark ? 'bg-zinc-300' : 'bg-neutral-500'}`}
                style={{ width: `${Math.min(percentageUsage, 100)}%` }}
              />
            </div>

            {/* Breakdown rows — sub bars relative to 5MB quota */}
            <div className={`divide-y ${dark ? 'divide-zinc-800' : 'divide-neutral-100'}`}>
              {sortedBreakdown.map(([database, bytes]) => {
                const rowPct = (bytes / storageQuota) * 100;
                return (
                  <div key={database} className="py-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={`text-[11px] font-bold tracking-wider uppercase ${dark ? 'text-zinc-300' : 'text-neutral-600'}`}>
                        {database}
                      </span>
                      <span className={`text-[11px] font-semibold ${dark ? 'text-zinc-300' : 'text-neutral-600'}`}>
                        {(bytes / 1024).toFixed(2)} KB
                      </span>
                    </div>
                    <div className={`w-full h-[2px] rounded-full ${dark ? 'bg-zinc-700' : 'bg-neutral-200'}`}>
                      <div
                        className={`h-[2px] rounded-full ${dark ? 'bg-zinc-400' : 'bg-neutral-400'}`}
                        style={{ width: `${Math.min(rowPct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default StorageGauge;