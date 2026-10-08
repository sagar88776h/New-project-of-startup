import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Printer, Copy, Check, Grid } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';

export default function AdminQrGenerator() {
  const { activeRestaurant } = useRestaurant();
  const { showToast } = useCart();
  const { theme, contact, settings } = activeRestaurant;

  const [selectedTable, setSelectedTable] = useState('01');
  const [viewMode, setViewMode] = useState('single'); // 'single' | 'batch'
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [batchQrs, setBatchQrs] = useState({});
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate target URL
  const baseUrl = window.location.origin;
  const menuUrl = `${baseUrl}/menu/${activeRestaurant.slug}?table=${selectedTable}`;
  const totalTables = settings?.tablesCount || 24;
  const tables = Array.from({ length: totalTables }, (_, i) => String(i + 1).padStart(2, '0'));

  useEffect(() => {
    // Generate QR for selected table
    QRCode.toDataURL(menuUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0E0B0A',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR generation error', err));
  }, [menuUrl, selectedTable]);

  useEffect(() => {
    if (viewMode === 'batch') {
      const generated = {};
      Promise.all(
        tables.map(t => {
          const u = `${baseUrl}/menu/${activeRestaurant.slug}?table=${t}`;
          return QRCode.toDataURL(u, {
            width: 280,
            margin: 2,
            color: { dark: '#0E0B0A', light: '#ffffff' },
            errorCorrectionLevel: 'H',
          }).then(url => {
            generated[t] = url;
          });
        })
      ).then(() => {
        setBatchQrs({ ...generated });
      });
    }
  }, [viewMode, activeRestaurant.slug, baseUrl, tables]);

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#ffffff' }}>
      
      {/* Mode Switcher */}
      <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px' }}>
        <button
          type="button"
          onClick={() => setViewMode('single')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            background: viewMode === 'single' ? (theme.primaryColor || '#C4161C') : 'transparent',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <QrCode size={15} />
          <span>Single Table Stand</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode('batch')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            background: viewMode === 'batch' ? (theme.primaryColor || '#C4161C') : 'transparent',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <Grid size={15} />
          <span>All Tables ({totalTables} Stands)</span>
        </button>
      </div>

      {viewMode === 'single' ? (
        <>
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
                <QrCode size={18} color={theme.accentColor || '#D4A64A'} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>QR Configuration</h4>
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
                type="button"
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

          {/* Printable Table Tent Stand Card Preview */}
          <div
            className="printable-tent-card"
            style={{
              borderRadius: '20px',
              padding: '24px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(180deg, #1A1514 0%, #0E0B0A 100%)',
              border: `2px solid ${theme.accentColor || '#D4A64A'}`,
              boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
              position: 'relative',
            }}
          >
            {/* Table Number Badge */}
            <div
              style={{
                background: theme.primaryColor || '#C4161C',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.85rem',
                letterSpacing: '0.06em',
                padding: '5px 20px',
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
                fontFamily: theme.fontHeading || "'Fraunces', serif",
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#F6EFE3',
                marginBottom: '4px',
              }}
            >
              {activeRestaurant.name}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#B8AEA2', marginBottom: '16px' }}>
              Scan QR Code to Order Food & Call Service
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
              type="button"
              onClick={handleDownloadPng}
              className="btn-primary"
              style={{ padding: '12px', borderRadius: '12px', fontSize: '0.85rem' }}
            >
              <Download size={16} />
              <span>Download PNG</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="btn-secondary"
              style={{ padding: '12px', borderRadius: '12px', fontSize: '0.85rem' }}
            >
              <Printer size={16} />
              <span>Print Table Stand</span>
            </button>
          </div>
        </>
      ) : (
        /* Batch Printable Grid */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '0.82rem', color: '#9ca3af', margin: 0 }}>
              Showing printable tent cards for all {totalTables} tables. Click Print to print all stands.
            </p>
            <button
              type="button"
              onClick={handlePrint}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
            >
              <Printer size={15} />
              <span>Print All Stands</span>
            </button>
          </div>

          <div
            className="printable-batch-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '16px',
              maxHeight: '60vh',
              overflowY: 'auto',
              padding: '4px',
            }}
          >
            {tables.map(t => (
              <div
                key={t}
                className="printable-tent-card"
                style={{
                  background: '#1A1514',
                  border: '1px solid rgba(212, 166, 74, 0.25)',
                  borderRadius: '16px',
                  padding: '16px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    background: theme.primaryColor || '#C4161C',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    padding: '3px 12px',
                    borderRadius: '999px',
                    marginBottom: '8px',
                  }}
                >
                  TABLE {t}
                </div>
                <h4 style={{ fontSize: '0.9rem', color: '#F6EFE3', margin: '0 0 8px 0', fontFamily: theme.fontHeading || "'Fraunces', serif" }}>
                  {activeRestaurant.name}
                </h4>
                <div style={{ background: '#fff', padding: '8px', borderRadius: '10px', marginBottom: '8px' }}>
                  {batchQrs[t] ? (
                    <img src={batchQrs[t]} alt={`QR Table ${t}`} style={{ width: '120px', height: '120px', display: 'block' }} />
                  ) : (
                    <div style={{ width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '0.7rem' }}>
                      Generating...
                    </div>
                  )}
                </div>
                <span style={{ fontSize: '0.68rem', color: '#B8AEA2' }}>Scan to Order</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
