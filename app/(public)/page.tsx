'use client';

import Image from 'next/image';

import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import LeagueSelector from '@/components/home-sections/features/LeagueSelector';
import LiveMatches from '@/components/home-sections/features/LiveMatches';
import TodayMatches from '@/components/home-sections/features/TodayMatches';
import UpcomingFixtures from '@/components/home-sections/features/UpcomingFixtures';
import Results from '@/components/home-sections/features/Results';
import CompetitionDisplay from '@/components/home-sections/features/CompetitionDisplay';
import LivescoreFilters from '@/components/home-sections/features/LivescoreFilters';

import HeroSection from '@/components/home-sections/hero/HeroSection';
import ArticlesPreview from '@/components/home-sections/articles-preview';
import CommunityPreviewSection from '@/components/home-sections/community-preview/CommunityPreviewSection';
import PredictionPreview from '@/components/home-sections/PredictionsPreview';
import SettledWins from '@/components/home-sections/SettledWins';

import { InternalAds } from '@/components/ads/IntAds/InternalAds';

import { AdPage } from '@/constants/ads/ad-page';
import { AdPosition } from '@/constants/ads/ad-position';

import { HomepageAds } from '@/components/ads/ExtAds/positions/HomepageAds';

import {
  useLivescore,
} from '@/hooks/useLivescore';


// ============================================================
// PAGE
// ============================================================

