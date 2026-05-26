const SKELETON_COUNT = 6

export function MenuGridSkeleton() {
  return (
    <div className="menu-page__grid menu-page__grid--skeleton" aria-hidden>
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <div key={i} className="menu-skeleton-card">
          <div className="menu-skeleton-card__media" />
          <div className="menu-skeleton-card__body">
            <div className="menu-skeleton-card__line menu-skeleton-card__line--title" />
            <div className="menu-skeleton-card__line menu-skeleton-card__line--desc" />
            <div className="menu-skeleton-card__line menu-skeleton-card__line--price" />
          </div>
        </div>
      ))}
    </div>
  )
}
