'use client';
import Link from 'next/link';
import {
  useParams,
} from 'next/navigation';
import {
  ArrowLeft,
} from 'lucide-react';
import {
  Button,
} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AdForm,
} from '@/components/admin/ads/AdForm';
import {
  useAdminAd,
} from '@/hooks/useAdminAds';
export default function EditAdPage() {
  const params =
    useParams();
  const id =
    params.id as string;
  const {
    data: ad,
    isLoading,
    isError,
  } = useAdminAd(id);
  if (isLoading) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        Loading advertisement...
      </div>
    );
  }
  if (isError || !ad) {
    return (
      <div className="py-6 text-center text-destructive">
        Advertisement not found.
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {/* HEADER */}
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        <Button
          variant="outline"
          size="icon"
          asChild
        >
          <Link href="/admin/ads">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">
            Edit Advertisement
          </h1>
          <p className="text-muted-foreground">
            Update advertisement details and display rules.
          </p>
        </div>
      </div>
      <Card className="surface">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-sm">
            Advertisement Details
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <AdForm
            mode="edit"
            defaultValues={ad}
          />
        </CardContent>
      </Card>
    </div>
  );
}
