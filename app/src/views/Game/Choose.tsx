import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Button, Input } from "../../components";
import { Classes, csstips, style } from '../../styles';

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
      <div className={Classes.flexContainer}>
        <div className={Classes.panel}>Pick a word or phrase for the other players to sketch.</div>
        <div className={Classes.flexPad} />
        <Input value={text} onChange={this.handleChange} />
        <div className={Classes.flexPad} />
        <div>
          <Button text="Submit" onClick={this.handleSubmit} />
        </div>
      </div>
    );
  }

  public handleChange = (text: string) => {
    this.setState({ text });
  };

  public handleSubmit = () => {
    if (this.state.text.length > 0) {
      this.props.onChoose(this.state.text);
    }
  };
}