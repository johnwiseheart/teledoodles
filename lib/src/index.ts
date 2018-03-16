export interface GenericMessage {
    gameCode: string;
    playerId: string;
}

export interface Player {
    username: string;
    id: string;
    isReady: boolean;
}

export const LISTENER_EVENT = 'LISTENER_EVENT';

export enum TurnType {
    LOBBY = 'LOBBY',
    CHOOSE_WORD = 'CHOOSE_WORD',
    DOODLE_WORD = 'DOODLE_WORD',
    GUESS_DOODLE = 'GUESS_DOODLE',
    END = 'END',
}

export interface Game {
    gameCode: string;
    players: { [id: string]: Player };
    turnType: TurnType;
}