const STORAGE_KEY = "proleum-monopoly-state-v1";
const SESSION_KEY = "proleum-monopoly-user-v1";
const palette = ["#1f7a5a", "#b7791f", "#365f91", "#8a3ffc", "#a83c3c", "#475569"];
const entityLabels = {
  boardCells: "Поле",
  contracts: "Контракты",
  tenders: "Тендеры",
  marketCards: "Рынок",
  events: "События",
  proleumCards: "ПРОЛЕУМ",
  assets: "Активы",
};
const resourceMeta = {
  REG: { name: "Регулярный бензин", basePrice: 3, color: "#2f7d58" },
  PRM: { name: "Премиальный бензин", basePrice: 4, color: "#bd7a22" },
  DTL: { name: "Дизельное топливо", basePrice: 4, color: "#365f91" },
};
const resourceVolumesByPlayers = {
  2: { REG: 4, PRM: 3, DTL: 4 },
  3: { REG: 5, PRM: 4, DTL: 5 },
  4: { REG: 6, PRM: 5, DTL: 6 },
  5: { REG: 7, PRM: 5, DTL: 7 },
  6: { REG: 8, PRM: 6, DTL: 8 },
};
const logisticsByPlayers = {
  2: { rail: 3, depot: 1 },
  3: { rail: 4, depot: 2 },
  4: { rail: 4, depot: 2 },
  5: { rail: 5, depot: 3 },
  6: { rail: 6, depot: 3 },
};
const proleumLogo = `
  <div class="proleumLogo" aria-label="ПРОЛЕУМ">
    <span class="dotGrid">${Array.from({ length: 9 }, () => "<i></i>").join("")}</span>
    <strong>ПРОЛЕУМ</strong>
  </div>`;
const boardTypes = [
  ["start", "Старт: новый торговый день"],
  ["supplier", "Поставщик REG"],
  ["event", "Операционное событие"],
  ["client", "АЗС-сегмент"],
  ["proleum", "Карты ПРОЛЕУМ"],
  ["rail", "ЖД-узел Север"],
  ["market", "Биржа ресурса"],
  ["asset", "Брокерский контур"],
  ["supplier", "Поставщик DTL"],
  ["risk", "Проверка риска"],
  ["pause", "Простой на станции"],
  ["depot", "Нефтебаза Восток"],
  ["contract", "Открытый контракт"],
  ["supplier", "Поставщик PRM"],
  ["tender", "Тендер дня"],
  ["road", "Автомаршрут"],
  ["event", "Операционное событие"],
  ["client", "Агрохолдинг"],
  ["market", "Биржа ресурса"],
  ["proleum", "Планерка участников рынка"],
  ["checkpoint", "Смена торгового дня"],
  ["depot", "Нефтебаза Юг"],
  ["contract", "Открытый контракт"],
  ["rail", "ЖД-узел Центр"],
  ["event", "Операционное событие"],
  ["client", "Промышленный клиент"],
  ["supplier", "Поставщик REG"],
  ["asset", "Сервисный актив"],
  ["market", "Биржа ресурса"],
  ["risk", "Срочная логистика"],
  ["penalty", "Срыв сроков"],
  ["road", "Трасса Запад"],
  ["contract", "Открытый контракт"],
  ["depot", "Нефтебаза Север"],
  ["proleum", "Карты ПРОЛЕУМ"],
  ["client", "Федеральная сеть"],
  ["rail", "ЖД-узел Восток"],
  ["event", "Операционное событие"],
  ["tender", "Тендерная комиссия"],
  ["market", "Финиш торгового круга"],
];

