// @flow

/*flow-include
import type { Request, Response } from 'express';
import type { State } from '../../redux/store.js';
import type { Game, Player } from '../../types';

type Score = {| player: Player, index: number, rating: number |};
*/

const altLeaderBoardCtrl = (req /*: Request */, res /*: Response */) => {
  const store = req.app.get("store");
  const state /*: State */ = store.getState();
  const games /*: Array<Game> */ = state.games;

  const gamesPerPlayer /*: { [Player]: number } */ = games
    .map(game => game.rankings)
    .reduce((mergeObject /*: any */, currentGameRankings /*: ?Ranking */) => {
      const players = Object.keys(currentGameRankings);
      const numberOfPlayers = players.length;
      const currentGamePlayers = Object.keys(currentGameRankings);
      return currentGamePlayers.reduce((mergeObject /*: any */, currentPlayer /*: ?Player */) => {
        if (mergeObject[currentPlayer] == undefined) {
          mergeObject[currentPlayer] = {
            totalGameCount: 0
          };
        }
        if (mergeObject[currentPlayer][numberOfPlayers] === undefined) {
          mergeObject[currentPlayer][numberOfPlayers] = {
            gameCount: 0,
            winCount: 0
          };
        }
        if (currentGameRankings[currentPlayer] === 1) {
          mergeObject[currentPlayer][numberOfPlayers].winCount += 1;
        }
        mergeObject[currentPlayer].totalGameCount += 1;
        mergeObject[currentPlayer][numberOfPlayers].gameCount += 1;
        return mergeObject;
      }, mergeObject);
    }, {})
  const players = Object.keys(gamesPerPlayer);
  const scores = players
    .map(currentPlayer => {
      const { totalGameCount, ...currentPlayerGames } = gamesPerPlayer[currentPlayer];
      const distinctGameNumberOfPlayersOfCurrentPlayerGames = Object.keys(currentPlayerGames);
      const currentPlayerScoresPerNumberOfPlayers = distinctGameNumberOfPlayersOfCurrentPlayerGames.map(currentNumberOfPlayers => {
        const currentPlayerGamesForCurrentNumberOfPlayers = currentPlayerGames[currentNumberOfPlayers];
        const winCountForCurrentTypeForCurrentPlayer = currentPlayerGamesForCurrentNumberOfPlayers.winCount;
        const gameCountForCurrentTypeForCurrentPlayer = currentPlayerGamesForCurrentNumberOfPlayers.gameCount;
        return {
          ...currentPlayerGamesForCurrentNumberOfPlayers,
          score: Math.pow(1 - (1 - (winCountForCurrentTypeForCurrentPlayer / gameCountForCurrentTypeForCurrentPlayer)), Math.log(2) / Math.log(1 / (1 - 1 / currentNumberOfPlayers)))
        }
      });
      const gameCountForCurrentPlayer = gamesPerPlayer[currentPlayer].totalGameCount;
      const currentPlayerTotalScore = currentPlayerScoresPerNumberOfPlayers.reduce((acc, item) => acc + item.score * item.gameCount / gameCountForCurrentPlayer, 0);
      return {
        player: currentPlayer,
        rating: currentPlayerTotalScore
      }
    })
    .sort((a, b) => b.rating - a.rating)
    .map((a, index) => ({
      player: a.player,
      index: index + 1,
      rating: Math.round(a.rating * 10000) / 100 + " %"
    }));

  res.render("index.hbs", { scores });
};

const reduceCount = (mergeObject /*: any */, key /*: ?Player */) => {
  const oldValue = mergeObject[key];

  if (oldValue == undefined) {
    mergeObject[key] = 1;
  } else {
    mergeObject[key] = oldValue + 1;
  }
  return mergeObject;
};

module.exports = {
  altLeaderBoardCtrl
};
