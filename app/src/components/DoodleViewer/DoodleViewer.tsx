import * as React from "react";
import "./DoodleViewer.scss";
import { getFromS3 } from "../../util";

export interface IDoodleViewerProps {
  src: string;
}

export interface IDoodleViewerState {
  imageUrl: string;
}

export default class DoodleViewer extends React.Component<IDoodleViewerProps, IDoodleViewerState> {
  public state: IDoodleViewerState = {
    imageUrl: undefined,
  }

  public async componentDidMount() {
    const imageUrl = await getFromS3(this.props.src);
    this.setState({ imageUrl });
  }

  public render() {
    const { imageUrl } = this.state;
    if (imageUrl === undefined) {
      return <div>Loading</div>;
    }
    return (
      <div className="doodle-viewer">
        <img src={imageUrl} />
      </div>
    );
  }
}
