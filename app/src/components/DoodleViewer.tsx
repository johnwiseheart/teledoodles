import * as React from "react";
import { Colors, csstips, style } from '../styles';
import { getFromS3 } from "../utils";

export interface IDoodleViewerProps {
  imageId: string;
}

export interface IDoodleViewerState {
  imageUrl: string;
}

export class DoodleViewer extends React.Component<IDoodleViewerProps, IDoodleViewerState> {
  public state: IDoodleViewerState = {
    imageUrl: undefined,
  }

  public async componentDidMount() {
    const imageUrl = await getFromS3(this.props.imageId);
    this.setState({ imageUrl });
  }

  public render() {
    const { imageUrl } = this.state;
    if (imageUrl === undefined) {
      return <div>Loading</div>;
    }
    return (
      <div className={Styles.container}>
        <img className={Styles.image} src={imageUrl} />
      </div>
    );
  }
}

namespace Styles {
  export const container = style({
    backgroundColor: Colors.primary,
  });

  export const image = style({
    width: "100%",
  })
}

