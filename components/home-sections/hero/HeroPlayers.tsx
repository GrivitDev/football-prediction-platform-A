'use client';

import Image from 'next/image';

import type {
  HeroPlayer,
} from './hero.types';

interface HeroPlayersProps {
  players: HeroPlayer[];
}

export default function HeroPlayers({
  players,
}: HeroPlayersProps) {
  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        z-20
        overflow-hidden
      "
    >
      {players.map(
        (
          player,
          index,
        ) => (
          <div
            key={
              player.id
            }
            className={`
              absolute
              ${player.className ?? ''}
            `}
          >
            {/* Player aura */}

            <div
              className="
                absolute
                inset-10
                rounded-full
                bg-primary/20
                blur-3xl

                dark:bg-primary/40
              "
            />

            {/* Player */}

            <div>
              <Image
                src={
                  player.image
                }
                alt={
                  player.alt
                }
                width={
                  player.width
                }
                height={
                  player.height
                }
                priority={
                  player.priority
                }
                className="
                  relative
                  h-auto
                  w-full
                  object-contain
                  drop-shadow-[0_30px_60px_rgba(0,0,0,0.35)]

                  dark:drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]
                "
              />
            </div>
          </div>
        ),
      )}
    </div>
  );
}