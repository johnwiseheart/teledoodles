import { Router } from 'react-router';
import { WebsocketStatus, Page, StoreState } from '../store';
import { TurnType } from 'teledoodles-lib';

// tslint:disable
const initialState: StoreState = {
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