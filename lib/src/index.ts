export interface IGenericMessage {
  gameCode: string;
  playerId: string;
}

export interface IPlayer {
  username: string;
  id: string;
  isReady: boolean;
}

export const LISTENER_EVENT = "LISTENER_EVENT";

export enum TurnType {
  LOBBY = "LOBBY",
  CHOOSE_WORD = "CHOOSE_WORD",
  DOODLE_WORD = "DOODLE_WORD",
  GUESS_DOODLE = "GUESS_DOODLE",
  END = "END"
}

export interface IGame {
  gameCode: string;
  players: { [id: string]: IPlayer };
  turnType: TurnType;
}
