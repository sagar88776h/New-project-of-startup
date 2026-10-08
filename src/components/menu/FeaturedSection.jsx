import React from 'react';
import { Star, Flame } from 'lucide-react';
import FoodCard from './FoodCard';
import { useRestaurant } from '../../context/RestaurantContext';

export default function FeaturedSection({ onOpenDetail }) {
  const { activeRestaurant } = useRestaurant();
  const { theme } = activeRestaurant;

  // Select top favorite / bestseller dishes
  const favorites = activeRestaurant.items.filter(i => i.isBestseller || i.isChefSpecial).slice(0, 4);

  if (favorites.length === 0) return null;

  return (
    <section style={{ padding: '16px 14px 10px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'rgba(201, 138, 44, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Star size={15} color={theme.primaryColor || '#c98a2c'} fill={theme.primaryColor || '#c98a2c'} />
          </div>
          <div>
            <h2
              style={{
                fontFamily: theme.fontHeading || "'Fraunces', serif",
                fontSize: '1.18rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                lineHeight: 1.15,
              }}
            >
              Today's Favorites
            </h2>
            <p style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
              Most loved freshly prepared dishes
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: '0.7rem',
            color: 'var(--color-accent)',
            fontWeight: 700,
            background: 'rgba(212, 166, 74, 0.12)',
            padding: '2px 8px',
            borderRadius: '999px',
            border: '1px solid rgba(212, 166, 74, 0.25)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {favorites.length} Top Dishes
        </span>
      </div>

      {/* Grid of Favorite Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          gap: '12px',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        {favorites.map((item, idx) => (
          <FoodCard key={item.id} item={item} onOpenDetail={onOpenDetail} index={idx} />
        ))}
      </div>
    </section>
  );
}
