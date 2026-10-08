import React from 'react';
import { Search, ShoppingBag, Info, BellRing, Settings, UtensilsCrossed } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';

export default function StickyHeader({
  onOpenSearch,
  onOpenInfo,
  onOpenService,
  onOpenAdmin,
  onChangeTable,
  onOpenIntro,
}) {
  const { activeRestaurant } = useRestaurant();
  const { totalItemsCount, setIsCartOpen, tableNumber } = useCart();
  const { theme, settings } = activeRestaurant;

  return (
    <header
      className="glass-nav"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '6px',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Left: Brand Monogram & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
        <div
          onClick={onOpenIntro}
          title="Click to replay Welcome Intro"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: `2px solid ${theme.primaryColor || 'var(--color-primary)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            cursor: 'pointer',
            background: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          {activeRestaurant.logo ? (
            <img
              src={activeRestaurant.logo}
              alt={activeRestaurant.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <UtensilsCrossed size={16} color="var(--color-primary)" />
          )}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <h2
            onClick={onOpenIntro}
            style={{
              fontFamily: theme.fontHeading || "'Playfair Display', serif",
              fontSize: '0.94rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.15,
              cursor: 'pointer',
            }}
            title="Click to replay Welcome to Devi intro"
          >
            {activeRestaurant.name}
          </h2>
          <div
            onClick={onChangeTable}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.66rem',
              color: 'var(--color-primary)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
            title="Click to select/change table"
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: tableNumber ? '#15803d' : '#f59e0b' }} />
            <span>{tableNumber ? `Table ${tableNumber}` : 'Select Table'}</span>
          </div>
        </div>
      </div>

      {/* Right Action Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
        {/* Search Button */}
        <button
          onClick={onOpenSearch}
          aria-label="Search Dishes"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <Search size={15} />
        </button>

        {/* Call Waiter / Service Button */}
        <button
          onClick={onOpenService}
          aria-label="Call Waiter"
          title="Call Waiter / Table Service"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(139, 29, 44, 0.08)',
            border: '1px solid rgba(139, 29, 44, 0.2)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <BellRing size={15} />
        </button>

        {/* Restaurant Info Button */}
        <button
          onClick={onOpenInfo}
          aria-label="Restaurant Info"
          title="About Restaurant & WiFi"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <Info size={15} />
        </button>

        {/* Cart Trigger (If Ordering Enabled) */}
        {settings?.orderingEnabled && (
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping Cart"
            style={{
              position: 'relative',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: totalItemsCount > 0 ? 'var(--color-primary)' : 'rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              color: totalItemsCount > 0 ? '#ffffff' : 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            <ShoppingBag size={15} />
            {totalItemsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  background: '#15803d',
                  color: '#ffffff',
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {totalItemsCount}
              </span>
            )}
          </button>
        )}

        {/* Admin Portal */}
        <button
          onClick={onOpenAdmin}
          aria-label="Admin Dashboard"
          title="Restaurant Admin Portal"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'rgba(0, 0, 0, 0.03)',
            border: '1px dashed rgba(0, 0, 0, 0.15)',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <Settings size={13} />
        </button>
      </div>
    </header>
  );
}
