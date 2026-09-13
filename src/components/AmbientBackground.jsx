import { useMemo } from 'react';

const ICONS = ['🌸', '✨', '💖', '🧸', '☁️', '🍓', '🎀', '⭐'];

export default function AmbientBackground() {
  // Generate random positions and timings for 16 floating elements
  const items = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      icon: ICONS[i % ICONS.length],
      left: `${(i * 6.2 + Math.random() * 4).toFixed(1)}%`,
      delay: `${(Math.random() * 10).toFixed(1)}s`,
      duration: `${(12 + Math.random() * 8).toFixed(1)}s`,
      size: `${(1.2 + Math.random() * 1.2).toFixed(2)}rem`,
    }));
  }, []);

  return (
    <div className="ambient-decor" aria-hidden="true">
      {items.map((item) => (
        <span
          key={item.id}
          className="floating-petal"
          style={{
            left: item.left,
            animationDelay: item.delay,
            animationDuration: item.duration,
            fontSize: item.size,
          }}
        >
          {item.icon}
        </span>
      ))}
    </div>
  );
}
