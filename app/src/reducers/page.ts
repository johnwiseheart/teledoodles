import { Action } from "redux";
import { isType } from "typescript-fsa";
import { gameJoin, pageChange, websocketClose, websocketConnect, websocketMessage, websocketOpen } from "../actions";
import { Page, WebsocketStatus } from "../store";
import initialState from "./initialState";

const page = (state: Page = initialState.page, action: Action): Page => {
  if (isType(action, pageChange)) {
    return action.payload;
  }

  return state;
};

export default page;
