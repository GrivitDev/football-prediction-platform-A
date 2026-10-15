import FixturesTable from '@/components/predictions/public/FixturesTable';
import RecentWinsTable from '@/components/predictions/public/RecentWinsTable';
import StandingsTable from '@/components/predictions/public/StandingsTable';
import FreePredictionsTable from '@/components/predictions/tables/FreePredictionsTable';
import RegularPredictionsTable from '@/components/predictions/tables/RegularPredictionsTable';
import VipPredictionsTable from '@/components/predictions/tables/VipPredictionsTable';
import PremiumPredictionsTable from '@/components/predictions/tables/PremiumPredictionsTable';

export default function PredictionsPage() {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-5 px-3 py-5 sm:gap-6 sm:px-5 sm:py-7 lg:px-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Football Predictions</h1>
        <p className="text-sm text-muted-foreground">Fixtures, tier-based predictions, recent results, league tables and player leaders.</p>
      </header>

      <FixturesTable />
      <FreePredictionsTable />
      <RegularPredictionsTable />
      <VipPredictionsTable />
      <PremiumPredictionsTable />
      <RecentWinsTable />
      <StandingsTable />
    </main>
  );
}
