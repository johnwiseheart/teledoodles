import * as React from 'react';
import { Button } from '../Button/Button';
import './PlayerInfo.scss';
import { Input } from '../Input/Input';
import { uuidv4, getPlayerInfo } from '../../util';
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../../store';
import { push as historyPush } from 'react-router-redux';

export interface PlayerInfoRouteOwnProps {}

export interface PlayerInfoRouteStateProps {}

export interface PlayerInfoRouteDispatchProps {
    push: (route: string) => void;
}

export type PlayerInfoRouteProps = PlayerInfoRouteOwnProps & PlayerInfoRouteStateProps & PlayerInfoRouteDispatchProps;

interface PlayerInfoRouteState {
    name: string;
}

class UnconnectedPlayerInfoRoute extends React.Component<PlayerInfoRouteProps, PlayerInfoRouteState> {
    public state: PlayerInfoRouteState = {
        name: '',
    };

    componentDidMount() {
        if (getPlayerInfo() != null) {
            this.pushToHome();
        }
    }

    public render() {
        const { name } = this.state;
        return (
            <div className="player">
                <h1>Player Name</h1>
                <Input value={name} onChange={this.handleNameChange} />
                <Button text="Submit" onClick={this.handleSubmit} />
            </div>
        );
    }

    private handleNameChange = (name: string) => {
        this.setState({ name });
    }

    private handleSubmit = () => {
        const { name } = this.state;
        if (name.length > 0) {
            localStorage.setItem('player', JSON.stringify({
                username: name,
                id: uuidv4(),
            }));
            this.pushToHome();
        }
    }

    private pushToHome = () => {
        const { push } = this.props;
        push('/');
    }
}

const mapStateToProps = (state: StoreState) => {
    return {};
};

const mapDispatchToProps = (dispatch: Dispatch<StoreState>) => {
    return {
        push: (route: string) => dispatch(historyPush(route)),
    };
};

export const PlayerInfoRoute = connect<
PlayerInfoRouteStateProps, PlayerInfoRouteDispatchProps, PlayerInfoRouteOwnProps
>(mapStateToProps, mapDispatchToProps)(UnconnectedPlayerInfoRoute);