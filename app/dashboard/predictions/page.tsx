'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Image from 'next/image';

import api from '@/lib/axios';

import PredictionModal from '@/components/predictions/PredictionModal';
import PredictionCard from '@/components/predictions/PredictionCard';
import PredictionTable from '@/components/predictions/PredictionTable';
import PredictionPagination from '@/components/predictions/PredictionPagination';
import PredictionFilters from '@/components/predictions/PredictionFilters';

import { InternalAds } from '@/components/ads/IntAds/InternalAds';

import { AdPage } from '@/constants/ads/ad-page';
import { AdPosition } from '@/constants/ads/ad-position';

import { PredictionsAds } from '@/components/ads/ExtAds/positions/PredictionsAds';


// ============================================================
// CONSTANTS
// ============================================================

const ITEMS_PER_PAGE = 10;


// ============================================================
// PAGE
// ============================================================

export default function PredictionsPage() {

  // ==========================================================
  // DATA
  // ==========================================================

  const [
    predictions,
    setPredictions,
  ] = useState<any[]>([]);


  const [
    selected,
    setSelected,
  ] = useState<any | null>(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  // ==========================================================
  // FILTERS
  // ==========================================================

  const [
    search,
    setSearch,
  ] = useState('');


  const [
    league,
    setLeague,
  ] = useState('all');


  const [
    minConfidence,
    setMinConfidence,
  ] = useState(0);


  const [
    dateFilter,
    setDateFilter,
  ] = useState('all');


  const [
    customFrom,
    setCustomFrom,
  ] = useState('');


  const [
    customTo,
    setCustomTo,
  ] = useState('');


  // ==========================================================
  // PAGINATION
  // ==========================================================

  const [
    page,
    setPage,
  ] = useState(1);


  // ==========================================================
  // FETCH PREDICTIONS
  // ==========================================================

  useEffect(() => {

    let cancelled = false;


    const fetchPredictions = async () => {

      try {

        const res =
          await api.get('/predictions');


        if (!cancelled) {

          setPredictions(
            Array.isArray(res.data)
              ? res.data
              : []
          );

        }

      } catch (error) {

        if (!cancelled) {

          console.error(
            'Failed to fetch predictions:',
            error
          );

          setPredictions([]);

        }

      } finally {

        if (!cancelled) {

          setLoading(false);

        }

      }

    };


    fetchPredictions();


    return () => {

      cancelled = true;

    };

  }, []);


  // ==========================================================
  // LEAGUES
  // ==========================================================

  const leagues = useMemo(() => {

    return Array.from(
      new Set(
        predictions
          .map(
            (prediction) =>
              prediction.leagueCode
          )
          .filter(Boolean)
      )
    ).sort();

  }, [
    predictions,
  ]);


  // ==========================================================
  // FILTER + SORT
  // ==========================================================

  const filtered = useMemo(() => {

    // ========================================================
    // CURRENT DATE
    // ========================================================

    const now = new Date();


    // ========================================================
    // TODAY
    // ========================================================

    const today = new Date(
      now
    );

    today.setHours(
      0,
      0,
      0,
      0
    );


    const todayTime =
      today.getTime();


    // ========================================================
    // TOMORROW
    // ========================================================

    const tomorrow = new Date(
      today
    );

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );


    const tomorrowTime =
      tomorrow.getTime();


    // ========================================================
    // DAY AFTER TOMORROW
    // ========================================================

    const dayAfterTomorrow =
      new Date(
        tomorrow
      );

    dayAfterTomorrow.setDate(
      dayAfterTomorrow.getDate() + 1
    );


    const dayAfterTomorrowTime =
      dayAfterTomorrow.getTime();


    // ========================================================
    // THIS WEEK
    // ========================================================

    /*
     * Week starts on Monday.
     */

    const weekStart =
      new Date(
        today
      );


    const dayOfWeek =
      weekStart.getDay();


    const daysFromMonday =
      dayOfWeek === 0
        ? 6
        : dayOfWeek - 1;


    weekStart.setDate(
      weekStart.getDate() -
      daysFromMonday
    );


    const weekStartTime =
      weekStart.getTime();


    const weekEnd =
      new Date(
        weekStart
      );


    weekEnd.setDate(
      weekEnd.getDate() + 7
    );


    const weekEndTime =
      weekEnd.getTime();


    // ========================================================
    // THIS MONTH
    // ========================================================

    const monthStart =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );


    monthStart.setHours(
      0,
      0,
      0,
      0
    );


    const monthStartTime =
      monthStart.getTime();


    const monthEnd =
      new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        1
      );


    monthEnd.setHours(
      0,
      0,
      0,
      0
    );


    const monthEndTime =
      monthEnd.getTime();


    // ========================================================
    // CUSTOM DATE RANGE
    // ========================================================

    let customFromTime:
      number | null = null;


    let customToTime:
      number | null = null;


    if (
      dateFilter === 'custom'
    ) {

      if (customFrom) {

        const from =
          new Date(
            `${customFrom}T00:00:00`
          );


        if (
          !Number.isNaN(
            from.getTime()
          )
        ) {

          customFromTime =
            from.getTime();

        }

      }


      if (customTo) {

        const to =
          new Date(
            `${customTo}T23:59:59.999`
          );


        if (
          !Number.isNaN(
            to.getTime()
          )
        ) {

          customToTime =
            to.getTime();

        }

      }

    }


    // ========================================================
    // SEARCH
    // ========================================================

    const searchTerm =
      search
        .trim()
        .toLowerCase();


    // ========================================================
    // FILTER
    // ========================================================

    return predictions

      .filter((prediction) => {

        // ----------------------------------------------------
        // LEAGUE
        // ----------------------------------------------------

        if (
          league !== 'all' &&
          prediction.leagueCode !== league
        ) {

          return false;

        }


        // ----------------------------------------------------
        // SEARCH
        // ----------------------------------------------------

        if (searchTerm) {

          const homeTeam =
            String(
              prediction.homeTeam ?? ''
            ).toLowerCase();


          const awayTeam =
            String(
              prediction.awayTeam ?? ''
            ).toLowerCase();


          const matchesSearch =
            homeTeam.includes(
              searchTerm
            ) ||
            awayTeam.includes(
              searchTerm
            );


          if (!matchesSearch) {

            return false;

          }

        }


        // ----------------------------------------------------
        // CONFIDENCE
        // ----------------------------------------------------

        const confidence =
          Number(
            prediction.confidence ?? 0
          );


        if (
          confidence < minConfidence
        ) {

          return false;

        }


        // ----------------------------------------------------
        // MATCH DATE
        // ----------------------------------------------------

        const matchDate =
          new Date(
            prediction.matchDate
          );


        const matchTime =
          matchDate.getTime();


        if (
          Number.isNaN(
            matchTime
          )
        ) {

          return false;

        }


        // ----------------------------------------------------
        // TODAY
        // ----------------------------------------------------

        if (
          dateFilter === 'today'
        ) {

          if (
            matchTime < todayTime ||
            matchTime >= tomorrowTime
          ) {

            return false;

          }

        }


        // ----------------------------------------------------
        // TOMORROW
        // ----------------------------------------------------

        if (
          dateFilter === 'tomorrow'
        ) {

          if (
            matchTime < tomorrowTime ||
            matchTime >= dayAfterTomorrowTime
          ) {

            return false;

          }

        }


        // ----------------------------------------------------
        // THIS WEEK
        // ----------------------------------------------------

        if (
          dateFilter === 'week'
        ) {

          if (
            matchTime < weekStartTime ||
            matchTime >= weekEndTime
          ) {

            return false;

          }

        }


        // ----------------------------------------------------
        // THIS MONTH
        // ----------------------------------------------------

        if (
          dateFilter === 'month'
        ) {

          if (
            matchTime < monthStartTime ||
            matchTime >= monthEndTime
          ) {

            return false;

          }

        }


        // ----------------------------------------------------
        // CUSTOM
        // ----------------------------------------------------

        if (
          dateFilter === 'custom'
        ) {

          /*
           * If FROM exists, matches must be
           * on or after FROM.
           */

          if (
            customFromTime !== null &&
            matchTime < customFromTime
          ) {

            return false;

          }


          /*
           * If TO exists, matches must be
           * on or before TO.
           */

          if (
            customToTime !== null &&
            matchTime > customToTime
          ) {

            return false;

          }

        }


        return true;

      })


      // ======================================================
      // SORT
      // ======================================================

      .sort((a, b) => {

        const aDate =
          new Date(
            a.matchDate
          );


        const bDate =
          new Date(
            b.matchDate
          );


        const aTime =
          aDate.getTime();


        const bTime =
          bDate.getTime();


        // ----------------------------------------------------
        // NORMALIZED DAYS
        // ----------------------------------------------------

        aDate.setHours(
          0,
          0,
          0,
          0
        );


        bDate.setHours(
          0,
          0,
          0,
          0
        );


        const aDay =
          aDate.getTime();


        const bDay =
          bDate.getTime();


        // ----------------------------------------------------
        // TODAY FIRST
        // ----------------------------------------------------

        const aIsToday =
          aDay === todayTime;


        const bIsToday =
          bDay === todayTime;


        if (
          aIsToday !== bIsToday
        ) {

          return aIsToday
            ? -1
            : 1;

        }


        // ----------------------------------------------------
        // UPCOMING VS PAST
        // ----------------------------------------------------

        const aUpcoming =
          aDay > todayTime;


        const bUpcoming =
          bDay > todayTime;


        if (
          aUpcoming !== bUpcoming
        ) {

          return aUpcoming
            ? -1
            : 1;

        }


        // ----------------------------------------------------
        // UPCOMING
        // ----------------------------------------------------

        if (aUpcoming) {

          if (
            aDay === bDay
          ) {

            return aTime - bTime;

          }


          return aDay - bDay;

        }


        // ----------------------------------------------------
        // PAST
        // ----------------------------------------------------

        if (
          aDay === bDay
        ) {

          return bTime - aTime;

        }


        return bDay - aDay;

      });

  }, [
    predictions,
    search,
    league,
    minConfidence,
    dateFilter,
    customFrom,
    customTo,
  ]);


  // ==========================================================
  // RESET PAGINATION WHEN FILTERS CHANGE
  // ==========================================================

  useEffect(() => {

    setPage(1);

  }, [
    search,
    league,
    minConfidence,
    dateFilter,
    customFrom,
    customTo,
  ]);


  // ==========================================================
  // PAGINATION
  // ==========================================================

  const totalPages =
    Math.ceil(
      filtered.length /
      ITEMS_PER_PAGE
    );


  useEffect(() => {

    if (
      totalPages > 0 &&
      page > totalPages
    ) {

      setPage(
        totalPages
      );

    }

  }, [
    page,
    totalPages,
  ]);


  const paginated =
    filtered.slice(
      (page - 1) *
        ITEMS_PER_PAGE,

      page *
        ITEMS_PER_PAGE
    );


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      className="
        space-y-8
      "
    >

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-border
          bg-card
          p-3
          sm:p-4
        "
      >

        <div
          className="
            relative
            space-y-5
          "
        >

          {/* BRAND */}

          <div
            className="
              flex
              items-center
              gap-1
              -mb-3
            "
          >

            <Image
              src="/logo.png"
              alt="HonestPredict"
              width={64}
              height={64}
              className="
                h-14
                w-14
                shrink-0
                object-contain
              "
            />


            <span
              className="
                text-lg
                font-black
                uppercase
                tracking-[0.3em]
                text-primary
              "
            >
              HonestPredict
            </span>

          </div>


          {/* TITLE */}

          <div>

            <h1
              className="
                text-2xl
                font-black
                tracking-tight
              "
            >
              Prediction Hub
            </h1>


            <p
              className="
                max-w-3xl
                text-sm
                leading-7
                text-muted-foreground
                sm:text-base
              "
            >
              Professional football predictions with detailed
              match analysis & confidence ratings.
            </p>

          </div>

        </div>

      </div>


      {/* ================================================== */}
      {/* FILTERS */}
      {/* ================================================== */}

      <PredictionFilters

        search={
          search
        }

        setSearch={
          setSearch
        }


        league={
          league
        }

        setLeague={
          setLeague
        }


        minConfidence={
          minConfidence
        }

        setMinConfidence={
          setMinConfidence
        }


        dateFilter={
          dateFilter
        }

        setDateFilter={
          setDateFilter
        }


        customFrom={
          customFrom
        }

        setCustomFrom={
          setCustomFrom
        }


        customTo={
          customTo
        }

        setCustomTo={
          setCustomTo
        }


        leagues={
          leagues
        }

      />


      {/* ================================================== */}
      {/* LOADING */}
      {/* ================================================== */}

      {
        loading && (

          <div
            className="
              rounded-3xl
              border
              border-border
              p-10
              text-center
              text-muted-foreground
            "
          >
            Loading predictions...
          </div>

        )
      }


      {/* ================================================== */}
      {/* EMPTY STATE */}
      {/* ================================================== */}

      {
        !loading &&
        paginated.length === 0 && (

          <div
            className="
              rounded-3xl
              border
              border-border
              p-10
              text-center
            "
          >

            <h3
              className="
                font-semibold
              "
            >
              No predictions found
            </h3>


            <p
              className="
                mt-2
                text-sm
                text-muted-foreground
              "
            >
              Try changing your filters.
            </p>

          </div>

        )
      }


      {/* ================================================== */}
      {/* PREDICTIONS */}
      {/* ================================================== */}

      {
        !loading &&
        paginated.length > 0 && (

          <>

            {/* DESKTOP */}

            <PredictionTable
              predictions={
                paginated
              }
              onSelect={
                setSelected
              }
            />


            {/* MOBILE */}

            <div
              className="
                space-y-4
                lg:hidden
              "
            >

              {
                paginated.map(
                  (prediction) => (

                    <PredictionCard
                      key={
                        prediction._id
                      }
                      prediction={
                        prediction
                      }
                      onClick={() =>
                        setSelected(
                          prediction
                        )
                      }
                    />

                  )
                )
              }

            </div>

          </>

        )
      }


      {/* ================================================== */}
      {/* PAGINATION */}
      {/* ================================================== */}

      {
        totalPages > 1 && (

          <PredictionPagination
            page={
              page
            }
            totalPages={
              totalPages
            }
            onChange={
              setPage
            }
          />

        )
      }


      {/* ================================================== */}
      {/* MODAL */}
      {/* ================================================== */}

      {
        selected && (

          <PredictionModal
            prediction={
              selected
            }
            onClose={() =>
              setSelected(null)
            }
          />

        )
      }


      {/* ================================================== */}
      {/* EXTERNAL ADS */}
      {/* ================================================== */}

      <PredictionsAds />


      {/* ================================================== */}
      {/* INTERNAL BOTTOM AD */}
      {/* ================================================== */}

      <InternalAds
        page={
          AdPage.HOME
        }
        position={
          AdPosition.BOTTOM
        }
      />


      {/* ================================================== */}
      {/* INTERNAL POPUP AD */}
      {/* ================================================== */}

      <InternalAds
        page={
          AdPage.HOME
        }
        position={
          AdPosition.POPUP
        }
      />

    </div>

  );

}