const defaultConfig = {
  rules: {
    title: "ПРОЛЕУМ: Сделка на миллион тонн",
    summary:
      "Игроки управляют нефтетрейдинговыми компаниями: берут клиентские контракты, обеспечивают их ресурсом, выбирают маршрут поставки, управляют риском и зарабатывают деньги, репутацию, эффективность и влияние.",
    setup: [
      "Стартовый капитал: 25 млн. Склад: 3 ресурса. Шкалы: Репутация 3, Эффективность 3, Влияние 3.",
      "На планшете рынка открываются 5 обычных контрактов, 1 тендер дня и первая карта рынка.",
      "Ведущий рынка обновляет цены, объемы REG/PRM/DTL и логистическую мощность дня.",
    ],
    turn: [
      "Игрок бросает кубики, перемещается по полю и выполняет действие клетки.",
      "Коммерческие действия: взять контракт, обеспечить ресурс, закрыть поставку, развить актив, провести переговоры или сыграть карту ПРОЛЕУМ.",
      "После хода всех игроков торговый день обновляется: новая карта рынка, ресурсы, логистика, открытые контракты и тендер.",
    ],
    scoring: [
      "Капитал: каждые 5 млн = 1 победное очко.",
      "Выполненные контракты: малый = 1, средний = 2, крупный = 3, тендер = 4.",
      "Каждые 2 пункта Репутации, Эффективности и Влияния дают по 1 очку.",
      "Сорванный контракт: -2 очка.",
    ],
    balance: [
      "За один полный круг поля игрок может купить не более 1 нового актива.",
      "Базовые действия не блокируются чужими активами: владелец получает комиссию, но не закрывает доступ.",
      "Если нужного ресурса нет, можно купить срочный ресурс у банка по цене +2 млн за жетон.",
      "Один ход - максимум одна сделка между игроками.",
    ],
  },
  boardCells: boardTypes.map(([type, title], index) => ({
    id: `cell-${index + 1}`,
    title,
    type,
    description:
      type === "start"
        ? "Проход через старт запускает новый торговый день и выплату оборотного бонуса."
        : "Клетка дает действие, усиление или возможность купить связанный актив.",
  })),
  contracts: [
    card("contract-azs", "Сеть АЗС", "малый", "Быстрый контракт для проверки авто-логистики и базовой маржи.", { REG: 2 }, ["Авто", "ЖД"], 3, 12, "низкий", "+1 Репутация при чистой поставке."),
    card("contract-agro", "Агрохолдинг", "средний", "Спрос на DTL, ограниченный ресурс и конкуренция за ЖД-мощность.", { DTL: 3 }, ["ЖД"], 4, 22, "средний", "+1 Рыночное влияние при поставке в срок."),
    card("contract-industry", "Промышленное предприятие", "крупный", "Сложная поставка через ЖД и нефтебазу. Требует Репутацию 4+.", { DTL: 2, PRM: 1 }, ["ЖД + нефтебаза"], 5, 28, "высокий", "+1 Эффективность при успешной поставке."),
  ],
  tenders: [
    card("tender-million-ton", "Тендер: миллион тонн", "тендер", "Открытая крупная сделка. Забирает тот, кто первым собрал ресурс и провел поставку.", { REG: 2, DTL: 2, PRM: 1 }, ["ЖД", "ЖД + нефтебаза"], 5, 36, "высокий", "+2 Рыночное влияние победителю тендера."),
  ],
  marketCards: [
    simple("market-dtl-season", "Сезонный спрос на DTL", "рынок", "DTL дорожает, аграрные контракты становятся выгоднее.", "DTL цена +1, объем -1. Агрохолдинги дают +2 млн дохода."),
    simple("market-reg-surplus", "Избыток REG", "рынок", "REG доступен дешевле, быстрые малые сделки ускоряются.", "REG цена -1, объем +2. Малые контракты можно брать без комиссии."),
    simple("market-rail-pressure", "Давление на ЖД", "рынок", "Провозная мощность ограничена, альтернативные маршруты дороже.", "ЖД-мощность -1. Срочная ЖД стоит +3 млн вместо +2 млн."),
  ],
  events: [
    simple("event-etran", "Сбой ЭТРАН", "операционное событие", "Выберите: заплатить 2 млн и провести поставку; потерять 1 ход срока; потратить 1 Репутацию и сохранить клиента."),
    simple("event-station", "Станция перегружена", "операционное событие", "Заплатите 3 млн за альтернативный маршрут, используйте нефтебазу за 1 млн или отложите поставку до следующего хода."),
    simple("event-idle", "Клиент спорит по простою", "операционное событие", "Заплатите 2 млн или потеряйте 1 Репутацию. Карта ПРОЛЕУМ может отменить потерю."),
  ],
  proleumCards: [
    simple("proleum-basis", "Альтернативный базис найден", "ПРОЛЕУМ", "Играть при закрытии контракта.", "Снизьте риск сделки на 1 или уменьшите стоимость логистики на 2 млн."),
    simple("proleum-margin", "Сервис спас маржу", "ПРОЛЕУМ", "Играть после операционного события.", "Отмените денежный штраф до 3 млн, но не отменяйте событие полностью."),
    simple("proleum-window", "Окно в логистике", "ПРОЛЕУМ", "Играть при закрытии через ЖД/нефтебазу.", "Используйте мощность даже если жетоны закончились. Доплатите 1 млн."),
  ],
  assets: [
    asset("asset-depot", "Нефтебаза", 12, "Увеличивает склад, упрощает крупные поставки и приносит комиссию.", "Владелец получает +2 к складу. Другие игроки платят 1 млн при использовании."),
    asset("asset-rail", "ЖД-узел", 10, "Дает скидку на ЖД и окно для срочных перевозок.", "Раз в день снижает свою ЖД-поставку на 1 млн. Другие платят комиссию."),
    asset("asset-broker", "Брокерский контур", 8, "Помогает спасать сложные контракты и зарабатывать на чужой брокерке.", "Чужая брокерка приносит 1 млн комиссии."),
  ],
  components: [
    simple("component-board", "Игровое поле", "1 шт.", "480x480 мм, 40 клеток."),
    simple("component-market", "Планшет рынка", "1 шт.", "Цены, ресурсы, логистика, открытые контракты, тендер."),
    simple("component-tablets", "Планшеты игроков", "6 шт.", "Деньги, склад, активные контракты, активы, 3 шкалы."),
    simple("component-cards", "Карты всего", "190 карт", "60 контрактов, 18 тендеров, 30 рынка, 40 событий, 30 ПРОЛЕУМ, 12 активов."),
    simple("component-tokens", "Ресурсные жетоны", "120 шт.", "REG / PRM / DTL по 40 шт."),
    simple("component-logistics", "Сроки и мощности", "86 шт.", "50 сроков, 10 ЖД, 6 нефтебаза, 20 продлено."),
  ],
};

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
  return { config: clone(defaultConfig), rooms: [] };
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  pushToServer();
  render();
}

