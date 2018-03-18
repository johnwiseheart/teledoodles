import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Button } from "../../Button/Button";
import DoodleViewer from "../../DoodleViewer/DoodleViewer";
import { Input } from "../../Input/Input";
import "./Guess.scss";

interface IGuessProps {
  imageId: string;
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
    const { imageId } = this.props;
    const { text } = this.state;
    return (
      <div className="guess">
        <div className="panel"><h2>What is this?</h2></div>
        <DoodleViewer imageId={imageId} />
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
