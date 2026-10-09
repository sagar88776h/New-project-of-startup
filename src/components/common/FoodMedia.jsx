import React, { useState, useEffect, useRef } from 'react';

// Global registry to enforce maximum 6 simultaneously playing videos across the entire page
const activePlayingRegistry = new Set();
const MAX_SIMULTANEOUS_VIDEOS = 6;

function playVideoWithConcurrencyLimit(videoEl) {
  if (!videoEl || activePlayingRegistry.has(videoEl)) return;

  if (activePlayingRegistry.size >= MAX_SIMULTANEOUS_VIDEOS) {
    // Evict oldest video
    const oldest = activePlayingRegistry.values().next().value;
    if (oldest) {
      try {
        oldest.pause();
      } catch {
        // ignore
      }
      activePlayingRegistry.delete(oldest);
    }
  }

  activePlayingRegistry.add(videoEl);
  videoEl.play().catch(() => {
    // Autoplay policy or interrupt handling
    activePlayingRegistry.delete(videoEl);
  });
}

function pauseVideoAndRelease(videoEl) {
  if (!videoEl) return;
  activePlayingRegistry.delete(videoEl);
  try {
    videoEl.pause();
  } catch {
    // ignore
  }
}

export default function FoodMedia({
  src,
  videoSrc,
  alt = 'Delicious dish',
  isVeg = false,
  aspectRatio = '4 / 3',
  width = 600,
  height = 450,
  className = '',
  style = {},
  priority = false,
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [hasImageError, setHasImageError] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);

  // Check network speed and user preference
  const isSlowConnection =
    typeof navigator !== 'undefined' &&
    (navigator.connection?.saveData ||
      ['slow-2g', '2g', '3g'].includes(navigator.connection?.effectiveType));

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  const canPlayVideo = Boolean(
    videoSrc && !isSlowConnection && !prefersReducedMotion && !hasVideoError
  );

  // IntersectionObserver to observe viewport proximity
  useEffect(() => {
    if (!canPlayVideo || !containerRef.current) return;

    const currentContainer = containerRef.current;
    const currentVideo = videoRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsInViewport(true);
          if (currentVideo) {
            playVideoWithConcurrencyLimit(currentVideo);
          }
        } else {
          setIsInViewport(false);
          if (currentVideo) {
            pauseVideoAndRelease(currentVideo);
          }
        }
      },
      {
        rootMargin: '100px 0px', // Pre-load slightly before scrolling into view
        threshold: 0.15,
      }
    );

    observer.observe(currentContainer);

    return () => {
      observer.disconnect();
      if (currentVideo) {
        pauseVideoAndRelease(currentVideo);
      }
    };
  }, [canPlayVideo]);

  return (
    <div
      ref={containerRef}
      className={`food-media-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        overflow: 'hidden',
        background: '#161211',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* 1. Graceful Fallback Placeholder if Image/Media fails */}
      {hasImageError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1A1514 0%, #251D1B 100%)',
            color: 'var(--color-text-secondary)',
            gap: '8px',
            padding: '12px',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: isVeg ? 'rgba(39, 174, 96, 0.16)' : 'rgba(196, 22, 28, 0.16)',
              border: `1.5px solid ${isVeg ? 'rgba(39, 174, 96, 0.4)' : 'rgba(196, 22, 28, 0.4)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
            }}
          >
            {isVeg ? '🌱' : '🍗'}
          </div>
          <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-accent)' }}>
            {alt}
          </span>
        </div>
      )}

      {/* 2. Still Image / Poster */}
      {!hasImageError && src && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onError={() => setHasImageError(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: canPlayVideo && isInViewport ? 'none' : 'block',
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* 3. Looping Video (only when eligible and in viewport) */}
      {canPlayVideo && (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={src}
          muted
          loop
          playsInline
          preload="none"
          onError={() => setHasVideoError(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: isInViewport ? 'block' : 'none',
          }}
        />
      )}
    </div>
  );
}
