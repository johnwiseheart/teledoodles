import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Button, Canvas } from "../../components";
import { Classes, csstips, style } from "../../styles";

export interface IDoodleProps {
  text: string;
  onDoodle: (doodleUrl: string) => void;
}

export interface IDoodleState {
  isEmpty: boolean;
}

export class Doodle extends React.Component<IDoodleProps, {}> {
  public state: IDoodleState = {
    isEmpty: true,
  }

  private canvas: Canvas;
  private refHandler = {
    canvas: (canvas: Canvas) => {
      this.canvas = canvas;
    },
  };

  public render() {
    const { isEmpty } = this.state;
    return (
      <div className={Classes.flexContainer}>
       <div className={Classes.subheader}>Doodle</div>
        <div className={Classes.description}>Doodle the word or phrase: {this.props.text}</div>
        <Canvas ref={this.refHandler.canvas} onCanvasTouch={this.handleCanvasTouch} />
        <div className={Classes.flexPad} />
        <div>
          <Button text="Submit" disabled={isEmpty} onClick={this.handleSubmit} />
        </div>
      </div>
    );
  }

  private handleSubmit = async () => {
    if (!this.state.isEmpty) {
      const URL = await this.canvas.getURL();
      this.props.onDoodle(URL);

    }
  }

  private handleCanvasTouch = (isEmpty: boolean) => {
    this.setState({ isEmpty });
  }
}

namespace Styles {
  export const label = style({
    color: "#999",
    fontSize: "12px",
    textTransform: "uppercase",
  });
}
