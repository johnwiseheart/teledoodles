import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Button } from "../../Button/Button";
import Canvas from "../../Canvas/Canvas";
import "./Doodle.scss";

export interface IDoodleProps {
  text: string;
  onDoodle: (doodleUrl: string) => void;
}

export class Doodle extends React.Component<IDoodleProps, {}> {
  private canvas: Canvas;
  private refHandler = {
    canvas: (canvas: Canvas) => {
      this.canvas = canvas;
    }
  };

  public render() {
    return (
      <div className="doodle">
        <div className="panel">
          <h2>{this.props.text}</h2>
          <span className="label">Doodle This</span>
        </div>
        <Canvas ref={this.refHandler.canvas} />
        <div className="flex-pad" />
        <div className="buttons">
          <Button text="Clear" onClick={this.clearCanvas} />
          <Button text="Submit" onClick={this.handleSubmit} />
        </div>
      </div>
    );
  }

  private clearCanvas = () => {
    this.canvas.clearCanvas();
  };

  private handleSubmit = async () => {
    const URL = await this.canvas.getURL();
    this.props.onDoodle(URL);
  }
}