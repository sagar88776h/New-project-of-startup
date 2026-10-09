import React, { useRef, useEffect } from 'react';
import { m } from 'framer-motion';
import { useRestaurant } from '../../context/RestaurantContext';

export default function CategoryNav({ activeCategoryId, onSelectCategory }) {
  const { activeRestaurant } = useRestaurant();
  const navRef = useRef(null);
  const activeTabRef = useRef(null);

  const categories = activeRestaurant.categories.filter(c => c.active);

  // Auto scroll active category chip into view horizontally
  useEffect(() => {
    if (activeTabRef.current && navRef.current) {
      const scrollLeft =
        activeTabRef.current.offsetLeft -
        navRef.current.offsetWidth / 2 +
        activeTabRef.current.offsetWidth / 2;

      navRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  }, [activeCategoryId]);

  return (
    <div
      style={{
        position: 'sticky',
        top: 'calc(48px + var(--sat))',
        zIndex: 80,
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderBottom: '1px solid var(--color-card-border)',
        padding: '8px 10px 8px',
      }}
    >
      <nav
        className="horizontal-scroll-row no-scrollbar"
        ref={navRef}
        style={{
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          overflowX: 'auto',
          overflowY: 'hidden',
          whiteSpace: 'nowrap',
          paddingBottom: '2px',
        }}
      >
        {categories.map((cat, idx) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <m.button
              key={cat.id}
              ref={isActive ? activeTabRef : null}
              onClick={() => onSelectCategory(cat.id)}
              className={`category-circle-chip ${isActive ? 'active' : ''}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.3 }}
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              style={{
                minWidth: '56px',
                minHeight: '64px',
              }}
            >
              {/* Circular Food Thumbnail */}
              <div className="category-circle-thumb">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    width="54"
                    height="54"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextElementSibling) {
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'rgba(139, 29, 44, 0.08)',
                    display: cat.image ? 'none' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    borderRadius: '50%',
                  }}
                >
                  {cat.icon || '🍽️'}
                </div>
              </div>

              {/* Category Name */}
              <span className="category-circle-name">
                {cat.name}
              </span>
            </m.button>
          );
        })}
      </nav>
    </div>
  );
}
