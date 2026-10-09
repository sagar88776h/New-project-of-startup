import React from 'react';
import { m } from 'framer-motion';
import FoodCard from './FoodCard';
import { useRestaurant } from '../../context/RestaurantContext';
import { fadeUp } from '../../lib/motion';

export default function MenuSection({ category, items, onOpenDetail }) {
  const { activeRestaurant } = useRestaurant();
  const { theme } = activeRestaurant;

  if (!items || items.length === 0) return null;

  return (
    <section
      id={`section-${category.id}`}
      style={{
        padding: '14px 14px 18px',
        scrollMarginTop: '110px',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Category Header with Divider */}
      <m.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        style={{ marginBottom: '12px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{category.icon || '🍽️'}</span>
            <h2
              style={{
                fontFamily: theme.fontHeading || "'Fraunces', serif",
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.01em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {category.name}
            </h2>
          </div>

          <span
            style={{
              fontSize: '0.7rem',
              color: 'var(--color-text-muted)',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '2px 8px',
              borderRadius: '999px',
              border: '1px solid var(--color-card-border)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {items.length} {items.length === 1 ? 'dish' : 'dishes'}
          </span>
        </div>

        {/* Clean Gradient Divider */}
        <m.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100%',
            height: '1.5px',
            transformOrigin: 'left',
            background: `linear-gradient(90deg, var(--color-primary) 0%, rgba(196, 22, 28, 0.15) 60%, transparent 100%)`,
          }}
        />
      </m.div>

      {/* Grid of Compact Dishes */}
      <div className="menu-food-grid">
        {items.map((dish, idx) => (
          <FoodCard key={dish.id} item={dish} onOpenDetail={onOpenDetail} index={idx} />
        ))}
      </div>
    </section>
  );
}
