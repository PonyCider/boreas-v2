export function SectionFrame({
  children,
  className = "",
  id,
  theme,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  theme?: "light" | "dark";
}) {
  return (
    <section
      id={id}
      data-theme={theme}
      className={`relative scroll-mt-28 py-20 sm:py-28 ${className}`}
    >
      {children}
    </section>
  );
}
