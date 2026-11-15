export function Skeleton({ className = '' }) {
  return <div className={`shimmer rounded-xl ${className}`} aria-hidden="true" />
}

export function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[4/5] w-full rounded-[20px]" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-2.5 w-16 rounded-full" />
        <Skeleton className="h-4 w-3/4 rounded-full" />
        <Skeleton className="h-3 w-20 rounded-full" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function Spinner({ className = 'h-5 w-5' }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-current/25 border-t-current ${className}`}
      aria-hidden="true"
    />
  )
}

export function PageLoader({ label = 'Cargando' }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-muted">
      <Spinner className="h-6 w-6 text-clay" />
      <p className="text-[10px] uppercase tracking-[0.22em]">{label}</p>
    </div>
  )
}
