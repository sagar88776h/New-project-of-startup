import React from 'react';
import { Search, ShoppingBag, Info, BellRing, Settings, Sparkles, UtensilsCrossed } from 'lucide-react';
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
  const { theme } = activeRestaurant;

  return (
    <header
      className="glass-nav"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        width: '100%',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Left: Brand Monogram & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(201, 151, 56, 0.2) 0%, rgba(201, 151, 56, 0.05) 100%)',
            border: `1px solid ${theme.primaryColor || '#c99738'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <UtensilsCrossed size={18} color={theme.primaryColor || '#c99738'} />
        </div>

        <div style={{ minWidth: 0, overflow: 'hidden' }}>
          <h2
            style={{
              fontFamily: theme.fontHeading || "'Playfair Display', serif",
              fontSize: '1rem',
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
              fontSize: '0.68rem',
              color: theme.primaryColor || '#c99738',
              cursor: 'pointer',
              fontWeight: 600,
            }}
            title="Click to change table"
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            <span>Table {tableNumber}</span>
            <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>✏️</span>
          </div>
        </div>
      </div>

      {/* Right Action Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Instant Search Button */}
        <button
          onClick={onOpenSearch}
          aria-label="Search Dishes"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
        >
          <Search size={18} />
        </button>

        {/* Call Waiter / Service Button */}
        <button
          onClick={onOpenService}
          aria-label="Call Waiter"
          title="Call Waiter / Table Service"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(201, 151, 56, 0.12)',
            border: '1px solid rgba(201, 151, 56, 0.3)',
            color: theme.primaryColor || '#c99738',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <BellRing size={18} />
        </button>

        {/* Restaurant Info Button */}
        <button
          onClick={onOpenInfo}
          aria-label="Restaurant Info"
          title="About Restaurant & WiFi"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Info size={18} />
        </button>

        {/* Cart Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          aria-label="Shopping Cart"
          style={{
            position: 'relative',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: totalItemsCount > 0 ? theme.primaryColor : 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: totalItemsCount > 0 ? '#0d0e12' : 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s ease',
          }}
        >
          <ShoppingBag size={18} />
          {totalItemsCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--color-bg)',
              }}
            >
              {totalItemsCount}
            </span>
          )}
        </button>

        {/* Admin Dashboard Entry */}
        <button
          onClick={onOpenAdmin}
          aria-label="Admin Dashboard"
          title="Owner Admin Dashboard"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px dashed rgba(255, 255, 255, 0.2)',
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginLeft: '2px',
          }}
        >
          <Settings size={15} />
        </button>
      </div>
    </header>
  );
}
