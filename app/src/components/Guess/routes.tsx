import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Button } from "../Button/Button";
import DoodleViewer from "../DoodleViewer/DoodleViewer";
import { Input } from "../Input/Input";
import "./Guess.scss";

// tslint:disable-next-line
const arrows = require("./arrows.svg");

export interface IGuessRouteProps extends RouteComponentProps<{}> {}

interface IGuessRouteState {
    text: string;
}

class UnconnectedGuessRoute extends React.Component<IGuessRouteProps, IGuessRouteState> {
    public state: IGuessRouteState = {
        text: "",
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
