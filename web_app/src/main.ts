import { render, h } from "vendor/preact";
import { App } from "./app.js";

render(h(App, null), document.getElementById("app")!);

import { Agent } from "vendor/@atproto/api";
import { type FeedDID, getFeed } from "./bluesky_api/feed.js";

const agent = new Agent({ fetchHandler: (input, init) => {
    return fetch("https://api.bsky.app" + input, init);
}});

const result = await getFeed(
    "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot" as FeedDID,
    agent,
);

// const result = await agent.app.bsky.feed.getFeed({
//     feed: ,
//     cursor: "eyJvIjoiMjAyNC0xMC0wNlQyMDo0OTozMS4wNTAzOTExNjlaIiwibiI6IjIwMjQtMTAtMDdUMDg6NDk6MzEuMDUwMzkxMTY5WiIsImYiOjAsImMiOjAsInAiOjAsInRzIjowLCJwZyI6MCwicyI6Wzk4MTg5ODA2NCw5ODAxMDg3NjgsOTgxNzI2NjU0LDk4MTczMDYwMyw5ODE1NDEyNTAsOTgxODQ1MTM2LDk4MTc3NDY5NSw5ODE3MDUyMzMsOTgxNjAyNTUxLDk3ODczNjM3Miw5ODA5MTQyNjYsOTgwNzcwMDEwLDk4MTUxODc0Miw5ODExMDA0NzgsOTgxMzUzMDUyLDk4MTEyOTE2Miw5ODEzMjQ4OTgsOTgxNzE3NzI4LDk4MDI3NzE5NSw5ODEyNjAyMTIsOTgxMzI1NTUyLDk4MTc2Mzk2Miw5Nzk2ODk4NDksOTc3MjIwOTk4LDk4MTA0NDM0MCw5ODE1NjU4NDMsOTgwMzg5NDEzLDk4MDc3MjI5OCw5ODE4MzU1ODMsOTc5NjA2MDAxXX0=",
//     //       eyJvIjoiMjAyNC0xMC0wNlQyMDo1MDoyNS42NDk4MjE1WiIsIm4iOiIyMDI0LTEwLTA3VDA4OjUwOjI1LjY0OTgyMTVaIiwiZiI6MCwiYyI6MCwicCI6MCwidHMiOjAsInBnIjowLCJzIjpbOTgwODkwNzY1LDk4MDk0NTI0OSw5ODEwMTMxMTcsOTgxMDM1ODU2LDk4MTExNTYwNiw5ODExMjkxNjIsOTgxMTM3NDIwLDk4MTE4NDY1MSw5ODEyMjQ0NzQsOTgxMzMxODA2LDk4MTMzMjA5NSw5ODEzOTQ5MTIsOTgxNDAwODE0LDk4MTQxMTM1Niw5ODE0MjIzODAsOTgxNDYzNzgzLDk4MTQ2NDczNSw5ODE0NzIyNzIsOTgxNDc1NTgxLDk4MTUwMjgzOSw5ODE1MDU2NzYsOTgxNTEzMDE1LDk4MTUzNDI2Miw5ODE1NjI1ODIsOTgxNTY1ODQzLDk4MTYwMjU1MSw5ODE2MDUyMTQsOTgxNjI1Nzk3LDk4MTc2Mzk2Miw5ODE4MzU1ODMsOTgxODk4MDY0LDk4MTkxNDI4NSw5ODAxMDg3NjgsOTgxNzI2NjU0LDk4MTczMDYwMyw5ODE1NDEyNTAsOTgxODQ1MTM2LDk4MTc3NDY5NSw5ODE3MDUyMzMsOTc4NzM2MzcyLDk4MDkxNDI2Niw5ODA3NzAwMTAsOTgxMTAwNDc4LDk4MTUxODc0Miw5ODEzNTMwNTIsOTgxMzI0ODk4LDk4MTcxNzcyOCw5ODAyNzcxOTUsOTgxMjYwMjEyLDk4MTMyNTU1Miw5Nzk2ODk4NDksOTc3MjIwOTk4LDk4MTA0NDM0MCw5ODAzODk0MTMsOTgwNzcyMjk4LDk3OTYwNjAwMSw5ODE3NDc2ODEsOTgxMTY2MzEwLDk4MTExMzc1Niw5ODE1MTQzMTNdfQ==
//     limit: 30,
// })
console.log(result);
