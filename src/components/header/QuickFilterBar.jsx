import React from 'react';
import { Sparkles, Flame, Clock, Leaf } from 'lucide-react';
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
      className="no-scrollbar"
      style={{
        width: '100%',
        overflowX: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: 'rgba(0, 0, 0, 0.2)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {filters.map(f => {
        const isActive = activeFilter === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onSelectFilter(f.id)}
            style={{
              flexShrink: 0,
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: isActive ? 700 : 500,
              border: isActive ? `1.5px solid ${theme.primaryColor || '#c99738'}` : '1px solid rgba(255, 255, 255, 0.1)',
              background: isActive
                ? `linear-gradient(135deg, rgba(201, 151, 56, 0.22) 0%, rgba(201, 151, 56, 0.08) 100%)`
                : 'rgba(255, 255, 255, 0.04)',
              color: isActive ? (theme.primaryColor || '#c99738') : 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(6px)',
            }}
          >
            {f.icon}
            <span>{f.label}</span>
          </button>
        );
      })}
    </div>
  );
}
