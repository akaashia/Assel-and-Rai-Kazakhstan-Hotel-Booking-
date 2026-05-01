export function KazakhOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 40"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <pattern id="kazakh-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path
          d="M20 0 L25 10 L35 10 L27 18 L30 28 L20 22 L10 28 L13 18 L5 10 L15 10 Z"
          fill="currentColor"
          opacity="0.3"
        />
        <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.5" />
      </pattern>
      <rect width="200" height="40" fill="url(#kazakh-pattern)" />
    </svg>
  );
}

export function KazakhBorder({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rotate-45 bg-primary"
            style={{ opacity: 0.3 + (i * 0.15) }}
          />
        ))}
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-primary via-primary to-transparent" />
    </div>
  );
}
