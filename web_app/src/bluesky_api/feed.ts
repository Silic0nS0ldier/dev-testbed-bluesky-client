import type { Agent, AppBskyFeedDefs } from "vendor/@atproto/api";
import { errAsync, fromPromise, okAsync, type ResultAsync } from "vendor/neverthrow";

export type FeedViewPost = AppBskyFeedDefs.FeedViewPost

// TODO Add per-feed mutex to keep order correct

/**
 * Feed cursor, needed to fetch next chunk.
 * If unset, no more data can be retrieved. There is no defined meaning for this which means;
 * - It could indicate the feed is inherently unordered. Each request may return the same or different data.
 * - There are no more posts to show.
 * - It has not been implemented.
 * Note that cursors can only look "down" the feed.
 */
export type FeedCursor = string & { __FeedCursor: unknown };
export type FeedDID = string & { __FeedDID: unknown };

export type FeedChunk = {
    currentCursor?: FeedCursor,
    nextCursor?: FeedCursor,
    feed: FeedViewPost[],
};

const feedsStore = new Map<FeedDID, FeedChunk[]>();

function getFeedChunks(feedDid: FeedDID): FeedChunk[] {
    const feedChunks = feedsStore.get(feedDid) ?? [];
    feedsStore.set(feedDid, feedChunks);
    return feedChunks;
}

/**
 * Get data for the specified feed, pulling the first chunk stored locally (cache) otherwise fresh
 * data.
 * Wraps `app.bsky.feed.getFeed`.
 */
export function getFeed(feedDid: FeedDID, agent: Agent, abortSignal?: AbortSignal): ResultAsync<FeedChunk, Error> {
    const feedChunks = getFeedChunks(feedDid);

    // Try cache
    {
        const maybeFeedChunk = feedChunks[0];
        if (maybeFeedChunk) {
            return okAsync(maybeFeedChunk);
        }
    }

    // Perform lookup
    return fromPromise(
        agent.app.bsky.feed.getFeed({
            feed: feedDid,
            limit: 30,
        }, { signal: abortSignal }),
        (e) => new Error('Lookup failed.', { cause: e }),
    )
    .map((r) => {
        const nextCursor = r.data.cursor as FeedCursor;
        const feed = r.data.feed;
        const feedChunk: FeedChunk = {
            nextCursor,
            feed,
        }
        feedChunks.push(feedChunk);
        return feedChunk;
    });
}

export function getFeedNext(feedDid: FeedDID, cursor: FeedCursor, agent: Agent): ResultAsync<FeedChunk, Error> {
    const feedChunks = getFeedChunks(feedDid);

    // Find where new chunk should be added
    const maybePriorFeedChunkIndex = feedChunks.findIndex(c => c.nextCursor === cursor);
    if (maybePriorFeedChunkIndex === -1) {
        return errAsync(new Error('Cursor not yet seen, cannot determine where to place in store.'));
    }

    // Try cache
    {
        const maybeFeedChunk = feedChunks[maybePriorFeedChunkIndex + 1];
        if (maybeFeedChunk) {
            return okAsync(maybeFeedChunk);
        }
    }

    // Grab latest
    return getFeedLatest(feedDid, agent);
}

export function getFeedLatest(feedDid: FeedDID, agent: Agent): ResultAsync<FeedChunk, Error> {
    const feedChunks = getFeedChunks(feedDid);

    // Perform lookup
    return fromPromise(
        agent.app.bsky.feed.getFeed({
            feed: feedDid,
            limit: 30,
        }),
        (e) => new Error('Lookup failed.', { cause: e }),
    )
    .map((r) => {
        const nextCursor = r.data.cursor as FeedCursor;
        const feed = r.data.feed;
        const feedChunk: FeedChunk = {
            nextCursor,
            feed,
        }
        feedChunks.push(feedChunk);
        return feedChunk;
    });
}
