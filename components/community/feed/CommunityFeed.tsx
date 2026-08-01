'use client';

import type {
  CommunityPost,
  CommunityReply,
} from '@/services/community.service';

import {
  CommunityPostType,
} from '@/services/community.service';

import CommunityDiscussionCard from './CommunityDiscussionCard';
import CommunityMediaCard from './CommunityMediaCard';
import CommunityCardSkeleton from './CommunityCardSkeleton';
import CommunityEmptyState from './CommunityEmptyState';

interface Props {
  posts: CommunityPost[];

  loading: boolean;

  replies: Record<
    string,
    CommunityReply[]
  >;

  repliesLoading: Record<
    string,
    boolean
  >;

  loadReplies: (
    id: string,
  ) => Promise<void>;

  createReply: (
    id: string,
    message: string,
  ) => Promise<void>;

  onReact: (
    id: string,
    reaction: string,
  ) => void;
}

export default function CommunityFeed({
  posts,
  loading,
  replies,
  repliesLoading,
  loadReplies,
  createReply,
  onReact,
}: Props) {
  if (loading) {
    return (
      <div
        className="
          space-y-5
          sm:space-y-6
        "
        aria-label="Loading community posts"
      >
        {Array.from({
          length: 3,
        }).map((_, index) => (
          <CommunityCardSkeleton
            key={`community-skeleton-${index}`}
          />
        ))}
      </div>
    );
  }

  if (!posts.length) {
    return (
      <CommunityEmptyState />
    );
  }

  return (
    <div
      className="
        space-y-5
        sm:space-y-6
      "
    >
      {posts.map((post) => {
        const postReplies =
          replies[post._id] ?? [];

        const isRepliesLoading =
          repliesLoading[post._id] ?? false;

        const handleLoadReplies =
          () =>
            loadReplies(
              post._id,
            );

        const handleCreateReply =
          (message: string) =>
            createReply(
              post._id,
              message,
            );

        const handleReact =
          (reaction: string) =>
            onReact(
              post._id,
              reaction,
            );

        if (
          post.type ===
          CommunityPostType.MEDIA
        ) {
          return (
            <CommunityMediaCard
              key={post._id}
              post={post}
              onReact={handleReact}
              replies={postReplies}
              repliesLoading={
                isRepliesLoading
              }
              loadReplies={
                handleLoadReplies
              }
              createReply={
                handleCreateReply
              }
            />
          );
        }

        return (
          <CommunityDiscussionCard
            key={post._id}
            post={post}
            onReact={handleReact}
            replies={postReplies}
            repliesLoading={
              isRepliesLoading
            }
            loadReplies={
              handleLoadReplies
            }
            createReply={
              handleCreateReply
            }
          />
        );
      })}
    </div>
  );
}