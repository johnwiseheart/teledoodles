import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import './Choose.scss';

export interface ChooseRouteProps extends RouteComponentProps<{}> {}

interface ChooseRouteState {
    text: string;
}

class UnconnectedChooseRoute extends React.Component<ChooseRouteProps, ChooseRouteState> {
    public state: ChooseRouteState = {
        text: '',
    };

    public render() {
        const { text } = this.state;
        return (
            <div className="choose">
                Pick a word or phrase for the other players to sketch.
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

export const ChooseRoute = withRouter(UnconnectedChooseRoute);