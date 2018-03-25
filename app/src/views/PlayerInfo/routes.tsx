import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { push as historyPush } from "react-router-redux";
import { Button, Canvas, Input } from "../../components";
import { IStoreState } from "../../store";
import { Classes, csstips, style } from "../../styles";
import { getPlayerInfo, uuidv4 } from "../../utils";

export interface IPlayerInfoRouteDispatchProps {
  push: (route: string) => void;
}

export type IPlayerInfoRouteProps = IPlayerInfoRouteDispatchProps;

interface IPlayerInfoRouteState {
  name: string;
  canvasEmpty: boolean;
}

class UnconnectedPlayerInfoRoute extends React.Component<
  IPlayerInfoRouteProps,
  IPlayerInfoRouteState
> {
  public state: IPlayerInfoRouteState = {
    canvasEmpty: true,
    name: "",
  };

  private canvas: Canvas;
  private refHandler = {
    canvas: (canvas: Canvas) => {
      this.canvas = canvas;
    },
  };

  public componentDidMount() {
    if (getPlayerInfo() != null) {
      this.pushToHome();
    }
  }

  public render() {
    const { canvasEmpty, name } = this.state;
    return (
      <div className={Classes.flexContainer}>
        <div className={Classes.subheader}>Player Info</div>
        <div className={Classes.description}>Pick a name and draw an avatar for yourself.</div>
        <Canvas ref={this.refHandler.canvas} onCanvasChange={this.handleCanvasChange}/>
        <Input value={name} onChange={this.handleNameChange} placeholder="Player name" />
        <div className={Classes.flexPad} />
        <div>
          <Button text="Submit" disabled={canvasEmpty || name.length === 0} onClick={this.handleSubmit} />
        </div>
      </div>
    );
  }

  private handleCanvasChange = (canvasEmpty: boolean) => {
    this.setState({ canvasEmpty });
  }

  private handleNameChange = (name: string) => {
    this.setState({ name });
  };

  private handleSubmit = () => {
    const { name } = this.state;

    if (name.length > 0) {
      return this.canvas.getURL().then(fileId => {
        localStorage.setItem(
          "player",
          JSON.stringify({
            avatarFileId: fileId,
            id: uuidv4(),
            username: name,
          }),
        );
        this.pushToHome();
      });
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
