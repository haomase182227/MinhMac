export default function SpiralBinder({ ringCount = 10 }) {
  const rings = Array.from({ length: ringCount }, (_, idx) => idx);

  return (
    <div className="spiral-binder" aria-hidden="true">
      {rings.map((idx) => (
        <div key={idx} className="spiral-ring" />
      ))}
    </div>
  );
}
