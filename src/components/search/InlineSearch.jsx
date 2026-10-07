import React from 'react';
import { Search, X } from 'lucide-react';

export default function InlineSearch({ searchQuery, onSearchChange, onClear }) {
  return (
    <div style={{ padding: '12px 16px 6px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#ffffff',
          border: '1.5px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '999px',
          padding: '10px 16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          transition: 'border-color 0.2s ease',
        }}
      >
        <Search size={17} color="var(--color-primary)" />
        <input
          type="text"
          placeholder="Search dishes, drinks, desserts, ingredients..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--color-text-primary)',
            fontSize: '0.85rem',
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
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
