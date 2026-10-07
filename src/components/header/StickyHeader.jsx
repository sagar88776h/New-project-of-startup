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
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Left: Brand Monogram & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(139, 29, 44, 0.08)',
            border: `1.5px solid var(--color-primary)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <UtensilsCrossed size={16} color="var(--color-primary)" />
        </div>

        <div style={{ minWidth: 0 }}>
          <h2
            style={{
              fontFamily: theme.fontHeading || "'Playfair Display', serif",
              fontSize: '0.98rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.15,
            }}
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
            title="Click to change table"
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#15803d' }} />
            <span>Table {tableNumber}</span>
          </div>
        </div>
      </div>

      {/* Right Action Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Search Button */}
        <button
          onClick={onOpenSearch}
          aria-label="Search Dishes"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Search size={16} />
        </button>

        {/* Call Waiter / Service Button */}
        <button
          onClick={onOpenService}
          aria-label="Call Waiter"
          title="Call Waiter / Table Service"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'rgba(139, 29, 44, 0.08)',
            border: '1px solid rgba(139, 29, 44, 0.2)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <BellRing size={16} />
        </button>

        {/* Restaurant Info Button */}
        <button
          onClick={onOpenInfo}
          aria-label="Restaurant Info"
          title="About Restaurant & WiFi"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Info size={16} />
        </button>

        {/* Cart Trigger (If Ordering Enabled) */}
        {settings?.orderingEnabled && (
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping Cart"
            style={{
              position: 'relative',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: totalItemsCount > 0 ? 'var(--color-primary)' : 'rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              color: totalItemsCount > 0 ? '#ffffff' : 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <ShoppingBag size={16} />
            {totalItemsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  background: '#15803d',
                  color: '#ffffff',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  width: '16px',
                  height: '16px',
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
            width: '30px',
            height: '30px',
            borderRadius: '6px',
            background: 'rgba(0, 0, 0, 0.03)',
            border: '1px dashed rgba(0, 0, 0, 0.15)',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginLeft: '2px',
          }}
        >
          <Settings size={14} />
        </button>
      </div>
    </header>
  );
}
