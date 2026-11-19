const SIZES = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12 sm:h-14 sm:w-14',
  lg: 'h-20 w-20',
}

export default function Logo({ className = '', size = 'md' }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <img
        src="/images/logo.png"
        alt="Lina Home & Deco"
        draggable="false"
        className={`${SIZES[size] ?? SIZES.md} object-contain mix-blend-multiply`}
      />
    </span>
  )
}
