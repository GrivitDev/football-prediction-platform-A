'use client';
import {
  LucideIcon,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
interface AdAnalyticsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
}
export function AdAnalyticsCard({
  title,
  value,
  icon: Icon,
  description,
}: AdAnalyticsCardProps) {
  return (
    <Card className="surface py-0">
      <CardHeader className="px-3 pt-3 pb-1.5 flex flex-row items-center justify-between space-y-0">
        <CardTitle
          className="
            text-xs
            font-medium
          "
        >
          {title}
        </CardTitle>
        <Icon
          className="
            size-4
            text-muted-foreground
          "
        />
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-0">
        <div
          className="
            text-lg
            font-bold
          "
        >
          {
            typeof value === 'number'
              ?
              value.toLocaleString()
              :
              value
          }
        </div>
        {
          description && (
            <p
              className="
                mt-1
                text-xs
                text-muted-foreground
              "
            >
              {description}
            </p>
          )
        }
      </CardContent>
    </Card>
  );
}
