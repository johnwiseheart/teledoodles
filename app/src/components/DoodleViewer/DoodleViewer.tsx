import * as React from 'react';
import './DoodleViewer.scss';

export interface DoodleViewerProps {
    src: string;
}

export default class DoodleViewer extends React.Component<DoodleViewerProps, {}> {
    render() {
        return (
            <div className="doodle-viewer">
                <img src={this.props.src} />
            </div>
        );
    }
}