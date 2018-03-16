import * as React from 'react';
import * as classNames from 'classnames';
import { RouteComponentProps } from 'react-router';
import { Button } from '../Button/Button';
import { connect, Dispatch } from 'react-redux';
import { joinGame, readyGame as readyGameAction } from '../../actions';
import { StoreState, WebsocketStatus } from '../../store';
import { Player } from "teledoodles-lib";
import './Lobby.scss';

interface LobbyRouteOwnProps extends RouteComponentProps< { gameCode: string} > {

}

interface LobbyRouteStateProps {
    gameCode: string;
    players: { [id: string]: Player };
    websocketStatus: WebsocketStatus;
}

interface LobbyRouteDispatchProps {
    joinGame: (gameCode: string) => void;
    readyGame: (isReady: boolean) => void;
}

type LobbyRouteProps = LobbyRouteOwnProps & LobbyRouteStateProps & LobbyRouteDispatchProps;

interface LobbyRouteState {
    isReady: boolean;
}

class UnconnectedLobbyRoute extends React.Component<LobbyRouteProps, LobbyRouteState> {
    public state: LobbyRouteState = {
        isReady: false,
    };

    componentDidMount() {
        const { match, websocketStatus } = this.props;
        // if the websocket is closed at this point, the user has
        // entered the lobby directly, so we need to start the game here
        if (websocketStatus === WebsocketStatus.CLOSED) {
            this.props.joinGame(match.params.gameCode);
        }
    }

    public render() {
        // TODO: loading until websocket connected
        const { isReady } = this.state;
        const { gameCode } = this.props;

        const readyText = isReady ? 'Ready to Play' : 'Not Ready';
        return (
            <div className="lobby">
                <h2>Lobby {gameCode}</h2>
                <p>All players must be ready to start the game.</p>
                <p>There must be atleast 4 players to start the game.</p>
                <div className="lobby-players">
                    <fieldset name="Not ready">
                        <legend>Not ready</legend>
                        {this.renderPlayers(this.getPlayersLeft(false))}
                    </fieldset>
                    <fieldset name="ready">
                        <legend>Ready</legend>
                        {this.renderPlayers(this.getPlayersLeft(true))}
                    </fieldset>
                </div>
                <Button text={readyText} selected={isReady} onClick={this.toggleReady} />
            </div>
        );
    }

    private getPlayersLeft = (isReady: boolean) => {
        const { players } = this.props;

        return Object.keys(players)
            .map(key => players[key])
            .filter(player => player.isReady === isReady);
    }

    private renderPlayers = (players: Player[]) => {
        return Object.keys(players)
            .map(key => players[key])
            .map(player => {
                const className = classNames('player', {
                    'ready': player.isReady,
                    'not-ready': !player.isReady
                });
                return (
                    <div key={player.id} className={className}>
                        {player.username}
                    </div>
                );
            });
    }

    private toggleReady = () => {
        const { isReady } = this.state;
        const { readyGame } = this.props;
        this.setState({ isReady: !isReady });
        readyGame(!isReady);
    }
}

const mapStateToProps = (state: StoreState): LobbyRouteStateProps => {
    return {
        gameCode: state.game.gameCode,
        players: state.game.players,
        websocketStatus: state.websocketStatus,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<StoreState>): LobbyRouteDispatchProps => {
    return {
        joinGame: (gameCode: string) => dispatch(joinGame(gameCode)),
        readyGame: (isReady: boolean) => dispatch(readyGameAction(isReady)),
    };
};

export const LobbyRoute = connect<
    LobbyRouteStateProps,
    LobbyRouteDispatchProps,
    LobbyRouteOwnProps
>(mapStateToProps, mapDispatchToProps)(UnconnectedLobbyRoute);