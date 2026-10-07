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
    <section style={{ padding: '20px 16px 12px' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'rgba(201, 138, 44, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Star size={17} color={theme.primaryColor || '#c98a2c'} fill={theme.primaryColor || '#c98a2c'} />
          </div>
          <div>
            <h2
              style={{
                fontFamily: theme.fontHeading || "'Playfair Display', serif",
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                lineHeight: 1.15,
              }}
            >
              Today's Favorites
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Most loved freshly prepared dishes
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: '0.72rem',
            color: theme.primaryColor || '#c98a2c',
            fontWeight: 700,
            background: 'rgba(201, 138, 44, 0.1)',
            padding: '3px 10px',
            borderRadius: '999px',
            border: '1px solid rgba(201, 138, 44, 0.2)',
          }}
        >
          {favorites.length} Top Dishes
        </span>
      </div>

      {/* Grid of Favorite Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '14px',
        }}
      >
        {favorites.map(item => (
          <FoodCard key={item.id} item={item} onOpenDetail={onOpenDetail} />
        ))}
      </div>
    </section>
  );
}
