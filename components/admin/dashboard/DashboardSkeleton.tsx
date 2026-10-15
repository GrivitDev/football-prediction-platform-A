import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function CardSkeleton() {
  return (
    <Card className="gap-0 rounded-lg py-0 shadow-none">
      <CardHeader className="px-3 py-2">
        <Skeleton className="h-2.5 w-16" />
      </CardHeader>
      <CardContent className="space-y-1 px-3 pb-2.5 pt-0">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-2.5 w-24" />
      </CardContent>
    </Card>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 border-b pb-2">
        <Skeleton className="h-4 w-28" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-12 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-10 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <CardSkeleton key={index} />)}
      </div>

      {[
        { count: 5, columns: 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-5' },
        { count: 5, columns: 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-5' },
        { count: 9, columns: 'grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-9' },
        { count: 8, columns: 'grid-cols-2 sm:grid-cols-4 xl:grid-cols-8' },
        { count: 3, columns: 'grid-cols-2 sm:grid-cols-3' },
      ].map(({ count, columns }, sectionIndex) => (
        <section key={sectionIndex} className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <div className={`grid gap-2 ${columns}`}>
            {Array.from({ length: count }, (_, index) => <CardSkeleton key={index} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
