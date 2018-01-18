// @flow
import * as React from 'react';
import './connectfour.css';

type GridCircle = number;
type GridColumn = [GridCircle, GridCircle, GridCircle, GridCircle, GridCircle, GridCircle];
type Grid = {|
    "0": GridColumn,
    "1": GridColumn,
    "2": GridColumn,
    "3": GridColumn,
    "4": GridColumn,
    "5": GridColumn,
    "6": GridColumn,
|};
type Props = {
    showing: boolean;
};
type State = {
    redIsNext: boolean;
    history: Array<Grid>;
};
type BoardProps = {
    current: Grid;
};
type ColumnProps = {
    column: GridColumn;
};
type CircleProps = {
    circle: GridCircle;
};

class Circle extends React.Component<CircleProps> {
    getColourOfCircle(): string {
        const circle = this.props.circle;
        switch (circle) {
            case 1:
                return 'red-circle';
            case -1:
                return 'yellow-circle';
            default:
                return 'blank-circle';
        }
    }

    render() {
        const circleClass: string = this.getColourOfCircle();
        const classes: string = `circle ${circleClass}`;
        return(
            <div className={classes}></div>
        );
    }
}

class Column extends React.Component<ColumnProps> {
    renderCircles() {
        const renderedCircles: Array<React.Node> = [];
        const column: GridColumn = this.props.column;
        column.forEach((circle: GridCircle, index) => {
            renderedCircles.push(
                <div className="square" key={index}>
                    <Circle circle={circle}/>
                </div>
            );
        });
        return renderedCircles;
    }
    render() {
        return(
            <div>
                {this.renderCircles()}
            </div>
        )
    }
}

class Board extends React.Component<BoardProps> {
    renderBoard() {
        const renderedColumns: Array<React.Node> = [];
        for(let columnNum: number = 0; columnNum < 7; columnNum++) {
            const column: GridColumn = this.props.current[columnNum];
            renderedColumns.push(
                <div className="column" key={columnNum}>
                    <Column column={column} />
                </div>
            );
        }
        return(
            <div>
                {renderedColumns}
            </div>

        );
    }

    render() {
        return(
            <div>
                {this.renderBoard()}
            </div>
        );
    }
}


export default class ConnectFour extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const column: GridColumn = [0,1,-1,0,1,-1];
        this.state = {
            redIsNext: true,
            history: [{
                "0": column,
                "1": column,
                "2": column,
                "3": column,
                "4": column,
                "5": column,
                "6": column
            }],
        };
    }
    render() {
        const showing: boolean = this.props.showing;
        const current: Grid = this.state.history[this.state.history.length - 1];
        return(
            <div>
                { showing ?
                    <div className="game">
                        <div className="game-board connect-four">
                            <Board current={current} />
                        </div>
                    </div>
                    : null
                }
            </div>
        );
    }
}