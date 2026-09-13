const ICONS = ['🌸', '✨', '💖', '🧸', '☁️', '🍓', '🎀', '⭐'];

// Pre-computed deterministic floating items (100% pure, no Math.random during render)
const STATIC_ITEMS = Array.from({ length: 16 }, (_, i) => {
  const pseudoSeed = (i * 37 + 13) % 100;
  const pseudoDelay = ((i * 23 + 7) % 80) / 10;
  const pseudoDuration = 12 + ((i * 19 + 5) % 80) / 10;
  const pseudoSize = 1.2 + ((i * 29 + 11) % 10) / 10;

  return {
    id: i,
    icon: ICONS[i % ICONS.length],
    left: `${(i * 6.2 + (pseudoSeed % 4)).toFixed(1)}%`,
    delay: `${pseudoDelay.toFixed(1)}s`,
    duration: `${pseudoDuration.toFixed(1)}s`,
    size: `${pseudoSize.toFixed(2)}rem`,
  };
});

export default function AmbientBackground() {
  return (
    <div className="ambient-decor" aria-hidden="true">
      {STATIC_ITEMS.map((item) => (
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
