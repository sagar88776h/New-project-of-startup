import React from 'react';
import { m } from 'framer-motion';
import { Utensils, ArrowDown, MapPin, Sparkles } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';
import { staggerContainer, fadeUp, scaleIn } from '../../lib/motion';

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
        background: 'var(--color-card-bg)',
        borderBottom: '1px solid var(--color-card-border)',
        overflow: 'hidden',
      }}
    >
      {/* Subtle Floating Ambient Background Glows */}
      <m.div
        aria-hidden="true"
        animate={{
          x: [0, 15, -10, 0],
          y: [0, -10, 12, 0],
          scale: [1, 1.12, 0.95, 1],
          opacity: [0.18, 0.28, 0.2, 0.18],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '-20px',
          left: '10%',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
          filter: 'blur(35px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <m.div
        aria-hidden="true"
        animate={{
          x: [0, -20, 15, 0],
          y: [0, 12, -15, 0],
          scale: [1, 1.15, 0.9, 1],
          opacity: [0.12, 0.22, 0.14, 0.12],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        style={{
          position: 'absolute',
          top: '30px',
          right: '5%',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Centered Cover Banner Wrapper */}
      <div className="hero-banner-wrapper" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-banner-container" style={{ position: 'relative', overflow: 'hidden' }}>
          <m.img
            initial={{ scale: 1.08, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            src={activeRestaurant.coverImage || '/devi-banner.png'}
            srcSet={`${activeRestaurant.coverImage || '/devi-banner.png'} 1200w, ${activeRestaurant.coverImage2x || activeRestaurant.coverImage || '/devi-banner.png'} 2400w`}
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 1200px, 1200px"
            alt={activeRestaurant.name}
            width="1200"
            height="375"
            fetchPriority="high"
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
          />
          {/* Bottom Edge Subtle Dark Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 55%, rgba(14, 11, 10, 0.85) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Top Badges (Intro Replay + Table Number) */}
          <div style={{ position: 'absolute', top: '10px', right: '12px', display: 'flex', alignItems: 'center', gap: '6px', zIndex: 5 }}>
            {onOpenIntro && (
              <m.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={onOpenIntro}
                style={{
                  background: 'rgba(0, 0, 0, 0.72)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(212, 166, 74, 0.35)',
                  color: '#F6EFE3',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                <Sparkles size={11} color="var(--color-accent)" />
                <span>Intro</span>
              </m.button>
            )}

            <m.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 25 }}
              style={{
                background: 'rgba(26, 21, 20, 0.92)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(212, 166, 74, 0.35)',
                color: 'var(--color-accent)',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
              }}
            >
              {tableNumber ? `TABLE ${tableNumber}` : 'TABLE ?'}
            </m.div>
          </div>
        </div>
      </div>

      {/* Restaurant Identity Content with Staggered Entrance */}
      <m.div
        variants={staggerContainer(0.08, 0.1)}
        initial="hidden"
        animate="visible"
        style={{ padding: '0 14px 14px', marginTop: '-28px', position: 'relative', zIndex: 10, width: '100%', boxSizing: 'border-box' }}
      >
        <div className="header-inner-container" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
            
            {/* Logo Monogram */}
            <m.div
              variants={scaleIn}
              whileHover={{ scale: 1.06, rotate: 3 }}
              whileTap={{ scale: 0.94 }}
              onClick={onOpenIntro}
              title="Click to view Welcome to Devi intro"
              style={{
                width: 'clamp(54px, 14vw, 64px)',
                height: 'clamp(54px, 14vw, 64px)',
                borderRadius: '50%',
                background: '#1A1514',
                border: `2.5px solid var(--color-accent)`,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 18px rgba(0,0,0,0.5), 0 0 12px rgba(212, 166, 74, 0.25)',
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
                <Utensils size={24} color="var(--color-accent)" />
              )}
            </m.div>

            {/* Quick CTA */}
            <m.button
              variants={fadeUp}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExploreClick}
              style={{
                background: 'rgba(196, 22, 28, 0.14)',
                border: '1px solid rgba(196, 22, 28, 0.35)',
                color: 'var(--color-primary)',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(196, 22, 28, 0.15)',
              }}
            >
              <span>Explore Menu</span>
              <m.div
                animate={{ y: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                <ArrowDown size={13} />
              </m.div>
            </m.button>
          </div>

          {/* Restaurant Name & Tagline */}
          <m.h1
            variants={fadeUp}
            style={{
              fontFamily: theme.fontHeading || "'Fraunces', serif",
              fontSize: 'clamp(1.22rem, 4.5vw, 1.5rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: 1.2,
              marginBottom: '4px',
              overflowWrap: 'anywhere',
              letterSpacing: '-0.01em',
            }}
          >
            {activeRestaurant.name}
          </m.h1>

          <m.p
            variants={fadeUp}
            style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.4, marginBottom: '8px', overflowWrap: 'anywhere' }}
          >
            {activeRestaurant.tagline}
          </m.p>

          {/* Snippet Row */}
          <m.div
            variants={fadeUp}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.74rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#15803d',
                  boxShadow: '0 0 8px #15803d',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Open & Serving Fresh</span>
            </div>
            {contact?.address && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                <MapPin size={12} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.address.split(',')[0]}</span>
              </div>
            )}
          </m.div>
        </div>
      </m.div>
    </div>
  );
}
