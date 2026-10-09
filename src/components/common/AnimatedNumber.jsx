import { useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * Smooth count-up animation for stats, ratings, and numerical displays
 */
export default function AnimatedNumber({ value, duration = 1.2, prefix = '', suffix = '', decimals = 0, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const numericTarget = typeof value === 'number' ? value : parseFloat(value) || 0;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    let frameId;
    const updateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out expo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = numericTarget * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(updateNumber);
      } else {
        setDisplayValue(numericTarget);
      }
    };

    frameId = requestAnimationFrame(updateNumber);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, value, duration]);

  const formatted = decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue);

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
