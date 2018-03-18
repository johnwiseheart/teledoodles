import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Button } from "../../Button/Button";
import { Input } from "../../Input/Input";
import "./Choose.scss";

interface IChooseProps {
  onChoose: (text: string) => void;
}

interface IChooseState {
  text: string;
}

export class Choose extends React.Component<IChooseProps, IChooseState> {
  public state: IChooseState = {
    text: ""
  };

  public render() {
    const { text } = this.state;
    return (
      <div className="choose">
        <div className="flex-pad" />
        Pick a word or phrase for the other players to sketch.
        <div className="flex-pad" />
        <Input value={text} onChange={this.handleChange} />
        <div className="flex-pad" />
        <Button text="Submit" onClick={this.handleSubmit} />
      </div>
    );
  }

  public handleChange = (text: string) => {
    this.setState({ text });
  };

  public handleSubmit = () => {
    this.props.onChoose(this.state.text);
  };
}