// @flow
import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import './connectfour.css';

type GridCircle = number;
type GridColumn = Array<GridCircle>;
type Grid = Array<GridColumn>;
type History = Array<Grid>
type Coords = [number, number];
type Props = {
  showing: boolean;
};
type State = {
  redIsNext: boolean;
  history: History;
  winningLine: Array<Coords>;
  moves: Array<Coords>;
};
type BoardProps = {
  current: Grid;
  onClick: (columnNum: number) => void;
  winningLine: Array<Coords>;
  redIsNext: boolean;
};
type BoardState = {
  hover: number;
};
type ColumnProps = {
  columnNum: number;
  column: GridColumn;
  winningLine: Array<Coords>;
  hover: number;
  redIsNext: boolean;
};
type CircleProps = {
  circle: GridCircle;
  hover: boolean;
  redIsNext: boolean;
};
type CirclePieceProps = {
  circle: GridCircle;
}

class CirclePiece extends React.Component<CirclePieceProps> {
  getColourOfCircle(num: GridCircle): string {
    const circle = this.props.circle;
    switch (circle) {
      case 1:
        return 'red-circle';
      case -1:
        return 'yellow-circle';
      default:
        return '';
    }
  }

  render() {
    const hoverClass: string = this.props.hover ? (this.props.redIsNext ? 'hover-red' : 'hover-yellow' ): '';
    const circleClass: string = this.getColourOfCircle(this.props.circle);
    const classes: string = `piece ${circleClass} ${hoverClass}`;
    return (
      <CSSTransition in={circleClass} classNames="slide-in-down">
        <div className={classes}></div>
      </CSSTransition>
    );
  }
}

class Circle extends React.Component<CircleProps> {
  render() {
    const classes: string = `circle`;
    return (
        <div className={classes}>
          <CirclePiece {...this.props} />
        </div>
      
    );
  }
}

class Column extends React.Component<ColumnProps> {
  isWinningCircle(x, y): boolean {
    const winningLine: Array<Coords> = this.props.winningLine;
    for (let winningCircle: Coords of winningLine) {
      const [winningX, winningY] = winningCircle;
      if (x === winningX && y === winningY) {
        return true;
      }
    }
    return false;
  }

