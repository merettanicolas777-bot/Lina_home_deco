export function Skeleton({ className = '' }) {
  return <div className={`shimmer rounded-md ${className}`} aria-hidden="true" />
}

export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-line/70 bg-shell p-2 sm:p-2.5">
      <Skeleton className="aspect-[4/5] w-full rounded-lg" />
      <div className="flex flex-1 flex-col px-2 pb-1 pt-3.5">
        <Skeleton className="h-2.5 w-20 rounded-full" />
        <Skeleton className="mt-3 h-3.5 w-full rounded-full" />
        <Skeleton className="mt-1.5 h-3.5 w-2/3 rounded-full" />
        <Skeleton className="mt-4 h-3.5 w-24 rounded-full" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 6, columns = 3 }) {
  return (
    <div
      className={`grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-5 sm:gap-y-6 ${
        columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
      }`}
    >
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
      <Spinner className="h-6 w-6 text-moss" />
      <p className="text-[12px] font-medium">{label}</p>
    </div>
  )
}
