import * as events from 'events';

import { Game, LISTENER_EVENT } from 'teledoodles-lib';

export interface StoreState {
    games: { [gameCode: string]: Game };
    players: { [playerId: string]: WebSocket };
}

export interface ListenerEvent {
    type: string;
    playerId: string;
    // tslint:disable-next-line
    payload: any;
}

export interface GameEvent extends ListenerEvent {
    gameCode: string;
}

// tslint:disable-next-line
export const eventIsGameEvent = (event: any): event is GameEvent => {
    return event.type.startsWith('GAME:');
};

// export type SetState = (newState: Partial<StoreState>) => void;

export type Listener = (state: StoreState, event: ListenerEvent) => StoreState;

export type ListenerInfo = { type: string, listener: Listener };

export const configureStore = (initState: StoreState, listeners: Listener[]) => {
    const eventEmitter = new events.EventEmitter();

    let state: StoreState = initState;

    listeners.forEach(listener => {
        eventEmitter.on(LISTENER_EVENT, (data) => {
            const newState = listener(state, data);
            state = newState;
        });
    });

    return {
        dispatch: (event: ListenerEvent) => {
            return eventEmitter.emit(LISTENER_EVENT, event);
        }
    };
};

export const initialState: StoreState = {
    games: {},
    players: {}
};