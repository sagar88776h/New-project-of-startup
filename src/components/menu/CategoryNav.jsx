import React, { useRef, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';

export default function CategoryNav({ activeCategoryId, onSelectCategory }) {
  const { activeRestaurant } = useRestaurant();
  const navRef = useRef(null);
  const activeTabRef = useRef(null);

  const categories = activeRestaurant.categories.filter(c => c.active);

  // Auto scroll active tab into view horizontally
  useEffect(() => {
    if (activeTabRef.current && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const tabRect = activeTabRef.current.getBoundingClientRect();

      const scrollLeft =
        activeTabRef.current.offsetLeft -
        navRef.current.offsetWidth / 2 +
        activeTabRef.current.offsetWidth / 2;

      navRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  }, [activeCategoryId]);

  return (
    <nav
      className="glass-nav no-scrollbar"
      ref={navRef}
      style={{
        position: 'sticky',
        top: '56px',
        zIndex: 80,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(13, 14, 18, 0.88)',
      }}
    >
      {categories.map(cat => {
        const isActive = activeCategoryId === cat.id;
        return (
          <button
            key={cat.id}
            ref={isActive ? activeTabRef : null}
            onClick={() => onSelectCategory(cat.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              border: isActive
                ? `1.5px solid var(--color-primary)`
                : '1px solid rgba(255, 255, 255, 0.08)',
              background: isActive
                ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)'
                : 'rgba(255, 255, 255, 0.04)',
              color: isActive ? '#0d0e12' : 'var(--color-text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
              boxShadow: isActive ? '0 4px 15px rgba(201, 151, 56, 0.3)' : 'none',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span style={{ fontSize: '0.95rem' }}>{cat.icon || '🍽️'}</span>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
