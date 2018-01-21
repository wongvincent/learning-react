// @flow
import * as React from 'react';
import './tictactoe.css';

type WinningLine = [number, number, number];
type Squares = Array<?string>;
type History = Array<{squares: Squares}>;
type Props = {
  showing: boolean;
};
type HandleClick = (i: number) => void;
type State = {
  history: History;
  moves: Array<number>;
  xIsNext: boolean;
};
type SquareProps = {
  isPreviousMove: boolean;
  isWinningSquare: boolean;
  onClick: HandleClick;
  value: ?string;
};
type BoardProps = {
  previousMove: number;
  winningSquares: ?WinningLine;
  squares: Squares;
  onClick: HandleClick;
};

function Square(props: SquareProps) {
  const previousMoveClass = props.isPreviousMove ? 'previous-move' : '';
  const winningSquareClass = props.isWinningSquare ? 'winner' : '';
  const classes = `square ${previousMoveClass} ${winningSquareClass}` 
  return (
    <button className={classes} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component<BoardProps> {
  renderSquare(i: number) {
    const isPreviousMove: boolean = this.props.previousMove === i;
    const isWinningSquare: boolean = !!this.props.winningSquares && this.props.winningSquares.some(function(winningSquare) {
      return winningSquare === i;
    });

    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isPreviousMove={isPreviousMove}
        isWinningSquare={isWinningSquare}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

export default class TicTacToe extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      moves: [],
      xIsNext: false,
    };
  }

  handleClick(i: number) {
    const history: History = this.state.history;
    const current: {squares: Squares} = history[history.length - 1];
    const squares: Squares = current.squares.slice();
    const moves: Array<number> = this.state.moves;
    if (squares[i] || calculateWinningLine(squares)) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares,
      }]),
      moves: moves.concat([i]),
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(move: number) {
    const history: History = this.state.history;
    const moves: Array<number> = this.state.moves;
    this.setState({
      history: history.slice(0, move + 1),
      xIsNext: (move % 2 === 1),
      moves: move === 0 ? [] : moves.slice(0, move),
    })
  }

  resetGame() {
    this.setState({
        history: [{
          squares: Array(9).fill(null),
        }],
        moves: [],
        xIsNext: false,
    });
  }

  render(): React.Node {
    const showing: boolean = this.props.showing;
    const history: History = this.state.history;
    const current: {squares: Squares} = history[history.length - 1];
    const winningLine: ?WinningLine = calculateWinningLine(current.squares);
    const winner: ?string = winningLine ? (this.state.xIsNext ? 'O' : 'X') : null;
    const previousMove: number = this.state.moves[this.state.moves.length - 1];
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status: string;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        { showing
        ?
          <div className="game">
            <div className="game-board tic-tac-toe">
              <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                previousMove={previousMove}
                winningSquares={winningLine} />
            </div>
            <div className="game-info">
              <div>{status}</div>
              <ol start="0">{moves}</ol>
              <button onClick={() => this.resetGame()}>Reset Game</button>
            </div>
          </div>
        : null }
      </div>
    );
  }
}

function calculateWinningLine(squares: Squares): ?WinningLine {
  const lines: Array<[number,number,number]> = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}