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
    if (saved) return JSON.parse(saved);
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
      state = remote;
      localStorage.setItem(STORAGE_KEY, serialized);
      lastSyncedState = serialized;
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
  return Math.floor(player.money / 5) + Math.floor(player.reputation / 2) + Math.floor(player.efficiency / 2) + Math.floor(player.influence / 2);
}

function activeRoom() {
  return state.rooms.find((room) => room.id === activeRoomId) || null;
}

function render() {
  if (!user) {
    root.innerHTML = loginMarkup();
    bindLogin();
    return;
  }

  const room = activeRoom();
  root.innerHTML = `
    <div class="app">
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
          <div>
            <span class="kicker">Тестовый мультиплеерный прототип</span>
            <h1>${view === "game" && room ? escapeHtml(room.name) : "ПРОЛЕУМ: торговая партия для VIP-клиентов"}</h1>
          </div>
          <div class="statusStrip">
            ${room ? `<span>Комната: ${room.id}</span>` : ""}
            <span>${user.role === "admin" ? "Редактирование включено" : "Режим игрока"}</span>
          </div>
        </header>
        ${view === "rooms" ? roomsMarkup() : ""}
        ${view === "game" && room ? gameMarkup(room) : ""}
        ${view === "rules" ? rulesMarkup() : ""}
        ${view === "editor" && user.role === "admin" ? editorMarkup() : ""}
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
  const playerCount = Math.max(2, Math.min(6, room.players.length));
  const volumes = resourceVolumesByPlayers[playerCount];
  const logistics = logisticsByPlayers[playerCount];
  const currentPlayer = room.players[room.currentTurn % Math.max(room.players.length, 1)];
  const marketCard = state.config.marketCards[room.marketCardIndex % state.config.marketCards.length];
  const selected = state.config.boardCells.find((cell) => cell.id === room.selectedEntityId) || state.config.boardCells[0];
  return `
    <section class="gameLayout">
      <div class="boardPanel">${boardMarkup(room)}</div>
      <div class="marketPanel">
        <div class="toolbar">
          <div><span class="kicker">Ход</span><h2>${escapeHtml(currentPlayer?.name || "Нет игроков")}</h2></div>
          <button class="primaryButton" data-action="roll">Бросить 2D6</button>
          <button class="secondaryButton" data-action="next-day">День +1</button>
        </div>
        <div class="marketTablet">
          <section><h3>Ресурс</h3><div class="resourceGrid">
            ${Object.entries(resourceMeta)
              .map(([code, meta]) => `<div class="resourceTile" style="border-color:${meta.color}"><strong>${code}</strong><span>${meta.basePrice} млн</span><small>объем ${volumes[code]}</small></div>`)
              .join("")}
          </div></section>
          <section><h3>Логистика дня</h3><div class="logisticsGrid"><div>ЖД-мощность <strong>${logistics.rail}</strong></div><div>Нефтебаза <strong>${logistics.depot}</strong></div></div></section>
          <section class="wide"><h3>Карта рынка</h3>${entityCardMarkup(marketCard, true)}</section>
        </div>
        <div class="dealColumns">
          <section class="deckColumn"><h3>Открытые контракты</h3>${state.config.contracts.slice(0, 5).map((item) => entityCardMarkup(item, true)).join("")}</section>
          <section class="deckColumn"><h3>Тендер дня</h3>${state.config.tenders.slice(0, 1).map((item) => entityCardMarkup(item, true)).join("")}</section>
        </div>
        ${playersMarkup(room.players)}
      </div>
      <aside class="inspector">
        <span class="kicker">Выбрано</span>
        <h2>${escapeHtml(selected.title)}</h2>
        <p>${escapeHtml(selected.description)}</p>
        <div class="metaList"><span>Тип: ${escapeHtml(selected.type)}</span><span>День: ${room.day}</span><span>Роль: ${user.role === "admin" ? "админ" : "игрок"}</span></div>
        <h3>Журнал</h3>
        <div class="logList">${room.log.slice(0, 8).map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>
      </aside>
    </section>`;
}

function boardMarkup(room) {
  return `
    <div class="board">
      ${state.config.boardCells
        .map((cell, index) => {
          const players = room.players.filter((player) => player.position === index);
          return `<button class="boardCell type-${cell.type}" data-cell="${cell.id}">
            <span>${index + 1}</span><strong>${escapeHtml(cell.title)}</strong>
            <div class="tokens">${players.map((player) => `<i style="background:${player.color}" title="${escapeHtml(player.name)}"></i>`).join("")}</div>
          </button>`;
        })
        .join("")}
      <div class="boardCenter">${proleumLogo}<span>контракт · ресурс · логистика · риск · маржа</span></div>
    </div>`;
}

function entityCardMarkup(entity, compact = false) {
  const resource = entity.resource
    ? `<div class="resourceLine">${Object.entries(entity.resource).map(([code, amount]) => `<span>${code} x${amount}</span>`).join("")}</div>`
    : "";
  return `
    <article class="entityCard ${compact ? "compact" : ""}">
      <div><span>${escapeHtml(entity.type)}</span><strong>${escapeHtml(entity.title)}</strong></div>
      <p>${escapeHtml(entity.description)}</p>
      ${resource}
      ${entity.effect ? `<small>${escapeHtml(entity.effect)}</small>` : ""}
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
  document.querySelector("[data-action='roll']")?.addEventListener("click", roll);
  document.querySelector("[data-action='next-day']")?.addEventListener("click", nextDay);
  document.querySelectorAll("[data-cell]").forEach((button) =>
    button.addEventListener("click", () => {
      const room = activeRoom();
      if (!room) return;
      room.selectedEntityId = button.dataset.cell;
      commit();
    }),
  );
  bindEditor();
}

function createRoom(name) {
  return {
    id: uid("room"),
    name,
    day: 1,
    currentTurn: 0,
    marketCardIndex: 0,
    players: [createPlayer(user.name, 0)],
    log: [`${user.name} создал комнату.`],
  };
}

function createPlayer(name, index) {
  return { id: uid("player"), name, color: palette[index % palette.length], position: 0, money: 25, reputation: 3, efficiency: 3, influence: 3 };
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
  const player = room.players[room.currentTurn % room.players.length];
  const value = Math.ceil(Math.random() * 6) + Math.ceil(Math.random() * 6);
  player.position = (player.position + value) % 40;
  const cell = state.config.boardCells[player.position];
  room.selectedEntityId = cell.id;
  room.log.unshift(`${player.name}: бросок ${value}, клетка "${cell.title}".`);
  room.currentTurn = (room.currentTurn + 1) % room.players.length;
  commit();
}

function nextDay() {
  const room = activeRoom();
  if (!room) return;
  room.day += 1;
  room.marketCardIndex = (room.marketCardIndex + 1) % state.config.marketCards.length;
  room.log.unshift(`Торговый день ${room.day}: рынок обновлен.`);
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

