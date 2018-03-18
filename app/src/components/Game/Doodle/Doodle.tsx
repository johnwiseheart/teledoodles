import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Button } from "../../Button/Button";
import Canvas from "../../Canvas/Canvas";
import "./Doodle.scss";

interface IDoodleRouteState {
  isOverlayOpen: boolean;
}

export class Doodle extends React.Component<{}, IDoodleRouteState> {
  public state: IDoodleRouteState = {
    isOverlayOpen: false
  };

  private canvas: Canvas;
  private refHandler = {
    canvas: (canvas: Canvas) => {
      this.canvas = canvas;
    }
  };

  public render() {
    return (
      <div className="doodle">
        <span className="label">Doodle This</span>
        <h2>Pierres Beard</h2>
        <div className="flex-pad" />
        <Canvas ref={this.refHandler.canvas} />
        <div className="flex-pad" />
        <div className="buttons">
          <Button text="Clear" onClick={this.clearCanvas} />
          <Button text="Submit" onClick={this.clearCanvas} />
        </div>
      </div>
    );
  }

  private clearCanvas = () => {
    this.canvas.clearCanvas();
  };
}