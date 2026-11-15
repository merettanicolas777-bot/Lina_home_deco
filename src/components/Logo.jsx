const SIZES = {
  sm: 'h-12 w-12',
  md: 'h-14 w-14 sm:h-[68px] sm:w-[68px]',
  lg: 'h-24 w-24',
}

export default function Logo({ className = '', size = 'md' }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <img
        src="/images/logo.png"
        alt="Lina Home & Deco"
        draggable="false"
        className={`${SIZES[size] ?? SIZES.md} object-contain`}
      />
    </span>
  )
}
