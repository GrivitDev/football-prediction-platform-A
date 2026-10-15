import { InternalAds } from '@/components/ads/IntAds/InternalAds';
import { AdPage } from '@/constants/ads/ad-page';
import { AdPosition } from '@/constants/ads/ad-position';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        min-h-screen
        w-full
        overflow-x-clip
      "
    >
      <main
        className="
          w-full
        "
      >
        {children}
      </main>
      <InternalAds
        page={AdPage.HOME}
        position={AdPosition.FOOTER}
      />
    </div>
  );
}