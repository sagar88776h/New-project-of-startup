import React from 'react';
import { m } from 'framer-motion';
import { Sparkles, Flame } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export default function QuickFilterBar({ activeFilter, onSelectFilter }) {
  const { activeRestaurant } = useRestaurant();
  const { theme } = activeRestaurant;

  const filters = [
    { id: 'all', label: 'All Items', icon: null },
    { id: 'veg', label: 'Pure Veg', icon: <span className="veg-indicator" style={{ width: '12px', height: '12px' }}><span className="veg-indicator-dot" style={{ width: '5px', height: '5px' }} /></span> },
    { id: 'nonveg', label: 'Non-Veg', icon: <span className="non-veg-indicator" style={{ width: '12px', height: '12px' }}><span className="non-veg-indicator-triangle" style={{ borderLeftWidth: '3px', borderRightWidth: '3px', borderBottomWidth: '5px' }} /></span> },
    { id: 'bestsellers', label: 'Bestsellers', icon: <Flame size={13} color="#f59e0b" /> },
    { id: 'chef', label: "Chef's Special", icon: <Sparkles size={13} color={theme.primaryColor || '#c99738'} /> },
  ];

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        background: 'rgba(0, 0, 0, 0.02)',
        borderBottom: '1px solid var(--color-card-border)',
      }}
    >
      <div
        className="no-scrollbar"
        style={{
          width: '100%',
          maxWidth: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          whiteSpace: 'nowrap',
          WebkitOverflowScrolling: 'touch',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '8px 14px',
          boxSizing: 'border-box',
        }}
      >
        {filters.map(f => {
          const isActive = activeFilter === f.id;
          return (
            <m.button
              key={f.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectFilter(f.id)}
              style={{
                position: 'relative',
                flexShrink: 0,
                padding: '5px 12px',
                borderRadius: '999px',
                fontSize: '0.76rem',
                fontWeight: isActive ? 700 : 500,
                border: isActive ? `1.5px solid var(--color-primary)` : '1px solid var(--color-card-border)',
                background: isActive
                  ? 'var(--color-primary)'
                  : 'var(--color-card-bg)',
                color: isActive ? '#ffffff' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
                boxShadow: isActive ? '0 2px 10px rgba(196, 22, 28, 0.35)' : 'none',
              }}
            >
              {f.icon}
              <span>{f.label}</span>
            </m.button>
          );
        })}
      </div>
    </div>
  );
}
