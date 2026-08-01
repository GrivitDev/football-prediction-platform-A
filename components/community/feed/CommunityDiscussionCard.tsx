'use client';

import {
  motion,
} from 'framer-motion';

import type {
  CommunityPost,
  CommunityReply,
} from '@/services/community.service';

import CommunityReactionBar from '../reactions/CommunityReactionBar';
import ReplySection from '../replies/ReplySection';

interface Props {
  post: CommunityPost;

  onReact: (
    id: string,
    reaction: string,
  ) => void;

  replies: CommunityReply[];

  repliesLoading: boolean;

  loadReplies: () => Promise<void>;

  createReply: (
    message: string,
  ) => Promise<void>;
}

export default function CommunityDiscussionCard({
  post,
  onReact,
  replies,
  repliesLoading,
  loadReplies,
  createReply,
}: Props) {
  const displayName =
    post.fullName?.trim() ||
    post.username;

  const initial =
    displayName
      ?.charAt(0)
      .toUpperCase() || '?';

  return (
    <motion.article
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
        p-4
        shadow-sm
        transition-colors
        hover:border-primary/20
        sm:p-5
      "
    >
      {/* USER */}

      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            flex
            size-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-primary/10
            text-sm
            font-semibold
            text-primary
            sm:size-11
          "
          aria-hidden="true"
        >
          {initial}
        </div>

        <div
          className="
            min-w-0
          "
        >
          <p
            className="
              truncate
              text-sm
              font-semibold
              text-foreground
            "
          >
            {displayName}
          </p>

          <p
            className="
              truncate
              text-xs
              text-muted-foreground
            "
          >
            @{post.username}
          </p>
        </div>
      </div>

      {/* TITLE */}

      {post.title?.trim() && (
        <h3
          className="
            mt-5
            text-lg
            font-semibold
            leading-snug
            tracking-tight
            text-foreground
            sm:text-xl
          "
        >
          {post.title}
        </h3>
      )}

      {/* MESSAGE */}

      <p
        className="
          mt-3
          whitespace-pre-wrap
          text-sm
          leading-6
          text-muted-foreground
          sm:text-base
        "
      >
        {post.message}
      </p>

      {/* REACTIONS */}

      <CommunityReactionBar
        reactions={post.reactions}
        onReact={(reaction) =>
          onReact(
            post._id,
            reaction,
          )
        }
      />

      {/* REPLIES */}

      <ReplySection
        replyCount={
          post.replyCount
        }
        replies={replies}
        loading={
          repliesLoading
        }
        loadReplies={
          loadReplies
        }
        createReply={
          createReply
        }
      />
    </motion.article>
  );
}