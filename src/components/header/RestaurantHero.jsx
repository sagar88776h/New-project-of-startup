import React from 'react';
import { Utensils, ArrowDown, MapPin, Clock, Sparkles } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';

export default function RestaurantHero({ onExploreClick, onOpenIntro }) {
  const { activeRestaurant } = useRestaurant();
  const { tableNumber } = useCart();
  const { theme, contact } = activeRestaurant;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
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
          height: 'clamp(125px, 28vw, 150px)',
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

        {/* Top Badges (Intro Replay + Table Number) */}
        <div style={{ position: 'absolute', top: '10px', right: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {onOpenIntro && (
            <button
              onClick={onOpenIntro}
              style={{
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                padding: '3px 8px',
                borderRadius: '999px',
                fontSize: '0.68rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={11} color="#facc15" />
              <span>Intro</span>
            </button>
          )}

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(6px)',
              color: 'var(--color-primary)',
              padding: '3px 9px',
              borderRadius: '999px',
              fontSize: '0.7rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            TABLE {tableNumber}
          </div>
        </div>
      </div>

      {/* Restaurant Identity Content */}
      <div style={{ padding: '0 14px 14px', marginTop: '-28px', position: 'relative', zIndex: 10, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
          
          {/* Logo Monogram */}
          <div
            onClick={onOpenIntro}
            title="Click to view Welcome to Devi intro"
            style={{
              width: 'clamp(54px, 14vw, 64px)',
              height: 'clamp(54px, 14vw, 64px)',
              borderRadius: '50%',
              background: '#ffffff',
              border: `2.5px solid ${theme.primaryColor || 'var(--color-primary)'}`,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
              flexShrink: 0,
              cursor: 'pointer',
            }}
          >
            {activeRestaurant.logo ? (
              <img
                src={activeRestaurant.logo}
                alt={activeRestaurant.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Utensils size={24} color="var(--color-primary)" />
            )}
          </div>

          {/* Quick CTA */}
          <button
            onClick={onExploreClick}
            style={{
              background: 'rgba(139, 29, 44, 0.08)',
              border: '1px solid rgba(139, 29, 44, 0.25)',
              color: 'var(--color-primary)',
              padding: '5px 11px',
              borderRadius: '999px',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0,
            }}
          >
            <span>Explore Menu</span>
            <ArrowDown size={12} />
          </button>
        </div>

        {/* Restaurant Name & Tagline */}
        <h1
          style={{
            fontFamily: theme.fontHeading || "'Playfair Display', serif",
            fontSize: 'clamp(1.2rem, 4.5vw, 1.45rem)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            lineHeight: 1.2,
            marginBottom: '4px',
            overflowWrap: 'anywhere',
          }}
        >
          {activeRestaurant.name}
        </h1>

        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4, marginBottom: '6px', overflowWrap: 'anywhere' }}>
          {activeRestaurant.tagline}
        </p>

        {/* Snippet Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#15803d', flexShrink: 0 }} />
            <span>Open & Serving Fresh</span>
          </div>
          {contact?.address && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
              <MapPin size={11} flexShrink={0} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.address.split(',')[0]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
