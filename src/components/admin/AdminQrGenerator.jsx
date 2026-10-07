import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Printer, Copy, Check, Sparkles, ExternalLink, Utensils } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';

export default function AdminQrGenerator() {
  const { activeRestaurant } = useRestaurant();
  const { showToast } = useCart();
  const { theme, contact, settings } = activeRestaurant;

  const [selectedTable, setSelectedTable] = useState('04');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const printCardRef = useRef(null);

  // Generate target URL
  const baseUrl = window.location.origin;
  const menuUrl = `${baseUrl}/menu/${activeRestaurant.slug}?table=${selectedTable}`;

  useEffect(() => {
    // Generate crisp QR code data URL with dark/gold theme
    QRCode.toDataURL(menuUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0d0e12',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR generation error', err));
  }, [menuUrl, activeRestaurant.slug, selectedTable]);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(menuUrl);
    setCopiedLink(true);
    showToast('Menu URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${activeRestaurant.slug}-table-${selectedTable}-qr.png`;
    a.click();
    showToast(`Downloaded QR for Table ${selectedTable}`, 'success');
  };

  const handlePrintTentCard = () => {
    window.print();
  };

  const tables = Array.from({ length: settings?.tablesCount || 24 }, (_, i) => String(i + 1).padStart(2, '0'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#ffffff' }}>
      
      {/* Table Selector & URL Box */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <QrCode size={18} color={theme.primaryColor || '#c99738'} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>QR Code Configuration</h4>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Select Table:</span>
            <select
              value={selectedTable}
              onChange={e => setSelectedTable(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                background: '#181b24',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.8rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {tables.map(t => (
                <option key={t} value={t}>Table {t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Menu Link */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '10px 14px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.8rem',
          }}
        >
          <span style={{ color: '#d1d5db', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
            {menuUrl}
          </span>
          <button
            onClick={handleCopyLink}
            style={{
              background: copiedLink ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {copiedLink ? <Check size={13} /> : <Copy size={13} />}
            <span>{copiedLink ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Printable Luxury Table Tent Stand Card Preview */}
      <div
        className="glass-panel"
        style={{
          borderRadius: '20px',
          padding: '24px 20px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(180deg, #181c26 0%, #0d0e12 100%)',
          border: `2px solid ${theme.primaryColor || '#c99738'}`,
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
          position: 'relative',
        }}
        ref={printCardRef}
      >
        {/* Table Number Badge */}
        <div
          style={{
            background: theme.primaryColor || '#c99738',
            color: '#0d0e12',
            fontWeight: 800,
            fontSize: '0.8rem',
            letterSpacing: '0.06em',
            padding: '4px 16px',
            borderRadius: '999px',
            marginBottom: '12px',
            textTransform: 'uppercase',
          }}
        >
          TABLE {selectedTable}
        </div>

        {/* Restaurant Name */}
        <h3
          style={{
            fontFamily: theme.fontHeading || "'Playfair Display', serif",
            fontSize: '1.4rem',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '4px',
          }}
        >
          {activeRestaurant.name}
        </h3>
        <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '16px' }}>
          Scan to View Digital Menu & Order from Table
        </p>

        {/* QR Code Container */}
        <div
          style={{
            background: '#ffffff',
            padding: '14px',
            borderRadius: '18px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            marginBottom: '16px',
            display: 'inline-block',
          }}
        >
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Code for Table ${selectedTable}`}
              style={{ width: '180px', height: '180px', display: 'block' }}
            />
          ) : (
            <div style={{ width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
              Generating QR...
            </div>
          )}
        </div>

        {/* WiFi Credentials on Tent Card */}
        {contact?.wifiPassword && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '6px 14px',
              borderRadius: '10px',
              fontSize: '0.72rem',
              color: '#d1d5db',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>📶 Free WiFi: <b>{contact.wifiSsid}</b></span>
            <span>|</span>
            <span>Key: <b>{contact.wifiPassword}</b></span>
          </div>
        )}
      </div>

      {/* Download & Print Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button
          onClick={handleDownloadPng}
          className="btn-primary"
          style={{ padding: '12px', borderRadius: '12px', fontSize: '0.85rem' }}
        >
          <Download size={16} />
          <span>Download PNG</span>
        </button>

        <button
          onClick={handlePrintTentCard}
          className="btn-secondary"
          style={{ padding: '12px', borderRadius: '12px', fontSize: '0.85rem' }}
        >
          <Printer size={16} />
          <span>Print Table Stand</span>
        </button>
      </div>
    </div>
  );
}
