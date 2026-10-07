import React from 'react';
import { TrendingUp, Eye, ShoppingBag, DollarSign, Users, Award, Flame } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';

export default function AdminAnalytics() {
  const { activeRestaurant } = useRestaurant();
  const { ordersHistory } = useCart();
  const { currency, theme, items = [] } = activeRestaurant;

  // Compute live simulated analytics
  const todayScans = 148 + ordersHistory.length * 3;
  const activeOrdersCount = ordersHistory.length;
  const todayRevenue = ordersHistory.reduce((sum, o) => sum + (o.grandTotal || 0), 0) + 4820;
  const tableOccupancy = Math.min(100, Math.round(((activeOrdersCount + 12) / (activeRestaurant.settings?.tablesCount || 24)) * 100));

  const stats = [
    { label: "Today's QR Scans", value: todayScans, icon: <Eye size={20} color="#38bdf8" />, change: '+18% vs yesterday' },
    { label: 'Active Table Orders', value: activeOrdersCount, icon: <ShoppingBag size={20} color="#10b981" />, change: 'Real-time kitchen' },
    { label: "Today's Revenue", value: `${currency}${todayRevenue.toLocaleString()}`, icon: <DollarSign size={20} color={theme.primaryColor || '#c99738'} />, change: '+24% this week' },
    { label: 'Table Occupancy', value: `${tableOccupancy}%`, icon: <Users size={20} color="#a78bfa" />, change: `${activeOrdersCount + 12} / ${activeRestaurant.settings?.tablesCount || 24} tables` },
  ];

  // Top Dishes
  const popularDishes = [...items]
    .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
    .slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Stat Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
        }}
      >
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="glass-panel"
            style={{
              padding: '16px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600 }}>{stat.label}</span>
              <div style={{ padding: '6px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)' }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} />
              <span>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Top 5 Bestselling Dishes Card */}
      <div
        className="glass-panel"
        style={{
          padding: '18px',
          borderRadius: '18px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Award size={18} color={theme.primaryColor || '#c99738'} />
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
            Top Performing Menu Dishes
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {popularDishes.map((dish, i) => (
            <div
              key={dish.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: theme.primaryColor || '#c99738', width: '18px' }}>
                  #{i + 1}
                </span>
                <img src={dish.image} alt={dish.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>{dish.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{currency}{dish.price} • {dish.rating} ★ ({dish.reviewCount} orders)</div>
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.72rem',
                  color: dish.isAvailable ? '#10b981' : '#ef4444',
                  fontWeight: 600,
                  background: dish.isAvailable ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  padding: '3px 8px',
                  borderRadius: '999px',
                }}
              >
                {dish.isAvailable ? 'In Stock' : 'Sold Out'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
