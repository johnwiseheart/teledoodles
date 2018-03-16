import { Router } from 'react-router';
import { Game, GenericMessage } from "teledoodles-lib";

export interface GameJoinMessage extends GenericMessage {
    type: 'GAME:JOIN';
    payload: {
        username: string;
    };
}

export interface GameReadyMessage extends GenericMessage {
    type: 'GAME:READY';
    payload: {
        isReady: boolean;
    };
}

export type Message =
    | GameJoinMessage
    | GameReadyMessage;

export enum WebsocketStatus {
    CLOSED = 'CLOSED',
    OPENING = 'OPENING',
    OPEN = 'OPEN',
}

export enum Page {
    HOME = 'HOME',
    LOBBY = 'LOBBY',
    CHOOSE_WORD = 'CHOOSE_WORD',
    DOODLE_WORD = 'DOODLE_WORD',
    GUESS_DOODLE = 'GUESS_DOODLE',
    END = 'END',
}

export interface StoreState {
    game: Game;
    router: Router;
    websocketStatus: WebsocketStatus;
    page: Page;
}