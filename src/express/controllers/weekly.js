// @flow

/*flow-include
import type { Request, Response } from 'express';
import type { State } from '../../redux/store.js';
import type { Game } from '../../types';
*/

const { computeRatingsFromRankings } = require("../../helpers/elo.js");
const {
  buildBeginningOfMonthDate,
  buildBeginningOfWeekDate,
  isGameAfterDate
} = require("../../helpers/date.js");
const { createLeaderboardFromRatings } = require("./index.js");

const monthlyCtrl = buildController(buildBeginningOfMonthDate());
const weeklyCtrl = buildController(buildBeginningOfWeekDate());

function buildController(date /*: Date */) {
  return (req /*: Request */, res /*: Response */) => {
    const store = req.app.get("store");
    const state /*: State */ = store.getState();
    const { games } = state;

    const rankings = games
      .filter(isGameAfterDate(date))
      .map(game => game.rankings);
    const ratings = computeRatingsFromRankings(rankings);

    const scores = createLeaderboardFromRatings(ratings);
    res.render("index.hbs", { scores });
  };
}

module.exports = {
  monthlyCtrl,
  weeklyCtrl
};
