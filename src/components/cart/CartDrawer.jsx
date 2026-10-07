import React from 'react';
import { X, Trash2, ShoppingBag, Send, Plus, Minus, Utensils, ShieldCheck, Edit3 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';

export default function CartDrawer({ onChangeTable }) {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    taxAmount,
    serviceChargeAmount,
    grandTotal,
    tableNumber,
    orderNotes,
    setOrderNotes,
    placeOrder,
  } = useCart();

  const { activeRestaurant } = useRestaurant();
  const { currency, theme, settings } = activeRestaurant;

  if (!isCartOpen) return null;

  return (
    <div className={`modal-overlay ${isCartOpen ? 'active' : ''}`} onClick={() => setIsCartOpen(false)}>
      <div
        className="bottom-sheet"
        onClick={e => e.stopPropagation()}
        style={{
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          color: '#ffffff',
        }}
      >
        <div className="sheet-handle" />

        {/* Drawer Header */}
        <div
          style={{
            padding: '12px 20px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color={theme.primaryColor || '#c99738'} />
            <div>
              <h3 style={{ fontFamily: theme.fontHeading || "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700 }}>
                Your Table Order
              </h3>
              <div
                onClick={onChangeTable}
                style={{ fontSize: '0.72rem', color: theme.primaryColor || '#c99738', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>Table {tableNumber}</span>
                <Edit3 size={11} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close cart"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Order Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 90px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: '#9ca3af' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛒</div>
              <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '6px' }}>Your cart is empty</h4>
              <p style={{ fontSize: '0.82rem', marginBottom: '20px' }}>
                Explore delicious creations from our gourmet menu and add your favorites.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.85rem' }}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Item Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {cartItems.map(item => (
                  <div
                    key={item.cartItemId}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    {/* Item Thumbnail & Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {item.isVeg ? (
                            <span className="veg-indicator" style={{ width: '12px', height: '12px' }}><span className="veg-indicator-dot" style={{ width: '5px', height: '5px' }} /></span>
                          ) : (
                            <span className="non-veg-indicator" style={{ width: '12px', height: '12px' }}><span className="non-veg-indicator-triangle" style={{ borderLeftWidth: '3px', borderRightWidth: '3px', borderBottomWidth: '5px' }} /></span>
                          )}
                          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.name}
                          </h4>
                        </div>

                        {/* Customizations list */}
                        {item.selectedCustomizations && item.selectedCustomizations.length > 0 && (
                          <div style={{ fontSize: '0.7rem', color: theme.primaryColor || '#c99738', marginTop: '2px' }}>
                            + {item.selectedCustomizations.map(c => c.name).join(', ')}
                          </div>
                        )}

                        {item.specialNotes && (
                          <div style={{ fontSize: '0.68rem', color: '#9ca3af', fontStyle: 'italic', marginTop: '2px' }}>
                            Note: "{item.specialNotes}"
                          </div>
                        )}

                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: theme.primaryColor || '#c99738', marginTop: '4px' }}>
                          {currency}{item.unitPrice} each
                        </div>
                      </div>
                    </div>

                    {/* Stepper Controls & Total */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                      <div className="qty-stepper-container">
                        <button
                          className="qty-stepper-btn"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-stepper-val">{item.quantity}</span>
                        <button
                          className="qty-stepper-btn"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>
                        {currency}{item.totalPrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Kitchen Note Input */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                  Cooking Instructions for Head Chef
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Please bring extra plates, food mild spicy, serve desserts after mains..."
                  value={orderNotes}
                  onChange={e => setOrderNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              {/* Bill Details Breakdown */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '16px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  Bill Breakdown
                </h4>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#d1d5db' }}>
                  <span>Item Subtotal</span>
                  <span>{currency}{subtotal.toFixed(2)}</span>
                </div>

                {settings?.taxRate > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#9ca3af' }}>
                    <span>GST / Taxes ({settings.taxRate}%)</span>
                    <span>{currency}{taxAmount.toFixed(2)}</span>
                  </div>
                )}

                {settings?.serviceChargeRate > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#9ca3af' }}>
                    <span>Restaurant Service Charge ({settings.serviceChargeRate}%)</span>
                    <span>{currency}{serviceChargeAmount.toFixed(2)}</span>
                  </div>
                )}

                <div
                  style={{
                    height: '1px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    margin: '4px 0',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                  <span>Grand Total</span>
                  <span style={{ color: theme.primaryColor || '#c99738' }}>{currency}{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sticky Send to Kitchen CTA */}
        {cartItems.length > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '14px 20px',
              background: 'rgba(18, 20, 28, 0.96)',
              backdropFilter: 'blur(16px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <button
              onClick={placeOrder}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '16px',
                fontSize: '1rem',
                fontWeight: 800,
                letterSpacing: '0.02em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Send size={18} />
              <span>SEND TO KITCHEN • {currency}{grandTotal.toFixed(2)}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
