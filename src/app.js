import { defaultConfig, logisticsByPlayers, resourceMeta, resourceVolumesByPlayers } from "./game-data.js";

const STORAGE_KEY = "proleum-monopoly-state-v1";
const SESSION_KEY = "proleum-monopoly-user-v1";
const TURN_DURATION_MS = 60_000;
const palette = ["#1f7a5a", "#b7791f", "#365f91", "#8a3ffc", "#a83c3c", "#475569"];
const boardLayout = [
  ["cell-1", "corner"],
  ["cell-6", "resource-reg", "REG", { title: "Биржа REG", description: "Купить REG по текущей рыночной цене или приобрести актив закупочного сектора." }],
  ["cell-11", "resource-reg", "REG", { title: "Оптовый поставщик REG", description: "Купить REG и получить возможность приобрести постоянную скидку сектора." }],
  ["cell-3", "special"],
  ["cell-8", "resource-prm", "PRM", { title: "Биржа PRM", description: "Купить PRM по текущей рыночной цене или приобрести актив закупочного сектора." }],
  ["cell-14", "resource-prm", "PRM", { title: "Оптовый поставщик PRM", description: "Купить PRM и получить возможность приобрести постоянную скидку сектора." }],
  ["cell-7", "special"],
  ["cell-9", "resource-dtl", "DTL", { title: "Биржа DTL", description: "Купить DTL по текущей рыночной цене или приобрести актив закупочного сектора." }],
  ["cell-13", "resource-dtl", "DTL", { title: "Оптовый поставщик DTL", description: "Купить DTL и получить возможность приобрести постоянную скидку сектора." }],
  ["cell-33", "special"],
  ["cell-10", "corner"],
  ["cell-12", "logistics-network"],
  ["cell-16", "logistics-network"],
  ["cell-15", "logistics-network"],
  ["cell-19", "special"],
  ["cell-18", "logistics-network"],
  ["cell-5", "logistics-network"],
  ["cell-25", "logistics-network"],
  ["cell-35", "logistics-network"],
  ["cell-22", "special"],
  ["cell-20", "corner"],
  ["cell-4", "contract-local"],
  ["cell-17", "contract-local"],
  ["cell-37", "special", null, { type: "tender", title: "Открытый тендер", sourceType: "Тендер", description: "Выбрать тендер из открытой витрины и подать заявку." }],
  ["cell-21", "contract-industry"],
  ["cell-23", "contract-industry"],
  ["cell-2", "contract-industry"],
  ["cell-24", "contract-fleet"],
  ["cell-36", "contract-fleet"],
  ["cell-38", "contract-fleet"],
  ["cell-30", "corner"],
  ["cell-31", "service-network"],
  ["cell-26", "special"],
  ["cell-28", "special"],
  ["cell-32", "service-network"],
  ["cell-27", "special"],
  ["cell-39", "special"],
  ["cell-34", "service-network"],
  ["cell-29", "special"],
  ["cell-40", "special"],
];
const sectorMeta = {
  "resource-reg": { title: "Закупка REG", short: "REG", color: "#d9544d", bonus: "Каждый актив снижает цену REG на 1 млн; полный сектор дает еще -1 млн." },
  "resource-prm": { title: "Закупка PRM", short: "PRM", color: "#d55b9f", bonus: "Каждый актив снижает цену PRM на 1 млн; полный сектор дает еще -1 млн." },
  "resource-dtl": { title: "Закупка DTL", short: "DTL", color: "#416aa6", bonus: "Каждый актив снижает цену DTL на 1 млн; полный сектор дает еще -1 млн." },
  "logistics-network": { title: "Логистическая сеть", short: "Логистика", color: "#56bfc8", bonus: "Активы снижают стоимость маршрутов; полная сеть делает логистику бесплатной." },
  "contract-local": { title: "Локальные клиенты", short: "Локальные", color: "#9b6947", bonus: "Каждый актив усиливает доход; полный сектор дает +2 млн к поставке." },
  "contract-industry": { title: "Корпоративные клиенты", short: "Корпоративные", color: "#d7ae28", bonus: "Каждый актив усиливает доход; полный сектор дает +2 млн к поставке." },
  "contract-fleet": { title: "Транспортные клиенты", short: "Транспорт", color: "#e58b32", bonus: "Каждый актив усиливает доход; полный сектор дает +2 млн к поставке." },
  "service-network": { title: "Сервисный контур", short: "Сервис", color: "#3b8f66", bonus: "Каждый актив увеличивает брокерскую комиссию; полный сектор дает еще +2 млн." },
};
const boardShortTitles = {
  "cell-1": "Старт",
  "cell-6": "Биржа REG",
  "cell-11": "Поставщик REG",
  "cell-8": "Биржа PRM",
  "cell-14": "Поставщик PRM",
  "cell-9": "Биржа DTL",
  "cell-13": "Поставщик DTL",
  "cell-3": "Событие",
  "cell-7": "Карта рынка",
  "cell-10": "Претензия",
  "cell-2": "Региональный клиент",
  "cell-12": "ЖД: отправка",
  "cell-16": "Нефтебаза МСК",
  "cell-15": "ЖД: окно",
  "cell-19": "Событие",
  "cell-18": "Нефтебаза Волга",
  "cell-5": "Автомаршрут",
  "cell-25": "ЖД: мощность",
  "cell-35": "ЖД: назначение",
  "cell-22": "ПРОЛЕУМ",
  "cell-20": "Переговоры",
  "cell-4": "Небольшая АЗС",
  "cell-17": "Заявка клиента",
  "cell-37": "Открытый тендер",
  "cell-21": "Промышленность",
  "cell-23": "Агрохолдинг",
  "cell-33": "ПРОЛЕУМ",
  "cell-24": "Сеть АЗС",
  "cell-36": "Автопарк",
  "cell-38": "Крупный клиент",
  "cell-30": "Блокировка",
  "cell-31": "Коды клиента",
  "cell-26": "Hedge REG",
  "cell-28": "Рыночный шок",
  "cell-32": "Брокерский контур",
  "cell-27": "Hedge PRM",
  "cell-39": "Событие",
  "cell-34": "Комиссия",
  "cell-29": "Hedge DTL",
  "cell-40": "Премия к индексу",
};
const entityLabels = {
  boardCells: "Поле",
  contracts: "Контракты",
  tenders: "Тендеры",
  marketCards: "Рынок",
  events: "События",
  proleumCards: "ПРОЛЕУМ",
  assets: "Активы",
};
const proleumLogo = `
  <div class="proleumLogo" aria-label="ПРОЛЕУМ">
    <span class="dotGrid">${Array.from({ length: 9 }, () => "<i></i>").join("")}</span>
    <strong>ПРОЛЕУМ</strong>
  </div>`;
let state = loadState();
let user = loadUser();
let view = "rooms";
let activeRoomId = null;
let editorKind = "contracts";
let editorSelectedId = null;
const root = document.querySelector("#root");
let lastSyncedState = "";
let modalState = null;
let diceState = null;
let sidePanel = null;
let dockOpen = false;
let marketOpen = false;
let pushInFlight = false;
let pushQueued = false;
let localMutationUntil = 0;
let expiringTurn = false;

normalizeState(state);
applyStartupRoute();

window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY) {
    state = loadState();
    render();
  }
});

render();
syncFromServer();
window.setInterval(syncFromServer, 1800);
window.setInterval(updateTurnClock, 250);

function card(id, title, type, description, resource, routes, duration, income, risk, effect) {
  return { id, title, type, description, resource, routes, duration, income, risk, effect };
}

function simple(id, title, type, description, effect = "") {
  return { id, title, type, description, effect };
}

