import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Send, Plus, Minus, Clock, Edit3, MessageSquare } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { modalBackdropVariants, bottomSheetVariants } from '../../lib/motion';

export default function CartDrawer({ onChangeTable }) {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    updateQuantity,
    updateItemNote,
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

  const [editingNoteItemId, setEditingNoteItemId] = useState(null);
  const [tempNoteText, setTempNoteText] = useState('');

  const { activeRestaurant } = useRestaurant();
  const { currency, theme, settings } = activeRestaurant;

  useEffect(() => {
    if (isCartOpen) {
      document.body.classList.add('modal-open');
      return () => document.body.classList.remove('modal-open');
    }
  }, [isCartOpen]);

  const maxPrepEstimate = cartItems.reduce((max, item) => {
    const itemMax = item.maxPrepTime || 20;
    return Math.max(max, itemMax);
  }, 15);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <m.div
          key="cart-backdrop"
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="modal-overlay cart-overlay active"
          onClick={() => setIsCartOpen(false)}
        >
          <m.div
            key="cart-drawer-sheet"
            variants={bottomSheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bottom-sheet cart-drawer-sheet"
            onClick={e => e.stopPropagation()}
            style={{
              maxHeight: '90dvh',
              height: 'auto',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              paddingBottom: 0,
              overscrollBehavior: 'contain',
            }}
          >
            <div className="sheet-handle" />

            {/* Drawer Header */}
            <div
              style={{
                padding: '10px 16px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--color-card-border)',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={20} color={theme.primaryColor || '#c98a2c'} />
                <div>
                  <h3 style={{ fontFamily: theme.fontHeading || "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700 }}>
                    Your Table Order
                  </h3>
                  <m.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={onChangeTable}
                    className="touch-target-44"
                    style={{ fontSize: '0.74rem', color: theme.primaryColor || '#c98a2c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, minHeight: '24px' }}
                  >
                    <span>{tableNumber ? `Table ${tableNumber}` : 'Select Table'}</span>
                    <Edit3 size={11} />
                  </m.div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {cartItems.length > 0 && (
                  <m.button
                    whileTap={{ scale: 0.9 }}
                    onClick={clearCart}
                    className="touch-target-44"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#dc2626',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 10px',
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Clear</span>
                  </m.button>
                )}

                <m.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Close cart"
                  className="touch-target-44"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: 'var(--color-text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={18} />
                </m.button>
              </div>
            </div>

            {/* Scrollable Order Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px calc(90px + env(safe-area-inset-bottom, 16px))', overscrollBehavior: 'contain' }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--color-text-muted)' }}>
                  <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>🍽️</div>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)', marginBottom: '6px' }}>Your cart is empty</h4>
                  <p style={{ fontSize: '0.82rem', marginBottom: '20px' }}>
                    Discover our freshly prepared chef specialties and add dishes to your order.
                  </p>
                  <m.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCartOpen(false)}
                    className="btn-primary touch-target-44"
                    style={{ padding: '10px 20px', fontSize: '0.85rem', minHeight: '44px' }}
                  >
                    Explore Menu
                  </m.button>
                </div>
              ) : (
                <>
                  {/* Estimated Kitchen Prep Alert Box */}
                  <div
                    style={{
                      background: 'rgba(212, 166, 74, 0.08)',
                      border: '1px solid rgba(212, 166, 74, 0.25)',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.78rem',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    <Clock size={16} color={theme.primaryColor || '#c98a2c'} />
                    <span>
                      Estimated kitchen preparation time for this order: <b>~{maxPrepEstimate} minutes</b>
                    </span>
                  </div>

                  {/* Items List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                    {cartItems.map(item => (
                      <m.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={item.cartItemId}
                        style={{
                          background: 'var(--color-card-bg)',
                          border: '1px solid var(--color-card-border)',
                          borderRadius: '16px',
                          padding: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                          minWidth: 0,
                        }}
                      >
                        {/* Item Thumbnail & Details */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1, overflow: 'hidden' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            style={{ width: '52px', height: '52px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                          />
                          <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              {item.isVeg ? (
                                <span className="veg-indicator" style={{ width: '12px', height: '12px' }}><span className="veg-indicator-dot" style={{ width: '5px', height: '5px' }} /></span>
                              ) : (
                                <span className="non-veg-indicator" style={{ width: '12px', height: '12px' }}><span className="non-veg-indicator-triangle" style={{ borderLeftWidth: '3px', borderRightWidth: '3px', borderBottomWidth: '5px' }} /></span>
                              )}
                              <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-word' }}>
                                {item.name}
                              </h4>
                            </div>

                            {/* Customizations */}
                            {item.selectedCustomizations && item.selectedCustomizations.length > 0 && (
                              <div style={{ fontSize: '0.7rem', color: theme.primaryColor || '#c98a2c', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                + {item.selectedCustomizations.map(c => c.name).join(', ')}
                              </div>
                            )}

                            {/* Cooking Note per item */}
                            {editingNoteItemId === item.cartItemId ? (
                              <div style={{ marginTop: '4px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <input
                                  type="text"
                                  value={tempNoteText}
                                  placeholder="e.g. less spicy, no onion"
                                  onChange={e => setTempNoteText(e.target.value)}
                                  autoFocus
                                  style={{
                                    fontSize: '16px',
                                    padding: '5px 8px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--color-card-border)',
                                    background: 'rgba(255,255,255,0.06)',
                                    color: 'var(--color-text-primary)',
                                    outline: 'none',
                                    width: '140px',
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateItemNote(item.cartItemId, tempNoteText.trim());
                                    setEditingNoteItemId(null);
                                  }}
                                  className="touch-target-44"
                                  style={{
                                    fontSize: '0.72rem',
                                    padding: '5px 10px',
                                    borderRadius: '8px',
                                    background: theme.primaryColor || '#c98a2c',
                                    color: '#ffffff',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                    minHeight: '34px',
                                  }}
                                >
                                  Save
                                </button>
                              </div>
                            ) : item.specialNotes ? (
                              <div
                                onClick={() => {
                                  setEditingNoteItemId(item.cartItemId);
                                  setTempNoteText(item.specialNotes);
                                }}
                                style={{
                                  fontSize: '0.68rem',
                                  color: 'var(--color-text-muted)',
                                  fontStyle: 'italic',
                                  marginTop: '2px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                }}
                                title="Click to edit cooking note"
                              >
                                <MessageSquare size={10} />
                                <span>"{item.specialNotes}"</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingNoteItemId(item.cartItemId);
                                  setTempNoteText('');
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  padding: '2px 0',
                                  fontSize: '0.68rem',
                                  color: theme.primaryColor || '#c98a2c',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  marginTop: '2px',
                                  fontWeight: 600,
                                }}
                              >
                                <MessageSquare size={10} />
                                <span>+ Add cooking note</span>
                              </button>
                            )}

                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: theme.primaryColor || '#c98a2c', marginTop: '2px' }}>
                              {currency}{item.unitPrice} each
                            </div>
                          </div>
                        </div>

                        {/* Stepper Controls & Price */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                          <div className="qty-stepper-container" style={{ minHeight: '36px' }}>
                            <m.button
                              whileTap={{ scale: 0.85 }}
                              className="qty-stepper-btn touch-target-44"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              style={{ width: '32px', height: '32px' }}
                            >
                              <Minus size={11} />
                            </m.button>
                            <span className="qty-stepper-val" style={{ minWidth: '22px' }}>{item.quantity}</span>
                            <m.button
                              whileTap={{ scale: 0.85 }}
                              className="qty-stepper-btn touch-target-44"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              style={{ width: '32px', height: '32px' }}
                            >
                              <Plus size={11} />
                            </m.button>
                          </div>

                          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                            {currency}{item.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </m.div>
                    ))}
                  </div>

                  {/* Kitchen Note */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      Cooking Instructions for Kitchen
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Please make curries mild spicy, bring extra small plates..."
                      value={orderNotes}
                      onChange={e => setOrderNotes(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--color-card-border)',
                        color: 'var(--color-text-primary)',
                        fontSize: '16px',
                        outline: 'none',
                        resize: 'none',
                      }}
                    />
                  </div>

                  {/* Bill Details */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--color-card-border)',
                      borderRadius: '14px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <h4 style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      Bill Summary
                    </h4>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: 'var(--color-text-secondary)' }}>
                      <span>Item Subtotal</span>
                      <span>{currency}{subtotal.toFixed(2)}</span>
                    </div>

                    {settings?.taxRate > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        <span>GST / Taxes ({settings.taxRate}%)</span>
                        <span>{currency}{taxAmount.toFixed(2)}</span>
                      </div>
                    )}

                    {settings?.serviceChargeRate > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        <span>Service Charge ({settings.serviceChargeRate}%)</span>
                        <span>{currency}{serviceChargeAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div
                      style={{
                        height: '1px',
                        background: 'var(--color-card-border)',
                        margin: '3px 0',
                      }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                      <span>Grand Total</span>
                      <span style={{ color: theme.primaryColor || '#c98a2c' }}>{currency}{grandTotal.toFixed(2)}</span>
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
                  padding: '12px 16px max(14px, env(safe-area-inset-bottom, 14px))',
                  background: 'var(--color-card-bg)',
                  borderTop: '1px solid var(--color-card-border)',
                  boxShadow: '0 -4px 15px rgba(0, 0, 0, 0.4)',
                  boxSizing: 'border-box',
                  zIndex: 20,
                }}
              >
                <m.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={placeOrder}
                  className="btn-primary touch-target-44"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '14px',
                    fontSize: '0.94rem',
                    fontWeight: 800,
                    letterSpacing: '0.02em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    minHeight: '48px',
                  }}
                >
                  <Send size={16} />
                  <span>PROCEED TO ORDER • {currency}{grandTotal.toFixed(2)}</span>
                </m.button>
              </div>
            )}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
