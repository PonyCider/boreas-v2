export function PlanToggle({
  id,
  label,
  help,
  delta,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  help: string;
  delta: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  const helpId = `${id}-help`;

  return (
    <div className="flex items-start gap-3 border-t border-line pt-4">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-describedby={helpId}
        className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />
      <label htmlFor={id} className="cursor-pointer text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="ml-2 text-clinical">{delta}</span>
        <span id={helpId} className="mt-1 block text-clinical">
          {help}
        </span>
      </label>
    </div>
  );
}
