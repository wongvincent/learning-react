// @flow
import * as React from 'react';
import './connectfour.css';

type GridCircle = number;
type GridColumn = Array<GridCircle>;
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
  onClick: (columnNum: number) => void;
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
    return (
      <div className={classes}></div>
    );
  }
}

class Column extends React.Component<ColumnProps> {
  renderCircles() {
    const renderedCircles: Array<React.Node> = [];
    const column: GridColumn = this.props.column;
    for (let i=5; i>=0; i--) {
      const circle: GridCircle = column[i];
      renderedCircles.push(
        <div className="square" key={i}>
          <Circle circle={circle} />
        </div>
      );
    }
    return renderedCircles;
  }
  render() {
    return (
      <div>
        {this.renderCircles()}
      </div>
    )
  }
}

class Board extends React.Component<BoardProps> {
  renderBoard() {
    const renderedColumns: Array<React.Node> = [];
    for (let columnNum: number = 0; columnNum < 7; columnNum++) {
      const column: GridColumn = this.props.current[columnNum];
      renderedColumns.push(
        <div className="column" key={columnNum} onClick={() => this.props.onClick(columnNum)}>
          <Column column={column} />
        </div>
      );
    }
    return (
      <div>
        {renderedColumns}
      </div>

    );
  }

  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}


export default class ConnectFour extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redIsNext: true,
      history: [{
        "0": Array(6).fill(0),
        "1": Array(6).fill(0),
        "2": Array(6).fill(0),
        "3": Array(6).fill(0),
        "4": Array(6).fill(0),
        "5": Array(6).fill(0),
        "6": Array(6).fill(0)
      }],
    };
  }

  playPiece(columnNum: number) {
    const current: Grid = this.state.history[this.state.history.length - 1]; //should deep copy
    const column: GridColumn = current[columnNum];
    const isColumnFull: boolean = column[column.length - 1] !== 0;
    if (!isColumnFull) {
      for (const circleIndex: number of column.keys()) {
        if (column[circleIndex] === 0) {
          column[circleIndex] = this.state.redIsNext ? 1 : -1;
          current[columnNum] = column;
          break;
        }
      }
      this.setState({
        redIsNext: !this.state.redIsNext,
        history: this.state.history.concat([
          current
        ])
      });
    }
  }

  resetGame() {
    this.setState({
      redIsNext: true,
      history: [{
        "0": Array(6).fill(0),
        "1": Array(6).fill(0),
        "2": Array(6).fill(0),
        "3": Array(6).fill(0),
        "4": Array(6).fill(0),
        "5": Array(6).fill(0),
        "6": Array(6).fill(0)
      }],
    })
  }

  render() {
    const showing: boolean = this.props.showing;
    const current: Grid = this.state.history[this.state.history.length - 1];
    let status: string;
    const winner: number = 0;
    if (winner) {
      status = 'Winner: ' + winner === 1 ? 'Red' : 'Yellow';
    } else {
      status = 'Next player: ' + (this.state.redIsNext ? 'Red' : 'Yellow');
    }
    return (
      <div>
        {showing ?
          <div className="game">
            <div className="game-board connect-four">
              <Board current={current} onClick={(columnNum) => this.playPiece(columnNum)} />
            </div>
            <div className="game-info">
              <div>{status}</div>
              <button onClick={() => this.resetGame()}>Reset Game</button>
            </div>
          </div>
          : null
        }
      </div>
    );
  }
}