  renderCircles() {
    const renderedCircles: Array<React.Node> = [];
    const columnNum: number = this.props.columnNum;
    const column: GridColumn = this.props.column;
    for (let i=5; i>=0; i--) {
      const circle: GridCircle = column[i];
      const isWinnerClass: string = this.isWinningCircle(columnNum, i) ? 'winner' : '';
      const squareClasses: string = `square ${isWinnerClass}`;
      let hover = false;
      if (this.props.hover === columnNum && circle === 0 && (i === 0 || column[i - 1] !== 0)) {
        hover = true;
      }
      renderedCircles.push(
        <div className={squareClasses} key={i}>
          <Circle
            circle={circle}
            hover={hover}
            redIsNext={this.props.redIsNext} />
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

class Board extends React.Component<BoardProps, BoardState> {
  constructor(props: BoardProps) {
    super(props);
    this.state = {
      hover: -1
    };
  }

  handleMouseOver(columnNum: number) {
    this.setState({
      hover: columnNum
    });
  }

  handleMouseOut() {
    this.setState({
      hover: -1
    });
  }

  renderBoard() {
    const renderedColumns: Array<React.Node> = [];
    for (let columnNum: number = 0; columnNum < 7; columnNum++) {
      const column: GridColumn = this.props.current[columnNum];
      renderedColumns.push(
        <div className="column"
          key={columnNum}
          onClick={() => this.props.onClick(columnNum)}
          onMouseOver={() => this.handleMouseOver(columnNum)}
          onMouseOut={() => this.handleMouseOut()} >
            <Column
              columnNum={columnNum}
              column={column}
              winningLine={this.props.winningLine}
              hover={this.state.hover}
              redIsNext={this.props.redIsNext} />
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
    const emptyColumn: GridColumn = Array(6).fill(0);
    this.state = {
      redIsNext: true,
      history: [
        [emptyColumn, emptyColumn, emptyColumn, emptyColumn, emptyColumn, emptyColumn, emptyColumn]
      ],
      winningLine: [],
      moves: []
    };
  }

  playPiece(columnNum: number) {
    const current: Grid = this.state.history[this.state.history.length - 1].slice();
    const column: GridColumn = current[columnNum].slice();
    const isColumnFull: boolean = column[column.length - 1] !== 0;
    const someoneHasWon: number = this.state.winningLine.length;
    if (!someoneHasWon && !isColumnFull) {
      let circleIndex: number = 0;
      while(circleIndex < column.length) {
        if (column[circleIndex] === 0) {
          column[circleIndex] = this.state.redIsNext ? 1 : -1;
          current[columnNum] = column;
          break;
        }
        circleIndex++;
      }
      const winningLine: Array<Coords> = this.calculateWinner(current, columnNum) || [];
      this.setState({
        redIsNext: !this.state.redIsNext,
        history: this.state.history.concat([
          current
        ]),
        winningLine,
        moves: this.state.moves.concat([[columnNum, circleIndex]])
      });
    }
  }

  calculateWinner(current: Grid, columnNum: number): ?Array<Coords> {
    let rowNum: number = -1;
    let lastFour: Array<Coords> = [];
    const processCircle = (x: number, y: number) => {
      const currentCircleValue: GridCircle = current[x][y];
      if (currentCircleValue === 0) {
        lastFour = [];
      } else if (lastFour.length === 0) {
        lastFour = [[x, y]];
      } else {
        const [prevX, prevY]: Coords = lastFour[lastFour.length - 1];
        const previousCircleValue = current[prevX][prevY];
        if (previousCircleValue === currentCircleValue) {
          lastFour = lastFour.concat([[x, y]]);
        } else {
          lastFour = [[x, y]];
        }
      }
    };

    // Checking vertical line and set index (row) of last piece played
    for (let rowIndex: number = 0; rowIndex < current[columnNum].length; rowIndex++) {
      processCircle(columnNum, rowIndex);
      if (lastFour.length === 0) break;
      rowNum = rowIndex;
      if (lastFour.length === 4) return lastFour;
    }

    lastFour = [];

    // Check horizontal line
    for (let columnIndex: number = 0; columnIndex < 7; columnIndex++) {
      processCircle(columnIndex, rowNum);
      if (lastFour.length === 4) return lastFour;
    }

    lastFour = [];

    // Check diagonal top-left to bottom-right line
    let minimumXYToZero: number = Math.min(columnNum, 5 - rowNum);
    let X: number = columnNum - minimumXYToZero;
    let Y: number = rowNum + minimumXYToZero;

    while (X < 7 && Y > -1) {
      processCircle(X, Y);
      if (lastFour.length === 4) return lastFour;
      X++;
      Y--;
    }

    lastFour = [];

    // Check diagonal bottom-left to top-right line
    minimumXYToZero = Math.min(columnNum, rowNum);
    X = columnNum - minimumXYToZero;
    Y = rowNum - minimumXYToZero;

    while(X < 7 && Y < 6) {
      processCircle(X, Y);
      if (lastFour.length === 4) return lastFour;
      X++;
      Y++;
    }

    return null;
  }

  jumpTo(move: number) {
    const history: History = this.state.history;
    this.setState({
      history: history.slice(0, move + 1),
      redIsNext: (move % 2 === 0),
      winningLine: move === history.length - 1 ? this.state.winningLine : [],
      moves: move === 0 ? [] : this.state.moves.slice(0, move),
    });
  }

  render() {
    const showing: boolean = this.props.showing;
    const history: History = this.state.history;
    const current: Grid = this.state.history[this.state.history.length - 1];
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to Move #' + move :
        'Reset Game';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    let status: string;
    const winningLine: Array<Coords> = this.state.winningLine;
    if (winningLine.length) {
      const [x,y]: Coords = winningLine[0];
      const winner: GridCircle = current[x][y];
      status = 'Winner: ' + (winner === 1 ? 'Red' : 'Yellow');
    } else {
      status = 'Next player: ' + (this.state.redIsNext ? 'Red' : 'Yellow');
    }
    return (
      <div>
        {showing ?
          <div className="game">
            <div className="game-board connect-four">
              <Board
                current={current}
                onClick={(columnNum) => this.playPiece(columnNum)}
                winningLine={winningLine}
                redIsNext={this.state.redIsNext} />
            </div>
            <div className="game-info">
              <div className="status">{status}</div>
              <ol start="0">{moves}</ol>
            </div>
          </div>
          : null
        }
      </div>
    );
  }
}