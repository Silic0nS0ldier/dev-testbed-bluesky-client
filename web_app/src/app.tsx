import { h, Fragment } from "vendor/preact";
import { useEffect, useState } from "vendor/preact/hooks";
import { Agent } from "vendor/@atproto/api";
import { FeedDID, FeedViewPost, getFeed } from "./bluesky_api/feed";
import { Post } from "./post";

const agent = new Agent({ fetchHandler: (input, init) => {
    return fetch("https://api.bsky.app" + input, init);
}});

export function App() {
    const [feedPosts, setFeedPosts] = useState<FeedViewPost[]>([]);

    // Runs requests, intentionally excludes dependency on data-setter to avoid unnecessary reruns
    // This is hacky and should be later refactored
    useEffect(() => {
        const aborter = new AbortController();

        (async () => {
            const result = await getFeed(
                "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot" as FeedDID,
                agent,
                aborter.signal
            );
            result.match(
                v => setFeedPosts(v.feed),
                err => {},
            );
        })();

        return () => aborter.abort("tearing down effect");
    });

    return (
        <>
            {feedPosts.map(p => {
                return <Post post={p.post} />;
            })}
        </>
    );
}
