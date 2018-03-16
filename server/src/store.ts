import * as events from "events";

import { IGame, LISTENER_EVENT } from "teledoodles-lib";

export interface IStoreState {
    games: { [gameCode: string]: IGame };
    players: { [playerId: string]: WebSocket };
}

export interface IListenerEvent {
    type: string;
    playerId: string;
    // tslint:disable-next-line
    payload: any;
}

export interface IGameEvent extends IListenerEvent {
    gameCode: string;
}

// tslint:disable-next-line
export const eventIsGameEvent = (event: any): event is IGameEvent => {
    return event.type.startsWith("GAME:");
};

// export type SetState = (newState: Partial<StoreState>) => void;

export type Listener = (state: IStoreState, event: IListenerEvent) => IStoreState;

export interface IListenerInfo { type: string; listener: Listener; }

export const configureStore = (initState: IStoreState, listeners: Listener[]) => {
    const eventEmitter = new events.EventEmitter();

    let state: IStoreState = initState;

    listeners.forEach((listener) => {
        eventEmitter.on(LISTENER_EVENT, (data) => {
            const newState = listener(state, data);
            state = newState;
        });
    });

    return {
        dispatch: (event: IListenerEvent) => {
            return eventEmitter.emit(LISTENER_EVENT, event);
        },
    };
};

export const initialState: IStoreState = {
    games: {},
    players: {},
};
