/**
 * Divulgación con <details> nativo en vez de un popover con JS: accesible por
 * teclado y por lector de pantalla sin trabajo extra, y funciona sin hidratar.
 */
export function InfoTooltip({
  summary,
  paragraphs,
}: {
  summary: string;
  paragraphs: string[];
}) {
  return (
    <details className="group inline-block align-middle">
      <summary
        aria-label={summary}
        className="inline-flex h-5 w-5 cursor-pointer list-none items-center justify-center rounded-[999px] border border-line text-xs text-clinical transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden"
      >
        ?
      </summary>
      <div className="mt-3 rounded-[var(--radius-md)] border border-line bg-elevated p-4 text-sm leading-relaxed text-muted">
        <p className="mb-2 font-medium text-foreground">{summary}</p>
        {paragraphs.map((text) => (
          <p key={text} className="mt-2 first:mt-0">
            {text}
          </p>
        ))}
      </div>
    </details>
  );
}
