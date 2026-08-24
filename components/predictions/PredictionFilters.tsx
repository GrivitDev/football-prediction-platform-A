'use client';

import {
  ChevronDown,
  ChevronUp,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

import { useState } from 'react';

interface PredictionFiltersProps {
  search: string;
  setSearch: (value: string) => void;

  league: string;
  setLeague: (value: string) => void;

  minConfidence: number;
  setMinConfidence: (value: number) => void;

  dateFilter: string;
  setDateFilter: (value: string) => void;

  customFrom: string;
  setCustomFrom: (value: string) => void;

  customTo: string;
  setCustomTo: (value: string) => void;

  leagues: string[];
}

export default function PredictionFilters({
  search,
  setSearch,

  league,
  setLeague,

  minConfidence,
  setMinConfidence,

  dateFilter,
  setDateFilter,

  customFrom,
  setCustomFrom,

  customTo,
  setCustomTo,

  leagues,
}: PredictionFiltersProps) {

  const [
    open,
    setOpen,
  ] = useState(false);


  return (

    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-border
        bg-card/70
        backdrop-blur-xl
      "
    >

      {/* ================================================== */}
      {/* TOP BAR */}
      {/* ================================================== */}

      <div
        className="
          flex
          items-center
          gap-2
          p-3
        "
      >

        {/* ================================================== */}
        {/* SEARCH */}
        {/* ================================================== */}

        <div
          className="
            relative
            min-w-0
            flex-1
          "
        >

          <Search
            className="
              absolute
              left-3
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-muted-foreground
            "
          />

          <input
            type="search"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search teams..."
            className="
              h-11
              w-full
              rounded-xl
              border
              border-border
              bg-background
              pl-10
              pr-4
              text-sm
              outline-none
              transition
              focus:border-primary
              focus:ring-2
              focus:ring-primary/10
            "
          />

        </div>


        {/* ================================================== */}
        {/* FILTER BUTTON */}
        {/* ================================================== */}

        <button
          type="button"
          onClick={() =>
            setOpen(
              (value) => !value
            )
          }
          aria-expanded={open}
          className="
            flex
            h-11
            shrink-0
            items-center
            gap-2
            rounded-xl
            border
            border-border
            bg-background
            px-3
            text-sm
            font-medium
            transition
            hover:bg-muted
          "
        >

          <SlidersHorizontal
            className="
              h-4
              w-4
            "
          />

          <span className="hidden sm:inline">
            Filters
          </span>

          {open ? (

            <ChevronUp
              className="
                h-4
                w-4
              "
            />

          ) : (

            <ChevronDown
              className="
                h-4
                w-4
              "
            />

          )}

        </button>

      </div>


      {/* ================================================== */}
      {/* FILTER PANEL */}
      {/* ================================================== */}

      {open && (

        <div
          className="
            border-t
            border-border
            p-3
          "
        >

          <div
            className="
              grid
              grid-cols-1
              gap-3
              sm:grid-cols-3
            "
          >

            {/* ================================================== */}
            {/* LEAGUE */}
            {/* ================================================== */}

            <div
              className="
                space-y-1.5
              "
            >

              <label
                htmlFor="prediction-league"
                className="
                  text-xs
                  font-medium
                  text-muted-foreground
                "
              >
                League
              </label>

              <select
                id="prediction-league"
                value={league}
                onChange={(e) =>
                  setLeague(
                    e.target.value
                  )
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-border
                  bg-background
                  px-3
                  text-sm
                  outline-none
                  transition
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/10
                "
              >

                <option value="all">
                  All Leagues
                </option>

                {leagues.map(
                  (item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* ================================================== */}
            {/* CONFIDENCE */}
            {/* ================================================== */}

            <div
              className="
                space-y-1.5
              "
            >

              <label
                htmlFor="prediction-confidence"
                className="
                  text-xs
                  font-medium
                  text-muted-foreground
                "
              >
                Confidence
              </label>

              <select
                id="prediction-confidence"
                value={minConfidence}
                onChange={(e) =>
                  setMinConfidence(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-border
                  bg-background
                  px-3
                  text-sm
                  outline-none
                  transition
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/10
                "
              >

                <option value={0}>
                  All Confidence
                </option>

                <option value={50}>
                  50%+
                </option>

                <option value={60}>
                  60%+
                </option>

                <option value={70}>
                  70%+
                </option>

                <option value={80}>
                  80%+
                </option>

                <option value={90}>
                  90%+
                </option>

              </select>

            </div>


            {/* ================================================== */}
            {/* DATE */}
            {/* ================================================== */}

            <div
              className="
                space-y-1.5
              "
            >

              <label
                htmlFor="prediction-date"
                className="
                  text-xs
                  font-medium
                  text-muted-foreground
                "
              >
                Date
              </label>

              <select
                id="prediction-date"
                value={dateFilter}
                onChange={(e) =>
                  setDateFilter(
                    e.target.value
                  )
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-border
                  bg-background
                  px-3
                  text-sm
                  outline-none
                  transition
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/10
                "
              >

                <option value="all">
                  All Dates
                </option>

                <option value="today">
                  Today
                </option>

                <option value="tomorrow">
                  Tomorrow
                </option>

                <option value="week">
                  This Week
                </option>

                <option value="month">
                  This Month
                </option>

                <option value="custom">
                  Custom
                </option>

              </select>

            </div>

          </div>


          {/* ================================================== */}
          {/* CUSTOM DATE RANGE */}
          {/* ================================================== */}

          {dateFilter === 'custom' && (

            <div
              className="
                mt-3
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
              "
            >

              {/* ================================================== */}
              {/* FROM */}
              {/* ================================================== */}

              <div
                className="
                  space-y-1.5
                "
              >

                <label
                  htmlFor="prediction-date-from"
                  className="
                    text-xs
                    font-medium
                    text-muted-foreground
                  "
                >
                  From
                </label>

                <input
                  id="prediction-date-from"
                  type="date"
                  value={customFrom}
                  onChange={(e) =>
                    setCustomFrom(
                      e.target.value
                    )
                  }
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-border
                    bg-background
                    px-3
                    text-sm
                    outline-none
                    transition
                    focus:border-primary
                    focus:ring-2
                    focus:ring-primary/10
                  "
                />

              </div>


              {/* ================================================== */}
              {/* TO */}
              {/* ================================================== */}

              <div
                className="
                  space-y-1.5
                "
              >

                <label
                  htmlFor="prediction-date-to"
                  className="
                    text-xs
                    font-medium
                    text-muted-foreground
                  "
                >
                  To
                </label>

                <input
                  id="prediction-date-to"
                  type="date"
                  value={customTo}
                  min={customFrom || undefined}
                  onChange={(e) =>
                    setCustomTo(
                      e.target.value
                    )
                  }
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-border
                    bg-background
                    px-3
                    text-sm
                    outline-none
                    transition
                    focus:border-primary
                    focus:ring-2
                    focus:ring-primary/10
                  "
                />

              </div>

            </div>

          )}

        </div>

      )}

    </div>

  );

}