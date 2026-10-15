'use client';

import {
  Activity,
  AlertCircle,
  ArrowUp,
  Database,
  HeartPulse,
  ListChecks,
  Network,
  RefreshCw,
  Server,
  Trophy,
  Workflow,
} from 'lucide-react';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import SystemMonitorErrors from './system-monitor-errors';
import SystemMonitorHealth from './system-monitor-health';
import SystemMonitorOverview from './system-monitor-overview';
import SystemMonitorCrons from './system-monitor-crons';
import SystemMonitorStorage from './system-monitor-storage';

import SystemMonitorSportsData from './system-monitor-sports-data';
import SystemMonitorCompetitions from './system-monitor-competitions';
import SystemMonitorPipeline from './system-monitor-pipeline';
import SystemMonitorQueue from './system-monitor-queue';
import SystemMonitorSync from './system-monitor-sync';
import SystemMonitorProviders from './system-monitor-providers';
import SystemMonitorData from './system-monitor-data';


// ============================================================
// TYPES
// ============================================================

type MonitorSection =
  | 'system'
  | 'sports';

type SystemMonitorTab =
  | 'overview'
  | 'health'
  | 'crons'
  | 'errors'
  | 'storage'
  | 'sports-overview'
  | 'sports-competitions'
  | 'sports-pipeline'
  | 'sports-queue'
  | 'sports-sync'
  | 'sports-providers'
  | 'sports-data';


// ============================================================
// TAB CONFIG
// ============================================================

interface TabDefinition {
  id: SystemMonitorTab;
  label: string;
  icon: typeof Activity;
}

const systemTabs: TabDefinition[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: Activity,
  },
  {
    id: 'health',
    label: 'Health',
    icon: HeartPulse,
  },
  {
    id: 'crons',
    label: 'Cron Jobs',
    icon: Server,
  },
  {
    id: 'errors',
    label: 'Errors',
    icon: AlertCircle,
  },
  {
    id: 'storage',
    label: 'Storage',
    icon: Database,
  },
];

const sportsTabs: TabDefinition[] = [
  {
    id: 'sports-overview',
    label: 'Overview',
    icon: Trophy,
  },
  {
    id: 'sports-competitions',
    label: 'Competitions',
    icon: Trophy,
  },
  {
    id: 'sports-pipeline',
    label: 'Pipeline',
    icon: Workflow,
  },
  {
    id: 'sports-queue',
    label: 'Queue',
    icon: ListChecks,
  },
  {
    id: 'sports-sync',
    label: 'Sync',
    icon: RefreshCw,
  },
  {
    id: 'sports-providers',
    label: 'Providers',
    icon: Network,
  },
  {
    id: 'sports-data',
    label: 'Data',
    icon: Database,
  },
];


// ============================================================
// HELPERS
// ============================================================

const findScrollParent = (
  element: HTMLElement | null,
): HTMLElement | null => {
  if (!element) {
    return null;
  }

  let parent =
    element.parentElement;

  while (parent) {
    const style =
      window.getComputedStyle(parent);

    const overflowY =
      style.overflowY;

    const isScrollableOverflow =
      overflowY === 'auto' ||
      overflowY === 'scroll' ||
      overflowY === 'overlay';

    const hasScrollableContent =
      parent.scrollHeight >
      parent.clientHeight;

    if (
      isScrollableOverflow &&
      hasScrollableContent
    ) {
      return parent;
    }

    parent =
      parent.parentElement;
  }

  return null;
};


// ============================================================
// COMPONENT
// ============================================================

