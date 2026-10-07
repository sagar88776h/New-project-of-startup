import React from 'react';
import { Utensils, ArrowDown, MapPin, Clock, Sparkles } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';

export default function RestaurantHero({ onExploreClick }) {
  const { activeRestaurant } = useRestaurant();
  const { tableNumber } = useCart();
  const { theme, contact } = activeRestaurant;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        background: '#ffffff',
        borderBottom: '1px solid var(--color-card-border)',
        overflow: 'hidden',
      }}
    >
      {/* Cover Image with Gradient Overlay */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '145px',
          backgroundColor: '#2b2d35',
        }}
      >
        <img
          src={activeRestaurant.coverImage}
          alt={activeRestaurant.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.88 }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(20,20,25,0.7) 100%)',
          }}
        />

        {/* Table Number Pill */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(6px)',
            color: 'var(--color-primary)',
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          TABLE {tableNumber}
        </div>
      </div>

      {/* Restaurant Identity Content */}
      <div style={{ padding: '0 16px 14px', marginTop: '-30px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px', marginBottom: '8px' }}>
          
          {/* Logo Monogram */}
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#ffffff',
              border: `2.5px solid var(--color-primary)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
              flexShrink: 0,
            }}
          >
            <Utensils size={24} color="var(--color-primary)" />
          </div>

          {/* Quick CTA */}
          <button
            onClick={onExploreClick}
            style={{
              background: 'rgba(139, 29, 44, 0.08)',
              border: '1px solid rgba(139, 29, 44, 0.25)',
              color: 'var(--color-primary)',
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Explore Menu</span>
            <ArrowDown size={13} />
          </button>
        </div>

        {/* Restaurant Name & Tagline */}
        <h1
          style={{
            fontFamily: theme.fontHeading || "'Playfair Display', serif",
            fontSize: '1.45rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            lineHeight: 1.2,
            marginBottom: '4px',
          }}
        >
          {activeRestaurant.name}
        </h1>

        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.4, marginBottom: '6px' }}>
          {activeRestaurant.tagline}
        </p>

        {/* Snippet Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#15803d' }} />
            <span>Open & Serving Fresh</span>
          </div>
          {contact?.address && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <MapPin size={11} />
              <span>{contact.address.split(',')[0]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
