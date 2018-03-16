import { StoreState, Message, Page } from '../store';
import { Dispatch } from 'react-redux';
import actionCreatorFactory from 'typescript-fsa';
import { getPlayerInfo } from '../util';

const actionCreator = actionCreatorFactory();

export const gameJoin = actionCreator<{gameCode: string}>('GAME:JOIN');
export const gameReady = actionCreator<boolean>('GAME:READY');

export const pageChange = actionCreator<Page>('PAGE:CHANGE');

export const websocketSend = actionCreator<Message>('WEBSOCKET:SEND');
export const websocketConnect = actionCreator<{ messages?: Message[] }>('WEBSOCKET:CONNECT');
export const websocketDisconnect = actionCreator('WEBSOCKET:DISCONNECT');
export const websocketOpen = actionCreator('WEBSOCKET:OPEN');
export const websocketClose = actionCreator<{ event: Event }>('WEBSOCKET:CLOSE');
export const websocketMessage = actionCreator<{ event: MessageEvent }>('WEBSOCKET:MESSAGE');

export const joinGame = (gameCode: string) => {
    return (dispatch: Dispatch<StoreState>) => {
        const playerInfo = getPlayerInfo();
        if (playerInfo) {
            const { id: playerId, username } = playerInfo;

            dispatch(gameJoin({ gameCode }));
            // tslint:disable-next-line
            console.log(gameCode);
            dispatch(websocketConnect({
                messages: [{ type: 'GAME:JOIN', gameCode, playerId, payload: { username } }],
            }));
            dispatch(pageChange(Page.LOBBY));
        }
    };
};

export const newGame = () => {
    return (dispatch: Dispatch<StoreState>) => {
        return fetch('http://localhost:5000/new')
            .then((resp: Response) => resp.json())
            .then((json) => {
                const { gameCode } = json;
                dispatch(joinGame(gameCode));
                // dispatch(gameJoin({ gameCode }));
            });
    };
};

export const readyGame = (isReady: boolean) => {
    return (dispatch: Dispatch<StoreState>, getState: () => StoreState) => {
        dispatch(websocketSend({
            type: 'GAME:READY',
            gameCode: getState().game.gameCode,
            playerId: getPlayerInfo().id,
            payload: { isReady },
        }));
        dispatch(gameReady(isReady));
    };
};

export const changePage = (page: Page) => {
    return (dispatch: Dispatch<StoreState>) => {
        dispatch(pageChange(page));
    }
}