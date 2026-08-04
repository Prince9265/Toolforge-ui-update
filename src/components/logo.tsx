export function ToolForgeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label="ToolForge logo">
      <defs>
        <linearGradient id="tf-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--primary-glow)" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="9" fill="url(#tf-grad)" />
      <path
        d="M9 20.5 20 9.5M17.5 7l7.5 7.5-3 3-7.5-7.5zM12.5 15.5 8 20a2.5 2.5 0 0 0 3.5 3.5l4.5-4.5"
        fill="none"
        stroke="white"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}