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
    // Transform offer to cart item
    const offerItem = {
      id: offer.id,
      name: offer.title,
      price: offer.discountedPrice,
      isVeg: false,
      isAvailable: true,
      image: offer.image,
      description: offer.description,
      customizations: [],
    };
    addToCart(offerItem, 1);
  };

  return (
    <section style={{ padding: '10px 16px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <Sparkles size={16} color={theme.primaryColor || '#c99738'} />
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {availableOffers.map(offer => (
          <div
            key={offer.id}
            className="glass-panel"
            style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(30, 34, 46, 0.9) 0%, rgba(18, 20, 26, 0.95) 100%)',
              border: `1px solid rgba(201, 151, 56, 0.3)`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}>
              {/* Offer Image */}
              <div style={{ width: '120px', minHeight: '120px', position: 'relative', flexShrink: 0 }}>
                <img
                  src={offer.image}
                  alt={offer.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    left: '6px',
                    background: 'rgba(139, 30, 47, 0.9)',
                    color: '#fff',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  OFFER
                </div>
              </div>

              {/* Offer Info */}
              <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: theme.primaryColor || '#c99738', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
                    {offer.badge || 'Limited Time Special'}
                  </div>
                  <h4
                    style={{
                      fontFamily: theme.fontHeading || "'Playfair Display', serif",
                      fontSize: '0.98rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      marginBottom: '4px',
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
                    }}
                  >
                    {offer.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span
                      style={{
                        fontFamily: theme.fontHeading || "'Playfair Display', serif",
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: theme.primaryColor || '#c99738',
                      }}
                    >
                      {currency}{offer.discountedPrice}
                    </span>
                    {offer.originalPrice && (
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', textDecoration: 'line-through' }}>
                        {currency}{offer.originalPrice}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddOffer(offer)}
                    className="btn-add-stepper"
                    style={{ padding: '5px 12px', fontSize: '0.75rem' }}
                  >
                    <Plus size={13} />
                    <span>CLAIM</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
