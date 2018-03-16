import * as classNames from "classnames";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { IPlayer } from "teledoodles-lib";
import { joinGame, readyGame as readyGameAction } from "../../actions";
import { IStoreState, WebsocketStatus } from "../../store";
import { Button } from "../Button/Button";
import "./Lobby.scss";

interface ILobbyRouteOwnProps extends RouteComponentProps< { gameCode: string} > {

}

interface ILobbyRouteStateProps {
    gameCode: string;
    players: { [id: string]: IPlayer };
    websocketStatus: WebsocketStatus;
}

interface ILobbyRouteDispatchProps {
    joinGame: (gameCode: string) => void;
    readyGame: (isReady: boolean) => void;
}

type LobbyRouteProps = ILobbyRouteOwnProps & ILobbyRouteStateProps & ILobbyRouteDispatchProps;

interface ILobbyRouteState {
    isReady: boolean;
}

class UnconnectedLobbyRoute extends React.Component<LobbyRouteProps, ILobbyRouteState> {
    public state: ILobbyRouteState = {
        isReady: false,
    };

    public componentDidMount() {
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

        const readyText = isReady ? "Ready to Play" : "Not Ready";
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
            .map((key) => players[key])
            .filter((player) => player.isReady === isReady);
    }

    private renderPlayers = (players: IPlayer[]) => {
        return Object.keys(players)
            .map((key) => players[key])
            .map((player) => {
                const className = classNames("player", {
                    "not-ready": !player.isReady,
                    "ready": player.isReady,
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

const mapStateToProps = (state: IStoreState): ILobbyRouteStateProps => {
    return {
        gameCode: state.game.gameCode,
        players: state.game.players,
        websocketStatus: state.websocketStatus,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<IStoreState>): ILobbyRouteDispatchProps => {
    return {
        joinGame: (gameCode: string) => dispatch(joinGame(gameCode)),
        readyGame: (isReady: boolean) => dispatch(readyGameAction(isReady)),
    };
};

export const LobbyRoute = connect<
    ILobbyRouteStateProps,
    ILobbyRouteDispatchProps,
    ILobbyRouteOwnProps
>(mapStateToProps, mapDispatchToProps)(UnconnectedLobbyRoute);
