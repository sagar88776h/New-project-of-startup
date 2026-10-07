import React from 'react';
import { CheckCircle2, ChefHat, Flame, Utensils, Receipt, Sparkles, X, PlusCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';

export default function OrderSuccessModal() {
  const {
    activeOrder,
    isOrderPlacedModalOpen,
    setIsOrderPlacedModalOpen,
    callWaiter,
  } = useCart();

  const { activeRestaurant } = useRestaurant();
  const { currency, theme } = activeRestaurant;

  if (!isOrderPlacedModalOpen || !activeOrder) return null;

  const steps = [
    { title: 'Order Placed', desc: 'Sent to kitchen', icon: <CheckCircle2 size={16} color="#10b981" />, active: true, completed: true },
    { title: 'Preparing', desc: 'Chef cooking with fresh ingredients', icon: <ChefHat size={16} color={theme.primaryColor || '#c99738'} />, active: true, completed: activeOrder.status?.includes('Preparing') || activeOrder.status?.includes('Served') },
    { title: 'Served to Table', desc: 'Delivered hot to Table ' + activeOrder.tableNumber, icon: <Utensils size={16} color="#3b82f6" />, active: activeOrder.status?.includes('Served'), completed: activeOrder.status?.includes('Served') },
  ];

  return (
    <div className="modal-overlay active" onClick={() => setIsOrderPlacedModalOpen(false)}>
      <div
        className="bottom-sheet dark-sheet"
        onClick={e => e.stopPropagation()}
        style={{
          background: '#141720',
          maxHeight: '90svh',
          padding: '20px 16px calc(24px + var(--sab))',
          color: '#ffffff',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div className="sheet-handle" />

        {/* Success Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '8px auto 14px',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)',
          }}
        >
          <CheckCircle2 size={36} color="#10b981" />
        </div>

        <h2
          style={{
            fontFamily: theme.fontHeading || "'Playfair Display', serif",
            fontSize: '1.45rem',
            fontWeight: 700,
            marginBottom: '4px',
          }}
        >
          Order Sent to Kitchen!
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '20px' }}>
          {activeOrder.orderId} • Table {activeOrder.tableNumber}
        </p>

        {/* Live Kitchen Status Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: theme.primaryColor || '#c99738', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Live Kitchen Tracker
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.12)',
                padding: '2px 8px',
                borderRadius: '999px',
                fontWeight: 600,
              }}
            >
              Live Status
            </span>
          </div>

          {/* Stepper progress */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {steps.map((s, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: s.completed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                    border: s.completed ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: s.completed ? '#ffffff' : '#9ca3af' }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                    {s.desc}
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
            borderRadius: '14px',
            padding: '12px 14px',
            marginBottom: '20px',
            textAlign: 'left',
          }}
        >
          <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: '8px', fontWeight: 600 }}>
            Items Ordered ({activeOrder.items?.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {activeOrder.items?.map(it => (
              <div key={it.cartItemId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#e5e7eb' }}>
                <span>{it.quantity}x {it.name}</span>
                <span style={{ fontWeight: 700 }}>{currency}{it.totalPrice}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: '10px',
              paddingTop: '8px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 800,
              fontSize: '0.95rem',
              color: theme.primaryColor || '#c99738',
            }}
          >
            <span>Total Amount</span>
            <span>{currency}{activeOrder.grandTotal?.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => setIsOrderPlacedModalOpen(false)}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', borderRadius: '14px' }}
          >
            <PlusCircle size={16} />
            <span>Order More Dishes</span>
          </button>

          <button
            onClick={() => {
              callWaiter('Bill Request');
              setIsOrderPlacedModalOpen(false);
            }}
            className="btn-secondary"
            style={{ width: '100%', padding: '12px', borderRadius: '14px' }}
          >
            <Receipt size={16} />
            <span>Request Bill to Table {activeOrder.tableNumber}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
