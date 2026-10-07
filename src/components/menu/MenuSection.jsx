import React from 'react';
import FoodCard from './FoodCard';
import { useRestaurant } from '../../context/RestaurantContext';

export default function MenuSection({ category, items, onOpenDetail }) {
  const { activeRestaurant } = useRestaurant();
  const { theme } = activeRestaurant;

  if (!items || items.length === 0) return null;

  return (
    <section
      id={`section-${category.id}`}
      style={{
        padding: '16px 16px 20px',
        scrollMarginTop: '110px',
      }}
    >
      {/* Category Header with Divider */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>{category.icon || '🍽️'}</span>
            <h2
              style={{
                fontFamily: theme.fontHeading || "'Playfair Display', serif",
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              {category.name}
            </h2>
          </div>

          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--color-text-muted)',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '2px 8px',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Elegant Gold Accented Divider */}
        <div
          style={{
            width: '100%',
            height: '1px',
            background: `linear-gradient(90deg, ${theme.primaryColor || '#c99738'} 0%, rgba(201, 151, 56, 0.1) 60%, transparent 100%)`,
            opacity: 0.6,
          }}
        />
      </div>

      {/* Grid of Dishes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '14px',
        }}
      >
        {items.map(dish => (
          <FoodCard key={dish.id} item={dish} onOpenDetail={onOpenDetail} />
        ))}
      </div>
    </section>
  );
}
