"use client";

export interface StackedCardLayer {
  key: string;
  content: React.ReactNode;
}

export interface StackedCardLayerStyle {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  blur: number;
  zIndex: number;
}

// Back layers read as soft shadow first, hint-of-content second (reference:
// relevo.chat's own stack is a pure dark blurred bleed, no visible card
// edges). No border on back layers — a crisp rounded-rect outline at any
// opacity still reads as "another card" instead of "shadow".
export const stackedCardLayerStyles: StackedCardLayerStyle[] = [
  { x: 0, y: 0, scale: 1, opacity: 1, blur: 0, zIndex: 14 },
  { x: 24, y: 16, scale: 0.965, opacity: 0.22, blur: 6, zIndex: 13 },
  { x: 44, y: 30, scale: 0.93, opacity: 0.1, blur: 11, zIndex: 12 },
];

/**
 * Renders a front card with 0-2 blurred "echo" layers behind it for depth.
 * Height is stable no matter which content is active: every possible layer
 * (ghostLayers) is rendered invisibly stacked in the same CSS grid cell
 * (grid-area: 1 / 1), so the wrapper's natural height is always the tallest
 * among them — no JS measurement, no per-change resize. For a static
 * (non-cycling) stack, pass the same array as both `layers` and
 * `ghostLayers`.
 */
export function StackedCards({
  layers,
  ghostLayers,
  layerOverrides,
  clipInset = "-4px 0px -40px -40px",
  radiusVar = "var(--radius-sm)",
  className = "",
}: {
  /** Front-to-back. Only stackedCardLayerStyles.length are rendered. */
  layers: StackedCardLayer[];
  /** Every possible layer's content, for height-stable sizing (see above). */
  ghostLayers: StackedCardLayer[];
  /** Per-index override of a layer's resting style — e.g. a departure/step-
   *  forward animation while cycling. `undefined` at an index (or a shorter
   *  array) falls back to that layer's stackedCardLayerStyles resting style. */
  layerOverrides?: (StackedCardLayerStyle | undefined)[];
  clipInset?: string;
  radiusVar?: string;
  className?: string;
}) {
  const visibleLayers = layers.slice(0, stackedCardLayerStyles.length);

  return (
    <div className={`relative overflow-x-clip pr-10 ${className}`} style={{ clipPath: `inset(${clipInset})` }}>
      <div className="pointer-events-none invisible grid" aria-hidden="true">
        {ghostLayers.map((layer) => (
          <div key={layer.key} className="overflow-hidden border border-line" style={{ gridArea: "1 / 1", borderRadius: radiusVar }}>
            {layer.content}
          </div>
        ))}
      </div>

      {visibleLayers.map((layer, index) => {
        const isFrontCard = index === 0;
        const style = layerOverrides?.[index] ?? stackedCardLayerStyles[index];
        return (
          <div
            key={layer.key}
            aria-hidden="true"
            className={`absolute inset-x-0 top-0 overflow-hidden pointer-events-none transition-all duration-500 ${
              isFrontCard ? "border border-line" : ""
            }`}
            style={{
              borderRadius: radiusVar,
              transform: `translate3d(${style.x}px, ${style.y}px, 0) scale(${style.scale})`,
              opacity: style.opacity,
              zIndex: style.zIndex,
              filter: `blur(${style.blur}px)`,
              transformOrigin: "top left",
              boxShadow: isFrontCard ? "var(--shadow)" : "var(--shadow-depth)",
            }}
          >
            {layer.content}
          </div>
        );
      })}
    </div>
  );
}
