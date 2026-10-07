import React from 'react';
import { Flame, Sparkles } from 'lucide-react';
import FoodCard from './FoodCard';
import { useRestaurant } from '../../context/RestaurantContext';

export default function FeaturedSection({ onOpenDetail }) {
  const { activeRestaurant } = useRestaurant();
  const { theme } = activeRestaurant;

  // Select top 3-4 favorite / bestseller dishes
  const favorites = activeRestaurant.items.filter(i => i.isBestseller || i.isChefSpecial).slice(0, 4);

  if (favorites.length === 0) return null;

  return (
    <section style={{ padding: '20px 16px 12px' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'rgba(201, 151, 56, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Flame size={16} color={theme.primaryColor || '#c99738'} />
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
              Customer Favorites
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Most loved culinary creations
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: '0.72rem',
            color: theme.primaryColor || '#c99738',
            fontWeight: 600,
            background: 'rgba(201, 151, 56, 0.1)',
            padding: '3px 10px',
            borderRadius: '999px',
            border: '1px solid rgba(201, 151, 56, 0.2)',
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
