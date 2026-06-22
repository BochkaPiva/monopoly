import assert from "node:assert/strict";
import fs from "node:fs";
import { defaultConfig, logisticsByPlayers, resourceMeta, resourceVolumesByPlayers } from "../src/game-data.js";

const allCards = [
  ...defaultConfig.contracts,
  ...defaultConfig.tenders,
  ...defaultConfig.marketCards,
  ...defaultConfig.events,
  ...defaultConfig.proleumCards,
  ...defaultConfig.boardCells,
];

const ids = allCards.map((card) => card.id);
assert.equal(new Set(ids).size, ids.length, "Every game entity must have a unique id.");
assert.equal(defaultConfig.boardCells.length, 40, "The board must contain exactly 40 cells.");
assert.ok(defaultConfig.contracts.length >= 60, "The contract deck is unexpectedly small.");
assert.ok(defaultConfig.events.length >= 30, "The event deck is unexpectedly small.");
assert.ok(defaultConfig.proleumCards.length >= 25, "The PROLEUM deck is unexpectedly small.");

for (const deal of [...defaultConfig.contracts, ...defaultConfig.tenders]) {
  assert.ok(deal.title, `${deal.id}: title is required.`);
  assert.ok(Object.values(deal.resource || {}).some((amount) => amount > 0), `${deal.id}: resource requirement is required.`);
  assert.ok(deal.routes?.length, `${deal.id}: at least one logistics route is required.`);
  assert.ok(deal.duration >= 2, `${deal.id}: duration below 2 creates an impossible take/supply/deliver flow.`);
  assert.ok(deal.income > 0, `${deal.id}: income must be positive.`);
  assert.ok(Number(deal.risk) >= 0 && Number(deal.risk) <= 2, `${deal.id}: base risk must be between 0 and 2.`);
}

for (const [players, volume] of Object.entries(resourceVolumesByPlayers)) {
  assert.ok(Number(players) >= 2 && Number(players) <= 6);
  for (const code of Object.keys(resourceMeta)) assert.ok(volume[code] > 0, `${players} players: ${code} stock must be positive.`);
}

for (const [players, logistics] of Object.entries(logisticsByPlayers)) {
  assert.ok(logistics.rail > 0, `${players} players: rail capacity must be positive.`);
  assert.ok(logistics.depot > 0, `${players} players: depot capacity must be positive.`);
}

const appSource = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
assert.match(appSource, /const TURN_DURATION_MS = 60_000/, "Turn duration must remain server-state compatible and fixed at 60 seconds.");
assert.match(appSource, /turnDeadline/, "The room must persist an absolute turn deadline.");
assert.match(appSource, /function expireTurn/, "An expired turn must advance even when the active player left the page.");
assert.match(appSource, /contractMarketIds/, "Contracts must use a shared market instead of a day slice.");
assert.match(appSource, /replaceMarketDeal\(room, kind, entity\.id\)/, "Taking a deal must immediately replenish the shared market.");
assert.match(appSource, /animatePlayerMove/, "Dice movement must animate through intermediate cells.");
assert.match(appSource, /modalState = \{ type: "cell", cellId: cell\.id \}/, "Landing must open the cell action modal.");
assert.match(appSource, /"logistics-network"/, "The board must preserve the logistics ownership sector.");
assert.match(appSource, /logisticsMonopoly \? 0/, "Completing logistics must make route cost zero.");

console.log(
  JSON.stringify(
    {
      boardCells: defaultConfig.boardCells.length,
      contracts: defaultConfig.contracts.length,
      tenders: defaultConfig.tenders.length,
      marketCards: defaultConfig.marketCards.length,
      events: defaultConfig.events.length,
      proleumCards: defaultConfig.proleumCards.length,
      status: "passed",
    },
    null,
    2,
  ),
);
