import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Button } from "../../Button/Button";
import { Input } from "../../Input/Input";
import "./Choose.scss";

interface IChooseRouteState {
  text: string;
}

export class Choose extends React.Component<{}, IChooseRouteState> {
  public state: IChooseRouteState = {
    text: ""
  };

  public render() {
    const { text } = this.state;
    return (
      <div className="choose">
        Pick a word or phrase for the other players to sketch.
        <Input value={text} onChange={this.handleChange} />
        <Button text="Submit" onClick={this.handleSubmit} />
      </div>
    );
  }

  public handleChange = (text: string) => {
    this.setState({ text });
  };

  public handleSubmit = () => {
    return;
  };
}