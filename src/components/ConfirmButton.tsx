"use client";
export default function ConfirmButton({
  message, children, className, name, value, ifField, style,
}: {
  message: string; children: React.ReactNode; className?: string; name?: string; value?: string;
  /** Only ask for confirmation when this form field currently has this value. */
  ifField?: { name: string; value: string };
  style?: React.CSSProperties;
}) {
  return (
    <button
      className={className}
      style={style}
      name={name}
      value={value}
      onClick={(e) => {
        if (ifField) {
          const el = e.currentTarget.form?.elements.namedItem(ifField.name) as HTMLSelectElement | null;
          if (!el || el.value !== ifField.value) return;
        }
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
