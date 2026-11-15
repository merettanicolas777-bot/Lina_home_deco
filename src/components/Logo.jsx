export default function Logo({ className = '', showTagline = true, size = 'md' }) {
  const sizes = {
    sm: { mark: 'h-9 w-9', name: 'text-2xl', tag: 'text-[7px]' },
    md: { mark: 'h-11 w-11', name: 'text-[26px]', tag: 'text-[8px]' },
    lg: { mark: 'h-16 w-16', name: 'text-4xl', tag: 'text-[10px]' },
  }
  const s = sizes[size] ?? sizes.md

  return (
    <span className={`flex items-center gap-2.5 text-ink ${className}`}>
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className={`${s.mark} shrink-0 text-clay`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 30.5 31.8 8.5 58 30.5" />
        <path d="M12.5 26.5v22.8c0 3.4 2.3 5.4 5.8 5.4h24.2" />
        <path d="M41.4 39.6c-2.6-3.4-7.4-3.2-7.4 1.2 0 3.4 4.4 5.6 7.4 8.4 3-2.8 7.6-5 7.6-8.4 0-4.4-4.9-4.6-7.6-1.2Z" />
      </svg>

      <span className="flex flex-col leading-none">
        <span className={`font-serif font-normal tracking-[0.02em] ${s.name}`}>lina</span>
        {showTagline && (
          <span className={`mt-1 font-sans uppercase tracking-[0.18em] text-ink/80 ${s.tag}`}>
            Home &amp; Deco
          </span>
        )}
      </span>
    </span>
  )
}
