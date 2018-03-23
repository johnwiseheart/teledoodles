import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Button, Input } from "../../components";
import { Classes, csstips, style } from "../../styles";

interface IChooseProps {
  onChoose: (text: string) => void;
}

interface IChooseState {
  text: string;
}

export class Choose extends React.Component<IChooseProps, IChooseState> {
  public state: IChooseState = {
    text: "",
  };

  public render() {
    const { text } = this.state;
    return (
      <div className={Classes.flexContainer}>
        <div className={Classes.subheader}>Choose</div>
        <div className={Classes.description}>Choose some text for the other players to draw and guess.<br />It can be a word, phrase, or any other text that everyone will understand.</div>
        <Input value={text} onChange={this.handleChange} />
        <div className={Classes.flexPad} />
        <div>
          <Button text="Submit" disabled={text.length === 0} onClick={this.handleSubmit} />
        </div>
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
