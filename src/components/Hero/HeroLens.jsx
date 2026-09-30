/**
 * Magnifying-glass that drifts between the two name lines.
 * Pure CSS motion (transform only). It positions itself relative to the
 * name block, so it must be rendered inside `.hero-name-block`.
 */
export default function HeroLens() {
  return (
    <span className="hero-lens" aria-hidden="true">
      <span className="hero-lens-body">
        <span className="hero-lens-glow" />
        <span className="hero-lens-glass" />
        <span className="hero-lens-handle" />
      </span>
    </span>
  );
}
