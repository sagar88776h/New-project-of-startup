import React, { useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChefHat, Utensils, PlusCircle, Receipt } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { modalBackdropVariants, bottomSheetVariants } from '../../lib/motion';

export default function OrderSuccessModal() {
  const {
    activeOrder,
    isOrderPlacedModalOpen,
    setIsOrderPlacedModalOpen,
    callWaiter,
  } = useCart();

  const { activeRestaurant } = useRestaurant();
  const { currency, theme } = activeRestaurant;

  useEffect(() => {
    if (isOrderPlacedModalOpen) {
      document.body.classList.add('modal-open');
      return () => document.body.classList.remove('modal-open');
    }
  }, [isOrderPlacedModalOpen]);

  const steps = [
    { title: 'Order Placed', desc: 'Sent to kitchen', icon: <CheckCircle2 size={16} color="#10b981" />, active: true, completed: true },
    { title: 'Preparing', desc: 'Chef cooking with fresh ingredients', icon: <ChefHat size={16} color={theme.primaryColor || '#c99738'} />, active: true, completed: activeOrder?.status?.includes('Preparing') || activeOrder?.status?.includes('Served') },
    { title: 'Served to Table', desc: 'Delivered hot to Table ' + (activeOrder?.tableNumber || '?'), icon: <Utensils size={16} color="#3b82f6" />, active: activeOrder?.status?.includes('Served'), completed: activeOrder?.status?.includes('Served') },
  ];

  return (
    <AnimatePresence>
      {isOrderPlacedModalOpen && activeOrder && (
        <m.div
          key="order-success-backdrop"
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="modal-overlay active"
          onClick={() => setIsOrderPlacedModalOpen(false)}
        >
          <m.div
            key="order-success-sheet"
            variants={bottomSheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bottom-sheet"
            onClick={e => e.stopPropagation()}
            style={{ maxHeight: '90dvh', height: 'auto', padding: '24px 20px max(24px, env(safe-area-inset-bottom, 24px))', overflowY: 'auto', overscrollBehavior: 'contain' }}
          >
            <div className="sheet-handle" />

            {/* Confirmed Icon and Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <m.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(21, 128, 61, 0.15)',
                  border: '2px solid #15803d',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  boxShadow: '0 4px 20px rgba(21, 128, 61, 0.3)',
                }}
              >
                <CheckCircle2 size={36} />
              </m.div>

              <h2
                style={{
                  fontFamily: theme.fontHeading || "'Playfair Display', serif",
                  fontSize: '1.45rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: '4px',
                }}
              >
                Order Sent to Kitchen!
              </h2>

              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Table <b>{activeOrder.tableNumber}</b> • Order #{activeOrder.orderId}
              </p>
            </div>

            {/* Live Progress Timeline */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--color-card-border)',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
                Live Kitchen Status
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {steps.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: step.completed ? 'rgba(21, 128, 61, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                        border: step.completed ? '1.5px solid #15803d' : '1.5px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: step.completed ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
                        {step.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}>
                        {step.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ordered Items Summary */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--color-card-border)',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                Items in This Order
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeOrder.items?.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                    <span style={{ color: 'var(--color-text-primary)' }}>
                      {it.quantity}x {it.name}
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>
                      {currency}{it.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                ))}

                <div style={{ height: '1px', background: 'var(--color-card-border)', margin: '4px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.94rem', fontWeight: 800 }}>
                  <span style={{ color: 'var(--color-text-primary)' }}>Total</span>
                  <span style={{ color: theme.primaryColor || '#c98a2c' }}>
                    {currency}{activeOrder.grandTotal?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <m.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsOrderPlacedModalOpen(false)}
                className="btn-primary touch-target-44"
                style={{ width: '100%', padding: '14px', borderRadius: '14px', minHeight: '48px' }}
              >
                <PlusCircle size={16} />
                <span>Order More Dishes</span>
              </m.button>

              <m.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  callWaiter('Bill Request');
                  setIsOrderPlacedModalOpen(false);
                }}
                className="btn-secondary touch-target-44"
                style={{ width: '100%', padding: '12px', borderRadius: '14px', minHeight: '48px' }}
              >
                <Receipt size={16} />
                <span>Request Bill to Table {activeOrder.tableNumber}</span>
              </m.button>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
