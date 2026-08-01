'use client';

import {
  motion,
} from 'framer-motion';

import {
  MessageCircle,
} from 'lucide-react';

export default function CommunityEmptyState() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        rounded-2xl
        border
        border-border
        bg-card
        p-6
        text-center
        shadow-sm
        sm:p-8
      "
    >
      <div
        className="
          mx-auto
          mb-4
          flex
          size-11
          items-center
          justify-center
          rounded-full
          bg-primary/10
          text-primary
        "
        aria-hidden="true"
      >
        <MessageCircle className="size-5" />
      </div>

      <h3
        className="
          text-lg
          font-semibold
          tracking-tight
          text-foreground
          sm:text-xl
        "
      >
        No football conversations yet
      </h3>

      <p
        className="
          mx-auto
          mt-2
          max-w-sm
          text-sm
          leading-6
          text-muted-foreground
        "
      >
        Be the first fan to share your thoughts
        and start the conversation.
      </p>
    </motion.div>
  );
}