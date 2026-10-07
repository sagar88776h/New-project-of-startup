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
        scrollMarginTop: '130px',
      }}
    >
      {/* Category Header with Divider */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>{category.icon || '🍽️'}</span>
            <h2
              style={{
                fontFamily: theme.fontHeading || "'Playfair Display', serif",
                fontSize: '1.25rem',
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
              background: 'rgba(0, 0, 0, 0.04)',
              padding: '2px 8px',
              borderRadius: '999px',
              border: '1px solid var(--color-card-border)',
            }}
          >
            {items.length} {items.length === 1 ? 'dish' : 'dishes'}
          </span>
        </div>

        {/* Clean Divider */}
        <div
          style={{
            width: '100%',
            height: '1.5px',
            background: `linear-gradient(90deg, var(--color-primary) 0%, rgba(139, 29, 44, 0.1) 60%, transparent 100%)`,
          }}
        />
      </div>

      {/* Grid of Compact Dishes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '12px',
        }}
      >
        {items.map(dish => (
          <FoodCard key={dish.id} item={dish} onOpenDetail={onOpenDetail} />
        ))}
      </div>
    </section>
  );
}
