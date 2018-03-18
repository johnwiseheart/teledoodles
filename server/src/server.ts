import * as cors from "@koa/cors";
import * as Koa from "koa";
import * as koaBody from "koa-body";
import * as Router from "koa-router";

import { configureStore, initialState } from "./store";
import { makeId } from "./utils";

// tslint:disable-next-line
const websockify = require("koa-websocket");

const app = websockify(new Koa());
const router = new Router();
app.use(koaBody());
app.use(cors());

const store = configureStore(initialState);

router.get("/ws", async ctx => {
  ctx.websocket.on("message", (message: string) => {
    // tslint:disable-next-line
    console.log(message);
    const parsed = JSON.parse(message);
    store.dispatch({
      gameCode: parsed.gameCode,
      payload: ctx.websocket,
      playerId: parsed.playerId,
      type: "PLAYER:WEBSOCKET:SET"
    });
    store.dispatch(parsed);
  });
});

router.get("/new", async ctx => {
  const gameCode = makeId();

  ctx.body = {
    gameCode
  };
});

app.use(router.routes());

app.ws.use(router.routes());

app.listen(5000);
// tslint:disable-next-line
console.log("Server running on port 5000");
