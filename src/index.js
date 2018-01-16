import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TicTacToe from './tictactoe.js';

function GameBoard(props) {
  return (
    <div>
      <TicTacToe showing={props.currentGame === 0} />
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentGame: 0
    };
  }

  newGame(key) {
    this.setState({
      currentGame: key,
    });
  }

  renderGameOptions(games) {
    return games.map((game, index) => {
      const name = game.name;
      const key = game.key;
      return (
        <li key={key}>
          <button onClick={() => this.newGame(key)}>{name}</button>
        </li>
      );
    });
  }

  render() {
    const games = [
      {
        name: 'Tic Tac Toe',
        key: 0
      }
    ];
    const gameOptions = this.renderGameOptions(games);

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
  document.getElementById('root')
);