async function syncFromServer() {
  try {
    const response = await fetch("./api/state", { cache: "no-store" });
    if (!response.ok) return;
    const remote = await response.json();
    if (!remote) {
      await pushToServer();
      return;
    }
    const serialized = JSON.stringify(remote);
    if (serialized && serialized !== lastSyncedState && serialized !== JSON.stringify(state)) {
      normalizeState(remote);
      state = remote;
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
  try {
    const serialized = JSON.stringify(state);
    lastSyncedState = serialized;
    await fetch("./api/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: serialized,
    });
  } catch {
    // Static-file fallback: localStorage remains the source of truth.
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
    (player.completedContracts || []).reduce((sum, contract) => sum + ({ "малый": 1, "средний": 2, "крупный": 3, "тендер": 4 }[contract.type] || 1), 0) +
    Math.floor(player.reputation / 2) +
    Math.floor(player.efficiency / 2) +
    Math.floor(player.influence / 2) -
    (player.failedContracts?.length || 0) * 2
  );
}

function activeRoom() {
  return state.rooms.find((room) => room.id === activeRoomId) || null;
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
  nextState.config ||= clone(defaultConfig);
  nextState.rooms ||= [];
  nextState.rooms.forEach((room) => {
    room.day ||= 1;
    room.currentTurn ||= 0;
    room.marketCardIndex ||= 0;
    room.log ||= [];
    room.players ||= [];
    room.assetOwnership ||= {};
    room.turnState = normalizeTurnState(room.turnState);
    room.market ||= createMarket(room);
    normalizeMarket(room);
    room.players.forEach((player, index) => normalizePlayer(player, index));
  });
}

function normalizePlayer(player, index = 0) {
  player.id ||= uid("player");
  player.color ||= palette[index % palette.length];
  player.position ||= 0;
  player.money ??= 25;
  player.reputation ??= 3;
  player.efficiency ??= 3;
  player.influence ??= 3;
  player.warehouse ||= { REG: 0, PRM: 0, DTL: 0 };
  player.activeContracts ||= [];
  player.completedContracts ||= [];
  player.failedContracts ||= [];
  player.assets ||= [];
  player.proleumCards ||= [];
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
  if (marketCard.id === "market-dtl-season") {
    prices.DTL += 1;
    stock.DTL = Math.max(0, stock.DTL - 1);
  }
  if (marketCard.id === "market-reg-surplus") {
    prices.REG = Math.max(1, prices.REG - 1);
    stock.REG += 2;
  }
  if (marketCard.id === "market-rail-pressure") {
    logistics.rail = Math.max(0, logistics.rail - 1);
  }
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

function cloneDeal(entity) {
  return {
    instanceId: uid("deal"),
    cardId: entity.id,
    title: entity.title,
    type: entity.type,
    description: entity.description,
    resource: clone(entity.resource || {}),
    filled: { REG: 0, PRM: 0, DTL: 0 },
    routes: clone(entity.routes || []),
    duration: entity.duration || 3,
    income: entity.income || 0,
    risk: entity.risk || "низкий",
    effect: entity.effect || "",
  };
}

function resourceTotal(resource = {}) {
  return Object.values(resource).reduce((sum, value) => sum + Number(value || 0), 0);
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
  return 3 + depotBonus;
}

function resourceBuyLimit(room, player) {
  const cellType = currentCell(room, player)?.type;
  return ["supplier", "market"].includes(cellType) ? 3 : 2;
}

function actionGate(room, player, options = {}) {
  if (!room || !player || !canUserAct(room)) return "Сейчас ходит другой игрок.";
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
  modalState = null;
  commit();
}

function cellTypeLabel(type) {
  const labels = {
    supplier: "поставщик",
    market: "биржа",
    contract: "контракт",
    client: "клиент",
    tender: "тендер",
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
  const costs = { depot: 12, rail: 10, road: 8, client: 9, supplier: 9, asset: 8 };
  return costs[cell?.type] || 10;
}

function routeOptions(room, contract) {
  const total = resourceTotal(contract.resource);
  const market = room.market || createMarket(room);
  const availableRail = Math.max(0, (market.logistics.rail || 0) - (market.usedLogistics.rail || 0));
  const availableDepot = Math.max(0, (market.logistics.depot || 0) - (market.usedLogistics.depot || 0));
  const allowed = contract.routes || [];
  const options = [];

  if (allowed.some((route) => route.includes("Авто")) && total <= 2) {
    options.push({ key: "auto", title: "Авто", cost: total, rail: 0, depot: 0, risk: 0, available: true, note: "Быстро, без общей мощности, только малые поставки." });
  }
  if (allowed.some((route) => route === "ЖД" || route.includes("ЖД"))) {
    const cost = 2 + Math.ceil(total / 2);
    options.push({ key: "rail", title: "ЖД", cost, rail: 1, depot: 0, risk: 1, available: availableRail >= 1, note: "Дешевле на объеме, но повышает операционный риск." });
  }
  if (allowed.some((route) => route.includes("нефтебаза"))) {
    const cost = 3 + Math.ceil(total / 2);
    options.push({ key: "rail-depot", title: "ЖД + нефтебаза", cost, rail: 1, depot: 1, risk: 0, available: availableRail >= 1 && availableDepot >= 1, note: "Надежнее для крупных сделок, занимает две мощности." });
  }

  return options;
}

function riskLevel(contract, route, player) {
  const base = { "низкий": 0, "средний": 1, "высокий": 2, "тендер": 2 }[contract.risk] ?? 1;
  const efficiencyReduce = player.efficiency >= 5 ? 1 : 0;
  return Math.max(0, base + (route?.risk || 0) - efficiencyReduce);
}

function resolveRisk(room, player, contract, route) {
  const risk = riskLevel(contract, route, player);
  if (risk <= 0) return { triggered: false, risk, penalty: 0, dice: null, eventCard: null };
  const dice = Math.ceil(Math.random() * 6);
  const threshold = risk === 1 ? 2 : risk === 2 ? 3 : 6;
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
        <button class="primaryButton" data-action="create-room">Создать</button>
      </div>
      <div class="roomGrid">
        ${state.rooms.map(roomCardMarkup).join("") || `<div class="panel"><h2>Комнат пока нет</h2><p>Создай первую тестовую партию и открой эту страницу во второй вкладке, чтобы имитировать второго игрока.</p></div>`}
      </div>
    </section>`;
}

function roomCardMarkup(room) {
  const initials = room.players.map((player) => `<span style="background:${player.color}">${escapeHtml(player.name.slice(0, 1).toUpperCase())}</span>`).join("");
  return `
    <article class="roomCard ${room.id === activeRoomId ? "active" : ""}">
      <div><h3>${escapeHtml(room.name)}</h3><span>${room.players.length} игроков · день ${room.day}</span></div>
      <div class="miniPlayers">${initials}</div>
      <div class="roomActions">
        <button class="secondaryButton" data-copy="${room.id}">ID</button>
        <button class="secondaryButton" data-open-room="${room.id}">Открыть</button>
        <button class="primaryButton" data-join-room="${room.id}">${room.players.some((player) => player.name === user.name) ? "Войти" : "Присоединиться"}</button>
      </div>
    </article>`;
}

function gameMarkup(room) {
  normalizeState(state);
  const actingPlayer = currentPlayer(room);
  const mine = userPlayer(room);
  const myTurn = canUserAct(room);
  const rolled = Boolean(room.turnState?.rolled);
  const turnState = normalizeTurnState(room.turnState);
  const selected = state.config.boardCells.find((cell) => cell.id === room.selectedEntityId) || state.config.boardCells[0];
  const contractReason = mine ? actionGate(room, mine, { requiresRolled: true, commercial: true, cells: ["contract", "client"] }) : "Вы не в комнате.";
  const tenderReason = mine ? actionGate(room, mine, { requiresRolled: true, commercial: true, cells: ["tender"] }) : "Вы не в комнате.";
  return `
    <section class="gameLayout">
      <div class="boardPanel">${boardMarkup(room)}</div>
      <div class="marketPanel">
        <div class="commandBar">
          <div>
            <span class="kicker">Сейчас ходит</span>
            <h2>${escapeHtml(actingPlayer?.name || "Нет игроков")}</h2>
            <p>${myTurn ? "Это ваш ход: выберите действие или бросьте кубики." : mine ? "Ожидайте свой ход. Ваши действия заблокированы." : "Вы наблюдатель этой комнаты."}</p>
            <div class="turnChecklist">
              <span class="${turnState.rolled ? "done" : ""}">Бросок</span>
              <span class="${turnState.cellActionUsed ? "done" : ""}">Клетка</span>
              <span class="${turnState.commercialActionUsed ? "done" : ""}">Коммерция</span>
            </div>
          </div>
          <div class="diceConsole ${diceState ? "isRolling" : ""}">
            <div class="dicePair"><span>${diceState?.a || "?"}</span><span>${diceState?.b || "?"}</span></div>
            <button class="primaryButton turnButton" data-action="roll" ${myTurn && !rolled ? "" : "disabled"}>${!myTurn ? "Не ваш ход" : rolled ? "Бросок сделан" : "Бросить 2D6"}</button>
          </div>
          <button class="primaryButton" data-action="end-turn" ${myTurn ? "" : "disabled"}>Завершить ход</button>
          <button class="secondaryButton" data-action="next-day" ${user.role === "admin" ? "" : "disabled"}>День +1</button>
        </div>
        <div class="dealColumns">
          <section class="deckColumn"><h3>Открытые контракты</h3>${state.config.contracts
            .slice(0, 5)
            .map((item) => entityCardMarkup(item, true, { action: "take-contract", label: "Взять контракт", disabled: Boolean(contractReason), reason: contractReason }))
            .join("")}</section>
          <section class="deckColumn"><h3>Тендер дня</h3>${state.config.tenders
            .slice(0, 1)
            .map((item) => entityCardMarkup(item, true, { action: "take-tender", label: "Заявиться", disabled: Boolean(tenderReason), reason: tenderReason }))
            .join("")}</section>
        </div>
        ${mine ? activeContractsMarkup(room, mine) : ""}
        ${playersMarkup(room.players)}
      </div>
      <aside class="inspector">
        <span class="kicker">Выбрано</span>
        <h2>${escapeHtml(selected.title)}</h2>
        <p>${escapeHtml(selected.description)}</p>
        <button class="primaryButton" data-open-cell="${selected.id}">Открыть действие клетки</button>
        <div class="metaList"><span>Тип: ${escapeHtml(selected.type)}</span><span>День: ${room.day}</span><span>Роль: ${user.role === "admin" ? "админ" : "игрок"}</span></div>
        <h3>Журнал</h3>
        <div class="logList">${room.log.slice(0, 8).map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>
      </aside>
      ${playerDockMarkup(room)}
    </section>`;
}

function boardMarkup(room) {
  normalizeMarket(room);
  const market = room.market;
  const marketCard = state.config.marketCards[room.marketCardIndex % state.config.marketCards.length];
  const myTurn = canUserAct(room);
  const player = currentPlayer(room);
  const resourceReason = player ? actionGate(room, player, { requiresRolled: true, commercial: true, cells: ["supplier", "market"] }) : "Нет игрока.";
  return `
    <div class="board">
      ${state.config.boardCells
        .map((cell, index) => {
          const players = room.players.filter((player) => player.position === index);
          const owner = room.assetOwnership?.[cell.id];
          const isStanding = player?.position === index;
          return `<button class="boardCell type-${cell.type} ${owner ? "ownedCell" : ""} ${isStanding ? "currentCell" : ""}" data-cell="${cell.id}">
            <span>${index + 1}</span><strong>${escapeHtml(cell.title)}</strong>
            ${owner ? `<em>${escapeHtml(owner.ownerName)}</em>` : ""}
            <div class="tokens">${players.map((player) => `<i style="background:${player.color}" title="${escapeHtml(player.name)}"></i>`).join("")}</div>
          </button>`;
        })
        .join("")}
      <div class="boardCenter">
        <div class="boardLogo">${proleumLogo}<span>торговый день ${room.day}</span></div>
        <div class="centerMarket">
          <div class="centerSection">
            <h3>Рынок ресурса</h3>
            <div class="resourceGrid compact">
              ${Object.entries(resourceMeta)
                .map(
                  ([code, meta]) => `<button class="resourceTile" style="border-color:${meta.color}" data-buy-resource="${code}" ${resourceReason ? "disabled" : ""} title="${escapeHtml(resourceReason || `Остаток: ${market.stock[code]} жетонов`)}">
                    <strong>${code}</strong><span>${market.prices[code]} млн</span><small>остаток ${market.stock[code]} жет.</small><em>Купить</em>
                  </button>`,
                )
                .join("")}
            </div>
          </div>
          <div class="centerSection">
            <h3>Логистика</h3>
            <div class="logisticsGrid compact"><div>ЖД <strong>${Math.max(0, market.logistics.rail - market.usedLogistics.rail)}/${market.logistics.rail}</strong></div><div>База <strong>${Math.max(0, market.logistics.depot - market.usedLogistics.depot)}/${market.logistics.depot}</strong></div></div>
          </div>
          <details class="marketEvent">
            <summary>${escapeHtml(marketCard.title)}</summary>
            <p>${escapeHtml(marketCard.description)}</p>
            <small>${escapeHtml(marketCard.effect || "")}</small>
          </details>
        </div>
      </div>
    </div>`;
}

function entityCardMarkup(entity, compact = false, action = null) {
  const resource = entity.resource
    ? `<div class="resourceLine">${Object.entries(entity.resource).map(([code, amount]) => `<span>${code} x${amount}</span>`).join("")}</div>`
    : "";
  const actionButton = action
    ? `<button class="cardAction" data-${action.action}="${entity.id}" ${action.disabled ? "disabled" : ""} title="${escapeHtml(action.reason || "")}">${escapeHtml(action.label)}</button>${action.disabled && action.reason ? `<small class="lockReason">${escapeHtml(action.reason)}</small>` : ""}`
    : "";
  return `
    <article class="entityCard ${compact ? "compact" : ""}">
      <div><span>${escapeHtml(entity.type)}</span><strong>${escapeHtml(entity.title)}</strong></div>
      <p>${escapeHtml(entity.description)}</p>
      ${resource}
      ${entity.effect ? `<small>${escapeHtml(entity.effect)}</small>` : ""}
      ${actionButton}
    </article>`;
}

function activeContractsMarkup(room, player) {
  return `<section class="panel activeDealsPanel">
    <div class="sectionHead"><div><span class="kicker">Ваш планшет</span><h3>Активные сделки</h3></div><span>${player.activeContracts.length}/3 слота</span></div>
    ${
      player.activeContracts.length
        ? player.activeContracts
            .map((contract) => {
              const missing = missingResources(contract);
              const progress = resourceTotal(contract.filled) / Math.max(1, resourceTotal(contract.resource));
              const fillReason = contractReady(contract)
                ? "Ресурс уже собран."
                : actionGate(room, player, { requiresRolled: true, commercial: true });
              const closeReason = !contractReady(contract)
                ? "Сначала обеспечьте все ресурсы."
                : actionGate(room, player, { requiresRolled: true, commercial: true });
              const routes = routeOptions(room, contract);
              const routeHint = routes.length
                ? routes.map((route) => `${route.title}: ${route.available ? `${route.cost} млн, риск ${riskLevel(contract, route, player)}` : "нет мощности"}`).join(" · ")
                : "Нет доступного маршрута по условиям контракта.";
              return `<article class="activeDeal">
                <div><strong>${escapeHtml(contract.title)}</strong><span>${escapeHtml(contract.type)} · срок ${contract.duration} · доход ${contract.income} млн</span></div>
                <div class="progressTrack"><i style="width:${Math.round(progress * 100)}%"></i></div>
                <div class="resourceLine">${Object.entries(contract.resource)
                  .map(([code, amount]) => `<span>${code} ${contract.filled?.[code] || 0}/${amount}</span>`)
                  .join("")}</div>
                <div class="dealActions">
                  <button class="secondaryButton" data-fill-contract="${contract.instanceId}" ${fillReason ? "disabled" : ""} title="${escapeHtml(fillReason)}">Обеспечить ресурс</button>
                  <button class="primaryButton" data-plan-route="${contract.instanceId}" ${closeReason ? "disabled" : ""} title="${escapeHtml(closeReason)}">Выбрать маршрут</button>
                </div>
                ${Object.values(missing).some(Boolean) ? `<small>Не хватает: ${Object.entries(missing).filter(([, amount]) => amount).map(([code, amount]) => `${code} x${amount}`).join(", ")}</small>` : `<small>Ресурс собран. Можно закрывать поставку.</small>`}
                <small class="routeHint">${escapeHtml(routeHint)}</small>
              </article>`;
            })
            .join("")
        : `<div class="emptyState">Возьмите контракт или тендер: карточка появится здесь, а затем ее можно будет обеспечить ресурсом и закрыть.</div>`
    }
  </section>`;
}

function playerDockMarkup(room) {
  return `<aside class="playerDock">
    <div class="dockHandle">Планшеты игроков</div>
    <div class="tabletStack">
      ${room.players.map((player) => playerTabletMarkup(player, currentPlayer(room)?.id === player.id)).join("")}
    </div>
  </aside>`;
}

function playerTabletMarkup(player, isCurrent) {
  const stock = Object.entries(player.warehouse || {})
    .map(([code, amount]) => `<span>${code}: <strong>${amount}</strong></span>`)
    .join("");
  return `<article class="playerTablet ${isCurrent ? "current" : ""}">
    <header><div><i style="background:${player.color}"></i><strong>${escapeHtml(player.name)}</strong></div><span>${isCurrent ? "ходит" : "ожидает"}</span></header>
    <div class="tabletStats">
      <span>Капитал <strong>${player.money} млн</strong></span>
      <span>Репутация <strong>${player.reputation}</strong></span>
      <span>Эффективность <strong>${player.efficiency}</strong></span>
      <span>Влияние <strong>${player.influence}</strong></span>
    </div>
    <details open>
      <summary>Склад</summary>
      <div class="tabletChips">${stock}<span>место: <strong>${warehouseUsed(player)}/${warehouseCapacity(player)}</strong></span></div>
    </details>
    <details>
      <summary>Контракты</summary>
      <div class="tabletList">${player.activeContracts.map((contract) => `<span>${escapeHtml(contract.title)}</span>`).join("") || "<span>Нет активных контрактов</span>"}</div>
    </details>
    <details>
      <summary>Активы и карты</summary>
      <div class="tabletList">${player.assets.map((assetItem) => `<span>${escapeHtml(assetItem.title)}</span>`).join("") || "<span>Активов пока нет</span>"}${player.proleumCards.map((cardItem) => `<span>ПРОЛЕУМ: ${escapeHtml(cardItem.title)}</span>`).join("")}</div>
    </details>
    <details>
      <summary>История</summary>
      <div class="tabletList"><span>Закрыто: ${player.completedContracts.length}</span><span>Сорвано: ${player.failedContracts?.length || 0}</span><span>Круг: ${player.lap || 0}</span></div>
    </details>
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

function modalMarkup() {
  if (!modalState) return "";
  const room = activeRoom();
  const mine = room ? userPlayer(room) : null;
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
        ${cellActionMarkup(cell, myTurn)}
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
              <span>Риск сделки ${riskLevel(contract, route, mine)}</span>
              <small>${escapeHtml(route.note)}</small>
              ${route.rail || route.depot ? `<em>Мощность: ЖД ${route.rail}, база ${route.depot}</em>` : `<em>Без общей мощности</em>`}
            </button>`)
            .join("") || `<div class="hintBox">Для этого контракта нет разрешенных маршрутов.</div>`}
        </div>
      </section>
    </div>`;
  }
  if (modalState.type === "eventChoice") {
    return `<div class="modalBackdrop" data-action="close-modal">
      <section class="modalSheet" data-modal-body>
        <button class="modalClose" data-action="close-modal">×</button>
        <span class="kicker">Операционное событие</span>
        <h2>${escapeHtml(modalState.title)}</h2>
        <p>${escapeHtml(modalState.description)}</p>
        <div class="decisionGrid">
          <button class="primaryButton" data-action="resolve-event" data-choice="pay">Заплатить и сохранить темп</button>
          <button class="secondaryButton" data-action="resolve-event" data-choice="rep">Потерять репутацию</button>
          <button class="secondaryButton" data-action="resolve-event" data-choice="delay">Принять задержку</button>
        </div>
      </section>
    </div>`;
  }
  return "";
}

function turnPromptMarkup() {
  const room = activeRoom();
  if (!room || modalState || diceState || !canUserAct(room) || room.turnState?.rolled || room.turnState?.promptDismissed) return "";
  const player = currentPlayer(room);
  return `<div class="turnPrompt">
    <section class="turnPromptCard">
      <span class="kicker">Ваш ход</span>
      <h2>${escapeHtml(player.name)}, бросьте кубики</h2>
      <p>Сначала бросок 2D6, затем выберите действие клетки или коммерческое действие: контракт, ресурс, актив, событие.</p>
      <div class="promptDice"><span>?</span><span>?</span></div>
      <div class="modalActions">
        <button class="primaryButton heroRoll" data-action="roll">Бросить кубики</button>
        <button class="secondaryButton" data-action="dismiss-turn-prompt">Сначала осмотреть стол</button>
      </div>
    </section>
  </div>`;
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
    return `<div class="modalActions">
      <button class="secondaryButton" data-buy-resource="REG" ${gate ? "disabled" : disabled} title="${escapeHtml(gate)}">Купить REG</button>
      <button class="secondaryButton" data-buy-resource="PRM" ${gate ? "disabled" : disabled} title="${escapeHtml(gate)}">Купить PRM</button>
      <button class="secondaryButton" data-buy-resource="DTL" ${gate ? "disabled" : disabled} title="${escapeHtml(gate)}">Купить DTL</button>
    </div>`;
  }
  if (["asset", "depot", "rail", "road", "client"].includes(cell.type)) {
    const gate = room && player ? actionGate(room, player, { requiresRolled: true, cellAction: true, cellId: cell.id, cells: ["asset", "depot", "rail", "road", "client"] }) : "Недоступно.";
    const owner = room?.assetOwnership?.[cell.id];
    const price = assetCostForCell(cell);
    const reason = owner ? `Актив уже принадлежит ${owner.ownerName}.` : player?.assetPurchasedLap === player?.lap ? "За круг уже куплен один актив." : gate;
    return `<div class="decisionBox"><strong>Покупаемый актив · ${price} млн</strong><p>Актив дает преимущество владельцу, но не блокирует базовые действия другим игрокам.</p>${reason ? `<small>${escapeHtml(reason)}</small>` : ""}<button class="primaryButton" data-buy-cell-asset="${cell.id}" ${reason ? "disabled" : disabled}>Купить актив</button></div>`;
  }
  if (cell.type === "contract") {
    const gate = room && player ? actionGate(room, player, { requiresRolled: true, commercial: true, cellId: cell.id, cells: ["contract"] }) : "Недоступно.";
    return `<div class="modalActions">${state.config.contracts
      .slice(0, 3)
      .map((item) => `<button class="secondaryButton" data-take-contract="${item.id}" ${gate ? "disabled" : disabled} title="${escapeHtml(gate)}">${escapeHtml(item.title)}</button>`)
      .join("")}</div>`;
  }
  if (cell.type === "tender") {
    const gate = room && player ? actionGate(room, player, { requiresRolled: true, commercial: true, cellId: cell.id, cells: ["tender"] }) : "Недоступно.";
    return `<div class="modalActions">${state.config.tenders
      .slice(0, 1)
      .map((item) => `<button class="primaryButton" data-take-tender="${item.id}" ${gate ? "disabled" : disabled} title="${escapeHtml(gate)}">Заявиться на тендер</button>`)
      .join("")}</div>`;
  }
  if (cell.type === "proleum") {
    const gate = room && player ? actionGate(room, player, { requiresRolled: true, cellAction: true, cellId: cell.id, cells: ["proleum"] }) : "Недоступно.";
    return `<div class="decisionBox"><strong>Экспертное решение</strong><p>Возьмите карту ПРОЛЕУМ в руку. Максимум 3 карты.</p>${gate ? `<small>${escapeHtml(gate)}</small>` : ""}<button class="primaryButton" data-action="draw-proleum" ${gate ? "disabled" : disabled}>Взять карту</button></div>`;
  }
  if (["event", "risk", "penalty", "pause"].includes(cell.type)) {
    const gate = room && player ? actionGate(room, player, { requiresRolled: true, cellAction: true, cellId: cell.id, cells: ["event", "risk", "penalty", "pause"] }) : "Недоступно.";
    return `<div class="decisionBox"><strong>Операционный выбор</strong><p>Откройте событие и выберите, как компания решит проблему.</p>${gate ? `<small>${escapeHtml(gate)}</small>` : ""}<button class="primaryButton" data-action="draw-event" ${gate ? "disabled" : disabled}>Открыть событие</button></div>`;
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
    const room = createRoom(name);
    state.rooms.unshift(room);
    activeRoomId = room.id;
    view = "game";
    commit();
  });
  document.querySelectorAll("[data-join-room]").forEach((button) =>
    button.addEventListener("click", () => {
      joinRoom(button.dataset.joinRoom);
      activeRoomId = button.dataset.joinRoom;
      view = "game";
      commit();
    }),
  );
  document.querySelectorAll("[data-open-room]").forEach((button) =>
    button.addEventListener("click", () => {
      activeRoomId = button.dataset.openRoom;
      view = "game";
      render();
    }),
  );
  document.querySelectorAll("[data-copy]").forEach((button) => button.addEventListener("click", () => navigator.clipboard?.writeText(button.dataset.copy)));
  document.querySelectorAll("[data-action='roll']").forEach((button) => button.addEventListener("click", roll));
  document.querySelector("[data-action='end-turn']")?.addEventListener("click", endTurn);
  document.querySelector("[data-action='dismiss-turn-prompt']")?.addEventListener("click", dismissTurnPrompt);
  document.querySelector("[data-action='next-day']")?.addEventListener("click", nextDay);
  document.querySelectorAll("[data-buy-resource]").forEach((button) =>
    button.addEventListener("click", () => {
      modalState = { type: "resource", code: button.dataset.buyResource };
      render();
    }),
  );
  document.querySelectorAll("[data-buy-resource-confirm]").forEach((button) =>
    button.addEventListener("click", () => buyResource(button.dataset.buyResourceConfirm, Number(button.dataset.amount || 1))),
  );
  document.querySelectorAll("[data-take-contract]").forEach((button) => button.addEventListener("click", () => takeDeal("contracts", button.dataset.takeContract)));
  document.querySelectorAll("[data-take-tender]").forEach((button) => button.addEventListener("click", () => takeDeal("tenders", button.dataset.takeTender)));
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
  document.querySelector("[data-action='draw-proleum']")?.addEventListener("click", drawProleumCard);
  document.querySelector("[data-action='draw-event']")?.addEventListener("click", drawEventCard);
  document.querySelectorAll("[data-action='resolve-event']").forEach((button) => button.addEventListener("click", () => resolveEventChoice(button.dataset.choice)));
  document.querySelectorAll("[data-action='close-modal']").forEach((item) =>
    item.addEventListener("click", (event) => {
      if (event.target.closest("[data-modal-body]") && !event.target.matches(".modalClose")) return;
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

function createRoom(name) {
  const room = {
    id: uid("room"),
    name,
    day: 1,
    currentTurn: 0,
    marketCardIndex: 0,
    turnState: normalizeTurnState(),
    players: [createPlayer(user.name, 0)],
    assetOwnership: {},
    log: [`${user.name} создал комнату.`],
  };
  room.market = createMarket(room);
  return room;
}

function createPlayer(name, index) {
  return {
    id: uid("player"),
    name,
    color: palette[index % palette.length],
    position: 0,
    money: 25,
    reputation: 3,
    efficiency: 3,
    influence: 3,
    warehouse: { REG: 0, PRM: 0, DTL: 0 },
    activeContracts: [],
    completedContracts: [],
    assets: [],
    proleumCards: [],
  };
}

function joinRoom(roomId) {
  const room = state.rooms.find((item) => item.id === roomId);
  if (!room) return;
  if (!room.players.some((player) => player.name === user.name)) {
    room.players.push(createPlayer(user.name, room.players.length));
    room.log.unshift(`${user.name} вошел в комнату.`);
  }
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
  diceState = { a, b, player: player.name };
  render();
  window.setTimeout(() => {
    const freshRoom = activeRoom();
    if (!freshRoom) return;
    const freshPlayer = currentPlayer(freshRoom);
    if (!freshPlayer || freshPlayer.name !== player.name) return;
    const previous = freshPlayer.position;
    freshPlayer.position = (freshPlayer.position + value) % 40;
    if (freshPlayer.position < previous) {
      freshPlayer.lap = (freshPlayer.lap || 0) + 1;
      freshPlayer.money += 2;
      freshRoom.log.unshift(`${freshPlayer.name}: прошел старт и получил 2 млн оборотного бонуса.`);
    }
    const cell = state.config.boardCells[freshPlayer.position];
    freshRoom.selectedEntityId = cell.id;
    freshRoom.turnState = normalizeTurnState({ rolled: true, promptDismissed: true });
    freshRoom.log.unshift(`${freshPlayer.name}: бросок ${value}, клетка "${cell.title}".`);
    modalState = { type: "cell", cellId: cell.id };
    diceState = null;
    commit();
  }, 850);
}

function endTurn() {
  const room = activeRoom();
  if (!room || !canUserAct(room)) return;
  const player = currentPlayer(room);
  ageContracts(room, player);
  room.log.unshift(`${player.name}: завершил ход.`);
  const nextTurn = (room.currentTurn + 1) % room.players.length;
  room.currentTurn = nextTurn;
  room.turnState = normalizeTurnState();
  if (nextTurn === 0) refreshTradingDay(room, "Все игроки сделали ход.");
  modalState = null;
  commit();
}

function nextDay() {
  const room = activeRoom();
  if (!room) return;
  if (user.role !== "admin") return;
  refreshTradingDay(room, "Админ обновил рынок вручную.");
  commit();
}

function refreshTradingDay(room, reason) {
  room.day += 1;
  room.marketCardIndex = (room.marketCardIndex + 1) % state.config.marketCards.length;
  room.market = createMarket(room);
  room.players.forEach((player) => normalizePlayer(player));
  room.log.unshift(`Торговый день ${room.day}: рынок обновлен. ${reason}`);
}

function ageContracts(room, player) {
  player.activeContracts = (player.activeContracts || []).filter((contract) => {
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
  if (player.activeContracts.length >= 3) {
    room.log.unshift(`${player.name}: нет свободного слота под контракт.`);
    modalState = null;
    commit();
    return;
  }
  const entity = state.config[kind].find((item) => item.id === id);
  if (!entity) return;
  player.activeContracts.push(cloneDeal(entity));
  markCommercialAction(room);
  room.log.unshift(`${player.name}: взял ${kind === "tenders" ? "тендер" : "контракт"} "${entity.title}".`);
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
  const limit = resourceBuyLimit(room, player);
  const capacityLeft = warehouseCapacity(player) - warehouseUsed(player);
  amount = Math.max(1, Math.min(amount, limit, capacityLeft, room.market.stock[code] || 0));
  if (!amount) return rejectAction(room, "Нет места на складе или ресурс закончился на рынке.");
  const price = room.market.prices[code] || resourceMeta[code]?.basePrice || 0;
  const cost = price * amount;
  if (player.money < cost) {
    room.log.unshift(`${player.name}: недостаточно капитала для покупки ${code}.`);
  } else {
    player.money -= cost;
    player.warehouse[code] = (player.warehouse[code] || 0) + amount;
    room.market.stock[code] = Math.max(0, (room.market.stock[code] || 0) - amount);
    markCommercialAction(room);
    room.log.unshift(`${player.name}: купил ${code} x${amount} за ${cost} млн.`);
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
  const plan = Object.entries(missing).map(([code, amount]) => {
    const fromWarehouse = Math.min(player.warehouse[code] || 0, amount);
    const marketNeed = amount - fromWarehouse;
    const fromMarket = Math.min(marketNeed, room.market.stock[code] || 0, Math.max(0, limit - purchased));
    purchased += fromMarket;
    const urgent = Math.max(0, marketNeed - fromMarket);
    totalCost += fromMarket * (room.market.prices[code] || resourceMeta[code].basePrice);
    totalCost += urgent * (resourceMeta[code].basePrice + 2);
    return { code, amount: fromWarehouse + fromMarket + urgent, fromWarehouse, fromMarket, urgent };
  });
  if (player.money < totalCost) {
    room.log.unshift(`${player.name}: не хватает капитала на срочную закупку для "${contract.title}".`);
  } else {
    plan.forEach(({ code, amount, fromWarehouse }) => {
      player.warehouse[code] = (player.warehouse[code] || 0) - fromWarehouse;
      contract.filled[code] = (contract.filled[code] || 0) + amount;
    });
    plan.forEach(({ code, fromMarket }) => {
      room.market.stock[code] = Math.max(0, (room.market.stock[code] || 0) - fromMarket);
    });
    player.money -= totalCost;
    markCommercialAction(room);
    const urgentCount = plan.reduce((sum, item) => sum + item.urgent, 0);
    room.log.unshift(`${player.name}: обеспечил ресурс по сделке "${contract.title}" за ${totalCost} млн${urgentCount ? `, срочно ${urgentCount} жет.` : ""}.`);
  }
  modalState = null;
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
  player.money += contract.income;
  player.reputation += contract.type === "малый" ? 1 : 0;
  player.influence += contract.type === "тендер" ? 2 : contract.type === "средний" ? 1 : 0;
  player.efficiency += contract.type === "крупный" ? 1 : 0;
  contract.closedRoute = route.title;
  contract.closedDay = room.day;
  player.completedContracts.push(contract);
  player.activeContracts.splice(index, 1);
  markCommercialAction(room);
  room.log.unshift(`${player.name}: закрыл "${contract.title}" через ${route.title}. Доход ${contract.income} млн, логистика ${route.cost} млн${risk.triggered ? `, риск сработал (${risk.eventCard.title}, -${risk.penalty} млн)` : risk.dice ? `, риск пройден D6=${risk.dice}` : ""}.`);
  modalState = null;
  commit();
}

function buyCellAsset(cellId) {
  const room = activeRoom();
  const player = requireTurnPlayer();
  if (!room || !player) return;
  const cell = state.config.boardCells.find((item) => item.id === cellId);
  if (!cell) return;
  const gate = actionGate(room, player, { requiresRolled: true, cellAction: true, cellId, cells: ["asset", "depot", "rail", "road", "client", "supplier"] });
  if (gate) return rejectAction(room, gate);
  if (room.assetOwnership[cellId]) return rejectAction(room, `Актив уже принадлежит ${room.assetOwnership[cellId].ownerName}.`);
  if (player.assetPurchasedLap === player.lap) return rejectAction(room, "За один круг можно купить только один новый актив.");
  const cost = assetCostForCell(cell);
  if (player.money < cost) {
    room.log.unshift(`${player.name}: недостаточно капитала для покупки "${cell.title}".`);
  } else {
    player.money -= cost;
    const owned = { id: uid("asset"), cellId, title: cell.title, type: cell.type, cost, ownerId: player.id, ownerName: player.name };
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
  if (player.proleumCards.length >= 3) {
    room.log.unshift(`${player.name}: рука ПРОЛЕУМ уже заполнена.`);
  } else {
    const cardItem = state.config.proleumCards[(player.proleumCards.length + room.day) % state.config.proleumCards.length];
    player.proleumCards.push(clone(cardItem));
    markCellAction(room);
    room.log.unshift(`${player.name}: взял карту ПРОЛЕУМ "${cardItem.title}".`);
  }
  modalState = null;
  commit();
}

function drawEventCard() {
  const room = activeRoom();
  const player = requireTurnPlayer();
  if (!room || !player) return;
  const gate = actionGate(room, player, { requiresRolled: true, cellAction: true, cells: ["event", "risk", "penalty", "pause"] });
  if (gate) return rejectAction(room, gate);
  const eventCard = state.config.events[(room.log.length + room.day) % state.config.events.length];
  markCellAction(room);
  modalState = { type: "eventChoice", title: eventCard.title, description: eventCard.description, eventId: eventCard.id };
  room.log.unshift(`${player.name}: открыл событие "${eventCard.title}".`);
  commit();
}

function resolveEventChoice(choice) {
  const room = activeRoom();
  const player = requireTurnPlayer();
  if (!room || !player || modalState?.type !== "eventChoice") return;
  if (choice === "pay") {
    const cost = Math.min(player.money, 2);
    player.money -= cost;
    room.log.unshift(`${player.name}: решил событие "${modalState.title}" деньгами (-${cost} млн).`);
  }
  if (choice === "rep") {
    player.reputation = Math.max(0, player.reputation - 1);
    room.log.unshift(`${player.name}: решил событие "${modalState.title}" через репутационные потери (-1).`);
  }
  if (choice === "delay") {
    const active = player.activeContracts[0];
    if (active) active.duration = Math.max(0, active.duration - 1);
    room.log.unshift(`${player.name}: принял задержку по событию "${modalState.title}".`);
  }
  modalState = null;
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

