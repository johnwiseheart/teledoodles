import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { push as historyPush } from "react-router-redux";
import { IStoreState } from "../../store";
import { getPlayerInfo, uuidv4 } from "../../util";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import "./PlayerInfo.scss";

export interface IPlayerInfoRouteDispatchProps {
    push: (route: string) => void;
}

export type IPlayerInfoRouteProps = IPlayerInfoRouteDispatchProps;

interface IPlayerInfoRouteState {
    name: string;
}

class UnconnectedPlayerInfoRoute extends React.Component<IPlayerInfoRouteProps, IPlayerInfoRouteState> {
    public state: IPlayerInfoRouteState = {
        name: "",
    };

    public componentDidMount() {
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
            localStorage.setItem("player", JSON.stringify({
                id: uuidv4(),
                username: name,
            }));
            this.pushToHome();
        }
    }

    private pushToHome = () => {
        const { push } = this.props;
        push("/");
    }
}

const mapStateToProps = (state: IStoreState) => {
    return {};
};

const mapDispatchToProps = (dispatch: Dispatch<IStoreState>) => {
    return {
        push: (route: string) => dispatch(historyPush(route)),
    };
};

export const PlayerInfoRoute = connect<
    {}, IPlayerInfoRouteDispatchProps, {}
>(mapStateToProps, mapDispatchToProps)(UnconnectedPlayerInfoRoute);