export default function SystemMonitor() {
  const [
    section,
    setSection,
  ] = useState<MonitorSection>('system');

  const [
    activeTab,
    setActiveTab,
  ] = useState<SystemMonitorTab>('overview');

  const [
    showBackToTop,
    setShowBackToTop,
  ] = useState(false);

  const monitorRef =
    useRef<HTMLElement | null>(null);

  const scrollContainerRef =
    useRef<HTMLElement | null>(null);

  const visibleTabs =
    section === 'system'
      ? systemTabs
      : sportsTabs;


  // ==========================================================
  // FIND ACTUAL SCROLL CONTAINER
  // ==========================================================

  useEffect(() => {
    const element =
      monitorRef.current;

    if (!element) {
      return;
    }

    const scrollParent =
      findScrollParent(element);

    scrollContainerRef.current =
      scrollParent;


    // ========================================================
    // SCROLL HANDLER
    // ========================================================

    const handleScroll = () => {
      const target =
        scrollContainerRef.current;

      const scrollTop =
        target?.scrollTop ??
        window.scrollY;

      setShowBackToTop(
        scrollTop > 300,
      );
    };


    // ========================================================
    // LISTEN TO ACTUAL SCROLLER
    // ========================================================

    if (scrollParent) {
      scrollParent.addEventListener(
        'scroll',
        handleScroll,
        {
          passive: true,
        },
      );
    } else {
      window.addEventListener(
        'scroll',
        handleScroll,
        {
          passive: true,
        },
      );
    }


    // ========================================================
    // INITIAL STATE
    // ========================================================

    handleScroll();


    // ========================================================
    // CLEANUP
    // ========================================================

    return () => {
      if (scrollParent) {
        scrollParent.removeEventListener(
          'scroll',
          handleScroll,
        );
      } else {
        window.removeEventListener(
          'scroll',
          handleScroll,
        );
      }
    };
  }, []);


  // ==========================================================
  // SECTION CHANGE
  // ==========================================================

  const handleSectionChange = (
    nextSection: MonitorSection,
  ) => {
    setSection(nextSection);

    setActiveTab(
      nextSection === 'system'
        ? 'overview'
        : 'sports-overview',
    );

    scrollToTop();
  };


  // ==========================================================
  // TAB CHANGE
  // ==========================================================

  const handleTabChange = (
    nextTab: SystemMonitorTab,
  ) => {
    setActiveTab(nextTab);
  };


  // ==========================================================
  // BACK TO TOP
  // ==========================================================

  const scrollToTop = () => {
    const target =
      scrollContainerRef.current;

    if (target) {
      target.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      return;
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  return (
    <section
      ref={monitorRef}
      className="relative space-y-1.5"
    >
      {/* ======================================================
          STICKY NAVIGATION
      ====================================================== */}

      <div className="sticky top-0 z-40 space-y-1.5 bg-background/95 pb-1.5 pt-0.5 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        {/* ====================================================
            TOP SECTION SWITCHER
        ==================================================== */}

        <div className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-card/90 p-1 shadow-sm">
          <button
            type="button"
            onClick={() =>
              handleSectionChange('system')
            }
            className={[
              'flex h-8 items-center justify-center gap-1.5 rounded-md px-2.5 text-[11px] font-semibold transition-colors',
              section === 'system'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
            ].join(' ')}
          >
            <Server className="h-3.5 w-3.5" />

            <span>
              System Data Management
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleSectionChange('sports')
            }
            className={[
              'flex h-8 items-center justify-center gap-1.5 rounded-md px-2.5 text-[11px] font-semibold transition-colors',
              section === 'sports'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
            ].join(' ')}
          >
            <Trophy className="h-3.5 w-3.5" />

            <span>
              Sports Data Management
            </span>
          </button>
        </div>


        {/* ====================================================
            CONTEXT TABS
        ==================================================== */}

        <div className="overflow-x-auto">
          <nav
            aria-label={
              section === 'system'
                ? 'System Data Management'
                : 'Sports Data Management'
            }
            className="flex min-w-max items-center gap-0.5 rounded-lg border border-border bg-card/90 p-0.5 shadow-sm"
          >
            {visibleTabs.map(tab => {
              const Icon =
                tab.icon;

              const active =
                activeTab ===
                tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    handleTabChange(
                      tab.id,
                    )
                  }
                  className={[
                    'flex h-7 items-center gap-1 rounded-md px-2 text-[10px] font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                  ].join(' ')}
                >
                  <Icon className="h-3 w-3 shrink-0" />

                  <span>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>


      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div>
        {/* SYSTEM */}

        {activeTab === 'overview' && (
          <SystemMonitorOverview />
        )}

        {activeTab === 'health' && (
          <SystemMonitorHealth />
        )}

        {activeTab === 'crons' && (
          <SystemMonitorCrons />
        )}

        {activeTab === 'errors' && (
          <SystemMonitorErrors />
        )}

        {activeTab === 'storage' && (
          <SystemMonitorStorage />
        )}


        {/* SPORTS */}

        {activeTab === 'sports-overview' && (
          <SystemMonitorSportsData />
        )}

        {activeTab === 'sports-competitions' && (
          <SystemMonitorCompetitions />
        )}

        {activeTab === 'sports-pipeline' && (
          <SystemMonitorPipeline />
        )}

        {activeTab === 'sports-queue' && (
          <SystemMonitorQueue />
        )}

        {activeTab === 'sports-sync' && (
          <SystemMonitorSync />
        )}

        {activeTab === 'sports-providers' && (
          <SystemMonitorProviders />
        )}

        {activeTab === 'sports-data' && (
          <SystemMonitorData />
        )}
      </div>


      {/* ======================================================
          BACK TO TOP
      ====================================================== */}

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
        className={[
          'fixed bottom-5 right-5 z-[60] flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-all duration-200 hover:bg-muted',
          showBackToTop
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0',
        ].join(' ')}
      >
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
    </section>
  );
}