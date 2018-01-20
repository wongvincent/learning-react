// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TicTacToe from './tictactoe.js';
import ConnectFour from './connectfour.js';

type Props = {};
type State = {
  currentGame: number;
};
type Games = Array<{name: string, key: number}>;
type GameBoardProps = {
  currentGame: number;
};

function GameBoard(props: GameBoardProps) {
  return (
    <div>
      <TicTacToe showing={props.currentGame === 0} />
      <ConnectFour showing={props.currentGame === 1} />
    </div>
  );
}

class Game extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentGame: 1
    };
  }

  newGame(key: number) {
    this.setState({
      currentGame: key,
    });
  }

  renderGameOptions(games: Games) {
    return games.map((game, index) => {
      const name: string = game.name;
      const key: number = game.key;
      return (
        <li key={key}>
          <button onClick={() => this.newGame(key)}>{name}</button>
        </li>
      );
    });
  }

  render(): React.Node {
    const games: Games = [
      {
        name: 'Tic Tac Toe',
        key: 0
      },
      {
        name: 'Connect Four',
        key: 1
      }
    ];
    const gameOptions: React.Node = this.renderGameOptions(games);

    return (
      <div>
        <GameBoard currentGame={this.state.currentGame} />
        <ul>{gameOptions}</ul>
      </div>
    );
  }
}
// ========================================

ReactDOM.render(
  <Game />,
  (document.getElementById('root'): any)
);