export default function HomePage() {

  // ==========================================================
  // LIVESCORE
  // ==========================================================

  const {
    leagues,
    selectedLeagueCode,
    selectLeague,

    matches,
    liveMatches,
    results,
    standings,

    isLoading,
  } = useLivescore();


  // ==========================================================
  // SELECTED COMPETITION
  // ==========================================================

  const selectedLeague =
    useMemo(() => {

      return leagues.find(
        league =>
          league.code ===
          selectedLeagueCode,
      );

    }, [
      leagues,
      selectedLeagueCode,
    ]);


  // ==========================================================
  // FILTER STATE
  // ==========================================================

  const [
    search,
    setSearch,
  ] = useState('');


  const [
    selectedDate,
    setSelectedDate,
  ] = useState('');


  const [
    goalFilter,
    setGoalFilter,
  ] = useState('');


  const [
    pointsFilter,
    setPointsFilter,
  ] = useState('');


  const [
    resultFilter,
    setResultFilter,
  ] = useState<
    'all' | 'home' | 'away' | 'draw'
  >('all');


  // ==========================================================
  // SECTION VIEW
  // ==========================================================

  type SectionView =
    | 'all'
    | 'predictions'
    | 'live'
    | 'today'
    | 'results'
    | 'upcoming'
    | 'table';


  const [
    sectionView,
    setSectionView,
  ] = useState<SectionView>('all');


  // ==========================================================
  // RESET FILTERS
  // ==========================================================

  const resetFilters =
    useCallback(() => {

      setSearch('');

      setSelectedDate('');

      setGoalFilter('');

      setPointsFilter('');

      setResultFilter('all');

    }, []);


  // ==========================================================
  // COMPETITION CHANGE
  // ==========================================================

  const handleLeagueChange =
    useCallback(
      (
        leagueCode: string,
      ) => {

        resetFilters();

        setSectionView('all');

        selectLeague(
          leagueCode,
        );

      },
      [
        resetFilters,
        selectLeague,
      ],
    );


  // ==========================================================
  // FILTER MATCHES
  // ==========================================================

  const filteredMatches =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      return matches.filter(
        match => {

          if (query) {

            const found =
              match.homeTeam
                .toLowerCase()
                .includes(query) ||

              match.awayTeam
                .toLowerCase()
                .includes(query) ||

              (
                match.venue ??
                ''
              )
                .toLowerCase()
                .includes(query);


            if (!found) {
              return false;
            }

          }


          if (selectedDate) {

            const matchDate =
              new Date(
                match.date,
              )
                .toISOString()
                .split('T')[0];


            if (
              matchDate !==
              selectedDate
            ) {
              return false;
            }

          }


          return true;

        },
      );

    }, [
      matches,
      search,
      selectedDate,
    ]);


  // ==========================================================
  // FILTER RESULTS
  // ==========================================================

  const filteredResults =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      return results.filter(
        match => {

          if (query) {

            const found =
              match.homeTeam
                .toLowerCase()
                .includes(query) ||

              match.awayTeam
                .toLowerCase()
                .includes(query) ||

              (
                match.venue ??
                ''
              )
                .toLowerCase()
                .includes(query);


            if (!found) {
              return false;
            }

          }


          if (selectedDate) {

            const matchDate =
              new Date(
                match.date,
              )
                .toISOString()
                .split('T')[0];


            if (
              matchDate !==
              selectedDate
            ) {
              return false;
            }

          }


          if (goalFilter) {

            const goals =
              (
                match.homeScore ??
                0
              ) +
              (
                match.awayScore ??
                0
              );


            if (
              goals <
              Number(
                goalFilter,
              )
            ) {
              return false;
            }

          }


          if (
            resultFilter ===
            'home'
          ) {

            if (
              (
                match.homeScore ??
                0
              ) <=
              (
                match.awayScore ??
                0
              )
            ) {
              return false;
            }

          }


          if (
            resultFilter ===
            'away'
          ) {

            if (
              (
                match.awayScore ??
                0
              ) <=
              (
                match.homeScore ??
                0
              )
            ) {
              return false;
            }

          }


          if (
            resultFilter ===
            'draw'
          ) {

            if (
              (
                match.homeScore ??
                0
              ) !==
              (
                match.awayScore ??
                0
              )
            ) {
              return false;
            }

          }


          return true;

        },
      );

    }, [
      results,
      search,
      selectedDate,
      goalFilter,
      resultFilter,
    ]);


  // ==========================================================
  // FILTER LIVE MATCHES
  // ==========================================================

  const filteredLiveMatches =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      if (!query) {
        return liveMatches;
      }


      return liveMatches.filter(
        match => {

          return (
            match.homeTeam
              .toLowerCase()
              .includes(query) ||

            match.awayTeam
              .toLowerCase()
              .includes(query) ||

            (
              match.venue ??
              ''
            )
              .toLowerCase()
              .includes(query)
          );

        },
      );

    }, [
      liveMatches,
      search,
    ]);


  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading) {

    return (
<main
  className="
    flex
    min-h-screen
    items-center
    justify-center
    bg-background
    px-3
  "
>
  <div
    className="
      flex
      flex-col
      items-center
      gap-8
    "
  >

    {/* ================================================== */}
    {/* LOGO LOADER */}
    {/* ================================================== */}

    <div
      className="
        relative
        flex
        h-28
        w-28
        items-center
        justify-center
      "
    >

      {/* Outer breathing ring */}

      <div
        className="
          absolute
          inset-0
          rounded-full
          border
          border-primary/10
          animate-pulse
        "
      />


      {/* Rotating loader ring */}

      <div
        className="
          absolute
          inset-0
          rounded-full
          border-2
          border-transparent
          border-t-primary
          border-r-primary/60
          animate-spin
        "
      />


      {/* Secondary rotating ring */}

      <div
        className="
          absolute
          inset-2
          rounded-full
          border
          border-transparent
          border-b-primary/40
          border-l-primary/20
          animate-[spin_2.5s_linear_infinite_reverse]
        "
      />


      {/* Logo container */}

      <div
        className="
          relative
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-full
          border
          border-primary/20
          bg-primary/5
          shadow-[0_0_40px_-10px_hsl(var(--primary)/0.5)]
        "
      >

        <Image
          src="/logo.png"
          alt="honestpredict"
          width={64}
          height={64}
          priority
          className="
            h-14
            w-14
            object-contain
          "
        />

      </div>

    </div>


    {/* ================================================== */}
    {/* LOADING TEXT */}
    {/* ================================================== */}

    <div
      className="
        flex
        flex-col
        items-center
        gap-2
      "
    >

      <p
        className="
          text-sm
          font-semibold
          text-foreground
        "
      >
        Fetching the latest football data
      </p>


      {/* Animated dots */}

      <div
        className="
          flex
          items-center
          gap-1.5
        "
      >

        <span
          className="
            h-1.5
            w-1.5
            rounded-full
            bg-primary
            animate-bounce
          "
        />

        <span
          className="
            h-1.5
            w-1.5
            rounded-full
            bg-primary
            animate-bounce
            [animation-delay:150ms]
          "
        />

        <span
          className="
            h-1.5
            w-1.5
            rounded-full
            bg-primary
            animate-bounce
            [animation-delay:300ms]
          "
        />

      </div>

    </div>

  </div>
</main>
    );

  }


  // ==========================================================
  // PAGE
  // ==========================================================

  return (
<main
  className="
    min-h-screen
    w-full
    overflow-x-hidden
    bg-background
    text-foreground
  "
>

  

      {/* ====================================================
          HERO
      ==================================================== */}

      <HeroSection />


  <div
    className="
      mx-auto
      w-full
      max-w-6xl
      2xl:max-w-7xl
      px-3
      sm:px-4
      lg:px-6
    "
  >



      {/* ====================================================
          TOP BANNER AD
      ==================================================== */}

      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          px-3
          sm:px-4
        "
      >
        <InternalAds
          page={AdPage.HOME}
          position={AdPosition.TOP_BANNER}
        />
      </div>


      {/* ====================================================
          HOMEPAGE EXTERNAL ADS
      ==================================================== */}

      <HomepageAds />


      {/* ====================================================
          MAIN CONTENT
      ==================================================== */}

      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          space-y-6
          px-3
          sm:px-4
          lg:space-y-8
          mt-4
        "
      >

        {/* ==================================================
            LIVE FILTER
        ================================================== */}

        {selectedLeagueCode && (
          <LivescoreFilters
            search={search}
            selectedDate={selectedDate}
            goalFilter={goalFilter}
            pointsFilter={pointsFilter}
            resultFilter={resultFilter}
            sectionView={sectionView}
            onSearchChange={setSearch}
            onDateChange={setSelectedDate}
            onGoalFilterChange={setGoalFilter}
            onPointsFilterChange={setPointsFilter}
            onResultFilterChange={setResultFilter}
            onSectionViewChange={setSectionView}
            onReset={resetFilters}
          />
        )}


        {/* ==================================================
            LIVE MATCHES
        ================================================== */}

        {(
          sectionView === 'all' ||
          sectionView === 'live'
        ) && (
          <LiveMatches
            matches={filteredLiveMatches}
          />
        )}


        {/* ==================================================
            HERO AD
        ================================================== */}

        <InternalAds
          page={AdPage.HOME}
          position={AdPosition.HERO}
        />


        {/* ==================================================
            TODAY'S PREDICTIONS
        ================================================== */}

        {(
          sectionView === 'all' ||
          sectionView === 'predictions'
        ) && (
          <><PredictionPreview
              search={search}
              selectedDate={selectedDate}
              goalFilter={goalFilter}
              resultFilter={resultFilter} />
              
              <SettledWins /></>
        )}



        {/* ==================================================
            INLINE AD
        ================================================== */}

        <InternalAds
          page={AdPage.HOME}
          position={AdPosition.INLINE}
        />


        {/* ==================================================
            SETTLED WINS
        ================================================== */}




        {/* ==================================================
            LEAGUE / COMPETITION DATA
        ================================================== */}

        {selectedLeagueCode && (
          <>

            {/* ================================================
                LEAGUE SELECTOR
            ================================================ */}

            <LeagueSelector
              leagues={leagues}
              selectedLeague={
                selectedLeagueCode
              }
              onLeagueChange={
                handleLeagueChange
              }
            />


            {/* ================================================
                TODAY'S FIXTURES
            ================================================ */}

            {(
              sectionView === 'all' ||
              sectionView === 'today'
            ) && (
              <TodayMatches
                matches={filteredMatches}
              />
            )}


            {/* ================================================
                RESULTS
            ================================================ */}

            {(
              sectionView === 'all' ||
              sectionView === 'results'
            ) && (
              <Results
                results={filteredResults}
              />
            )}


            {/* ================================================
                INLINE AD
            ================================================ */}

            <InternalAds
              page={AdPage.HOME}
              position={AdPosition.INLINE}
            />


            {/* ================================================
                UPCOMING FIXTURES
            ================================================ */}

            {(
              sectionView === 'all' ||
              sectionView === 'upcoming'
            ) && (
              <UpcomingFixtures
                fixtures={filteredMatches}
              />
            )}


            {/* ================================================
                LEAGUE TABLE / CUP
            ================================================ */}

            {(
              sectionView === 'all' ||
              sectionView === 'table'
            ) &&
              selectedLeague &&
              standings && (
                <CompetitionDisplay
                  league={selectedLeague}
                  competition={standings}
                  search={search}
                  pointsFilter={pointsFilter}
                />
              )
            }

          </>
        )}




      </div>


      {/* ====================================================
          POPUP AD
      ==================================================== */}

      <InternalAds
        page={AdPage.HOME}
        position={AdPosition.POPUP}
      />


  </div>

  
        {/* ==================================================
            ARTICLES
        ================================================== */}

        <ArticlesPreview />


        {/* ==================================================
            COMMUNITY
        ================================================== */}

        <CommunityPreviewSection />


        {/* ====================================================
            BOTTOM AD
        ==================================================== */}

        <InternalAds
          page={AdPage.HOME}
          position={AdPosition.BOTTOM}
        />
</main>
  );
}