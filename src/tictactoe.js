import React from 'react';
import ReactDOM from 'react-dom';

function Square(props) {
  const previousMoveClass = props.isPreviousMove ? 'previous-move' : '';
  const winningSquareClass = props.isWinningSquare ? 'winner' : '';
  const classes = `square ${previousMoveClass} ${winningSquareClass}` 
  return (
    <button className={classes} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const isPreviousMove = this.props.previousMove === i;
    const isWinningSquare = this.props.winningSquares && this.props.winningSquares.some(function(winningSquare) {
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

export default class TicTacToe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      moves: [],
      xIsNext: false,
    };
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const moves = this.state.moves;
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

  jumpTo(move) {
    const history = this.state.history;
    const moves = this.state.moves;
    this.setState({
      history: history.slice(0, move + 1),
      xIsNext: (move % 2 === 1),
      moves: move === 0 ? [] : moves.slice(0, move),
    })
  }

  render() {
    const showing = this.props.showing;
    const history = this.state.history;
    const current = history[history.length - 1];
    const winningLine = calculateWinningLine(current.squares);
    const winner = winningLine ? (this.state.xIsNext ? 'O' : 'X') : null;
    const previousMove = this.state.moves[this.state.moves.length - 1];
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

    let status;
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
            <div className="game-board">
              <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                previousMove={previousMove}
                winningSquares={winningLine} />
            </div>
            <div className="game-info">
              <div>{status}</div>
              <ol>{moves}</ol>
            </div>
          </div>
        : null }
      </div>
    );
  }
}

function calculateWinningLine(squares) {
  const lines = [
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