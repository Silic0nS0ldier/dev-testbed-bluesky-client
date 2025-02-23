import { render, h } from "vendor/preact";
import { App } from "./app.js";

render(h(App, null), document.getElementById("app")!);
