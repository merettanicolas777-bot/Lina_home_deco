export function Skeleton({ className = '' }) {
  return <div className={`shimmer rounded-xl ${className}`} aria-hidden="true" />
}

export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-[18px] border border-ink/[0.07] bg-white/70 p-2.5 sm:p-3">
      <Skeleton className="aspect-[4/5] w-full rounded-[12px]" />
      <div className="flex flex-1 flex-col px-1 pt-3">
        <Skeleton className="h-2 w-14 rounded-full" />
        <Skeleton className="mt-2.5 h-3.5 w-full rounded-full" />
        <Skeleton className="mt-1.5 h-3.5 w-2/3 rounded-full" />
        <Skeleton className="mt-auto h-3 w-20 rounded-full" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 gap-x-3.5 gap-y-5 sm:gap-x-6 sm:gap-y-7 lg:grid-cols-3">
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
