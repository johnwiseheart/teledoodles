import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Button } from "../../Button/Button";
import DoodleViewer from "../../DoodleViewer/DoodleViewer";
import { Input } from "../../Input/Input";
import "./Guess.scss";

interface IGuessProps {
  onGuess: (text: string) => void;
}

interface IGuessState {
  text: string;
}

export class Guess extends React.Component<IGuessProps, IGuessState> {
  public state: IGuessState = {
    text: ""
  };

  public render() {
    const { text } = this.state;
    return (
      <div className="guess">
        What is this?
        {/* <DoodleViewer src={arrows} /> */}
        <div className="flex-pad" />
        <Input value={text} onChange={this.handleChange} />
        <Button text="Submit" onClick={this.handleSubmit} />
      </div>
    );
  }

  public handleChange = (text: string) => {
    this.setState({ text });
  };

  public handleSubmit = () => {
    this.props.onGuess(this.state.text);
  };
}
