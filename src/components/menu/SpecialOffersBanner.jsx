import React from 'react';
import { m } from 'framer-motion';
import { Sparkles, Plus } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';
import { fadeUp } from '../../lib/motion';
import FoodMedia from '../common/FoodMedia';

export default function SpecialOffersBanner({ onOpenDetail: _onOpenDetail }) {
  const { activeRestaurant } = useRestaurant();
  const { addToCart } = useCart();
  const { currency, theme, specialOffers = [] } = activeRestaurant;

  const availableOffers = specialOffers.filter(o => o.available);

  if (!activeRestaurant.settings?.specialOffersEnabled || availableOffers.length === 0) {
    return null;
  }

  const handleAddOffer = (offer) => {
    const offerItem = {
      id: offer.id,
      name: offer.title,
      price: offer.discountedPrice,
      isVeg: false,
      isAvailable: true,
      image: offer.image,
      description: offer.description,
      minPrepTime: offer.minPrepTime || 15,
      maxPrepTime: offer.maxPrepTime || 20,
      customizations: [],
    };
    addToCart(offerItem, 1);
  };

  return (
    <m.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      style={{ padding: '10px 12px 16px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <m.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        >
          <Sparkles size={16} color={theme.primaryColor || '#c98a2c'} />
        </m.div>
        <h3
          style={{
            fontFamily: theme.fontHeading || "'Playfair Display', serif",
            fontSize: '1.1rem',
            color: 'var(--color-text-primary)',
          }}
        >
          Special Curations & Combos
        </h3>
      </div>

      <div className="offers-grid">
        {availableOffers.map((offer, idx) => (
          <m.div
            key={offer.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: idx * 0.08, duration: 0.45 }}
            whileHover={{ y: -3, scale: 1.01 }}
            className="restaurant-card"
            style={{
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'stretch',
              border: `1px solid rgba(212, 166, 74, 0.25)`,
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
              boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
              minWidth: 0,
            }}
          >
            {/* Offer Real Photography */}
            <div style={{ width: 'clamp(84px, 24vw, 110px)', minHeight: '105px', position: 'relative', flexShrink: 0, backgroundColor: '#1A1514' }}>
              <FoodMedia
                src={offer.image}
                videoSrc={offer.video}
                alt={offer.title}
                isVeg={false}
                aspectRatio="1 / 1"
                width={200}
                height={180}
                style={{ width: '100%', height: '100%' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '6px',
                  left: '6px',
                  background: 'var(--color-accent)',
                  color: '#ffffff',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                }}
              >
                SPECIAL
              </div>
            </div>

            {/* Offer Details */}
            <div style={{ padding: '10px 12px', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
                  {offer.badge || 'Chef Selection'}
                </div>
                <h4
                  style={{
                    fontFamily: theme.fontHeading || "'Fraunces', serif",
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: '3px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {offer.title}
                </h4>
                <p
                  style={{
                    fontSize: '0.74rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.35,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                  }}
                >
                  {offer.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', gap: '6px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span
                    style={{
                      fontFamily: theme.fontHeading || "'Fraunces', serif",
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: 'var(--color-accent)',
                    }}
                  >
                    {currency}{offer.discountedPrice}
                  </span>
                  {offer.originalPrice && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                      {currency}{offer.originalPrice}
                    </span>
                  )}
                </div>

                <m.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleAddOffer(offer)}
                  aria-label={`Claim offer ${offer.title}`}
                  className="btn-add-stepper touch-target-44"
                  style={{ padding: '5px 12px', fontSize: '0.74rem', minHeight: '36px', minWidth: '60px' }}
                >
                  <Plus size={12} />
                  <span>CLAIM</span>
                </m.button>
              </div>
            </div>
          </m.div>
        ))}
      </div>
    </m.section>
  );
}
