import { h } from "vendor/preact";
import { AppBskyEmbedImages, AppBskyEmbedRecord, AppBskyActorDefs, AppBskyEmbedVideo, AppBskyEmbedExternal } from "vendor/@atproto/api";
import { PostView } from "./bluesky_api/post";

function renderAuthor(author: AppBskyActorDefs.ProfileViewBasic) {
    return (
        <div>
            {author.avatar && (
                <img
                    src={author.avatar}
                    width={26}
                    style={{ display: "inline", borderRadius: "50%" }}
                />
            )} {author.displayName} <code>@{author.handle}</code>
        </div>
    )
}

type PostProps = {
    post: PostView,
}

export function Post({ post }: PostProps) {
    return (
        <div style={{ marginBottom: "20px" }}>
            {renderAuthor(post.author)}
            {(post.record as any).text}
            {post.embed && ((() => {
                switch (post.embed.$type) {
                    case "app.bsky.embed.images#view": {
                        const embed: AppBskyEmbedImages.View = post.embed as any;
                        return (
                            <div style={{ margin: "5px", borderStyle: "solid", borderColor: "white", borderRadius: "6px", borderWidth: "1px" }}>
                                {embed.images.map(i => {
                                    return (
                                        <img
                                            src={i.fullsize}
                                            alt={i.alt}
                                            style={{ maxWidth: "250px", maxHeight: "250px" }}
                                        />
                                    );
                                })}
                            </div>
                        );
                    };
                    case "app.bsky.embed.record#view": {
                        const embed: AppBskyEmbedRecord.View = post.embed as any;
                        switch (embed.record.$type) {
                            case "app.bsky.embed.record#viewRecord": {
                                const embed2: AppBskyEmbedRecord.ViewRecord = embed.record as any;
                                return (
                                    <div style={{ margin: "5px", borderStyle: "solid", borderColor: "white", borderRadius: "6px", borderWidth: "1px" }}>
                                        {renderAuthor(embed2.author)}
                                        {(embed2.value as any).text}
                                    </div>
                                )
                            };
                            // allow fall-through for different record types
                        }
                    };
                    case "app.bsky.embed.video#view": {
                        const embed: AppBskyEmbedVideo.View = post.embed as any;
                        return (
                            <div style={{ margin: "5px", borderStyle: "solid", borderColor: "white", borderRadius: "6px", borderWidth: "1px" }}>
                                <div style={{ backgroundColor: "red" }}>VIDEO NOT YET SUPPORTED - SHOWING THUMBNAIL</div>
                                <img
                                    src={embed.thumbnail}
                                    alt={embed.alt}
                                    style={{ maxWidth: "250px", maxHeight: "250px" }}
                                />
                            </div>
                        );
                    };
                    case "app.bsky.embed.external#view": {
                        const embed: AppBskyEmbedExternal.View = post.embed as any;
                        return (
                            <div style={{ margin: "5px", borderStyle: "solid", borderColor: "white", borderRadius: "6px", borderWidth: "1px" }}>
                                <a href={embed.external.uri}>
                                    <div>{embed.external.title}</div>
                                    <div>{embed.external.description}</div>
                                </a>
                            </div>
                        )
                    };
                    default:
                        return (
                            <div style={{ backgroundColor: "red" }}>UNSUPPORTED EMBED TYPE {post.embed.$type}</div>
                        );
                }
            })())}
        </div>
    );
}
