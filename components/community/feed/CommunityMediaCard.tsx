'use client';

import {
  motion,
} from 'framer-motion';

import type {
  CommunityPost,
  CommunityReply,
} from '@/services/community.service';

import ReplySection from '../replies/ReplySection';
import CommunityReactionBar from '../reactions/CommunityReactionBar';

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

export default function CommunityMediaCard({
  post,
  onReact,
  replies,
  repliesLoading,
  loadReplies,
  createReply,
}: Props) {

  const mediaType =
    post.media?.type;

  const hasMedia =
    Boolean(
      post.media?.url,
    );


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
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-card
        shadow-sm
      "
    >

      {
        hasMedia && (

          <div
            className="
              overflow-hidden
              bg-muted
            "
          >

            {
              mediaType === 'video'

                ? (

                  <video
                    src={
                      post.media?.url
                    }
                    controls
                    playsInline
                    preload="metadata"
                    className="
                      block
                      max-h-[600px]
                      w-full
                      object-contain
                    "
                  />

                )

                : (

                  <img
                    src={
                      post.media?.url
                    }
                    alt="
                      Media shared by the community
                    "
                    loading="lazy"
                    decoding="async"
                    className="
                      block
                      max-h-[600px]
                      w-full
                      object-contain
                      transition-transform
                      duration-300
                      hover:scale-[1.01]
                    "
                  />

                )
            }

          </div>

        )
      }


      <div
        className="
          space-y-3
          p-4
          sm:p-5
        "
      >

        {
          post.message?.trim() && (

            <p
              className="
                whitespace-pre-wrap
                text-sm
                leading-6
                text-foreground
                sm:text-base
              "
            >
              {post.message}
            </p>

          )
        }


        <p
          className="
            text-xs
            font-medium
            text-muted-foreground
          "
        >
          @{post.username}
        </p>

      </div>


      <CommunityReactionBar
        reactions={
          post.reactions
        }
        onReact={
          (reaction) =>
            onReact(
              post._id,
              reaction,
            )
        }
      />


      <ReplySection
        replyCount={
          post.replyCount
        }
        replies={
          replies
        }
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