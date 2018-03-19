import { Action } from "redux";
import {
  IGenericMessage,
  messageIsErrorMessage,
  messageIsInfoMessage,
  MessageType,
} from "teledoodles-lib";
import { isType } from "typescript-fsa";
import { websocketMessage } from "../actions";
import { WebsocketStatus } from "../store";
import initialState from "./initialState";

const errors = (state: string[] = initialState.errors, action: Action): string[] => {
  if (isType(action, websocketMessage)) {
    const parsed: IGenericMessage = JSON.parse(action.payload.event.data);
    if (messageIsErrorMessage(parsed)) {
      return [...state, parsed.payload.error];
    }
  }

  return state;
};

export default errors;