function asset(id, title, cost, description, effect) {
  return { id, title, type: "актив", cost, description, effect };
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function arrangeBoardCells(cells = []) {
  const byId = new Map(cells.map((cell) => [cell.id, cell]));
  return boardLayout
    .map(([id, sector, resourceCode, override], index) => {
      const source = byId.get(id);
      if (!source) return null;
      return {
        ...source,
        ...(override || {}),
        index: index + 1,
        sector,
        resourceCode: resourceCode || source.resourceCode || "",
        sectorTitle: sectorMeta[sector]?.title || "",
        sectorColor: sectorMeta[sector]?.color || "",
        buyable: sectorMeta[sector] ? true : override?.buyable ?? source.buyable,
      };
    })
    .filter(Boolean);
}

function deckWindow(collection = [], offset = 0, count = 1) {
  if (!collection.length || count <= 0) return [];
  return Array.from({ length: Math.min(count, collection.length) }, (_, index) => collection[(offset + index) % collection.length]);
}

function dealMarketKey(kind) {
  return kind === "tenders" ? "tenderMarketIds" : "contractMarketIds";
}

function dealCursorKey(kind) {
  return kind === "tenders" ? "tenderDeckCursor" : "contractDeckCursor";
}

function dealMarketSize(room, kind, config = state.config) {
  const playerCount = String(Math.max(2, Math.min(6, room.players?.length || 2)));
  return kind === "tenders"
    ? config.settings?.tendersByPlayers?.[playerCount] || 1
    : config.settings?.contractsByPlayers?.[playerCount] || 5;
}

function ensureDealMarket(room, kind, config = state.config) {
  const collection = config[kind] || [];
  const marketKey = dealMarketKey(kind);
  const cursorKey = dealCursorKey(kind);
  room[marketKey] ||= [];
  room[cursorKey] ??= 0;
  const targetSize = Math.min(dealMarketSize(room, kind, config), collection.length);
  room[marketKey] = room[marketKey]
    .filter((id, index, ids) => ids.indexOf(id) === index && collection.some((card) => card.id === id))
    .slice(0, targetSize);
  let attempts = 0;
  while (room[marketKey].length < targetSize && attempts < collection.length * 2) {
    const card = collection[room[cursorKey] % collection.length];
    room[cursorKey] = (room[cursorKey] + 1) % Math.max(1, collection.length);
    attempts += 1;
    if (card && !room[marketKey].includes(card.id)) room[marketKey].push(card.id);
  }
  return room[marketKey].map((id) => collection.find((card) => card.id === id)).filter(Boolean);
}

function replaceMarketDeal(room, kind, takenId) {
  const marketKey = dealMarketKey(kind);
  room[marketKey] = (room[marketKey] || []).filter((id) => id !== takenId);
  ensureDealMarket(room, kind);
}

function startTurnClock(room) {
  room.turnStartedAt = new Date().toISOString();
  room.turnDeadline = new Date(Date.now() + TURN_DURATION_MS).toISOString();
}

function turnRemainingMs(room) {
  return Math.max(0, (Date.parse(room?.turnDeadline || "") || 0) - Date.now());
}

function updateTurnClock() {
  const room = activeRoom();
  if (!room) return;
  const remaining = turnRemainingMs(room);
  const ratio = Math.max(0, Math.min(1, remaining / TURN_DURATION_MS));
  document.querySelectorAll("[data-turn-deadline]").forEach((timer) => {
    timer.querySelector("i")?.style.setProperty("width", `${ratio * 100}%`);
    const seconds = Math.ceil(remaining / 1000);
    const label = timer.querySelector("span");
    if (label) label.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
    timer.classList.toggle("urgent", remaining > 0 && remaining <= 15_000);
    timer.classList.toggle("expired", remaining <= 0);
  });
  if (remaining <= 0 && room.status === "active" && room.players.length && room.lastExpiredDeadline !== room.turnDeadline) {
    expireTurn(room);
  }
}

function expireTurn(room) {
  if (expiringTurn || !room || room.lastExpiredDeadline === room.turnDeadline) return;
  expiringTurn = true;
  const expiredDeadline = room.turnDeadline;
  const player = currentPlayer(room);
  room.lastExpiredDeadline = expiredDeadline;
  room.log.unshift(`${player?.name || "Игрок"}: время хода истекло.`);
  const nextTurn = (room.currentTurn + 1) % room.players.length;
  room.currentTurn = nextTurn;
  room.turnState = normalizeTurnState();
  startTurnClock(room);
  if (nextTurn === 0) {
    if (room.day >= (room.maxDays || 6)) {
      finishGame(room);
      modalState = { type: "finalResults" };
    } else {
      refreshTradingDay(room, "Завершен полный круг ходов.");
      modalState = null;
    }
  } else {
    modalState = null;
  }
  commit();
  expiringTurn = false;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      normalizeState(parsed);
      return parsed;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return { config: clone(defaultConfig), rooms: [], deletedRoomIds: [] };
}

function loadUser() {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function commit() {
  const room = activeRoom();
  if (room) {
    room.revision = (room.revision || 0) + 1;
    room.updatedAt = new Date().toISOString();
  }
  const serialized = JSON.stringify(state);
  localStorage.setItem(STORAGE_KEY, serialized);
  lastSyncedState = serialized;
  localMutationUntil = Date.now() + 5000;
  pushToServer();
  render();
}

async function syncFromServer() {
  if (pushInFlight || Date.now() < localMutationUntil) return;
  try {
    const response = await fetch("./api/state", { cache: "no-store" });
    if (!response.ok) return;
    const remote = await response.json();
    if (!remote) {
      await pushToServer();
      return;
    }
    if (!remote.rooms?.length && state.rooms?.length) {
      await pushToServer();
      return;
    }
    normalizeState(remote);
    const deleted = new Set(state.deletedRoomIds || []);
    const localById = new Map(state.rooms.map((room) => [room.id, room]));
    let changed = false;
    remote.rooms.forEach((remoteRoom) => {
      if (deleted.has(remoteRoom.id)) return;
      const localRoom = localById.get(remoteRoom.id);
      const remoteRevision = Number(remoteRoom.revision || 0);
      const localRevision = Number(localRoom?.revision || 0);
      const remoteTime = Date.parse(remoteRoom.updatedAt || 0) || 0;
      const localTime = Date.parse(localRoom?.updatedAt || 0) || 0;
      if (!localRoom || remoteRevision > localRevision || (remoteRevision === localRevision && remoteTime > localTime)) {
        localById.set(remoteRoom.id, remoteRoom);
        changed = true;
      }
    });
    if (changed) {
      state.rooms = [...localById.values()].filter((room) => !deleted.has(room.id));
      const serialized = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, serialized);
      lastSyncedState = serialized;
      applyStartupRoute();
      render();
    }
  } catch {
    // Static-file fallback: localStorage remains the source of truth.
  }
}

async function pushToServer() {
  if (pushInFlight) {
    pushQueued = true;
    return;
  }
  pushInFlight = true;
  try {
    const serialized = JSON.stringify(state);
    lastSyncedState = serialized;
    const response = await fetch("./api/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: serialized,
    });
    if (response.ok) localMutationUntil = Date.now() + 1200;
  } catch {
    // Static-file fallback: localStorage remains the source of truth.
  } finally {
    pushInFlight = false;
    if (pushQueued) {
      pushQueued = false;
      pushToServer();
    }
  }
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function scorePlayer(player) {
  return (
    Math.floor(player.money / 5) +
    (player.completedContracts || []).reduce((sum, contract) => sum + (contract.brokered ? 1 : contract.victoryPoints || { "малый": 1, "средний": 2, "крупный": 3, "тендер": 4 }[contract.type] || 1), 0) +
    Math.floor(player.reputation / 2) +
    Math.floor(player.efficiency / 2) +
    Math.floor(player.influence / 2) -
    (player.failedContracts?.length || 0) * 2
  );
}

function activeRoom() {
  const room = state.rooms.find((room) => room.id === activeRoomId);
  if (room) return room;
  if (view === "game" && state.rooms[0]) {
    activeRoomId = state.rooms[0].id;
    return state.rooms[0];
  }
  return null;
}

function applyStartupRoute() {
  const match = window.location.hash.match(/room=([^&]+)/);
  if (!match) return;
  const roomId = decodeURIComponent(match[1]);
  if (state.rooms.some((room) => room.id === roomId)) {
    activeRoomId = roomId;
    view = "game";
  }
}

function normalizeState(nextState) {
  if (!nextState.config || nextState.config.version !== defaultConfig.version) {
    nextState.config = clone(defaultConfig);
  }
  nextState.config.boardCells = arrangeBoardCells(nextState.config.boardCells);
  nextState.rooms ||= [];
  nextState.deletedRoomIds ||= [];
  nextState.rooms.forEach((room) => {
    room.day ||= 1;
    room.currentTurn ||= 0;
    room.ownerName ||= room.players?.[0]?.name || "";
    room.mode ||= "Standard";
    room.maxDays ||= nextState.config?.settings?.modes?.[room.mode]?.days || 6;
    room.status ||= "active";
    room.revision ||= 0;
    room.updatedAt ||= "";
    room.turnStartedAt ||= new Date().toISOString();
    room.turnDeadline ||= new Date(Date.now() + TURN_DURATION_MS).toISOString();
    room.marketCardIndex ||= 0;
    room.eventCardIndex ||= 0;
    room.proleumCardIndex ||= 0;
    room.tradeOffers ||= [];
    room.log ||= [];
    room.players ||= [];
    room.assetOwnership ||= {};
    room.turnState = normalizeTurnState(room.turnState);
    room.market ||= createMarket(room);
    normalizeMarket(room);
    room.players.forEach((player, index) => normalizePlayer(player, index));
    ensureDealMarket(room, "contracts", nextState.config);
    ensureDealMarket(room, "tenders", nextState.config);
  });
}

function normalizePlayer(player, index = 0) {
  player.id ||= uid("player");
  player.color ||= palette[index % palette.length];
  player.position ||= 0;
  player.money ??= state.config?.settings?.startingMoney || 25;
  player.reputation ??= 3;
  player.efficiency ??= 3;
  player.influence ??= 3;
  player.warehouse ||= { REG: 0, PRM: 0, DTL: 0 };
  player.activeContracts ||= [];
  player.completedContracts ||= [];
  player.failedContracts ||= [];
  player.assets ||= [];
  player.proleumCards ||= [];
  player.hedgeTokens ||= [];
  player.brokeredContracts ||= [];
  player.lap ??= 0;
  player.assetPurchasedLap ??= -1;
}

function normalizeTurnState(turnState = {}) {
  return {
    rolled: Boolean(turnState.rolled),
    promptDismissed: Boolean(turnState.promptDismissed),
    commercialActionUsed: Boolean(turnState.commercialActionUsed),
    cellActionUsed: Boolean(turnState.cellActionUsed),
    proleumPlayed: Boolean(turnState.proleumPlayed),
    negotiationUsed: Boolean(turnState.negotiationUsed),
    logisticsBonus: turnState.logisticsBonus || null,
    proleumRiskReduction: Number(turnState.proleumRiskReduction || 0),
    proleumLogisticsDiscount: Number(turnState.proleumLogisticsDiscount || 0),
    proleumIncomePenalty: Number(turnState.proleumIncomePenalty || 0),
    skipRisk: Boolean(turnState.skipRisk),
    extraRail: Number(turnState.extraRail || 0),
    brokerBonus: Number(turnState.brokerBonus || 0),
  };
}

function createMarket(room) {
  const playerCount = Math.max(2, Math.min(6, room.players?.length || 2));
  const volumes = clone(resourceVolumesByPlayers[playerCount]);
  const logistics = clone(logisticsByPlayers[playerCount]);
  const prices = Object.fromEntries(Object.entries(resourceMeta).map(([code, meta]) => [code, meta.basePrice]));
  applyMarketCardEffect(prices, volumes, logistics, state.config.marketCards[room.marketCardIndex % state.config.marketCards.length]);
  return {
    day: room.day || 1,
    cardId: state.config.marketCards[room.marketCardIndex % state.config.marketCards.length]?.id,
    prices,
    stock: volumes,
    logistics,
    usedLogistics: { rail: 0, depot: 0 },
  };
}

function normalizeMarket(room) {
  room.market ||= createMarket(room);
  room.market.prices ||= {};
  room.market.stock ||= {};
  room.market.logistics ||= {};
  room.market.usedLogistics ||= { rail: 0, depot: 0 };
  Object.entries(resourceMeta).forEach(([code, meta]) => {
    room.market.prices[code] ??= meta.basePrice;
    room.market.stock[code] ??= resourceVolumesByPlayers[Math.max(2, Math.min(6, room.players.length))][code];
  });
  room.market.logistics.rail ??= logisticsByPlayers[Math.max(2, Math.min(6, room.players.length))].rail;
  room.market.logistics.depot ??= logisticsByPlayers[Math.max(2, Math.min(6, room.players.length))].depot;
  room.market.usedLogistics.rail ??= 0;
  room.market.usedLogistics.depot ??= 0;
}

function applyMarketCardEffect(prices, stock, logistics, marketCard) {
  if (!marketCard) return;
  Object.entries(marketCard.priceDelta || {}).forEach(([code, delta]) => {
    prices[code] = Math.max(1, (prices[code] || resourceMeta[code]?.basePrice || 1) + Number(delta || 0));
  });
  Object.entries(marketCard.stockDelta || {}).forEach(([code, delta]) => {
    stock[code] = Math.max(0, (stock[code] || 0) + Number(delta || 0));
  });
  logistics.rail = Math.max(0, (logistics.rail || 0) + Number(marketCard.logisticsDelta?.rail || 0));
  logistics.depot = Math.max(0, (logistics.depot || 0) + Number(marketCard.logisticsDelta?.depot || 0));
}

function currentPlayer(room) {
  return room.players[room.currentTurn % Math.max(room.players.length, 1)];
}

function userPlayer(room) {
  return room.players.find((player) => player.name === user.name);
}

function canUserAct(room) {
  const current = currentPlayer(room);
  return Boolean(current && current.name === user.name);
}

function cloneDeal(entity, room) {
  return {
    instanceId: uid("deal"),
    cardId: entity.id,
    title: entity.title,
    type: entity.type,
    description: entity.description,
    resource: clone(entity.resource || {}),
    filled: { REG: 0, PRM: 0, DTL: 0 },
    routes: clone(entity.routes || []),
    duration: Math.max(2, entity.duration || 3),
    acceptedDay: room?.day || 1,
    income: entity.income || 0,
    risk: entity.risk ?? 0,
    category: entity.category || "",
    size: entity.size || entity.type,
    brokerFee: entity.brokerFee || 0,
    victoryPoints: entity.victoryPoints || ({ "малый": 1, "средний": 2, "крупный": 3, "тендер": 4 }[entity.type] || 1),
    requirement: entity.requirement || "",
    effect: entity.effect || "",
  };
}

function resourceTotal(resource = {}) {
  return Object.values(resource).reduce((sum, value) => sum + Number(value || 0), 0);
}

function isContractFilled(contract) {
  return Object.entries(contract.resource || {}).every(([code, amount]) => (contract.filled?.[code] || 0) >= amount);
}

function missingResources(contract) {
  return Object.fromEntries(
    Object.entries(contract.resource || {}).map(([code, amount]) => [code, Math.max(0, Number(amount || 0) - Number(contract.filled?.[code] || 0))]),
  );
}

function contractReady(contract) {
  return Object.values(missingResources(contract)).every((value) => value === 0);
}

function currentCell(room, player = currentPlayer(room)) {
  return state.config.boardCells[player?.position || 0];
}

function isCurrentCell(room, cellId, player = currentPlayer(room)) {
  return currentCell(room, player)?.id === cellId;
}

function warehouseUsed(player) {
  return resourceTotal(player.warehouse || {});
}

function warehouseCapacity(player) {
  const depotBonus = (player.assets || []).filter((item) => item.type === "depot").length * 2;
  return (state.config?.settings?.warehouseBase || 3) + depotBonus;
}

function ownedAssetCount(player, type) {
  return (player.assets || []).filter((item) => item.type === type).length;
}

function sectorCells(sector) {
  return state.config.boardCells.filter((cell) => cell.sector === sector && cell.buyable !== false);
}

function ownedSectorAssets(player, sector) {
  const sectorIds = new Set(sectorCells(sector).map((cell) => cell.id));
  return (player.assets || []).filter((asset) => sectorIds.has(asset.cellId));
}

function ownsSector(player, sector) {
  const cells = sectorCells(sector);
  return cells.length > 0 && ownedSectorAssets(player, sector).length === cells.length;
}

function completedContractSectors(player) {
  return ["contract-local", "contract-industry", "contract-fleet"].filter((sector) => ownsSector(player, sector)).length;
}

function resourceAssetDiscount(player, code) {
  const sector = code === "PRM" ? "resource-prm" : code === "DTL" ? "resource-dtl" : "resource-reg";
  return Math.min(2, ownedSectorAssets(player, sector).length) + (ownsSector(player, sector) ? 1 : 0);
}

function assetBenefitText(type) {
  const benefits = {
    supplier: "Скидка 1 млн на каждый жетон при закупке ресурса.",
    client: "+1 млн к доходу прямой поставки, максимум +2 млн.",
    broker: "+1 млн к брокерской комиссии.",
    rail: "Скидка 1 млн на ЖД-логистику, максимум -2 млн.",
    road: "Скидка 1 млн на автомаршрут.",
    depot: "+2 места на складе и -1 риск маршрута через нефтебазу.",
  };
  return benefits[type] || "Актив учитывается в рейтинге компании.";
}

function resourceBuyLimit(room, player) {
  const cellType = currentCell(room, player)?.type;
  return ["supplier", "market"].includes(cellType) ? 3 : 2;
}

function actionGate(room, player, options = {}) {
  if (!room || !player || !canUserAct(room)) return "Сейчас ходит другой игрок.";
  if (room.status === "finished") return "Партия завершена.";
  const turn = normalizeTurnState(room.turnState);
  const cell = currentCell(room, player);
  if (options.requiresRolled && !turn.rolled) return "Сначала бросьте кубики.";
  if (options.commercial && turn.commercialActionUsed) return "Коммерческое действие в этот ход уже использовано.";
  if (options.cellAction && turn.cellActionUsed) return "Действие клетки в этот ход уже использовано.";
  if (options.cells?.length && !options.cells.includes(cell?.type)) {
    return `Это действие доступно на клетках: ${options.cells.map(cellTypeLabel).join(", ")}.`;
  }
  if (options.cellId && !isCurrentCell(room, options.cellId, player)) return "Нельзя выполнить действие чужой клетки: нужно стоять на ней.";
  return "";
}

function markCommercialAction(room) {
  room.turnState = normalizeTurnState(room.turnState);
  room.turnState.commercialActionUsed = true;
  room.turnState.promptDismissed = true;
}

function markCellAction(room) {
  room.turnState = normalizeTurnState(room.turnState);
  room.turnState.cellActionUsed = true;
  room.turnState.promptDismissed = true;
}

function rejectAction(room, message) {
  if (room && message) room.log.unshift(`Действие недоступно: ${message}`);
  modalState = { type: "notice", title: "Действие недоступно", message };
  commit();
}

function cellTypeLabel(type) {
  const labels = {
    supplier: "поставщик",
    market: "биржа",
    contract: "контракт",
    client: "клиент",
    tender: "тендер",
    hedge: "хедж MOEX",
    broker: "брокерка",
    marketCard: "карта рынка",
    claim: "претензия",
    meeting: "планерка",
    block: "блокировка",
    rail: "ЖД-узел",
    depot: "нефтебаза",
    road: "автомаршрут",
    asset: "актив",
    proleum: "ПРОЛЕУМ",
    event: "событие",
    risk: "риск",
    penalty: "штраф",
    pause: "пауза",
  };
  return labels[type] || type;
}

function assetCostForCell(cell) {
  const costs = { depot: 12, rail: 10, road: 7, client: 8, supplier: 8, broker: 9, asset: 8 };
  return costs[cell?.type] || 10;
}

function routeOptions(room, contract, player = userPlayer(room) || currentPlayer(room)) {
  const total = resourceTotal(contract.resource);
  const market = room.market || createMarket(room);
  const availableRail = Math.max(0, (market.logistics.rail || 0) + Number(room.turnState?.extraRail || 0) - (market.usedLogistics.rail || 0));
  const availableDepot = Math.max(0, (market.logistics.depot || 0) - (market.usedLogistics.depot || 0));
  const allowed = contract.routes || [];
  const turnBonus = room.turnState?.logisticsBonus;
  const logisticsMonopoly = ownsSector(player, "logistics-network");
  const roadDiscount = Math.min(1, ownedAssetCount(player, "road")) + (turnBonus === "road" ? 1 : 0);
  const railDiscount = Math.min(2, ownedAssetCount(player, "rail")) + (turnBonus === "rail" ? 1 : 0);
  const depotDiscount = turnBonus === "depot" ? 1 : 0;
  const proleumDiscount = Number(room.turnState?.proleumLogisticsDiscount || 0);
  const options = [];

  if (allowed.some((route) => route.includes("Авто")) && total <= 2) {
    options.push({
      key: "auto",
      title: "Авто",
      cost: logisticsMonopoly ? 0 : Math.max(1, total - roadDiscount - proleumDiscount),
      rail: 0,
      depot: 0,
      risk: 0,
      available: true,
      note: logisticsMonopoly ? "Полная логистическая сеть: маршрут бесплатный." : roadDiscount || proleumDiscount ? "Тактическая скидка применена." : "Быстро, без общей мощности, только малые поставки.",
    });
  }
  if (allowed.some((route) => route === "ЖД" || route.includes("ЖД"))) {
    const cost = logisticsMonopoly ? 0 : Math.max(1, 2 + Math.ceil(total / 2) - railDiscount - proleumDiscount);
    options.push({ key: "rail", title: "ЖД", cost, rail: 1, depot: 0, risk: turnBonus === "rail" || logisticsMonopoly ? 0 : 1, available: availableRail >= 1, note: logisticsMonopoly ? "Полная логистическая сеть: маршрут бесплатный и не добавляет риск." : railDiscount ? "Скидка ЖД-актива или клетки применена." : "Дешевле на объеме, но повышает операционный риск." });
  }
  if (allowed.some((route) => route.toLowerCase().includes("нефтебаза"))) {
    const cost = logisticsMonopoly ? 0 : Math.max(1, 3 + Math.ceil(total / 2) - railDiscount - depotDiscount - proleumDiscount);
    options.push({ key: "rail-depot", title: "ЖД + нефтебаза", cost, rail: 1, depot: 1, risk: 0, available: availableRail >= 1 && availableDepot >= 1, note: logisticsMonopoly ? "Полная логистическая сеть: маршрут бесплатный." : depotDiscount ? "Бонус нефтебазы применен." : "Надежнее для крупных сделок, занимает две мощности." });
  }

  return options;
}

function riskLevel(contract, route, player, room = activeRoom()) {
  const base = Number.isFinite(Number(contract.risk)) ? Number(contract.risk) : { "низкий": 0, "средний": 1, "высокий": 2, "тендер": 2 }[contract.risk] ?? 1;
  const efficiencyReduce = player.efficiency >= 5 ? 1 : 0;
  const depotReduce = route?.key === "rail-depot" && ownedAssetCount(player, "depot") ? 1 : 0;
  const proleumReduce = Number(room?.turnState?.proleumRiskReduction || 0);
  return Math.max(0, base + (route?.risk || 0) - efficiencyReduce - depotReduce - proleumReduce);
}

function riskChance(level) {
  return level <= 0 ? 0 : Math.round((Math.min(5, level + 1) / 6) * 100);
}

function resolveRisk(room, player, contract, route) {
  const risk = riskLevel(contract, route, player);
  if (room.turnState?.skipRisk) return { triggered: false, risk, penalty: 0, dice: null, eventCard: null, skipped: true };
  if (risk <= 0) return { triggered: false, risk, penalty: 0, dice: null, eventCard: null };
  const dice = Math.ceil(Math.random() * 6);
  const threshold = Math.min(5, risk + 1);
  const triggered = dice <= threshold;
  if (!triggered) return { triggered, risk, penalty: 0, dice, eventCard: null };
  const eventCard = state.config.events[(room.log.length + room.day + risk) % state.config.events.length];
  const penalty = Math.min(4, 1 + risk);
  player.money = Math.max(0, player.money - penalty);
  return { triggered, risk, penalty, dice, eventCard };
}

function render() {
  if (!user) {
    root.innerHTML = loginMarkup();
    bindLogin();
    return;
  }

  const room = activeRoom();
  root.innerHTML = `
    <div class="app ${view === "game" ? "gameApp" : ""}">
      <aside class="sidebar">
        <div class="brand">
          ${proleumLogo}
          <div><span>Сделка на миллион тонн</span></div>
        </div>
        ${navButton("rooms", "Комнаты")}
        ${navButton("game", "Игра", !room)}
        ${navButton("rules", "Правила")}
        ${user.role === "admin" ? navButton("editor", "Редактор") : ""}
        <div class="sidebarFooter">
          <div class="userBadge"><span class="iconBox">ID</span><div><strong>${escapeHtml(user.name)}</strong><span>${user.role === "admin" ? "Администратор" : "Игрок"}</span></div></div>
          <button class="ghostButton" data-action="logout">Выйти</button>
        </div>
      </aside>
      <main class="workspace">
        <header class="topbar">
          <div class="topIdentity">
            ${view === "game" ? proleumLogo : ""}
            <div>
            <span class="kicker">Тестовый мультиплеерный прототип</span>
            <h1>${view === "game" && room ? escapeHtml(room.name) : "ПРОЛЕУМ: торговая партия для VIP-клиентов"}</h1>
            </div>
          </div>
          <div class="statusStrip">
            ${view === "game" ? `<button class="miniNav" data-view="rooms">Комнаты</button><button class="miniNav" data-view="rules">Правила</button>` : ""}
            ${room ? `<span>Комната: ${room.id}</span>` : ""}
            <span>${user.role === "admin" ? "Редактирование включено" : "Режим игрока"}</span>
          </div>
        </header>
        ${view === "rooms" ? roomsMarkup() : ""}
        ${view === "game" && room ? gameMarkup(room) : ""}
        ${view === "rules" ? rulesMarkup() : ""}
        ${view === "editor" && user.role === "admin" ? editorMarkup() : ""}
        ${turnPromptMarkup()}
        ${modalMarkup()}
        ${diceOverlayMarkup()}
      </main>
    </div>`;
  bindCommon();
  window.requestAnimationFrame(updateTurnClock);
}

function loginMarkup() {
  return `
    <main class="login">
      <section class="loginPanel">
        <div class="heroBrand">${proleumLogo}<span class="tradingBadge">трейдинг</span></div>
        <h1>Премиальная нефтетрейдинговая партия для закрытых клиентов</h1>
        <label>Имя<input id="login-name" value="Тестовый игрок" /></label>
        <div class="segmented">
          <button class="active" data-role="admin">Админ</button>
          <button data-role="player">Игрок</button>
        </div>
        <button class="primaryButton" data-action="login">Войти</button>
      </section>
    </main>`;
}

function bindLogin() {
  let role = "admin";
  document.querySelectorAll("[data-role]").forEach((button) => {
    button.addEventListener("click", () => {
      role = button.dataset.role;
      document.querySelectorAll("[data-role]").forEach((item) => item.classList.toggle("active", item === button));
    });
  });
  document.querySelector("[data-action='login']").addEventListener("click", () => {
    const name = document.querySelector("#login-name").value.trim() || "Игрок";
    user = { name, role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    render();
  });
}

function navButton(target, label, disabled = false) {
  return `<button class="navButton ${view === target ? "active" : ""}" ${disabled ? "disabled" : ""} data-view="${target}">${label}</button>`;
}

function roomsMarkup() {
  return `
    <section class="roomsLayout">
      <div class="panel createRoom">
        <h2>Создать комнату</h2>
        <p>Комнаты сохраняются локально и синхронизируются между вкладками браузера для быстрых тестов сценариев.</p>
        <input id="room-name" value="Тестовая партия PROLEUM" />
        <label class="roomModeLabel">Режим
          <select id="room-mode">
            <option value="Briefing">Briefing · 5 дней</option>
            <option value="Standard" selected>Standard · 6 дней</option>
            <option value="Signature">Signature · 8 дней</option>
          </select>
        </label>
        <button class="primaryButton" data-action="create-room">Создать</button>
      </div>
      <div class="roomGrid">
        ${state.rooms.map(roomCardMarkup).join("") || `<div class="panel"><h2>Комнат пока нет</h2><p>Создай первую тестовую партию и открой эту страницу во второй вкладке, чтобы имитировать второго игрока.</p></div>`}
      </div>
    </section>`;
}

function roomCardMarkup(room) {
  const initials = room.players.map((player) => `<span style="background:${player.color}">${escapeHtml(player.name.slice(0, 1).toUpperCase())}</span>`).join("");
  const isMember = room.players.some((player) => player.name === user.name);
  const canDelete = user.role === "admin" || room.ownerName === user.name;
  return `
    <article class="roomCard ${room.id === activeRoomId ? "active" : ""}">
      <div><h3>${escapeHtml(room.name)}</h3><span>${room.players.length} игроков · ${escapeHtml(room.mode || "Standard")} · день ${room.day}/${room.maxDays || 6}${room.ownerName ? ` · владелец ${escapeHtml(room.ownerName)}` : ""}</span></div>
      <div class="miniPlayers">${initials}</div>
      <div class="roomActions">
        <button class="secondaryButton" data-copy="${room.id}">ID</button>
        <button class="secondaryButton" data-open-room="${room.id}">Открыть</button>
        <button class="primaryButton" data-join-room="${room.id}">${isMember ? "Войти" : "Присоединиться"}</button>
        ${isMember ? `<button class="secondaryButton" data-leave-room="${room.id}">Покинуть</button>` : ""}
        ${canDelete ? `<button class="dangerButton" data-delete-room="${room.id}">Удалить</button>` : ""}
      </div>
    </article>`;
}

function gameMarkup(room) {
  normalizeState(state);
  const mine = userPlayer(room);
  const acting = currentPlayer(room);
  const selected = state.config.boardCells.find((cell) => cell.id === room.selectedEntityId) || state.config.boardCells[acting?.position || 0] || state.config.boardCells[0];
  const contractReason = mine ? actionGate(room, mine, { requiresRolled: true, commercial: true, cells: ["contract", "client"] }) : "Вы не в комнате.";
  const tenderReason = mine ? actionGate(room, mine, { requiresRolled: true, commercial: true, cells: ["tender"] }) : "Вы не в комнате.";
  const contracts = ensureDealMarket(room, "contracts");
  const tenders = ensureDealMarket(room, "tenders");
  return `
    <section class="gameLayout gameShell">
      ${topBarMarkup(room, selected)}
      ${playerRailMarkup(room)}
      <div class="boardPanel">${boardMarkup(room, contracts, tenders, contractReason, tenderReason)}</div>
      ${playerDockMarkup(room)}
      ${sidePanelMarkup(room)}
    </section>`;
}

function turnPhase(room, selected) {
  const mine = userPlayer(room);
  const myTurn = canUserAct(room);
  const turnState = normalizeTurnState(room.turnState);
  if (room.status === "finished") return { id: "FINISHED", label: "Итоги", cta: "Показать результаты", hint: "Партия завершена.", action: "show-results" };
  if (!myTurn) return { id: "WAITING", label: "Ожидание", cta: "Не ваш ход", hint: `Ожидайте, сейчас ходит ${currentPlayer(room)?.name || "другой игрок"}.`, action: null };
  if (!turnState.rolled) return { id: "ROLL", label: "Бросок", cta: "Бросить кубики", hint: "Бросьте 2D6, чтобы перейти на клетку.", action: "roll" };
  if (!turnState.cellActionUsed) return { id: "CELL_ACTION", label: "Клетка", cta: "Открыть действие клетки", hint: `Вы на клетке "${selected?.title || ""}". Откройте действие или переходите к коммерции.`, action: "open-cell", cellId: selected?.id };
  if (!turnState.commercialActionUsed) return { id: "COMMERCIAL_ACTION", label: "Коммерция", cta: "Выбрать коммерческое действие", hint: "Сделайте одно коммерческое действие: ресурс, контракт, поставка, hedge или брокерка.", action: "commercial" };
  return { id: "TURN_END_READY", label: "Финал", cta: "Завершить ход", hint: "Основные действия выполнены. Завершите ход.", action: "end-turn" };
}

function topBarMarkup(room, selected) {
  const actingPlayer = currentPlayer(room);
  const turnState = normalizeTurnState(room.turnState);
  const phase = turnPhase(room, selected);
  const disabled = phase.action ? "" : "disabled";
  const canFinishEarly = canUserAct(room) && turnState.rolled && phase.id !== "TURN_END_READY";
  const incomingTrades = room.tradeOffers.filter((offer) => offer.status === "pending" && offer.buyerName === user.name);
  const canNegotiate = canUserAct(room) && turnState.rolled && !turnState.negotiationUsed && room.players.length > 1;
  return `<header class="topBar" data-turn="${room.currentTurn}-${room.day}">
    <div class="turnTimer" data-turn-deadline="${escapeHtml(room.turnDeadline || "")}"><i style="width:${Math.max(0, Math.min(100, (turnRemainingMs(room) / TURN_DURATION_MS) * 100))}%"></i><span>${Math.ceil(turnRemainingMs(room) / 1000)}</span></div>
    <div class="topBarMain">
      ${proleumLogo}
      <div class="turnIdentity">
        <span class="kicker">Текущий ход</span>
        <h2>${escapeHtml(actingPlayer?.name || "Нет игроков")}</h2>
        <p>${escapeHtml(phase.hint)}</p>
      </div>
      <div class="diceConsole ${diceState ? "isRolling" : ""}">
        <div class="dicePair"><span>${diceState?.a || "?"}</span><span>${diceState?.b || "?"}</span></div>
      </div>
      <div class="turnActions">
        <button class="primaryButton topCta" data-action="${phase.action || "noop"}" data-cell-id="${phase.cellId || ""}" ${disabled}>${escapeHtml(phase.cta)}</button>
        ${incomingTrades.length ? `<button class="secondaryButton iconButton tradeAlert" data-action="open-trades">Предложения ${incomingTrades.length}</button>` : ""}
        ${canNegotiate ? `<button class="secondaryButton iconButton" data-action="open-trade-builder">Сделка</button>` : ""}
        ${canFinishEarly ? `<button class="secondaryButton iconButton" data-action="end-turn" title="Завершить ход без обязательного действия">Завершить</button>` : ""}
        <details class="topMenu">
          <summary aria-label="Меню партии">•••</summary>
          <div>
            <button class="secondaryButton" data-side-panel="log">Журнал</button>
            <button class="secondaryButton" data-view="rules">Правила</button>
            <button class="secondaryButton" data-leave-room="${room.id}">Покинуть партию</button>
          </div>
        </details>
      </div>
    </div>
  </header>`;
}

function boardMarkup(room, openContracts, openTenders, contractReason, tenderReason) {
  normalizeMarket(room);
  const market = room.market;
  const marketCard = state.config.marketCards[room.marketCardIndex % state.config.marketCards.length];
  const player = currentPlayer(room);
  const resourceReason = userPlayer(room) ? actionGate(room, userPlayer(room), { requiresRolled: true, commercial: true, cells: ["supplier", "market"] }) : "Вы не в комнате.";
  const resourceCell = userPlayer(room) ? currentCell(room, userPlayer(room)) : null;
  return `
    <div class="board">
      ${state.config.boardCells
        .map((cell, index) => {
          const players = room.players.filter((player) => player.position === index);
          const owner = room.assetOwnership?.[cell.id];
          const isStanding = player?.position === index;
          const actionLabel = cellActionLabel(cell.type);
          return `<button class="boardCell type-${cell.type} sector-${cell.sector || "special"} ${owner ? "ownedCell" : ""} ${isStanding ? "currentCell" : ""}" data-cell="${cell.id}" style="--sector-color:${cell.sectorColor || "#a9aaa7"}">
            ${cell.sectorColor ? `<span class="sectorBand" aria-hidden="true"></span>` : ""}
            ${owner ? `<i class="ownerStrip" style="background:${owner.ownerId ? room.players.find((item) => item.id === owner.ownerId)?.color || "#ffcc00" : "#ffcc00"}"></i>` : ""}
            <span class="cellNumber">${index + 1}</span><small class="cellActionLabel">${escapeHtml(actionLabel)}</small><strong title="${escapeHtml(cell.title)}">${escapeHtml(boardShortTitles[cell.id] || cell.title)}</strong>
            ${owner ? `<em>${escapeHtml(owner.ownerName)}</em>` : ""}
            <div class="tokens">${players.map((player, tokenIndex) => `<i class="tokenShape token-${tokenIndex % 4}" style="--token-color:${player.color}" title="${escapeHtml(player.name)}"></i>`).join("")}</div>
          </button>`;
        })
        .join("")}
      <div class="boardCenter">
        <div class="boardLogo">${proleumLogo}<span>торговый день ${room.day}</span></div>
        <div class="centerMarket boardSummary">
          <section class="centerResourceBoard">
            <header><span>Рынок ресурсов</span><strong>Цена / остаток</strong></header>
            <div class="centerTickerGrid">
              ${Object.entries(resourceMeta).map(([code, meta]) => resourceTickerMarkup(code, meta, market, resourceReason || (resourceCell?.resourceCode && resourceCell.resourceCode !== code ? `На текущей клетке доступен только ${resourceCell.resourceCode}.` : ""), "centerTicker")).join("")}
            </div>
          </section>
          <section class="centerDayBoard">
            <button class="marketEvent marketDayCard" data-open-card="marketCard:${marketCard.id}">
              <span>Карта рынка</span>
              <strong>${escapeHtml(marketCard.title)}</strong>
              <small>${escapeHtml(marketCard.effect || marketCard.description)}</small>
            </button>
            <div class="centerLogistics">
              ${logisticMeter("ЖД", market.logistics.rail, market.usedLogistics.rail)}
              ${logisticMeter("Нефтебаза", market.logistics.depot, market.usedLogistics.depot)}
            </div>
          </section>
          ${centerDealsMarkup(openContracts, openTenders, contractReason, tenderReason)}
        </div>
      </div>
    </div>`;
}

function cellActionLabel(type) {
  const labels = {
    start: "СТАРТ",
    supplier: "РЕСУРСЫ",
    market: "РЕСУРСЫ",
    contract: "КОНТРАКТ",
    client: "КЛИЕНТ",
    tender: "ТЕНДЕР",
    proleum: "КАРТА",
    marketCard: "РЫНОК",
    hedge: "ХЕДЖ",
    broker: "БРОКЕР",
    rail: "ЖД",
    road: "АВТО",
    depot: "БАЗА",
    event: "СОБЫТИЕ",
    risk: "РИСК",
    penalty: "ШТРАФ",
    pause: "ПРОСТОЙ",
    claim: "ПРЕТЕНЗИЯ",
    block: "БЛОК",
    meeting: "ПРОЛЕУМ",
    asset: "АКТИВ",
  };
  return labels[type] || "ДЕЙСТВИЕ";
}

function centerDealsMarkup(contracts, tenders, contractReason, tenderReason) {
  return `<section class="centerDeals">
    <header><strong>Открытые сделки</strong><span>Взятая карта сразу заменяется следующей из колоды</span></header>
    <div class="centerDealGrid">
      ${contracts.map((contract) => centerDealCardMarkup(contract, "contract", contractReason)).join("")}
      ${tenders.map((tender) => centerDealCardMarkup(tender, "tender", tenderReason)).join("")}
    </div>
  </section>`;
}

function centerDealCardMarkup(deal, kind, reason) {
  const resource = Object.entries(deal.resource || {}).map(([code, amount]) => `${code}×${amount}`).join(" · ");
  const routes = (deal.routes || []).map((route) => route.replace("ЖД + нефтебаза", "ЖД+база")).join(" / ");
  return `<article class="centerDealCard ${kind === "tender" ? "isTender" : ""}" data-open-card="${kind === "tender" ? "tender" : "market"}:${deal.id}">
    <div><span>${kind === "tender" ? "Тендер" : deal.type}</span><strong>${escapeHtml(deal.title)}</strong></div>
    <p>${escapeHtml(resource)}${routes ? ` · ${escapeHtml(routes)}` : ""}</p>
    <footer><span>${deal.income || 0} млн · ${deal.duration || 0} дн.</span><button data-${kind === "tender" ? "take-tender" : "take-contract"}="${deal.id}" ${reason ? "disabled" : ""} title="${escapeHtml(reason || "")}">${kind === "tender" ? "Заявиться" : "Взять"}</button></footer>
  </article>`;
}

function resourceTickerMarkup(code, meta, market, resourceReason, className = "tickerRow") {
  const price = market.prices[code];
  const delta = price - meta.basePrice;
  return `<button class="${className} ${delta > 0 ? "priceUp" : delta < 0 ? "priceDown" : "priceFlat"}" data-buy-resource="${code}" ${resourceReason ? "disabled" : ""} title="${escapeHtml(resourceReason || `Купить ${code}`)}">
    <span class="tickerCode">${code}</span>
    <strong>${price} млн</strong>
    <span>${market.stock[code]} шт</span>
    <em>${delta > 0 ? "↑" : delta < 0 ? "↓" : "•"}${delta ? Math.abs(delta) : "0"}</em>
    <b>Купить</b>
  </button>`;
}

function marketTerminalMarkup(room, openContracts, openTenders, contractReason, tenderReason) {
  normalizeMarket(room);
  const marketCard = state.config.marketCards[room.marketCardIndex % state.config.marketCards.length];
  return `<aside class="marketPanel marketTerminal ${marketOpen ? "open" : ""}">
    <button class="marketHandle" data-action="toggle-market"><span>Сделки</span><b>${openContracts.length + openTenders.length}</b></button>
    <header class="terminalHeader"><div><span>Сделки рынка</span><strong>Контракты и тендер</strong></div><div><button class="ghostButton" data-open-card="marketCard:${marketCard.id}">Карта дня</button><button class="terminalClose" data-action="toggle-market" aria-label="Свернуть">×</button></div></header>
    <section class="terminalDeck"><h3>Открытые контракты</h3><div class="terminalScroll">${openContracts
      .map((item) => entityCardMarkup(item, true, { action: "take-contract", label: "Взять", disabled: Boolean(contractReason), reason: contractReason, source: "market" }))
      .join("")}</div></section>
    <section class="terminalDeck tenderDeck"><h3>Тендер дня</h3>${openTenders
      .map((item) => entityCardMarkup(item, true, { action: "take-tender", label: "Заявиться", disabled: Boolean(tenderReason), reason: tenderReason, source: "tender" }))
      .join("")}</section>
  </aside>`;
}

function logisticMeter(label, total, used) {
  const left = Math.max(0, total - used);
  const percent = total ? Math.round((left / total) * 100) : 0;
  return `<div class="logisticMeter"><div><span>${label}</span><strong>${left}/${total}</strong></div><i><b style="width:${percent}%"></b></i></div>`;
}

function entityCardMarkup(entity, compact = false, action = null) {
  const resource = entity.resource
    ? `<div class="resourceLine">${Object.entries(entity.resource).map(([code, amount]) => `<span>${code} x${amount}</span>`).join("")}</div>`
    : "";
  const routes = entity.routes?.length ? `<div class="routeLine">${entity.routes.map((route) => `<span>${escapeHtml(route)}</span>`).join("")}</div>` : "";
  const meta = entity.income ? `<div class="dealMetaLine"><span>${entity.income} млн</span><span>срок ${entity.duration}</span><span>риск ${entity.risk}</span>${entity.brokerFee ? `<span>брокерка ${entity.brokerFee}</span>` : ""}</div>` : "";
  const actionButton = action
    ? `<button class="cardAction" data-${action.action}="${entity.id}" ${action.disabled ? "disabled" : ""} title="${escapeHtml(action.reason || "")}">${escapeHtml(action.label)}</button>${action.disabled && action.reason ? `<small class="lockReason">${escapeHtml(action.reason)}</small>` : ""}`
    : "";
  return `
    <article class="entityCard gameCard cardM ${compact ? "compact" : ""}" data-open-card="${action?.source || "entity"}:${entity.id}">
      <div><span>${escapeHtml(entity.type)}</span><strong>${escapeHtml(entity.title)}</strong></div>
      <p>${escapeHtml(entity.description)}</p>
      ${meta}
      ${resource}
      ${routes}
      ${entity.effect ? `<small>${escapeHtml(entity.effect)}</small>` : ""}
      ${actionButton}
    </article>`;
}

function playerRailMarkup(room) {
  return `<aside class="playerRail">
    <div class="railHandle">Игроки</div>
    <div class="railStack">
      ${room.players
        .map(
          (player) => `<button class="railPlayer ${currentPlayer(room)?.id === player.id ? "current" : ""}" data-open-opponent="${player.id}">
            <header><i style="background:${player.color}"></i><strong>${escapeHtml(player.name)}</strong><span>${currentPlayer(room)?.id === player.id ? "ходит" : "ожидает"}</span></header>
            <div class="railMetrics">
              <span><small>Капитал</small><b>${player.money} млн</b></span>
              <span><small>Репутация</small><b>${player.reputation}</b></span>
              <span><small>Эффективность</small><b>${player.efficiency}</b></span>
              <span><small>Влияние</small><b>${player.influence}</b></span>
              <span><small>Очки</small><b>${scorePlayer(player)}</b></span>
            </div>
          </button>`,
        )
        .join("")}
    </div>
  </aside>`;
}

function playerDockMarkup(room) {
  const mine = userPlayer(room);
  if (!mine) return "";
  return `<aside class="playerDock ${dockOpen ? "open" : ""}">
    <button class="dockHandle" data-action="toggle-tablet">
      <strong>Моя компания · ${escapeHtml(mine.name)}</strong>
      <span>Капитал ${mine.money} млн · Репутация ${mine.reputation} · Эффективность ${mine.efficiency} · Влияние ${mine.influence} · Очки ${scorePlayer(mine)}</span>
      <em>${dockOpen ? "Свернуть" : "Планшет"}</em>
    </button>
    <div class="tabletStack">
      ${playerTabletMarkup(room, mine, currentPlayer(room)?.id === mine.id)}
    </div>
  </aside>`;
}

function cardSlot(content, label, className = "", cardRef = "") {
  const attr = cardRef ? `data-open-card="${escapeHtml(cardRef)}"` : "";
  return `<button class="cardSlot gameCard ${className} ${content ? "filled" : "empty"}" ${attr} ${cardRef ? "" : "disabled"}>${content || `<span>${escapeHtml(label)}</span>`}</button>`;
}

function miniContractCard(room, player, contract) {
  const progress = Math.round((resourceTotal(contract.filled) / Math.max(1, resourceTotal(contract.resource))) * 100);
  return `<article class="miniDealCard">
    <header><span>${escapeHtml(contract.type)}</span><strong>${escapeHtml(contract.title)}</strong></header>
    <div class="miniDealMeta"><span>Срок ${contract.duration}</span><span>Доход ${contract.income} млн</span><span>Риск ${escapeHtml(contract.risk)}</span></div>
    <div class="progressTrack"><i style="width:${progress}%"></i></div>
    <div class="resourceLine">${Object.entries(contract.resource).map(([code, amount]) => `<span>${code} ${contract.filled?.[code] || 0}/${amount}</span>`).join("")}</div>
    <footer><span>Обеспечено ${progress}%</span><b>Открыть</b></footer>
  </article>`;
}

function playerTabletMarkup(room, player, isCurrent) {
  const activeLimit = state.config?.settings?.activeContractLimit || 2;
  const contractSlots = Array.from({ length: activeLimit }, (_, index) => {
    const contract = player.activeContracts[index];
    return contract
      ? `<button class="tabletDeal" data-open-card="activeContract:${contract.instanceId}">${miniContractCard(room, player, contract)}</button>`
      : `<div class="tabletEmpty dealEmpty"><span>Свободный слот</span><small>Контракт появится здесь</small></div>`;
  }).join("");
  const resourceChips = Object.entries(player.warehouse || {})
    .map(([code, amount]) => `<button class="resourceChip resource-${code.toLowerCase()}" data-open-card="warehouse:${code}" ${amount ? "" : "disabled"}><strong>${code}</strong><span>${amount}</span></button>`)
    .join("");
  const proleumSlots = Array.from({ length: 3 }, (_, index) => {
    const cardItem = player.proleumCards[index];
    return cardItem
      ? `<button class="tabletMiniCard proleumMini" data-open-card="proleum:${cardItem.id}"><span>ПРОЛЕУМ</span><strong>${escapeHtml(cardItem.title)}</strong></button>`
      : `<div class="tabletEmpty miniEmpty"><span>Карта ${index + 1}</span></div>`;
  }).join("");
  const assetSlots = player.assets.length
    ? player.assets.map((item) => `<button class="assetRow" data-open-card="asset:${item.id}"><span>${escapeHtml(item.type)}</span><strong>${escapeHtml(item.title)}</strong></button>`).join("")
    : `<div class="tabletEmpty assetEmpty"><span>Активов пока нет</span><small>Купленные объекты появятся здесь</small></div>`;
  const hedgeSlots = (player.hedgeTokens || [])
    .map((token, index) => `<button class="hedgeChip" data-open-card="hedge:${index}"><span>Hedge</span><strong>${token.resource} x${token.volume || 2}</strong></button>`)
    .join("");
  const sectorProgress = Object.entries(sectorMeta)
    .map(([sector, meta]) => {
      const total = sectorCells(sector).length;
      const owned = ownedSectorAssets(player, sector).length;
      return `<div class="sectorProgress ${owned === total && total ? "complete" : ""}" style="--sector-color:${meta.color}" title="${escapeHtml(`${meta.title}: ${meta.bonus}`)}"><i></i><span>${escapeHtml(meta.short || meta.title)}</span><strong>${owned}/${total}</strong></div>`;
    })
    .join("");
  return `<article class="playerTablet ${isCurrent ? "current" : ""}">
    <header class="tabletHeader">
      <div><i style="background:${player.color}"></i><strong>${escapeHtml(player.name)}</strong></div>
      <span>${isCurrent ? "Ваш ход" : "Ожидание"}</span>
    </header>
    <div class="tabletStats">
      <span>Капитал <strong>${player.money} млн</strong></span>
      <span>Репутация <strong>${player.reputation}</strong></span>
      <span>Эффективность <strong>${player.efficiency}</strong></span>
      <span>Влияние <strong>${player.influence}</strong></span>
      <span>Очки <strong>${scorePlayer(player)}</strong></span>
    </div>
    <div class="tabletWorkspace">
      <section class="tabletZone dealsZone">
        <header><h4>Активные сделки</h4><span>${player.activeContracts.length}/${activeLimit}</span></header>
        <div class="dealWorkbench">${contractSlots}</div>
      </section>
      <section class="tabletZone inventoryZone">
        <header><h4>Склад и решения</h4><span>${warehouseUsed(player)}/${warehouseCapacity(player)}</span></header>
        <div class="resourceShelf">${resourceChips}</div>
        <div class="proleumShelf">${proleumSlots}</div>
        ${hedgeSlots ? `<div class="hedgeShelf">${hedgeSlots}</div>` : ""}
      </section>
      <section class="tabletZone assetsZone">
        <header><h4>Активы компании</h4><span>${player.assets.length}</span></header>
        <div class="sectorPortfolio">${sectorProgress}</div>
        <div class="assetShelf">${assetSlots}</div>
        <div class="tabletHistory"><span>Закрыто ${player.completedContracts.length}</span><span>Сорвано ${player.failedContracts?.length || 0}</span><span>Круг ${player.lap || 0}</span></div>
      </section>
    </div>
  </article>`;
}

function playersMarkup(players) {
  return `<section class="panel"><h3>Компании игроков</h3><div class="dataTable">
    <div class="tableHeader"><span>Игрок</span><span>Капитал</span><span>Реп.</span><span>Эфф.</span><span>Влияние</span><span>Очки</span></div>
    ${players
      .map(
        (player) => `<div class="tableRow"><span><i style="background:${player.color}"></i>${escapeHtml(player.name)}</span><span>${player.money} млн</span><span>${player.reputation}</span><span>${player.efficiency}</span><span>${player.influence}</span><span>${scorePlayer(player)}</span></div>`,
      )
      .join("")}
  </div></section>`;
}

function sidePanelMarkup(room) {
  if (!sidePanel) return "";
  if (sidePanel === "log") {
    return `<aside class="sideDrawer" data-modal-body>
      <header><div><span>Журнал партии</span><strong>Операционная лента</strong></div><button class="modalClose" data-side-panel="">×</button></header>
      <div class="drawerList">${room.log.map((line, index) => `<p><span>#${room.log.length - index}</span>${escapeHtml(line)}</p>`).join("")}</div>
    </aside>`;
  }
  if (sidePanel === "dev" && user.role === "admin") {
    return `<aside class="sideDrawer devDrawer" data-modal-body>
      <header><div><span>Admin only</span><strong>Dev panel</strong></div><button class="modalClose" data-side-panel="">×</button></header>
      <div class="drawerList">
        <button class="primaryButton" data-action="next-day">Следующий торговый день</button>
        <button class="secondaryButton" data-action="dismiss-turn-prompt">Скрыть подсказку хода</button>
        <button class="secondaryButton" data-view="editor">Редактор контента</button>
        <button class="secondaryButton" data-side-panel="log">Экспорт/просмотр лога</button>
      </div>
    </aside>`;
  }
  return "";
}

function findCardByRef(ref) {
  const room = activeRoom();
  const mine = room ? userPlayer(room) : null;
  const [zone, id] = String(ref || "").split(":");
  if (zone === "market" || zone === "entity") return state.config.contracts.find((item) => item.id === id) || state.config.tenders.find((item) => item.id === id);
  if (zone === "tender") return state.config.tenders.find((item) => item.id === id);
  if (zone === "marketCard") return state.config.marketCards.find((item) => item.id === id);
  if (zone === "activeContract") return mine?.activeContracts.find((item) => item.instanceId === id);
  if (zone === "proleum") return mine?.proleumCards.find((item) => item.id === id);
  if (zone === "asset") return mine?.assets.find((item) => item.id === id);
  if (zone === "hedge") return mine?.hedgeTokens?.[Number(id)];
  if (zone === "warehouse") return { id: ref, title: id, type: "Ресурс", description: "Ресурс на складе вашей компании.", resource: { [id]: 1 } };
  return null;
}

function expandedCardMarkup(ref) {
  const room = activeRoom();
  const mine = room ? userPlayer(room) : null;
  const card = findCardByRef(ref);
  if (!card) return "";
  const [zone] = String(ref).split(":");
  const resources = card.resource ? `<div class="resourceLine expanded">${Object.entries(card.resource).map(([code, amount]) => `<span>${code} x${amount}</span>`).join("")}</div>` : "";
  const routes = card.routes?.length ? `<div class="routeLine">${card.routes.map((route) => `<span>${escapeHtml(route)}</span>`).join("")}</div>` : "";
  const progress = zone === "activeContract" ? `<div class="progressTrack"><i style="width:${Math.round((resourceTotal(card.filled) / Math.max(1, resourceTotal(card.resource))) * 100)}%"></i></div>` : "";
  const actions = expandedCardActions(room, mine, card, ref);
  return `<div class="modalBackdrop cardBackdrop" data-action="close-modal">
    <section class="modalSheet cardSheet gameCard cardL" data-modal-body>
      <button class="modalClose" data-action="close-modal">×</button>
      <span class="cardType">${escapeHtml(card.type || zone)}</span>
      <h2>${escapeHtml(card.title || card.resource || "Карточка")}</h2>
      <p>${escapeHtml(card.description || card.effect || "Подробности карточки.")}</p>
      ${progress}
      ${resources}
      ${routes}
      <div class="cardFacts">
        ${card.income ? `<span>Доход <strong>${card.income} млн</strong></span>` : ""}
        ${card.duration ? `<span>Срок <strong>${card.duration}</strong></span>` : ""}
        ${card.risk !== undefined ? `<span>Риск <strong>${card.risk}</strong></span>` : ""}
        ${card.brokerFee ? `<span>Брокерка <strong>${card.brokerFee} млн</strong></span>` : ""}
      </div>
      ${card.effect ? `<div class="hintBox">${escapeHtml(card.effect)}</div>` : ""}
      <div class="modalActions">${actions}</div>
    </section>
  </div>`;
}

function actionButton(label, action, enabled, reason, dataset = "") {
  return `<button class="${enabled ? "primaryButton" : "secondaryButton"}" ${dataset || `data-action="${action}"`} ${enabled ? "" : "disabled"} title="${escapeHtml(reason || "")}">${escapeHtml(label)}</button>${!enabled && reason ? `<small class="lockReason">${escapeHtml(reason)}</small>` : ""}`;
}

function expandedCardActions(room, mine, card, ref) {
  if (!room || !mine) return actionButton("Только просмотр", "noop", false, "Вы не в комнате.");
  const [zone] = String(ref).split(":");
  if (zone === "market") {
    const reason = actionGate(room, mine, { requiresRolled: true, commercial: true, cells: ["contract", "client"] });
    return actionButton("Взять контракт", "", !reason, reason, `data-take-contract="${card.id}"`);
  }
  if (zone === "tender" || (zone === "entity" && card.type === "тендер")) {
    const reason = actionGate(room, mine, { requiresRolled: true, commercial: true, cells: ["tender"] });
    return actionButton("Заявиться", "", !reason, reason, `data-take-tender="${card.id}"`);
  }
  if (zone === "activeContract") {
    const fillReason = actionGate(room, mine, { commercial: true });
    const ready = isContractFilled(card);
    return [
      actionButton("Обеспечить ресурс", "", !fillReason && !ready, ready ? "Контракт уже обеспечен." : fillReason, `data-fill-contract="${card.instanceId}"`),
      actionButton("Выбрать маршрут", "", !fillReason && ready, ready ? "" : "Сначала обеспечьте ресурс.", `data-plan-route="${card.instanceId}"`),
      actionButton("Брокерка", "", !fillReason, fillReason, `data-action="broker-contract"`),
    ].join("");
  }
  if (zone === "warehouse") return actionButton("Подсветить сделки", "noop", false, "Перекладывание ресурса в ручном режиме будет в следующем UX-слое.");
  if (zone === "proleum") {
    const playability = proleumPlayability(room, mine, card);
    return actionButton("Сыграть карту", "", playability.enabled, playability.reason, `data-play-proleum="${card.id}"`);
  }
  if (zone === "marketCard") return actionButton("Понятно", "close-modal", true, "", `data-action="close-modal"`);
  return actionButton("Подробнее", "noop", false, "Для этой карточки пока доступен просмотр.");
}

function proleumPlayability(room, player, card) {
  if (!canUserAct(room)) return { enabled: false, reason: "Карту можно сыграть только в свой ход." };
  if (!room.turnState?.rolled) return { enabled: false, reason: "Сначала бросьте кубики." };
  if (room.turnState?.proleumPlayed) return { enabled: false, reason: "В этот ход уже сыграна карта ПРОЛЕУМ." };
  const immediate = new Set([
    "Альтернативный базис найден",
    "Экспресс-анализ риска",
    "Коммерческий компромисс",
    "Слот подтвержден",
    "Сервисный коридор",
    "Проверенный маршрут",
    "Брокерское сопровождение ПРОЛЕУМ",
    "Приоритетное окно поставки",
  ]);
  if (!immediate.has(card.title)) return { enabled: false, reason: "Это контекстная карта: она применяется автоматически в подходящем событии или поставке." };
  if (!player.activeContracts.length && !card.title.includes("Приоритетное окно")) return { enabled: false, reason: "Для этой карты нужен активный контракт." };
  return { enabled: true, reason: "" };
}

function modalMarkup() {
  if (!modalState) return "";
  const room = activeRoom();
  const mine = room ? userPlayer(room) : null;
  if (modalState.type === "card") return expandedCardMarkup(modalState.ref);
  if (modalState.type === "cardReveal") return cardRevealMarkup(modalState);
  if (modalState.type === "notice") {
    return `<div class="modalBackdrop" data-action="close-modal">
      <section class="modalSheet noticeSheet" data-modal-body>
        <button class="modalClose" data-action="close-modal">×</button>
        <span class="cardType">Проверка правил</span>
        <h2>${escapeHtml(modalState.title)}</h2>
        <p>${escapeHtml(modalState.message || "Это действие сейчас недоступно.")}</p>
        <div class="modalActions"><button class="primaryButton" data-action="close-modal">Понятно</button></div>
      </section>
    </div>`;
  }
  if (modalState.type === "tradeBuilder" && room && mine) {
    const targets = room.players.filter((player) => player.id !== mine.id);
    const availableResources = Object.entries(mine.warehouse || {}).filter(([, amount]) => amount > 0);
    return `<div class="modalBackdrop" data-action="close-modal">
      <section class="modalSheet tradeSheet" data-modal-body>
        <button class="modalClose" data-action="close-modal">×</button>
        <span class="cardType">Переговорная сделка</span>
        <h2>Предложить ресурс игроку</h2>
        <p>Одно предложение за ход. Ресурс и деньги передаются только после подтверждения второй стороной.</p>
        ${availableResources.length ? `<div class="tradeForm">
          <label>Покупатель<select id="trade-target">${targets.map((player) => `<option value="${player.id}">${escapeHtml(player.name)}</option>`).join("")}</select></label>
          <label>Ресурс<select id="trade-resource">${availableResources.map(([code, amount]) => `<option value="${code}">${code} · доступно ${amount}</option>`).join("")}</select></label>
          <label>Цена, млн<input id="trade-price" type="number" min="0" max="20" value="4" /></label>
        </div>
        <div class="modalActions"><button class="primaryButton" data-action="create-trade">Отправить предложение</button></div>` : `<div class="hintBox">На складе нет ресурсов для продажи.</div>`}
      </section>
    </div>`;
  }
  if (modalState.type === "tradeInbox" && room) {
    const offers = room.tradeOffers.filter((offer) => offer.status === "pending" && offer.buyerName === user.name);
    return `<div class="modalBackdrop" data-action="close-modal">
      <section class="modalSheet tradeSheet" data-modal-body>
        <button class="modalClose" data-action="close-modal">×</button>
        <span class="cardType">Входящие предложения</span>
        <h2>Сделки игроков</h2>
        <div class="tradeOfferList">${offers.map((offer) => `<article>
          <div><span>${escapeHtml(offer.sellerName)} предлагает</span><strong>${offer.resource} x${offer.amount}</strong></div>
          <b>${offer.price} млн</b>
          <div class="miniActions"><button class="primaryButton" data-accept-trade="${offer.id}">Принять</button><button class="secondaryButton" data-decline-trade="${offer.id}">Отклонить</button></div>
        </article>`).join("") || `<div class="hintBox">Новых предложений нет.</div>`}</div>
      </section>
    </div>`;
  }
  if (modalState.type === "supplyResult") {
    const contract = modalState.contract;
    return `<div class="modalBackdrop revealBackdrop">
      <section class="modalSheet cardSheet revealCard contractStageResult" data-modal-body>
        <div class="revealGlow"></div>
        <span class="cardType">Этап 1 из 2 · обеспечение</span>
        <div class="revealStamp">Ресурс зарезервирован</div>
        <h2>${escapeHtml(contract.title)}</h2>
        <p>Контракт обеспечен ресурсом, но еще не закрыт. Доход пока не начислен.</p>
        <div class="resourceLine expanded">${Object.entries(contract.resource).map(([code, amount]) => `<span>${code} ${contract.filled?.[code] || 0}/${amount}</span>`).join("")}</div>
        <div class="cardFacts">
          <span>Затраты на ресурс <strong>${modalState.cost} млн</strong></span>
          <span>Следующий этап <strong>выбор маршрута</strong></span>
          <span>Доход после поставки <strong>${contract.income} млн</strong></span>
        </div>
        <div class="hintBox">Обеспечение заняло коммерческое действие. На следующем ходу откройте контракт в планшете и нажмите «Выбрать маршрут».</div>
        <div class="modalActions"><button class="primaryButton" data-action="close-modal">Понятно</button></div>
      </section>
    </div>`;
  }
  if (modalState.type === "deliveryResult") {
    const result = modalState.result;
    return `<div class="modalBackdrop revealBackdrop">
      <section class="modalSheet cardSheet revealCard deliveryResult ${result.risk.triggered ? "riskTriggered" : "riskPassed"}" data-modal-body>
        <div class="revealGlow"></div>
        <span class="cardType">Поставка завершена</span>
        <div class="revealStamp">${result.risk.triggered ? "Риск сработал" : "Сделка закрыта"}</div>
        <h2>${escapeHtml(result.title)}</h2>
        <p>Маршрут: ${escapeHtml(result.route)}. Контракт перенесен в историю завершенных сделок.</p>
        <div class="settlementGrid">
          <span>Доход<strong>+${result.income} млн</strong></span>
          <span>Логистика<strong>-${result.logisticsCost} млн</strong></span>
          ${result.clientBonus ? `<span>Клиентский актив<strong>+${result.clientBonus} млн</strong></span>` : ""}
          ${result.proleumPenalty ? `<span>Компромисс ПРОЛЕУМ<strong>-${result.proleumPenalty} млн</strong></span>` : ""}
          <span>Риск сделки<strong>уровень ${result.risk.level}</strong></span>
          <span>Проверка D6<strong>${result.risk.skipped ? "отменена картой" : result.risk.dice || "не нужна"}</strong></span>
        </div>
        ${result.risk.triggered ? `<div class="riskNotice"><strong>${escapeHtml(result.risk.eventTitle || "Операционный риск")}</strong><span>Штраф: -${result.risk.penalty} млн</span></div>` : `<div class="hintBox">Проверка риска пройдена. Дополнительных штрафов нет.</div>`}
        <div class="modalActions"><button class="primaryButton" data-action="close-modal">Продолжить</button></div>
      </section>
    </div>`;
  }
  if (modalState.type === "finalResults") {
    const ranking = [...(room?.players || [])].sort((a, b) => scorePlayer(b) - scorePlayer(a));
    return `<div class="modalBackdrop revealBackdrop">
      <section class="modalSheet cardSheet revealCard finalResults" data-modal-body>
        <div class="revealGlow"></div>
        <span class="cardType">Финал партии · ${escapeHtml(room?.mode || "Standard")}</span>
        <div class="revealStamp">Торговый цикл завершен</div>
        <h2>${escapeHtml(ranking[0]?.name || "Победитель")}</h2>
        <p>Побеждает компания с лучшим совокупным рейтингом капитала, контрактов и деловой репутации.</p>
        <div class="rankingList">${ranking.map((player, index) => `<div class="${index === 0 ? "winner" : ""}"><b>${index + 1}</b><span>${escapeHtml(player.name)}</span><strong>${scorePlayer(player)} очк.</strong><small>${player.money} млн · закрыто ${player.completedContracts.length} · срывы ${player.failedContracts.length}</small></div>`).join("")}</div>
        <div class="modalActions"><button class="primaryButton" data-view="rooms">К списку партий</button><button class="secondaryButton" data-action="close-modal">Остаться за столом</button></div>
      </section>
    </div>`;
  }
  if (modalState.type === "commercial" && mine) {
    return `<div class="modalBackdrop" data-action="close-modal">
      <section class="modalSheet cardSheet" data-modal-body>
        <button class="modalClose" data-action="close-modal">×</button>
        <span class="cardType">COMMERCIAL_ACTION</span>
        <h2>Выберите коммерческое действие</h2>
        <p>За ход доступно одно коммерческое действие. Недоступные варианты показывают причину блокировки.</p>
        <div class="decisionGrid">
          ${commercialActionOption(room, mine, { label: "Закупить ресурс", cells: ["supplier", "market"], details: "REG / PRM / DTL в пределах остатка рынка", action: "resources" })}
          ${commercialActionOption(room, mine, { label: "Взять контракт", cells: ["contract", "client"], details: "Открытая сделка попадет в свободный слот", action: "contracts" })}
          ${commercialActionOption(room, mine, { label: "Заявиться на тендер", cells: ["tender"], details: "Тендер занимает слот активной сделки", action: "tender" })}
          ${commercialActionOption(room, mine, { label: "Hedge MOEX", cells: ["hedge"], details: "Фиксация цены ресурса до 2 жетонов", action: "hedge" })}
          ${commercialActionOption(room, mine, { label: "Брокерка", cells: ["broker"], details: "Передать активный контракт в брокерский контур", action: "broker" })}
        </div>
        <button class="secondaryButton skipAction" data-action="skip-commercial">Пропустить коммерческое действие</button>
      </section>
    </div>`;
  }
  if (modalState.type === "opponent") {
    const opponent = room?.players.find((player) => player.id === modalState.playerId);
    if (!opponent) return "";
    return `<div class="modalBackdrop" data-action="close-modal">
      <section class="modalSheet cardSheet opponentSheet" data-modal-body>
        <button class="modalClose" data-action="close-modal">×</button>
        <span class="cardType">Открытая информация</span>
        <h2>${escapeHtml(opponent.name)}</h2>
        <div class="tabletStats opponentStats">
          <span>Капитал <strong>${opponent.money} млн</strong></span>
          <span>Репутация <strong>${opponent.reputation}</strong></span>
          <span>Эффективность <strong>${opponent.efficiency}</strong></span>
          <span>Влияние <strong>${opponent.influence}</strong></span>
          <span>Очки <strong>${scorePlayer(opponent)}</strong></span>
        </div>
        <div class="cardFacts">
          <span>Активные сделки <strong>${opponent.activeContracts.length}</strong></span>
          <span>Карты ПРОЛЕУМ <strong>${opponent.proleumCards.length}</strong></span>
          <span>Активы <strong>${opponent.assets.length}</strong></span>
          <span>Склад <strong>${warehouseUsed(opponent)}/${warehouseCapacity(opponent)}</strong></span>
        </div>
        <div class="hintBox">Закрытые карты соперника не раскрываются: видны только количество и открытые метрики компании.</div>
      </section>
    </div>`;
  }
  const myTurn = room ? canUserAct(room) : false;
  if (modalState.type === "cell") {
    const cell = state.config.boardCells.find((item) => item.id === modalState.cellId);
    if (!cell) return "";
    const owner = room?.assetOwnership?.[cell.id];
    const standing = room && mine ? isCurrentCell(room, cell.id, mine) : false;
    return `<div class="modalBackdrop" data-action="close-modal">
      <section class="modalSheet" data-modal-body>
        <button class="modalClose" data-action="close-modal">×</button>
        <span class="kicker">Клетка ${escapeHtml(cell.type)}</span>
        <h2>${escapeHtml(cell.title)}</h2>
        <p>${escapeHtml(cell.description)}</p>
        <div class="cellStatus">
          <span>${standing ? "Вы стоите на этой клетке" : "Действия доступны только текущему игроку на своей клетке"}</span>
          ${owner ? `<span>Владелец: ${escapeHtml(owner.ownerName)}</span>` : `<span>Актив свободен</span>`}
        </div>
        ${cell.sectorTitle ? `<div class="sectorInfo" style="--sector-color:${cell.sectorColor}"><strong>${escapeHtml(cell.sectorTitle)}</strong><span>${escapeHtml(sectorMeta[cell.sector]?.bonus || "")}</span></div>` : ""}
        ${cellActionMarkup(cell, myTurn)}
        ${myTurn && standing && !room.turnState?.cellActionUsed && cell.type !== "claim" ? `<button class="secondaryButton skipAction" data-action="skip-cell">Пропустить действие клетки</button>` : ""}
      </section>
    </div>`;
  }
  if (modalState.type === "resource") {
    const meta = resourceMeta[modalState.code];
    const stock = room?.market?.stock?.[modalState.code] ?? 0;
    const limit = room && mine ? resourceBuyLimit(room, mine) : 2;
    const capacityLeft = mine ? Math.max(0, warehouseCapacity(mine) - warehouseUsed(mine)) : 0;
    const gate = room && mine ? actionGate(room, mine, { requiresRolled: true, commercial: true, cells: ["supplier", "market"] }) : "Вы не в комнате.";
    return `<div class="modalBackdrop" data-action="close-modal">
      <section class="modalSheet" data-modal-body>
        <button class="modalClose" data-action="close-modal">×</button>
        <span class="kicker">Закупка ресурса</span>
        <h2>${modalState.code} · ${escapeHtml(meta.name)}</h2>
        <p>Цена рынка: ${room?.market?.prices?.[modalState.code] ?? meta.basePrice} млн за жетон. Остаток рынка: ${stock}. Свободно на складе: ${capacityLeft}. Лимит действия: ${limit}.</p>
        ${gate ? `<div class="hintBox">${escapeHtml(gate)}</div>` : ""}
        <div class="modalActions">
          <button class="primaryButton" data-buy-resource-confirm="${modalState.code}" data-amount="1" ${gate || stock < 1 || capacityLeft < 1 ? "disabled" : ""}>Купить 1</button>
          <button class="primaryButton" data-buy-resource-confirm="${modalState.code}" data-amount="2" ${gate || stock < 2 || capacityLeft < 2 || limit < 2 ? "disabled" : ""}>Купить 2</button>
          <button class="primaryButton" data-buy-resource-confirm="${modalState.code}" data-amount="3" ${gate || stock < 3 || capacityLeft < 3 || limit < 3 ? "disabled" : ""}>Купить 3</button>
        </div>
      </section>
    </div>`;
  }
  if (modalState.type === "contract" && mine) {
    const contract = mine.activeContracts.find((item) => item.instanceId === modalState.contractId);
    if (!contract) return "";
    return `<div class="modalBackdrop" data-action="close-modal">
      <section class="modalSheet" data-modal-body>
        <button class="modalClose" data-action="close-modal">×</button>
        <span class="kicker">Активная сделка</span>
        <h2>${escapeHtml(contract.title)}</h2>
        <p>${escapeHtml(contract.description)}</p>
        <div class="resourceLine">${Object.entries(contract.resource).map(([code, amount]) => `<span>${code} ${contract.filled?.[code] || 0}/${amount}</span>`).join("")}</div>
        <div class="modalActions">
          <button class="secondaryButton" data-fill-contract="${contract.instanceId}" ${myTurn && !contractReady(contract) ? "" : "disabled"}>Обеспечить ресурс</button>
          <button class="primaryButton" data-plan-route="${contract.instanceId}" ${myTurn && contractReady(contract) ? "" : "disabled"}>Выбрать маршрут</button>
        </div>
      </section>
    </div>`;
  }
  if (modalState.type === "route" && mine) {
    const contract = mine.activeContracts.find((item) => item.instanceId === modalState.contractId);
    if (!contract) return "";
    const routes = routeOptions(room, contract);
    return `<div class="modalBackdrop" data-action="close-modal">
      <section class="modalSheet routeSheet" data-modal-body>
        <button class="modalClose" data-action="close-modal">×</button>
        <span class="kicker">Маршрут поставки</span>
        <h2>${escapeHtml(contract.title)}</h2>
        <p>Выберите логистику. Закрытие поставки занимает коммерческое действие, списывает мощность дня и запускает проверку риска.</p>
        <div class="routeGrid">
          ${routes
            .map((route) => `<button class="routeOption" data-close-contract="${contract.instanceId}" data-route="${route.key}" ${route.available ? "" : "disabled"}>
              <strong>${escapeHtml(route.title)}</strong>
              <span>Стоимость ${route.cost} млн</span>
              <span>Риск ${riskLevel(contract, route, mine)} · шанс события ${riskChance(riskLevel(contract, route, mine))}%</span>
              <small>${escapeHtml(route.note)}</small>
              ${route.rail || route.depot ? `<em>Мощность: ЖД ${route.rail}, база ${route.depot}</em>` : `<em>Без общей мощности</em>`}
            </button>`)
            .join("") || `<div class="hintBox">Для этого контракта нет разрешенных маршрутов.</div>`}
        </div>
      </section>
    </div>`;
  }
  if (modalState.type === "eventChoice") {
    const eventCard = state.config.events.find((item) => item.id === modalState.eventId) || modalState;
    const choices = eventCard.choices?.length ? eventCard.choices : ["Заплатить и сохранить темп", "Потерять репутацию", "Принять задержку"];
    return `<div class="modalBackdrop revealBackdrop">
      <section class="modalSheet cellSheet theme-event revealCard eventReveal" data-modal-body>
        <div class="revealGlow"></div>
        <span class="cardType">Операционное событие</span>
        <h2>${escapeHtml(eventCard.title)}</h2>
        <p>${escapeHtml(eventCard.description)}</p>
        <div class="hintBox">Помогает: ${escapeHtml(eventCard.helps || "карты ПРОЛЕУМ / активы / шкалы компании")}</div>
        <div class="decisionGrid">
          ${choices.map((choice, index) => `<button class="${index === 0 ? "primaryButton" : "secondaryButton"}" data-action="resolve-event" data-choice="${index}">${escapeHtml(choice)}</button>`).join("")}
        </div>
      </section>
    </div>`;
  }
  return "";
}

function turnPromptMarkup() {
  return "";
}

function dismissTurnPrompt() {
  const room = activeRoom();
  if (room) {
    room.turnState ||= { rolled: false };
    room.turnState.promptDismissed = true;
  }
  commit();
}

function cellActionMarkup(cell, myTurn) {
  const room = activeRoom();
  const player = room ? userPlayer(room) : null;
  const disabled = myTurn ? "" : "disabled";
  if (["supplier", "market"].includes(cell.type)) {
    const gate = room && player ? actionGate(room, player, { requiresRolled: true, commercial: true, cellId: cell.id, cells: ["supplier", "market"] }) : "Недоступно.";
    const owner = room?.assetOwnership?.[cell.id];
    const assetGate = cell.buyable && room && player ? actionGate(room, player, { requiresRolled: true, cellAction: true, cellId: cell.id, cells: ["supplier", "market"] }) : "Недоступно.";
    const assetReason = owner ? `Актив уже принадлежит ${owner.ownerName}.` : player?.assetPurchasedLap === player?.lap ? "За круг уже куплен один актив." : assetGate;
    const availableResources = cell.resourceCode ? [cell.resourceCode] : Object.keys(resourceMeta);
    return `<div class="modalActions">
      ${availableResources.map((code) => `<button class="secondaryButton" data-buy-resource="${code}" ${gate ? "disabled" : disabled} title="${escapeHtml(gate)}">Купить ${code}</button>`).join("")}
      ${cell.buyable ? `<button class="primaryButton" data-buy-cell-asset="${cell.id}" ${assetReason ? "disabled" : disabled} title="${escapeHtml(assetReason)}">Купить актив сектора за ${assetCostForCell(cell)} млн</button>` : ""}
    </div>`;
  }
  if (cell.type === "marketCard") {
    const gate = room && player ? actionGate(room, player, { requiresRolled: true, cellAction: true, cellId: cell.id, cells: ["marketCard"] }) : "Недоступно.";
    return `<div class="decisionBox"><strong>Карта рынка</strong><p>Откройте следующую карту рынка: цены, объемы и логистика пересчитаются по балансу из Excel.</p>${gate ? `<small>${escapeHtml(gate)}</small>` : ""}<button class="primaryButton" data-action="draw-market" ${gate ? "disabled" : disabled}>Открыть карту рынка</button></div>`;
  }
  if (cell.type === "hedge") {
    const gate = room && player ? actionGate(room, player, { requiresRolled: true, commercial: true, cellId: cell.id, cells: ["hedge"] }) : "Недоступно.";
    const code = cell.title.includes("PRM") ? "PRM" : cell.title.includes("DTL") ? "DTL" : "REG";
    return `<div class="decisionBox"><strong>Hedge MOEX · ${code}</strong><p>Купите hedge за 1 млн: фикс цены до 2 ${code} для одного контракта. Лимит руки: ${state.config.settings?.hedgeLimit || 2}.</p>${gate ? `<small>${escapeHtml(gate)}</small>` : ""}<button class="primaryButton" data-buy-hedge="${code}" ${gate ? "disabled" : disabled}>Купить hedge ${code}</button></div>`;
  }
  if (cell.type === "broker") {
    const gate = room && player ? actionGate(room, player, { requiresRolled: true, commercial: true, cellId: cell.id, cells: ["broker"] }) : "Недоступно.";
    const owner = room?.assetOwnership?.[cell.id];
    const assetGate = room && player ? actionGate(room, player, { requiresRolled: true, cellAction: true, cellId: cell.id, cells: ["broker"] }) : "Недоступно.";
    const assetReason = owner ? `Актив уже принадлежит ${owner.ownerName}.` : player?.assetPurchasedLap === player?.lap ? "За круг уже куплен один актив." : assetGate;
    return `<div class="decisionBox"><strong>Брокерский контур</strong><p>Передайте активный контракт в брокерку: получите брокерскую комиссию без полной поставки, +1 влияние, но контракт считается brokered.</p>${gate ? `<small>${escapeHtml(gate)}</small>` : ""}<div class="modalActions"><button class="primaryButton" data-action="broker-contract" ${gate ? "disabled" : disabled}>Передать контракт в брокерку</button><button class="secondaryButton" data-buy-cell-asset="${cell.id}" ${assetReason ? "disabled" : disabled} title="${escapeHtml(assetReason)}">Купить брокерский актив за ${assetCostForCell(cell)} млн</button></div></div>`;
  }
  if (cell.type === "client") {
    const contractGate = room && player ? actionGate(room, player, { requiresRolled: true, commercial: true, cellId: cell.id, cells: ["client"] }) : "Недоступно.";
    const assetGate = room && player ? actionGate(room, player, { requiresRolled: true, cellAction: true, cellId: cell.id, cells: ["client"] }) : "Недоступно.";
    const owner = room?.assetOwnership?.[cell.id];
    const price = assetCostForCell(cell);
    const reason = owner ? `Актив уже принадлежит ${owner.ownerName}.` : player?.assetPurchasedLap === player?.lap ? "За круг уже куплен один актив." : assetGate;
    return `<div class="decisionBox"><strong>Клиентский сегмент</strong><p>Клетка дает доступ к контрактам и может стать долгосрочным активом.</p>
      <div class="modalActions">${ensureDealMarket(room, "contracts").slice(0, 3)
        .map((item) => `<button class="secondaryButton" data-take-contract="${item.id}" ${contractGate ? "disabled" : disabled} title="${escapeHtml(contractGate)}">${escapeHtml(item.title)}</button>`)
        .join("")}</div>
      ${reason ? `<small>${escapeHtml(reason)}</small>` : ""}<button class="primaryButton" data-buy-cell-asset="${cell.id}" ${reason ? "disabled" : disabled}>Купить сегмент за ${price} млн</button></div>`;
  }
  if (["rail", "road", "depot"].includes(cell.type)) {
    const gate = room && player ? actionGate(room, player, { requiresRolled: true, cellAction: true, cellId: cell.id, cells: ["rail", "road", "depot"] }) : "Недоступно.";
    const owner = room?.assetOwnership?.[cell.id];
    const price = assetCostForCell(cell);
    const buyReason = owner ? `Актив уже принадлежит ${owner.ownerName}.` : player?.assetPurchasedLap === player?.lap ? "За круг уже куплен один актив." : gate;
    const bonusLabels = {
      rail: "ЖД в этот ход: стоимость -1 млн, маршрут не добавляет риск",
      road: "Автомаршрут в этот ход: стоимость -1 млн",
      depot: "Маршрут через нефтебазу в этот ход: стоимость -1 млн",
    };
    return `<div class="decisionBox"><strong>Логистический выбор</strong><p>${escapeHtml(cell.description)}</p>
      <div class="modalActions">
        <button class="primaryButton" data-logistics-bonus="${cell.type}" ${gate ? "disabled" : disabled}>Использовать бонус</button>
        <button class="secondaryButton" data-buy-cell-asset="${cell.id}" ${buyReason ? "disabled" : disabled}>Купить актив за ${price} млн</button>
      </div>
      <small>${escapeHtml(bonusLabels[cell.type])}</small>
    </div>`;
  }
  if (["asset", "supplier", "broker"].includes(cell.type)) {
    const gate = room && player ? actionGate(room, player, { requiresRolled: true, cellAction: true, cellId: cell.id, cells: ["asset", "supplier", "broker"] }) : "Недоступно.";
    const owner = room?.assetOwnership?.[cell.id];
    const price = assetCostForCell(cell);
    const reason = owner ? `Актив уже принадлежит ${owner.ownerName}.` : player?.assetPurchasedLap === player?.lap ? "За круг уже куплен один актив." : gate;
    return `<div class="decisionBox"><strong>Покупаемый актив · ${price} млн</strong><p>Актив дает преимущество владельцу, но не блокирует базовые действия другим игрокам.</p>${reason ? `<small>${escapeHtml(reason)}</small>` : ""}<button class="primaryButton" data-buy-cell-asset="${cell.id}" ${reason ? "disabled" : disabled}>Купить актив</button></div>`;
  }
  if (cell.type === "contract") {
    const gate = room && player ? actionGate(room, player, { requiresRolled: true, commercial: true, cellId: cell.id, cells: ["contract"] }) : "Недоступно.";
    return `<div class="modalActions">${ensureDealMarket(room, "contracts").slice(0, 3)
      .map((item) => `<button class="secondaryButton" data-take-contract="${item.id}" ${gate ? "disabled" : disabled} title="${escapeHtml(gate)}">${escapeHtml(item.title)}</button>`)
      .join("")}</div>`;
  }
  if (cell.type === "tender") {
    const gate = room && player ? actionGate(room, player, { requiresRolled: true, commercial: true, cellId: cell.id, cells: ["tender"] }) : "Недоступно.";
    return `<div class="modalActions">${ensureDealMarket(room, "tenders")
      .map((item) => `<button class="primaryButton" data-take-tender="${item.id}" ${gate ? "disabled" : disabled} title="${escapeHtml(gate)}">Заявиться на тендер</button>`)
      .join("")}</div>`;
  }
  if (cell.type === "proleum") {
    const gate = room && player ? actionGate(room, player, { requiresRolled: true, cellAction: true, cellId: cell.id, cells: ["proleum"] }) : "Недоступно.";
    return `<div class="decisionBox"><strong>Экспертное решение</strong><p>Возьмите карту ПРОЛЕУМ в руку. Максимум ${state.config.settings?.proleumHandLimit || 3} карты.</p>${gate ? `<small>${escapeHtml(gate)}</small>` : ""}<button class="primaryButton" data-action="draw-proleum" ${gate ? "disabled" : disabled}>Взять карту</button></div>`;
  }
  if (["event", "risk", "penalty", "pause"].includes(cell.type)) {
    const gate = room && player ? actionGate(room, player, { requiresRolled: true, cellAction: true, cellId: cell.id, cells: ["event", "risk", "penalty", "pause"] }) : "Недоступно.";
    return `<div class="decisionBox"><strong>Операционный выбор</strong><p>Откройте событие и выберите, как компания решит проблему.</p>${gate ? `<small>${escapeHtml(gate)}</small>` : ""}<button class="primaryButton" data-action="draw-event" ${gate ? "disabled" : disabled}>Открыть событие</button></div>`;
  }
  if (["block", "meeting"].includes(cell.type)) {
    const gate = room && player ? actionGate(room, player, { requiresRolled: true, cellAction: true, cellId: cell.id, cells: ["block", "meeting"] }) : "Недоступно.";
    const label = cell.type === "meeting" ? "Провести планерку" : "Разрешить блокировку";
    return `<div class="decisionBox"><strong>${cell.type === "meeting" ? "Планерка участников рынка" : "Блокировка поставки"}</strong><p>${escapeHtml(cell.description)}</p>${gate ? `<small>${escapeHtml(gate)}</small>` : ""}<button class="primaryButton" data-action="special-cell" ${gate ? "disabled" : disabled}>${label}</button></div>`;
  }
  if (cell.type === "claim") {
    const gate = room && player ? actionGate(room, player, { requiresRolled: true, cellAction: true, cellId: cell.id, cells: ["claim"] }) : "Недоступно.";
    const canPay = !gate && player.money >= 2;
    const contracts = player.activeContracts || [];
    return `<div class="decisionBox claimDecision">
      <strong>Урегулирование претензии</strong>
      <p>Выберите один вариант. Претензионный блок обязателен: завершить ход до решения нельзя.</p>
      <div class="claimChoices">
        <button class="primaryButton" data-claim-choice="pay" ${canPay ? "" : "disabled"}>
          <strong>Заплатить 2 млн</strong><span>Сохранить коммерческое действие</span>
        </button>
        <button class="secondaryButton" data-claim-choice="lose-commercial" ${gate ? "disabled" : ""}>
          <strong>Принять претензию</strong><span>Потерять коммерческое действие этого хода</span>
        </button>
        ${contracts.length
          ? contracts.map((contract) => `<button class="secondaryButton" data-claim-choice="extend" data-contract-id="${contract.instanceId}" ${!gate && player.money >= 2 ? "" : "disabled"}>
              <strong>Продлить: ${escapeHtml(contract.title)}</strong><span>-2 млн, срок +1 торговый день</span>
            </button>`).join("")
          : `<button class="secondaryButton" disabled><strong>Продлить контракт</strong><span>Нет активных контрактов</span></button>`}
      </div>
      ${gate ? `<small>${escapeHtml(gate)}</small>` : player.money < 2 ? `<small>Для платных вариантов нужно 2 млн. Доступен выбор с потерей коммерческого действия.</small>` : ""}
    </div>`;
  }
  return `<div class="decisionBox"><strong>Служебная клетка</strong><p>Эта клетка влияет на темп партии и обновление торгового дня.</p></div>`;
}

function diceOverlayMarkup() {
  if (!diceState) return "";
  return `<div class="diceOverlay"><div class="diceAnimation"><span>${diceState.a}</span><span>${diceState.b}</span></div><p>${escapeHtml(diceState.player)} бросает кубики</p></div>`;
}

function rulesMarkup() {
  const rules = state.config.rules;
  const blocks = [
    ["setup", "Подготовка"],
    ["turn", "Ход и торговый день"],
    ["scoring", "Победа"],
    ["balance", "Баланс"],
  ];
  return `<section class="rulesLayout">
    <div class="panel rulesIntro"><h2>${escapeHtml(rules.title)}</h2><p>${escapeHtml(rules.summary)}</p></div>
    ${blocks.map(([key, label]) => `<div class="panel"><h3>${label}</h3><ul>${rules[key].map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>`).join("")}
    <div class="panel componentPanel"><h3>Комплектация прототипа</h3>${state.config.components.map((item) => entityCardMarkup(item, true)).join("")}</div>
  </section>`;
}

function editorMarkup() {
  const collection = state.config[editorKind];
  if (!editorSelectedId || !collection.some((item) => item.id === editorSelectedId)) editorSelectedId = collection[0]?.id || null;
  const selected = collection.find((item) => item.id === editorSelectedId);
  return `<section class="editorLayout">
    <div class="panel entityList">
      <h2>Игровые сущности</h2>
      <div class="tabRow">${Object.entries(entityLabels).map(([key, label]) => `<button class="${key === editorKind ? "active" : ""}" data-kind="${key}">${label}</button>`).join("")}</div>
      <button class="secondaryButton" data-action="add-entity">Добавить</button>
      <div class="entityRows">${collection.map((entity) => `<button class="${entity.id === selected?.id ? "active" : ""}" data-select-entity="${entity.id}"><strong>${escapeHtml(entity.title)}</strong><span>${escapeHtml(entity.type)}</span></button>`).join("")}</div>
    </div>
    <div class="panel editForm">
      <div class="formHeader"><h2>${escapeHtml(selected?.title || "Нет сущности")}</h2><button class="dangerButton" data-action="delete-entity" ${selected ? "" : "disabled"}>Удалить</button></div>
      ${
        selected
          ? `<label>Название<input data-edit-field="title" value="${escapeHtml(selected.title)}" /></label>
             <label>Тип<input data-edit-field="type" value="${escapeHtml(selected.type)}" /></label>
             <label>Описание<textarea data-edit-field="description">${escapeHtml(selected.description)}</textarea></label>
             <div class="formGrid">
               <label>Стоимость<input data-edit-field="cost" value="${selected.cost || ""}" /></label>
               <label>Доход<input data-edit-field="income" value="${selected.income || ""}" /></label>
               <label>Срок<input data-edit-field="duration" value="${selected.duration || ""}" /></label>
             </div>
             <label>Эффект<textarea data-edit-field="effect">${escapeHtml(selected.effect || "")}</textarea></label>
             <div class="saveNote">Изменения сохраняются автоматически в браузере.</div>`
          : ""
      }
    </div>
    <div class="panel jsonPanel"><h2>Быстрая проверка</h2><pre>${escapeHtml(JSON.stringify(selected, null, 2))}</pre></div>
  </section>`;
}

function bindCommon() {
  document.querySelectorAll("[data-view]").forEach((button) =>
    button.addEventListener("click", () => {
      view = button.dataset.view;
      modalState = null;
      sidePanel = null;
      if (view !== "game") window.location.hash = "";
      render();
    }),
  );
  document.querySelector("[data-action='logout']")?.addEventListener("click", () => {
    localStorage.removeItem(SESSION_KEY);
    user = null;
    activeRoomId = null;
    view = "rooms";
    render();
  });
  document.querySelector("[data-action='create-room']")?.addEventListener("click", () => {
    const name = document.querySelector("#room-name").value.trim() || "Тестовая партия PROLEUM";
    const mode = document.querySelector("#room-mode")?.value || "Standard";
    const room = createRoom(name, mode);
    state.rooms.unshift(room);
    activeRoomId = room.id;
    view = "game";
    window.location.hash = `room=${encodeURIComponent(room.id)}`;
    commit();
  });
  document.querySelectorAll("[data-join-room]").forEach((button) =>
    button.addEventListener("click", () => {
      joinRoom(button.dataset.joinRoom);
      activeRoomId = button.dataset.joinRoom;
      view = "game";
      window.location.hash = `room=${encodeURIComponent(button.dataset.joinRoom)}`;
      commit();
    }),
  );
  document.querySelectorAll("[data-open-room]").forEach((button) =>
    button.addEventListener("click", () => {
      activeRoomId = button.dataset.openRoom;
      view = "game";
      window.location.hash = `room=${encodeURIComponent(button.dataset.openRoom)}`;
      render();
    }),
  );
  document.querySelectorAll("[data-leave-room]").forEach((button) =>
    button.addEventListener("click", () => leaveRoom(button.dataset.leaveRoom)),
  );
  document.querySelectorAll("[data-delete-room]").forEach((button) =>
    button.addEventListener("click", () => deleteRoom(button.dataset.deleteRoom)),
  );
  document.querySelectorAll("[data-copy]").forEach((button) => button.addEventListener("click", () => navigator.clipboard?.writeText(button.dataset.copy)));
  document.querySelectorAll("[data-action='roll']").forEach((button) => button.addEventListener("click", roll));
  document.querySelector("[data-action='end-turn']")?.addEventListener("click", endTurn);
  document.querySelector("[data-action='open-cell']")?.addEventListener("click", (event) => {
    const cellId = event.currentTarget.dataset.cellId;
    if (!cellId) return;
    modalState = { type: "cell", cellId };
    render();
  });
  document.querySelector("[data-action='commercial']")?.addEventListener("click", () => {
    modalState = { type: "commercial" };
    render();
  });
  document.querySelector("[data-action='show-results']")?.addEventListener("click", () => {
    modalState = { type: "finalResults" };
    render();
  });
  document.querySelector("[data-action='open-trade-builder']")?.addEventListener("click", () => {
    modalState = { type: "tradeBuilder" };
    render();
  });
  document.querySelector("[data-action='open-trades']")?.addEventListener("click", () => {
    modalState = { type: "tradeInbox" };
    render();
  });
  document.querySelector("[data-action='create-trade']")?.addEventListener("click", createTradeOffer);
  document.querySelectorAll("[data-accept-trade]").forEach((button) => button.addEventListener("click", () => resolveTradeOffer(button.dataset.acceptTrade, true)));
  document.querySelectorAll("[data-decline-trade]").forEach((button) => button.addEventListener("click", () => resolveTradeOffer(button.dataset.declineTrade, false)));
  document.querySelector("[data-action='skip-cell']")?.addEventListener("click", skipCellAction);
  document.querySelector("[data-action='skip-commercial']")?.addEventListener("click", skipCommercialAction);
  document.querySelector("[data-action='toggle-tablet']")?.addEventListener("click", () => {
    dockOpen = !dockOpen;
    render();
  });
  document.querySelectorAll("[data-action='toggle-market']").forEach((button) =>
    button.addEventListener("click", () => {
      marketOpen = !marketOpen;
      render();
    }),
  );
  document.querySelector("[data-action='dismiss-turn-prompt']")?.addEventListener("click", dismissTurnPrompt);
  document.querySelector("[data-action='next-day']")?.addEventListener("click", nextDay);
  document.querySelectorAll("[data-side-panel]").forEach((button) =>
    button.addEventListener("click", () => {
      sidePanel = button.dataset.sidePanel || null;
      render();
    }),
  );
  document.querySelectorAll("[data-open-card]").forEach((item) =>
    item.addEventListener("click", (event) => {
      const clickedButton = event.target.closest("button");
      if (clickedButton && clickedButton !== item) return;
      modalState = { type: "card", ref: item.dataset.openCard };
      render();
    }),
  );
  document.querySelectorAll("[data-open-opponent]").forEach((button) =>
    button.addEventListener("click", () => {
      modalState = { type: "opponent", playerId: button.dataset.openOpponent };
      render();
    }),
  );
  document.querySelectorAll("[data-buy-resource]").forEach((button) =>
    button.addEventListener("click", () => {
      modalState = { type: "resource", code: button.dataset.buyResource };
      render();
    }),
  );
  document.querySelectorAll("[data-buy-resource-confirm]").forEach((button) =>
    button.addEventListener("click", () => buyResource(button.dataset.buyResourceConfirm, Number(button.dataset.amount || 1))),
  );
  document.querySelectorAll("[data-take-contract]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    takeDeal("contracts", button.dataset.takeContract);
  }));
  document.querySelectorAll("[data-take-tender]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    takeDeal("tenders", button.dataset.takeTender);
  }));
  document.querySelectorAll("[data-fill-contract]").forEach((button) => button.addEventListener("click", () => fillContract(button.dataset.fillContract)));
  document.querySelectorAll("[data-plan-route]").forEach((button) =>
    button.addEventListener("click", () => {
      modalState = { type: "route", contractId: button.dataset.planRoute };
      render();
    }),
  );
  document.querySelectorAll("[data-close-contract]").forEach((button) => button.addEventListener("click", () => closeContract(button.dataset.closeContract, button.dataset.route)));
  document.querySelectorAll("[data-open-cell]").forEach((button) =>
    button.addEventListener("click", () => {
      modalState = { type: "cell", cellId: button.dataset.openCell };
      render();
    }),
  );
  document.querySelectorAll("[data-buy-cell-asset]").forEach((button) => button.addEventListener("click", () => buyCellAsset(button.dataset.buyCellAsset)));
  document.querySelectorAll("[data-logistics-bonus]").forEach((button) => button.addEventListener("click", () => activateLogisticsBonus(button.dataset.logisticsBonus)));
  document.querySelector("[data-action='draw-proleum']")?.addEventListener("click", (event) => {
    event.stopPropagation();
    drawProleumCard();
  });
  document.querySelector("[data-action='draw-event']")?.addEventListener("click", (event) => {
    event.stopPropagation();
    drawEventCard();
  });
  document.querySelector("[data-action='draw-market']")?.addEventListener("click", (event) => {
    event.stopPropagation();
    drawMarketCardFromCell();
  });
  document.querySelector("[data-action='broker-contract']")?.addEventListener("click", brokerContract);
  document.querySelector("[data-action='special-cell']")?.addEventListener("click", applySpecialCell);
  document.querySelectorAll("[data-claim-choice]").forEach((button) =>
    button.addEventListener("click", () => resolveClaimChoice(button.dataset.claimChoice, button.dataset.contractId)),
  );
  document.querySelectorAll("[data-buy-hedge]").forEach((button) => button.addEventListener("click", () => buyHedge(button.dataset.buyHedge)));
  document.querySelectorAll("[data-play-proleum]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    playProleumCard(button.dataset.playProleum);
  }));
  document.querySelectorAll("[data-action='resolve-event']").forEach((button) => button.addEventListener("click", () => resolveEventChoice(button.dataset.choice)));
  document.querySelectorAll("[data-action='close-modal']").forEach((item) =>
    item.addEventListener("click", (event) => {
      if (item.classList.contains("modalBackdrop") && event.target !== item) return;
      modalState = null;
      render();
    }),
  );
  document.querySelectorAll("[data-cell]").forEach((button) =>
    button.addEventListener("click", () => {
      const room = activeRoom();
      if (!room) return;
      room.selectedEntityId = button.dataset.cell;
      modalState = { type: "cell", cellId: button.dataset.cell };
      render();
    }),
  );
  bindEditor();
}

function createRoom(name, mode = "Standard") {
  const modeSettings = state.config?.settings?.modes?.[mode] || state.config?.settings?.modes?.Standard || { days: 6 };
  const room = {
    id: uid("room"),
    name,
    ownerName: user.name,
    mode,
    maxDays: modeSettings.days || 6,
    status: "active",
    revision: 0,
    updatedAt: new Date().toISOString(),
    day: 1,
    currentTurn: 0,
    marketCardIndex: 0,
    turnState: normalizeTurnState(),
    players: [createPlayer(user.name, 0)],
    assetOwnership: {},
    log: [`${user.name} создал комнату.`],
  };
  startTurnClock(room);
  room.market = createMarket(room);
  ensureDealMarket(room, "contracts");
  ensureDealMarket(room, "tenders");
  return room;
}

function createPlayer(name, index) {
  return {
    id: uid("player"),
    name,
    color: palette[index % palette.length],
    position: 0,
    money: state.config?.settings?.startingMoney || 25,
    reputation: 3,
    efficiency: 3,
    influence: 3,
    warehouse: { REG: 0, PRM: 0, DTL: 0 },
    activeContracts: [],
    completedContracts: [],
    failedContracts: [],
    assets: [],
    proleumCards: [],
    hedgeTokens: [],
    brokeredContracts: [],
  };
}

function commercialActionOption(room, player, option) {
  const currentCell = state.config.boardCells[player.position];
  const gate = actionGate(room, player, { requiresRolled: true, commercial: true, cells: option.cells });
  const onRightCell = option.cells.includes(currentCell?.type);
  const reason = gate || (!onRightCell ? `Нужно стоять на клетке: ${option.cells.join(", ")}.` : "");
  const enabled = !reason;
  if (option.action === "resources" && enabled) {
    return `<div class="routeOption commercialOption"><strong>${escapeHtml(option.label)}</strong><span>${escapeHtml(option.details)}</span><div class="miniActions">
      <button class="secondaryButton" data-buy-resource="REG">REG</button>
      <button class="secondaryButton" data-buy-resource="PRM">PRM</button>
      <button class="secondaryButton" data-buy-resource="DTL">DTL</button>
    </div></div>`;
  }
  if (option.action === "hedge" && enabled) {
    const code = currentCell.title.includes("PRM") ? "PRM" : currentCell.title.includes("DTL") ? "DTL" : "REG";
    return `<button class="routeOption commercialOption" data-buy-hedge="${code}"><strong>${escapeHtml(option.label)} ${code}</strong><span>${escapeHtml(option.details)}</span><small>Купить hedge за ${state.config.settings?.hedgeCost || 1} млн</small></button>`;
  }
  if (option.action === "broker" && enabled) {
    return `<button class="routeOption commercialOption" data-action="broker-contract"><strong>${escapeHtml(option.label)}</strong><span>${escapeHtml(option.details)}</span><small>${player.activeContracts.length ? "Передать первый активный контракт" : "Нет активных контрактов"}</small></button>`;
  }
  return `<button class="routeOption commercialOption" ${enabled ? `data-open-cell="${currentCell.id}"` : "disabled"}><strong>${escapeHtml(option.label)}</strong><span>${escapeHtml(option.details)}</span><small>${escapeHtml(reason || "Открыть действие текущей клетки")}</small></button>`;
}

function cellTheme(type) {
  if (["supplier"].includes(type)) return "supplier";
  if (["market", "marketCard", "hedge"].includes(type)) return "market";
  if (["client", "contract", "tender"].includes(type)) return "contract";
  if (["rail", "road"].includes(type)) return "rail";
  if (["depot"].includes(type)) return "depot";
  if (["broker"].includes(type)) return "broker";
  if (["event", "risk", "block", "claim", "penalty"].includes(type)) return "event";
  if (["proleum", "meeting"].includes(type)) return "proleum";
  return "default";
}

function marketIncomeAdjustment(room, contract) {
  const card = state.config.marketCards[room.marketCardIndex % state.config.marketCards.length];
  const text = `${card?.effect || ""} ${card?.description || ""}`.toLowerCase();
  let delta = 0;
  const category = String(contract.category || "").toLowerCase();
  const size = String(contract.size || contract.type || "").toLowerCase();
  if (text.includes("все контракты -1") || text.includes("прямые поставки -1")) delta -= 1;
  if (text.includes("все контракты +1")) delta += 1;
  if (text.includes("тендер +2") && contract.type === "тендер") delta += 2;
  if (text.includes("крупные -1") && size.includes("круп")) delta -= 1;
  if (text.includes("крупные +1") && size.includes("круп")) delta += 1;
  if (text.includes("крупные +2") && size.includes("круп")) delta += 2;
  if (text.includes("малые +1") && size.includes("мал")) delta += 1;
  [
    ["агрохолдинг", "агро"],
    ["азс", "азс"],
    ["сеть азс", "сеть азс"],
    ["промышленность", "промышлен"],
    ["автопарк", "автопарк"],
    ["региональный", "регион"],
    ["муниципальные", "муницип"],
    ["трейдеры", "трейдер"],
  ].forEach(([needle, cat]) => {
    const match = text.match(new RegExp(`${needle}[^+-]*([+-])\\s?(\\d+)`));
    if (match && category.includes(cat)) delta += (match[1] === "+" ? 1 : -1) * Number(match[2]);
  });
  return delta;
}

function applyContractBonus(player, contract, clean = true) {
  const effect = String(contract.effect || "");
  const amountMatch = effect.match(/\+(\d+)/);
  const amount = amountMatch ? Number(amountMatch[1]) : 1;
  if (effect.includes("Репутац")) player.reputation += amount;
  else if (effect.includes("Эффектив")) player.efficiency += amount;
  else if (effect.includes("Влия")) player.influence += amount;
  else if (clean) player.reputation += contract.type === "малый" ? 1 : 0;
}

function joinRoom(roomId) {
  const room = state.rooms.find((item) => item.id === roomId);
  if (!room) return;
  if (!room.players.some((player) => player.name === user.name)) {
    room.players.push(createPlayer(user.name, room.players.length));
    ensureDealMarket(room, "contracts");
    ensureDealMarket(room, "tenders");
    room.log.unshift(`${user.name} вошел в комнату.`);
  }
}

function leaveRoom(roomId) {
  const room = state.rooms.find((item) => item.id === roomId);
  if (!room) return;
  const playerIndex = room.players.findIndex((player) => player.name === user.name);
  if (playerIndex < 0) {
    activeRoomId = null;
    view = "rooms";
    render();
    return;
  }

  const leavingPlayer = room.players[playerIndex];
  const wasCurrent = playerIndex === room.currentTurn;
  room.tradeOffers = (room.tradeOffers || []).map((offer) =>
    offer.status === "pending" && (offer.sellerId === leavingPlayer.id || offer.buyerId === leavingPlayer.id)
      ? { ...offer, status: "cancelled", resolvedAt: new Date().toISOString() }
      : offer,
  );
  room.players.splice(playerIndex, 1);
  Object.entries(room.assetOwnership || {}).forEach(([cellId, asset]) => {
    if (asset.ownerId === leavingPlayer.id) delete room.assetOwnership[cellId];
  });

  if (!room.players.length) {
    state.deletedRoomIds ||= [];
    state.deletedRoomIds.push(roomId);
    state.rooms = state.rooms.filter((item) => item.id !== roomId);
  } else {
    if (playerIndex < room.currentTurn) room.currentTurn -= 1;
    if (room.currentTurn >= room.players.length) room.currentTurn = 0;
    if (wasCurrent) {
      room.turnState = normalizeTurnState();
      startTurnClock(room);
    }
    if (room.ownerName === leavingPlayer.name) room.ownerName = room.players[0].name;
    room.log.unshift(`${leavingPlayer.name} покинул комнату${wasCurrent ? "; ход передан следующему игроку" : ""}.`);
  }

  activeRoomId = null;
  view = "rooms";
  modalState = null;
  sidePanel = null;
  window.location.hash = "";
  commit();
}

function deleteRoom(roomId) {
  const room = state.rooms.find((item) => item.id === roomId);
  if (!room) return;
  if (user.role !== "admin" && room.ownerName !== user.name) return;
  if (!window.confirm(`Удалить партию «${room.name}»? Это действие нельзя отменить.`)) return;
  state.deletedRoomIds ||= [];
  if (!state.deletedRoomIds.includes(roomId)) state.deletedRoomIds.push(roomId);
  state.rooms = state.rooms.filter((item) => item.id !== roomId);
  if (activeRoomId === roomId) activeRoomId = null;
  view = "rooms";
  modalState = null;
  sidePanel = null;
  window.location.hash = "";
  commit();
}

function skipCellAction() {
  const room = activeRoom();
  if (!room || !canUserAct(room) || !room.turnState?.rolled) return;
  const player = currentPlayer(room);
  room.turnState = normalizeTurnState(room.turnState);
  room.turnState.cellActionUsed = true;
  room.turnState.promptDismissed = true;
  room.log.unshift(`${player.name}: пропустил действие клетки.`);
  modalState = null;
  commit();
}

function skipCommercialAction() {
  const room = activeRoom();
  if (!room || !canUserAct(room) || !room.turnState?.rolled) return;
  const player = currentPlayer(room);
  room.turnState = normalizeTurnState(room.turnState);
  room.turnState.commercialActionUsed = true;
  room.turnState.promptDismissed = true;
  room.log.unshift(`${player.name}: пропустил коммерческое действие.`);
  modalState = null;
  commit();
}

function createTradeOffer() {
  const room = activeRoom();
  const seller = requireTurnPlayer();
  if (!room || !seller) return;
  room.turnState = normalizeTurnState(room.turnState);
  if (!room.turnState.rolled) return rejectAction(room, "Сначала бросьте кубики.");
  if (room.turnState.negotiationUsed) return rejectAction(room, "Переговорная сделка в этот ход уже использована.");
  const buyerId = document.querySelector("#trade-target")?.value;
  const resource = document.querySelector("#trade-resource")?.value;
  const price = Math.max(0, Math.min(20, Number(document.querySelector("#trade-price")?.value || 0)));
  const buyer = room.players.find((player) => player.id === buyerId);
  if (!buyer || buyer.id === seller.id) return rejectAction(room, "Выберите другого игрока.");
  if (!resource || (seller.warehouse?.[resource] || 0) < 1) return rejectAction(room, "Выбранного ресурса больше нет на складе.");
  room.tradeOffers.push({
    id: uid("trade"),
    status: "pending",
    sellerId: seller.id,
    sellerName: seller.name,
    buyerId: buyer.id,
    buyerName: buyer.name,
    resource,
    amount: 1,
    price,
    createdDay: room.day,
  });
  room.turnState.negotiationUsed = true;
  room.log.unshift(`${seller.name}: предложил ${buyer.name} купить ${resource} x1 за ${price} млн.`);
  modalState = { type: "notice", title: "Предложение отправлено", message: `${buyer.name} увидит его в панели хода.` };
  commit();
}

function resolveTradeOffer(offerId, accepted) {
  const room = activeRoom();
  if (!room) return;
  const offer = room.tradeOffers.find((item) => item.id === offerId && item.status === "pending");
  if (!offer || offer.buyerName !== user.name) return;
  const seller = room.players.find((player) => player.id === offer.sellerId);
  const buyer = room.players.find((player) => player.id === offer.buyerId);
  if (!accepted) {
    offer.status = "declined";
    offer.resolvedAt = new Date().toISOString();
    room.log.unshift(`${buyer?.name || user.name}: отклонил предложение ${offer.sellerName}.`);
    modalState = null;
    commit();
    return;
  }
  if (!seller || !buyer) return rejectAction(room, "Один из участников сделки покинул комнату.");
  if ((seller.warehouse?.[offer.resource] || 0) < offer.amount) return rejectAction(room, "У продавца уже нет предложенного ресурса.");
  if (buyer.money < offer.price) return rejectAction(room, `Для сделки нужно ${offer.price} млн. Доступно: ${buyer.money} млн.`);
  if (warehouseUsed(buyer) + offer.amount > warehouseCapacity(buyer)) return rejectAction(room, "На складе покупателя нет свободного места.");
  seller.warehouse[offer.resource] -= offer.amount;
  buyer.warehouse[offer.resource] = (buyer.warehouse[offer.resource] || 0) + offer.amount;
  buyer.money -= offer.price;
  seller.money += offer.price;
  offer.status = "accepted";
  offer.resolvedAt = new Date().toISOString();
  room.log.unshift(`${buyer.name}: принял сделку ${offer.sellerName}, ${offer.resource} x${offer.amount} за ${offer.price} млн.`);
  modalState = { type: "notice", title: "Сделка завершена", message: `${offer.resource} добавлен на склад, ${offer.price} млн перечислены продавцу.` };
  commit();
}

function roll() {
  const room = activeRoom();
  if (!room || !room.players.length) return;
  if (!canUserAct(room)) return;
  if (room.turnState?.rolled) return;
  const player = currentPlayer(room);
  const a = Math.ceil(Math.random() * 6);
  const b = Math.ceil(Math.random() * 6);
  const value = a + b;
  diceState = { a, b, player: player.name, step: 0, total: value };
  render();
  window.setTimeout(() => animatePlayerMove(room.id, player.id, value, 0), 650);
}

function animatePlayerMove(roomId, playerId, total, step) {
  const freshRoom = state.rooms.find((room) => room.id === roomId);
  const freshPlayer = freshRoom?.players.find((player) => player.id === playerId);
  if (!freshRoom || !freshPlayer || currentPlayer(freshRoom)?.id !== playerId) {
    diceState = null;
    render();
    return;
  }
  if (step < total) {
    const previous = freshPlayer.position;
    freshPlayer.position = (freshPlayer.position + 1) % 40;
    if (freshPlayer.position < previous) {
      freshPlayer.lap = (freshPlayer.lap || 0) + 1;
      freshPlayer.money += 2;
      freshRoom.log.unshift(`${freshPlayer.name}: прошел старт и получил 2 млн оборотного бонуса.`);
    }
    freshRoom.selectedEntityId = state.config.boardCells[freshPlayer.position].id;
    diceState = { ...diceState, step: step + 1, total };
    render();
    window.setTimeout(() => animatePlayerMove(roomId, playerId, total, step + 1), 115);
    return;
  }
  window.setTimeout(() => {
    const freshRoom = activeRoom();
    if (!freshRoom) return;
    const freshPlayer = currentPlayer(freshRoom);
    if (!freshPlayer || freshPlayer.id !== playerId) return;
    const cell = state.config.boardCells[freshPlayer.position];
    freshRoom.selectedEntityId = cell.id;
    freshRoom.turnState = normalizeTurnState({ rolled: true, promptDismissed: true });
    freshRoom.log.unshift(`${freshPlayer.name}: бросок ${total}, клетка "${cell.title}".`);
    modalState = { type: "cell", cellId: cell.id };
    diceState = null;
    commit();
  }, 180);
}

function endTurn() {
  const room = activeRoom();
  if (!room || !canUserAct(room) || !room.turnState?.rolled) return;
  const player = currentPlayer(room);
  const cell = currentCell(room, player);
  if (cell?.type === "claim" && !room.turnState?.cellActionUsed) {
    return rejectAction(room, "Сначала урегулируйте претензионный блок.");
  }
  room.log.unshift(`${player.name}: завершил ход.`);
  const nextTurn = (room.currentTurn + 1) % room.players.length;
  room.currentTurn = nextTurn;
  room.turnState = normalizeTurnState();
  startTurnClock(room);
  if (nextTurn === 0) {
    if (room.day >= (room.maxDays || 6)) {
      finishGame(room);
      modalState = { type: "finalResults" };
    } else {
      refreshTradingDay(room, "Все игроки сделали ход.");
      modalState = null;
    }
  } else {
    modalState = null;
  }
  commit();
}

function resolveClaimChoice(choice, contractId = "") {
  const room = activeRoom();
  const player = requireTurnPlayer();
  if (!room || !player) return;
  const cell = currentCell(room, player);
  const gate = actionGate(room, player, { requiresRolled: true, cellAction: true, cellId: cell.id, cells: ["claim"] });
  if (gate || cell.type !== "claim") return rejectAction(room, gate || "Вы не на претензионном блоке.");

  if (choice === "pay") {
    if (player.money < 2) return rejectAction(room, "Для урегулирования нужно 2 млн.");
    player.money -= 2;
    room.log.unshift(`${player.name}: урегулировал претензию за 2 млн и сохранил коммерческое действие.`);
  } else if (choice === "lose-commercial") {
    room.turnState.commercialActionUsed = true;
    room.log.unshift(`${player.name}: принял претензию и потерял коммерческое действие этого хода.`);
  } else if (choice === "extend") {
    const contract = player.activeContracts.find((item) => item.instanceId === contractId);
    if (!contract) return rejectAction(room, "Выбранный контракт больше не активен.");
    if (player.money < 2) return rejectAction(room, "Для продления контракта нужно 2 млн.");
    player.money -= 2;
    contract.duration += 1;
    room.log.unshift(`${player.name}: заплатил 2 млн и продлил "${contract.title}" на 1 торговый день.`);
  } else {
    return rejectAction(room, "Выберите способ урегулирования претензии.");
  }

  markCellAction(room);
  modalState = null;
  commit();
}

function finishGame(room) {
  room.status = "finished";
  room.finishedAt = new Date().toISOString();
  room.finalRanking = [...room.players]
    .sort((a, b) => scorePlayer(b) - scorePlayer(a))
    .map((player, index) => ({ place: index + 1, playerId: player.id, name: player.name, score: scorePlayer(player) }));
  room.log.unshift(`Партия завершена. Победитель: ${room.finalRanking[0]?.name || "не определен"}.`);
}

function nextDay() {
  const room = activeRoom();
  if (!room) return;
  if (user.role !== "admin") return;
  refreshTradingDay(room, "Админ обновил рынок вручную.");
  commit();
}

function refreshTradingDay(room, reason) {
  room.players.forEach((player) => ageContracts(room, player));
  room.day += 1;
  room.marketCardIndex = (room.marketCardIndex + 1) % state.config.marketCards.length;
  room.market = createMarket(room);
  room.players.forEach((player) => normalizePlayer(player));
  room.log.unshift(`Торговый день ${room.day}: рынок обновлен. ${reason}`);
}

function ageContracts(room, player) {
  player.activeContracts = (player.activeContracts || []).filter((contract) => {
    contract.acceptedDay ??= room.day;
    if (contract.acceptedDay >= room.day) return true;
    contract.duration = Math.max(0, (contract.duration || 1) - 1);
    if (contract.duration > 0) return true;
    player.failedContracts ||= [];
    player.failedContracts.push(contract);
    player.reputation = Math.max(0, player.reputation - 1);
    room.log.unshift(`${player.name}: срок по "${contract.title}" сорван. Репутация -1, штраф по очкам.`);
    return false;
  });
}

function requireTurnPlayer() {
  const room = activeRoom();
  if (!room || !canUserAct(room)) return null;
  return userPlayer(room);
}

function takeDeal(kind, id) {
  const room = activeRoom();
  const player = requireTurnPlayer();
  if (!room || !player) return;
  normalizePlayer(player);
  const gate = actionGate(room, player, { requiresRolled: true, commercial: true, cells: kind === "tenders" ? ["tender"] : ["contract", "client"] });
  if (gate) return rejectAction(room, gate);
  const activeLimit = state.config?.settings?.activeContractLimit || 2;
  if (player.activeContracts.length >= activeLimit) {
    room.log.unshift(`${player.name}: нет свободного слота под контракт.`);
    modalState = null;
    commit();
    return;
  }
  const entity = state.config[kind].find((item) => item.id === id);
  if (!entity) return;
  if (!ensureDealMarket(room, kind).some((item) => item.id === id)) return rejectAction(room, "Эта карта уже взята другим игроком. Витрина обновлена.");
  const requirement = requirementGate(player, entity.requirement);
  if (requirement) return rejectAction(room, requirement);
  const deal = cloneDeal(entity, room);
  player.activeContracts.push(deal);
  replaceMarketDeal(room, kind, entity.id);
  markCommercialAction(room);
  room.log.unshift(`${player.name}: взял ${kind === "tenders" ? "тендер" : "контракт"} "${entity.title}".`);
  modalState = {
    type: "cardReveal",
    kind: kind === "tenders" ? "tender" : "contract",
    label: kind === "tenders" ? "Новый тендер" : "Новый контракт",
    stamp: "В планшете",
    card: clone(entity),
  };
  commit();
}

function requirementGate(player, requirement = "") {
  if (!requirement) return "";
  const match = String(requirement).match(/(Репутация|Эффективность|Влияние)\s*(\d+)\+/i);
  if (!match) return "";
  const key = { "Репутация": "reputation", "Эффективность": "efficiency", "Влияние": "influence" }[match[1]];
  const needed = Number(match[2]);
  if (key && player[key] < needed) return `Требование допуска: ${requirement}.`;
  return "";
}

function cardRevealMarkup(reveal) {
  const card = reveal.card || {};
  const resources = card.resource
    ? `<div class="resourceLine expanded">${Object.entries(card.resource).map(([code, amount]) => `<span>${code} x${amount}</span>`).join("")}</div>`
    : "";
  const routes = card.routes?.length ? `<div class="routeLine">${card.routes.map((route) => `<span>${escapeHtml(route)}</span>`).join("")}</div>` : "";
  return `<div class="modalBackdrop revealBackdrop" data-action="close-modal">
    <section class="modalSheet cardSheet revealCard reveal-${escapeHtml(reveal.kind || "card")}" data-modal-body>
      <div class="revealGlow"></div>
      <button class="modalClose" data-action="close-modal">×</button>
      <span class="cardType">${escapeHtml(reveal.label || card.type || "Новая карта")}</span>
      <div class="revealStamp">${escapeHtml(reveal.stamp || "Получено")}</div>
      <h2>${escapeHtml(card.title || "Карта")}</h2>
      <p>${escapeHtml(card.description || card.effect || "Карта добавлена в вашу игровую зону.")}</p>
      ${resources}
      ${routes}
      <div class="cardFacts">
        ${card.income ? `<span>Доход <strong>${card.income} млн</strong></span>` : ""}
        ${card.duration ? `<span>Срок <strong>${card.duration}</strong></span>` : ""}
        ${card.risk !== undefined ? `<span>Риск <strong>${card.risk}</strong></span>` : ""}
      </div>
      ${card.effect ? `<div class="hintBox">${escapeHtml(card.effect)}</div>` : ""}
      <div class="modalActions"><button class="primaryButton revealAccept" data-action="close-modal">Понятно</button></div>
    </section>
  </div>`;
}

function buyHedge(resource) {
  const room = activeRoom();
  const player = requireTurnPlayer();
  if (!room || !player) return;
  const gate = actionGate(room, player, { requiresRolled: true, commercial: true, cells: ["hedge"] });
  if (gate) return rejectAction(room, gate);
  const limit = state.config?.settings?.hedgeLimit || 2;
  const cost = state.config?.settings?.hedgeCost || 1;
  if (player.hedgeTokens.length >= limit) return rejectAction(room, `Лимит hedge-токенов: ${limit}.`);
  if (player.money < cost) return rejectAction(room, `Hedge стоит ${cost} млн.`);
  player.money -= cost;
  player.hedgeTokens.push({ id: uid("hedge"), resource, lockedPrice: resourceMeta[resource].basePrice, volume: 2 });
  markCommercialAction(room);
  room.log.unshift(`${player.name}: купил hedge ${resource} за ${cost} млн, фикс цены до 2 жетонов.`);
  modalState = null;
  commit();
}

function drawMarketCardFromCell() {
  const room = activeRoom();
  const player = requireTurnPlayer();
  if (!room || !player) return;
  const gate = actionGate(room, player, { requiresRolled: true, cellAction: true, cells: ["marketCard"] });
  if (gate) return rejectAction(room, gate);
  const usedLogistics = clone(room.market.usedLogistics || { rail: 0, depot: 0 });
  room.marketCardIndex = (room.marketCardIndex + 1) % state.config.marketCards.length;
  room.market = createMarket(room);
  room.market.usedLogistics = usedLogistics;
  const marketCard = state.config.marketCards[room.marketCardIndex % state.config.marketCards.length];
  markCellAction(room);
  room.log.unshift(`${player.name}: открыл карту рынка "${marketCard.title}".`);
  modalState = { type: "cardReveal", kind: "market", label: "Карта рынка", stamp: `День ${room.day}`, card: clone(marketCard) };
  commit();
}

function brokerContract() {
  const room = activeRoom();
  const player = requireTurnPlayer();
  if (!room || !player) return;
  const gate = actionGate(room, player, { requiresRolled: true, commercial: true, cells: ["broker"] });
  if (gate) return rejectAction(room, gate);
  const contract = player.activeContracts[0];
  if (!contract) return rejectAction(room, "Для брокерки нужен активный контракт.");
  const fee = contract.brokerFee || Math.max(2, Math.floor((contract.income || 0) / 6));
  const assetBonus = ownedAssetCount(player, "broker") + (ownsSector(player, "service-network") ? 2 : 0);
  const proleumBonus = Number(room.turnState?.brokerBonus || 0);
  player.money += fee + assetBonus + proleumBonus;
  player.influence += 1;
  contract.brokered = true;
  player.brokeredContracts.push(contract);
  player.completedContracts.push(contract);
  player.activeContracts = player.activeContracts.filter((item) => item.instanceId !== contract.instanceId);
  markCommercialAction(room);
  room.log.unshift(`${player.name}: передал "${contract.title}" в брокерку и получил ${fee + assetBonus + proleumBonus} млн комиссии${assetBonus || proleumBonus ? `, включая бонусы +${assetBonus + proleumBonus}` : ""}.`);
  modalState = null;
  commit();
}

function buyResource(code, amount = 1) {
  const room = activeRoom();
  const player = requireTurnPlayer();
  if (!room || !player) return;
  normalizePlayer(player);
  normalizeMarket(room);
  const gate = actionGate(room, player, { requiresRolled: true, commercial: true, cells: ["supplier", "market"] });
  if (gate) return rejectAction(room, gate);
  const resourceCell = currentCell(room, player);
  if (resourceCell.resourceCode && resourceCell.resourceCode !== code) {
    return rejectAction(room, `На клетке "${resourceCell.title}" доступна закупка только ${resourceCell.resourceCode}.`);
  }
  const limit = resourceBuyLimit(room, player);
  const capacityLeft = warehouseCapacity(player) - warehouseUsed(player);
  amount = Math.max(1, Math.min(amount, limit, capacityLeft, room.market.stock[code] || 0));
  if (!amount) return rejectAction(room, "Нет места на складе или ресурс закончился на рынке.");
  const supplierDiscount = resourceAssetDiscount(player, code);
  const price = Math.max(1, (room.market.prices[code] || resourceMeta[code]?.basePrice || 0) - supplierDiscount);
  const cost = price * amount;
  if (player.money < cost) {
    return rejectAction(room, `Для покупки ${code} x${amount} нужно ${cost} млн. Доступно: ${player.money} млн.`);
  } else {
    player.money -= cost;
    player.warehouse[code] = (player.warehouse[code] || 0) + amount;
    room.market.stock[code] = Math.max(0, (room.market.stock[code] || 0) - amount);
    markCommercialAction(room);
    room.log.unshift(`${player.name}: купил ${code} x${amount} за ${cost} млн${supplierDiscount ? " со скидкой поставщика" : ""}.`);
  }
  modalState = null;
  commit();
}

function fillContract(contractId) {
  const room = activeRoom();
  const player = requireTurnPlayer();
  if (!room || !player) return;
  normalizeMarket(room);
  const gate = actionGate(room, player, { requiresRolled: true, commercial: true });
  if (gate) return rejectAction(room, gate);
  const contract = player.activeContracts.find((item) => item.instanceId === contractId);
  if (!contract) return;
  const missing = missingResources(contract);
  let totalCost = 0;
  let purchased = 0;
  const limit = resourceBuyLimit(room, player);
  const usedHedges = [];
  const plan = Object.entries(missing).map(([code, amount]) => {
    const fromWarehouse = Math.min(player.warehouse[code] || 0, amount);
    const marketNeed = amount - fromWarehouse;
    const fromMarket = Math.min(marketNeed, room.market.stock[code] || 0, Math.max(0, limit - purchased));
    purchased += fromMarket;
    const urgent = Math.max(0, marketNeed - fromMarket);
    const hedgeIndex = player.hedgeTokens.findIndex((token) => token.resource === code);
    const hedgedVolume = hedgeIndex >= 0 ? Math.min(2, fromMarket + urgent) : 0;
    const marketPrice = room.market.prices[code] || resourceMeta[code].basePrice;
    totalCost += Math.min(fromMarket, hedgedVolume) * resourceMeta[code].basePrice;
    totalCost += Math.max(0, fromMarket - hedgedVolume) * marketPrice;
    totalCost += urgent * (resourceMeta[code].basePrice + 2);
    if (hedgedVolume) usedHedges.push(hedgeIndex);
    return { code, amount: fromWarehouse + fromMarket + urgent, fromWarehouse, fromMarket, urgent, hedgedVolume };
  });
  if (player.money < totalCost) {
    room.log.unshift(`${player.name}: не хватает капитала на срочную закупку для "${contract.title}".`);
    modalState = { type: "contract", contractId };
  } else {
    plan.forEach(({ code, amount, fromWarehouse }) => {
      player.warehouse[code] = (player.warehouse[code] || 0) - fromWarehouse;
      contract.filled[code] = (contract.filled[code] || 0) + amount;
    });
    plan.forEach(({ code, fromMarket }) => {
      room.market.stock[code] = Math.max(0, (room.market.stock[code] || 0) - fromMarket);
    });
    [...new Set(usedHedges)].sort((a, b) => b - a).forEach((index) => player.hedgeTokens.splice(index, 1));
    player.money -= totalCost;
    markCommercialAction(room);
    const urgentCount = plan.reduce((sum, item) => sum + item.urgent, 0);
    const hedgeCount = plan.reduce((sum, item) => sum + item.hedgedVolume, 0);
    room.log.unshift(`${player.name}: обеспечил ресурс по сделке "${contract.title}" за ${totalCost} млн${urgentCount ? `, срочно ${urgentCount} жет.` : ""}${hedgeCount ? `, hedge применен на ${hedgeCount} жет.` : ""}.`);
    modalState = { type: "supplyResult", contract: clone(contract), cost: totalCost };
  }
  commit();
}

function closeContract(contractId, routeKey) {
  const room = activeRoom();
  const player = requireTurnPlayer();
  if (!room || !player) return;
  normalizeMarket(room);
  const gate = actionGate(room, player, { requiresRolled: true, commercial: true });
  if (gate) return rejectAction(room, gate);
  const index = player.activeContracts.findIndex((item) => item.instanceId === contractId);
  const contract = player.activeContracts[index];
  if (!contract || !contractReady(contract)) return;
  const route = routeOptions(room, contract).find((item) => item.key === routeKey);
  if (!route) return rejectAction(room, "Выберите доступный маршрут.");
  if (!route.available) return rejectAction(room, "На выбранный маршрут не хватает мощности дня.");
  if (player.money < route.cost) return rejectAction(room, `Не хватает капитала на логистику: нужно ${route.cost} млн.`);
  room.market.usedLogistics.rail += route.rail;
  room.market.usedLogistics.depot += route.depot;
  player.money -= route.cost;
  const risk = resolveRisk(room, player, contract, route);
  const marketDelta = marketIncomeAdjustment(room, contract);
  const clientBonus = Math.min(2, ownedAssetCount(player, "client")) + completedContractSectors(player) * 2;
  const proleumPenalty = Number(room.turnState?.proleumIncomePenalty || 0);
  const finalIncome = Math.max(0, contract.income + marketDelta + clientBonus - proleumPenalty);
  player.money += finalIncome;
  applyContractBonus(player, contract, !risk.triggered);
  contract.closedRoute = route.title;
  contract.closedDay = room.day;
  contract.finalIncome = finalIncome;
  contract.marketDelta = marketDelta;
  contract.assetIncomeBonus = clientBonus;
  player.completedContracts.push(contract);
  player.activeContracts.splice(index, 1);
  markCommercialAction(room);
  room.log.unshift(`${player.name}: закрыл "${contract.title}" через ${route.title}. Доход ${finalIncome} млн${marketDelta ? ` (рынок ${marketDelta > 0 ? "+" : ""}${marketDelta})` : ""}, логистика ${route.cost} млн${risk.triggered ? `, риск сработал (${risk.eventCard.title}, -${risk.penalty} млн)` : risk.dice ? `, риск пройден D6=${risk.dice}` : ""}.`);
  modalState = {
    type: "deliveryResult",
    result: {
      title: contract.title,
      route: route.title,
      income: finalIncome,
      logisticsCost: route.cost,
      marketDelta,
      clientBonus,
      proleumPenalty,
      risk: {
        level: risk.risk,
        dice: risk.dice,
        triggered: risk.triggered,
        skipped: risk.skipped,
        penalty: risk.penalty,
        eventTitle: risk.eventCard?.title || "",
      },
    },
  };
  commit();
}

function buyCellAsset(cellId) {
  const room = activeRoom();
  const player = requireTurnPlayer();
  if (!room || !player) return;
  const cell = state.config.boardCells.find((item) => item.id === cellId);
  if (!cell) return;
  const gate = actionGate(room, player, { requiresRolled: true, cellAction: true, cellId, cells: ["asset", "depot", "rail", "road", "client", "supplier", "market", "broker"] });
  if (gate) return rejectAction(room, gate);
  if (room.assetOwnership[cellId]) return rejectAction(room, `Актив уже принадлежит ${room.assetOwnership[cellId].ownerName}.`);
  if (player.assetPurchasedLap === player.lap) return rejectAction(room, "За один круг можно купить только один новый актив.");
  const cost = assetCostForCell(cell);
  if (player.money < cost) {
    return rejectAction(room, `Для покупки "${cell.title}" нужно ${cost} млн. Доступно: ${player.money} млн.`);
  } else {
    player.money -= cost;
    const owned = {
      id: uid("asset"),
      cellId,
      title: cell.title,
      type: cell.type,
      sector: cell.sector,
      sectorTitle: cell.sectorTitle,
      resourceCode: cell.resourceCode,
      cost,
      ownerId: player.id,
      ownerName: player.name,
      effect: sectorMeta[cell.sector]?.bonus || assetBenefitText(cell.type),
    };
    player.assets.push(owned);
    room.assetOwnership[cellId] = owned;
    player.assetPurchasedLap = player.lap;
    markCellAction(room);
    room.log.unshift(`${player.name}: купил актив "${cell.title}" за ${cost} млн.`);
  }
  modalState = null;
  commit();
}

function drawProleumCard() {
  const room = activeRoom();
  const player = requireTurnPlayer();
  if (!room || !player) return;
  const gate = actionGate(room, player, { requiresRolled: true, cellAction: true, cells: ["proleum"] });
  if (gate) return rejectAction(room, gate);
  const handLimit = state.config.settings?.proleumHandLimit || 3;
  if (player.proleumCards.length >= handLimit) {
    room.log.unshift(`${player.name}: рука ПРОЛЕУМ уже заполнена.`);
    modalState = null;
  } else {
    const cardItem = state.config.proleumCards[room.proleumCardIndex % state.config.proleumCards.length];
    room.proleumCardIndex = (room.proleumCardIndex + 1) % state.config.proleumCards.length;
    player.proleumCards.push(clone(cardItem));
    markCellAction(room);
    room.log.unshift(`${player.name}: взял карту ПРОЛЕУМ "${cardItem.title}".`);
    modalState = { type: "cardReveal", kind: "proleum", label: "Карта ПРОЛЕУМ", stamp: "Добавлена в руку", card: clone(cardItem) };
  }
  commit();
}

function drawEventCard() {
  const room = activeRoom();
  const player = requireTurnPlayer();
  if (!room || !player) return;
  const gate = actionGate(room, player, { requiresRolled: true, cellAction: true, cells: ["event", "risk", "penalty", "pause"] });
  if (gate) return rejectAction(room, gate);
  const eventCard = state.config.events[room.eventCardIndex % state.config.events.length];
  room.eventCardIndex = (room.eventCardIndex + 1) % state.config.events.length;
  markCellAction(room);
  modalState = { type: "eventChoice", title: eventCard.title, description: eventCard.description, eventId: eventCard.id };
  room.log.unshift(`${player.name}: открыл событие "${eventCard.title}".`);
  commit();
}

function playProleumCard(cardId) {
  const room = activeRoom();
  const player = requireTurnPlayer();
  if (!room || !player) return;
  const index = player.proleumCards.findIndex((card) => card.id === cardId);
  const card = player.proleumCards[index];
  if (!card) return;
  const playability = proleumPlayability(room, player, card);
  if (!playability.enabled) return rejectAction(room, playability.reason);
  room.turnState = normalizeTurnState(room.turnState);
  const title = card.title;
  if (title === "Альтернативный базис найден") {
    room.turnState.proleumRiskReduction += 1;
    room.turnState.proleumLogisticsDiscount += 2;
  } else if (title === "Экспресс-анализ риска") {
    room.turnState.proleumRiskReduction += 1;
  } else if (title === "Коммерческий компромисс") {
    room.turnState.skipRisk = true;
    room.turnState.proleumIncomePenalty += 2;
  } else if (title === "Слот подтвержден") {
    room.turnState.proleumLogisticsDiscount += 1;
    room.turnState.proleumRiskReduction += 1;
  } else if (title === "Сервисный коридор") {
    room.turnState.proleumRiskReduction += 1;
    room.turnState.proleumLogisticsDiscount += 1;
  } else if (title === "Проверенный маршрут") {
    room.turnState.proleumRiskReduction += 1;
  } else if (title === "Брокерское сопровождение ПРОЛЕУМ") {
    room.turnState.brokerBonus += 1;
  } else if (title === "Приоритетное окно поставки") {
    room.turnState.extraRail += 1;
  }
  room.turnState.proleumPlayed = true;
  player.proleumCards.splice(index, 1);
  room.log.unshift(`${player.name}: сыграл карту ПРОЛЕУМ "${card.title}".`);
  modalState = { type: "cardReveal", kind: "proleum", label: "Карта сыграна", stamp: "Эффект активен до конца хода", card: clone(card) };
  commit();
}

function activateLogisticsBonus(type) {
  const room = activeRoom();
  const player = requireTurnPlayer();
  if (!room || !player) return;
  const cell = currentCell(room, player);
  const gate = actionGate(room, player, { requiresRolled: true, cellAction: true, cellId: cell.id, cells: ["rail", "road", "depot"] });
  if (gate || cell.type !== type) return rejectAction(room, gate || "Бонус не соответствует текущей клетке.");
  room.turnState = normalizeTurnState(room.turnState);
  room.turnState.logisticsBonus = type;
  markCellAction(room);
  room.log.unshift(`${player.name}: активировал разовый логистический бонус клетки "${cell.title}".`);
  modalState = null;
  commit();
}

function resolveEventChoice(choice) {
  const room = activeRoom();
  const player = requireTurnPlayer();
  if (!room || !player || modalState?.type !== "eventChoice") return;
  const eventCard = state.config.events.find((item) => item.id === modalState.eventId) || modalState;
  const choiceText = eventCard.choices?.[Number(choice)] || String(choice);
  const moneyMatch = choiceText.match(/(\d+)\s*млн/);
  const cost = moneyMatch ? Number(moneyMatch[1]) : 0;
  if (choiceText.toLowerCase().includes("хедж") && player.hedgeTokens.length) {
    player.hedgeTokens.shift();
    room.log.unshift(`${player.name}: решил событие "${eventCard.title}" через hedge.`);
  } else if (choiceText.includes("+1 Репута")) {
    player.reputation += 1;
    room.log.unshift(`${player.name}: выбрал "${choiceText}" по событию "${eventCard.title}" (+1 Репутация).`);
  } else if (choiceText.includes("+1 млн") || choiceText.includes("Скидка 1 млн")) {
    player.money += 1;
    room.log.unshift(`${player.name}: выбрал "${choiceText}" по событию "${eventCard.title}" (+1 млн).`);
  } else if (cost) {
    player.money = Math.max(0, player.money - cost);
    room.log.unshift(`${player.name}: выбрал "${choiceText}" по событию "${eventCard.title}" (-${cost} млн).`);
  } else if (choiceText.includes("Репутац") || choiceText.includes("репутац")) {
    player.reputation = Math.max(0, player.reputation - 1);
    room.log.unshift(`${player.name}: выбрал "${choiceText}" по событию "${eventCard.title}" (-1 Репутация).`);
  } else if (choiceText.includes("Влия")) {
    player.influence = Math.max(0, player.influence - 1);
    room.log.unshift(`${player.name}: выбрал "${choiceText}" по событию "${eventCard.title}" (-1 Влияние).`);
  } else if (choiceText.includes("Эффектив")) {
    player.efficiency += 1;
    room.log.unshift(`${player.name}: выбрал "${choiceText}" по событию "${eventCard.title}" (+1 Эффективность).`);
  } else if (choiceText.includes("Срок") || choiceText.includes("срок") || choiceText.includes("Отложить")) {
    const active = player.activeContracts[0];
    if (active) active.duration = Math.max(0, active.duration - 1);
    room.log.unshift(`${player.name}: выбрал "${choiceText}" по событию "${eventCard.title}" (срок -1).`);
  } else {
    room.log.unshift(`${player.name}: выбрал "${choiceText}" по событию "${eventCard.title}".`);
  }
  modalState = null;
  commit();
}

function applySpecialCell() {
  const room = activeRoom();
  const player = requireTurnPlayer();
  if (!room || !player) return;
  const cell = currentCell(room, player);
  const gate = actionGate(room, player, { requiresRolled: true, cellAction: true, cells: ["claim", "block", "meeting"] });
  if (gate) return rejectAction(room, gate);
  if (cell.type === "meeting") {
    if (player.proleumCards.length < (state.config.settings?.proleumHandLimit || 3)) {
      const cardItem = state.config.proleumCards[room.proleumCardIndex % state.config.proleumCards.length];
      room.proleumCardIndex = (room.proleumCardIndex + 1) % state.config.proleumCards.length;
      player.proleumCards.push(clone(cardItem));
      room.log.unshift(`${player.name}: планерка дала карту ПРОЛЕУМ "${cardItem.title}".`);
      modalState = { type: "cardReveal", kind: "proleum", label: "Карта ПРОЛЕУМ", stamp: "Получена на планерке", card: clone(cardItem) };
    } else {
      player.influence += 1;
      room.log.unshift(`${player.name}: планерка усилила влияние (+1).`);
      modalState = null;
    }
  } else if (cell.type === "claim") {
    const cost = Math.min(player.money, 2);
    player.money -= cost;
    room.log.unshift(`${player.name}: закрыл претензионный блок за ${cost} млн.`);
    modalState = null;
  } else if (cell.type === "block") {
    if (player.activeContracts[0]) player.activeContracts[0].duration = Math.max(0, player.activeContracts[0].duration - 1);
    else player.money = Math.max(0, player.money - 1);
    room.log.unshift(`${player.name}: обработал блокировку поставки.`);
    modalState = null;
  }
  markCellAction(room);
  commit();
}

function bindEditor() {
  document.querySelectorAll("[data-kind]").forEach((button) =>
    button.addEventListener("click", () => {
      editorKind = button.dataset.kind;
      editorSelectedId = null;
      render();
    }),
  );
  document.querySelector("[data-action='add-entity']")?.addEventListener("click", () => {
    const next = { id: uid(editorKind), title: "Новая сущность", type: entityLabels[editorKind], description: "Описание сценария или правила.", effect: "" };
    state.config[editorKind].unshift(next);
    editorSelectedId = next.id;
    commit();
  });
  document.querySelectorAll("[data-select-entity]").forEach((button) =>
    button.addEventListener("click", () => {
      editorSelectedId = button.dataset.selectEntity;
      render();
    }),
  );
  document.querySelector("[data-action='delete-entity']")?.addEventListener("click", () => {
    state.config[editorKind] = state.config[editorKind].filter((entity) => entity.id !== editorSelectedId);
    editorSelectedId = null;
    commit();
  });
  document.querySelectorAll("[data-edit-field]").forEach((field) => {
    field.addEventListener("input", () => {
      const selected = state.config[editorKind].find((entity) => entity.id === editorSelectedId);
      if (!selected) return;
      const key = field.dataset.editField;
      selected[key] = ["cost", "income", "duration"].includes(key) ? Number(field.value) || undefined : field.value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      pushToServer();
      const preview = document.querySelector(".jsonPanel pre");
      if (preview) preview.textContent = JSON.stringify(selected, null, 2);
    });
  });
}

