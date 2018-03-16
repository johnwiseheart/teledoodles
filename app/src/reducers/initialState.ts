import { Router } from "react-router";
import { TurnType } from "teledoodles-lib";
import { IStoreState, Page, WebsocketStatus } from "../store";

// tslint:disable
const initialState: IStoreState = {
    game: {
        gameCode: '',
        players: {},
        turnType: undefined,
    },
    router: {} as Router,
    websocketStatus: WebsocketStatus.CLOSED,
    page: Page.HOME,
};

export default initialState;