'use client';

import {
  CheckCircle2,
  MessageCircle,
  ShieldAlert,
  Target,
  Trophy,
  Users,
  XCircle,
} from 'lucide-react';

const allowedRules = [
  {
    icon: MessageCircle,
    title: 'Match Discussions',
    description:
      'Share thoughts about upcoming matches and football events.',
  },
  {
    icon: Target,
    title: 'Prediction Opinions',
    description:
      'Explain your match predictions and the reasoning behind them.',
  },
  {
    icon: Trophy,
    title: 'Team Analysis',
    description:
      'Discuss tactics, players, form, and team performance.',
  },
  {
    icon: Users,
    title: 'Football Experiences',
    description:
      'Share your football journey and experiences with other fans.',
  },
];

const blockedRules = [
  {
    title: 'Insults or Harassment',
    description:
      'Treat every member of the community with respect.',
  },
  {
    title: 'Hate Speech',
    description:
      'Discrimination or hateful content of any kind is not allowed.',
  },
  {
    title: 'Spam Content',
    description:
      'Avoid repeated posts, unwanted promotions, or unrelated content.',
  },
  {
    title: 'Betting Scams',
    description:
      'Do not share misleading betting offers or fraudulent schemes.',
  },
];

export default function CommunityGuidelinesContent() {
  return (
    <section
      className="
        px-4
        py-8
        sm:px-6
        sm:py-10
      "
    >
      {/* HEADER */}

      <div
        className="
          mx-auto
          max-w-2xl
          text-center
        "
      >
        <div
          className="
            mx-auto
            flex
            w-fit
            items-center
            gap-2
            rounded-full
            border
            border-border
            bg-muted/50
            px-3
            py-1.5
            text-xs
            font-medium
            text-muted-foreground
          "
        >
          <ShieldAlert
            className="
              size-4
              text-primary
            "
            aria-hidden="true"
          />

          Community Guidelines
        </div>

        <h2
          className="
            mt-5
            text-2xl
            font-bold
            tracking-tight
            text-foreground
            sm:text-3xl
          "
        >
          Respect the game.
          <span
            className="
              block
              text-primary
            "
          >
            Respect the community.
          </span>
        </h2>

        <p
          className="
            mx-auto
            mt-4
            max-w-xl
            text-sm
            leading-6
            text-muted-foreground
            sm:text-base
          "
        >
          Help us keep the PredictPro community
          competitive, welcoming, and enjoyable
          for every football fan.
        </p>
      </div>

      {/* GUIDELINES */}

      <div
        className="
          mt-8
          grid
          gap-5
          lg:grid-cols-2
        "
      >
        {/* ALLOWED */}

        <section
          className="
            rounded-2xl
            border
            border-border
            bg-card
            p-5
            sm:p-6
          "
        >
          <div
            className="
              mb-5
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                size-9
                items-center
                justify-center
                rounded-lg
                bg-primary/10
                text-primary
              "
            >
              <CheckCircle2
                className="size-5"
                aria-hidden="true"
              />
            </div>

            <div>
              <h3
                className="
                  text-base
                  font-semibold
                "
              >
                What you can share
              </h3>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-muted-foreground
                "
              >
                Football content we encourage
              </p>
            </div>
          </div>

          <div
            className="
              divide-y
              divide-border
            "
          >
            {allowedRules.map((rule) => {
              const Icon = rule.icon;

              return (
                <div
                  key={rule.title}
                  className="
                    flex
                    gap-3
                    py-4
                    first:pt-0
                    last:pb-0
                  "
                >
                  <Icon
                    className="
                      mt-0.5
                      size-4
                      shrink-0
                      text-primary
                    "
                    aria-hidden="true"
                  />

                  <div>
                    <h4
                      className="
                        text-sm
                        font-semibold
                      "
                    >
                      {rule.title}
                    </h4>

                    <p
                      className="
                        mt-1
                        text-sm
                        leading-5
                        text-muted-foreground
                      "
                    >
                      {rule.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* NOT ALLOWED */}

        <section
          className="
            rounded-2xl
            border
            border-border
            bg-card
            p-5
            sm:p-6
          "
        >
          <div
            className="
              mb-5
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                size-9
                items-center
                justify-center
                rounded-lg
                bg-destructive/10
                text-destructive
              "
            >
              <XCircle
                className="size-5"
                aria-hidden="true"
              />
            </div>

            <div>
              <h3
                className="
                  text-base
                  font-semibold
                "
              >
                What we don&apos;t allow
              </h3>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-muted-foreground
                "
              >
                Content that harms the community
              </p>
            </div>
          </div>

          <div
            className="
              divide-y
              divide-border
            "
          >
            {blockedRules.map((rule) => (
              <div
                key={rule.title}
                className="
                  py-4
                  first:pt-0
                  last:pb-0
                "
              >
                <h4
                  className="
                    text-sm
                    font-semibold
                  "
                >
                  {rule.title}
                </h4>

                <p
                  className="
                    mt-1
                    text-sm
                    leading-5
                    text-muted-foreground
                  "
                >
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}