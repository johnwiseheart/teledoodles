import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Button, DoodleViewer, Input } from "../../components";
import { Classes, csstips, style } from '../../styles';

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
      <div className={Classes.flexContainer}>
        <div className="panel"><h2>What is this?</h2></div>
        <DoodleViewer imageId={imageId} />
        <div className={Classes.flexPad} />
        <Input value={text} onChange={this.handleChange} />
        <Button text="Submit" onClick={this.handleSubmit} />
      </div>
    );
  }

  public handleChange = (text: string) => {
    this.setState({ text });
  };

  public handleSubmit = () => {
    if (this.state.text.length > 0) {
      this.props.onGuess(this.state.text);
    }
  };
}
