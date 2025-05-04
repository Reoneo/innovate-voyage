
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Add the SkeletonCard component that's being imported
const SkeletonCard = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("border rounded-lg p-4", className)} {...props}>
    <Skeleton className="h-full w-full" />
  </div>
);

export { Skeleton, SkeletonCard }
