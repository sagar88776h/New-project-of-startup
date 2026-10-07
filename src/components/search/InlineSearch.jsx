import React from 'react';
import { Search, X } from 'lucide-react';

export default function InlineSearch({ searchQuery, onSearchChange, onClear }) {
  return (
    <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', padding: '12px 14px 6px' }}>
      <div
        style={{
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#ffffff',
          border: '1.5px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '999px',
          padding: '9px 14px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          transition: 'border-color 0.2s ease',
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
        {searchQuery && (
          <button
            onClick={onClear}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
