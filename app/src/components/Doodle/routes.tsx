import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Canvas from '../Canvas/Canvas';
import { Button } from '../Button/Button';
import './Doodle.scss';

export interface DoodleRouteProps extends RouteComponentProps<{}> {}

interface DoodleRouteState {
    isOverlayOpen: boolean;
}

class UnconnectedDoodleRoute extends React.Component<DoodleRouteProps, DoodleRouteState> {
    public state: DoodleRouteState = {
        isOverlayOpen: false,
    };

    private canvas: Canvas;
    private refHandler = {
        canvas: (canvas: Canvas) => { this.canvas = canvas; },
    };

    public render() {
        return (
            <div className="doodle">
                <span className="label">Doodle This</span>
                <h2>Pierres Beard</h2>
                <div className="flex-pad" />
                <Canvas ref={this.refHandler.canvas} />
                <div className="flex-pad" />
                <div className="buttons">
                    <Button text="Clear" onClick={this.clearCanvas} />
                    <Button text="Submit" onClick={this.clearCanvas} />
                </div>
            </div>
        );
    }

    private clearCanvas = () => {
        this.canvas.clearCanvas();
    }
}

export const DoodleRoute = withRouter(UnconnectedDoodleRoute);