import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { push as historyPush } from "react-router-redux";
import { Button, Input } from "../../components";
import { IStoreState } from "../../store";
import { Classes, csstips, style } from "../../styles";
import { getPlayerInfo, uuidv4 } from "../../utils";

export interface IPlayerInfoRouteDispatchProps {
  push: (route: string) => void;
}

export type IPlayerInfoRouteProps = IPlayerInfoRouteDispatchProps;

interface IPlayerInfoRouteState {
  name: string;
}

class UnconnectedPlayerInfoRoute extends React.Component<
  IPlayerInfoRouteProps,
  IPlayerInfoRouteState
> {
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
      <div className={Classes.flexContainer}>
        <div className={Classes.panel}>Player name</div>
        <Input value={name} onChange={this.handleNameChange} />
        <div className={Classes.flexPad} />
        <div>
          <Button text="Submit" onClick={this.handleSubmit} />
        </div>
      </div>
    );
  }

  private handleNameChange = (name: string) => {
    this.setState({ name });
  };

  private handleSubmit = () => {
    const { name } = this.state;
    if (name.length > 0) {
      localStorage.setItem(
        "player",
        JSON.stringify({
          id: uuidv4(),
          username: name,
        }),
      );
      this.pushToHome();
    }
  };

  private pushToHome = () => {
    const { push } = this.props;
    push("/");
  };
}

const mapStateToProps = (state: IStoreState) => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch<IStoreState>) => {
  return {
    push: (route: string) => dispatch(historyPush(route)),
  };
};

export const PlayerInfoRoute = connect<{}, IPlayerInfoRouteDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps,
)(UnconnectedPlayerInfoRoute);
