import * as React from "react";
import { Colors, csstips, Shadows, style } from "../styles";
import { getFromS3 } from "../utils";

export interface IS3ImageWrapperProps {
  imageId: string;
  renderImage: (fileUrl: string) => JSX.Element;
  renderLoader?: () => JSX.Element;
}

export interface IS3ImageWrapperState {
  imageUrl: string;
}

export class S3ImageWrapper extends React.Component<IS3ImageWrapperProps, IS3ImageWrapperState> {
  public state: IS3ImageWrapperState = {
    imageUrl: undefined,
  };

  public async componentDidMount() {
    const imageUrl = await getFromS3(this.props.imageId);
    this.setState({ imageUrl });
  }

  public render() {
    const { renderImage, renderLoader } = this.props
    const { imageUrl } = this.state;
    if (imageUrl === undefined) {
      return renderLoader ? renderLoader : <div>Loading</div>;
    }
    return renderImage(imageUrl);
  }
}