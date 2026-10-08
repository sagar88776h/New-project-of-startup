import React from 'react';
import { Tag, Sparkles, Plus, Clock } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';

export default function SpecialOffersBanner({ onOpenDetail }) {
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
    <section style={{ padding: '10px 14px 16px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <Sparkles size={16} color={theme.primaryColor || '#c98a2c'} />
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
        {availableOffers.map(offer => (
          <div
            key={offer.id}
            className="restaurant-card"
            style={{
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'stretch',
              border: `1px solid rgba(201, 138, 44, 0.3)`,
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* Offer Real Photography */}
            <div style={{ width: 'clamp(96px, 28vw, 115px)', minHeight: '110px', position: 'relative', flexShrink: 0, backgroundColor: '#1A1514' }}>
              <img
                src={offer.image}
                alt={offer.title}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                }}
              >
                SPECIAL
              </div>
            </div>

            {/* Offer Details */}
            <div style={{ padding: '10px 12px', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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

                <button
                  onClick={() => handleAddOffer(offer)}
                  className="btn-add-stepper"
                  style={{ padding: '5px 10px', fontSize: '0.72rem' }}
                >
                  <Plus size={12} />
                  <span>CLAIM</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
