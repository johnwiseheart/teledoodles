import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Button, Input, S3ImageWrapper } from "../../components";
import { Classes, Colors, csstips, Shadows, style } from "../../styles";

interface IGuessProps {
  imageId: string;
  onGuess: (text: string) => void;
}

interface IGuessState {
  text: string;
}

export class Guess extends React.Component<IGuessProps, IGuessState> {
  public state: IGuessState = {
    text: "",
  };

  public render() {
    const { imageId } = this.props;
    const { text } = this.state;

    const renderImage = (imageUrl: string) => (
      <div className={Styles.imageContainer}>
        <img className={Styles.image} src={imageUrl} />
      </div>
    )

    return (
      <div className={Classes.flexContainer}>
        <div className="panel">
          <h2>What is this?</h2>
        </div>
        <S3ImageWrapper imageId={imageId} renderImage={renderImage}/>
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

namespace Styles {
  export const imageContainer = style({
    backgroundColor: Colors.white,
    boxShadow: Shadows.one
  });

  export const image = style({
    width: "100%",
  });
}
