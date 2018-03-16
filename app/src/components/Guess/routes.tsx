import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import DoodleViewer from '../DoodleViewer/DoodleViewer';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import './Guess.scss';

const arrows = require('./arrows.svg');

export interface GuessRouteProps extends RouteComponentProps<{}> {}

interface GuessRouteState {
    text: string;
}

class UnconnectedGuessRoute extends React.Component<GuessRouteProps, GuessRouteState> {
    public state: GuessRouteState = {
        text: '',
    };

    public render() {
        const { text } = this.state;
        return (
            <div className="guess">
                What is this?
                <DoodleViewer src={arrows} />
                <div className="flex-pad" />
                <Input value={text} onChange={this.handleChange} />
                <Button text="Submit" onClick={this.handleSubmit} />
            </div>
        );
    }

    public handleChange = (text: string) => {
        this.setState({ text });
    }

    public handleSubmit = () => {
        return;
    }
}

export const GuessRoute = withRouter(UnconnectedGuessRoute);