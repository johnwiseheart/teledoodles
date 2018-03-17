import * as React from "react";
import "./DoodleViewer.scss";

export interface IDoodleViewerProps {
  src: string;
}

export default class DoodleViewer extends React.Component<IDoodleViewerProps, {}> {
  public render() {
    return (
      <div className="doodle-viewer">
        <img src={this.props.src} />
      </div>
    );
  }
}
