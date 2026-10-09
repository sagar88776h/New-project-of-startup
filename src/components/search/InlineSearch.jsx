import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

export default function InlineSearch({ searchQuery, onSearchChange, onClear }) {
  return (
    <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', padding: '12px 14px 6px' }}>
      <m.div
        whileFocus={{ scale: 1.01 }}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--color-card-bg)',
          border: '1.5px solid var(--color-card-border)',
          borderRadius: '999px',
          padding: '9px 14px',
          boxShadow: 'var(--shadow-sm)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <Search size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search dishes, drinks, desserts..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          style={{
            flex: 1,
            minWidth: 0,
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--color-text-primary)',
            fontSize: '0.84rem',
            fontFamily: 'inherit',
          }}
        />
        <AnimatePresence>
          {searchQuery && (
            <m.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileTap={{ scale: 0.85 }}
              onClick={onClear}
              aria-label="Clear search"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
                padding: '2px',
              }}
            >
              <X size={16} />
            </m.button>
          )}
        </AnimatePresence>
      </m.div>
    </div>
  );
}
