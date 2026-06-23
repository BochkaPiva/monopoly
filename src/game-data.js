export const resourceMeta = {
  "REG": {
    "name": "Регулярный бензин",
    "basePrice": 3,
    "color": "#2f7d58"
  },
  "PRM": {
    "name": "Премиальный бензин",
    "basePrice": 4,
    "color": "#bd7a22"
  },
  "DTL": {
    "name": "Дизельное топливо",
    "basePrice": 4,
    "color": "#365f91"
  }
};

export const resourceVolumesByPlayers = {
  "2": {
    "REG": 4,
    "PRM": 3,
    "DTL": 4
  },
  "3": {
    "REG": 5,
    "PRM": 4,
    "DTL": 5
  },
  "4": {
    "REG": 6,
    "PRM": 5,
    "DTL": 6
  },
  "5": {
    "REG": 7,
    "PRM": 5,
    "DTL": 7
  },
  "6": {
    "REG": 8,
    "PRM": 6,
    "DTL": 8
  }
};

export const logisticsByPlayers = {
  "2": {
    "rail": 2,
    "depot": 1
  },
  "3": {
    "rail": 3,
    "depot": 2
  },
  "4": {
    "rail": 4,
    "depot": 2
  },
  "5": {
    "rail": 5,
    "depot": 3
  },
  "6": {
    "rail": 6,
    "depot": 3
  }
};

export const defaultConfig = {
  "version": "balance-v2",
  "settings": {
    "version": "balance-v2",
    "startingMoney": 25,
    "activeContractLimit": 2,
    "warehouseBase": 3,
    "hedgeCost": 1,
    "hedgeLimit": 2,
    "proleumHandLimit": 3,
    "contractsByPlayers": {
      "2": 4,
      "3": 5,
      "4": 5,
      "5": 6,
      "6": 6
    },
    "tendersByPlayers": {
      "2": 1,
      "3": 1,
      "4": 1,
      "5": 1,
      "6": 2
    },
    "modes": {
      "Briefing": {
        "days": 5,
        "roundsPerDay": 2,
        "businessActions": 2,
        "activeContractLimit": 1,
        "advancedHedge": false
      },
      "Standard": {
        "days": 6,
        "roundsPerDay": 3,
        "businessActions": 2,
        "activeContractLimit": 2,
        "advancedHedge": true
      },
      "Signature": {
        "days": 8,
        "roundsPerDay": 3,
        "businessActions": 2,
        "activeContractLimit": 3,
        "advancedHedge": true
      }
    }
  },
  "rules": {
    "title": "ПРОЛЕУМ: Сделка на миллион тонн",
    "summary": "Signature Business Game: нефтетрейдинг через спрос, ресурс, логистику, риск, сервис ПРОЛЕУМ, hedge и маржу. Победа определяется гибридным рейтингом рынка, а не банкротством соперников.",
    "setup": [
      "Стартовый капитал: 25 млн. Базовый склад: 3 ресурса. Репутация, эффективность и влияние стартуют с 3.",
      "Открывается рынок: контракты по числу игроков, 1-2 тендера, карта рынка, ресурсные объемы и логистическая мощность дня.",
      "Базовый лимит активных контрактов: 2. В Briefing-режиме - 1 активный контракт."
    ],
    "turn": [
      "Игрок бросает 2D6, перемещает фишку и выполняет эффект клетки. Сроки контрактов уменьшаются только при смене торгового дня.",
      "После эффекта клетки доступны два бизнес-действия: можно связать контракт, ресурс, обеспечение, поставку, hedge или брокерку в одну цепочку.",
      "Торговый день состоит из 2 раундов в Briefing и 3 раундов в Standard/Signature. Между раундами частично восстанавливаются рынок и логистика.",
      "Дубль не дает дополнительный ход: он усиливает эффект клетки, если это поддержано сценарием."
    ],
    "scoring": [
      "Итоговый рейтинг = капитал/5 + очки контрактов + шкалы компании/2 + престиж - штрафы за срывы.",
      "Малый контракт = 1 VP, средний = 2 VP, крупный = 3 VP, тендер = 4 VP.",
      "Сорванный контракт: -2 VP и потеря репутации, если не спасен картой ПРОЛЕУМ."
    ],
    "balance": [
      "Нет dead turn: срочная закупка, брокерка, hedge, переговоры и ПРОЛЕУМ дают аварийные выходы.",
      "Переговоры включают продажу, обмен ресурсов и субпоставку прямо в контракт другого игрока.",
      "Чужие активы не блокируют базовое действие: владелец получает комиссию, но игрок всегда имеет публичный путь.",
      "Hedge стоит 1 млн, фиксирует цену до 2 единиц одного ресурса и ограничен 2 токенами в руке."
    ]
  },
  "boardCells": [
    {
      "id": "cell-1",
      "index": 1,
      "title": "Старт: новый торговый день",
      "type": "start",
      "sourceType": "Угловая",
      "description": "Игрок получает 2 млн оборотного капитала. Рынок обновляется по торговым дням, не самой клеткой.",
      "buyable": false
    },
    {
      "id": "cell-2",
      "index": 2,
      "title": "Региональный клиент",
      "type": "client",
      "sourceType": "Клиент",
      "description": "Выбрать 1 из 2 малых/средних контрактов регионального клиента.",
      "buyable": true
    },
    {
      "id": "cell-3",
      "index": 3,
      "title": "Операционное событие",
      "type": "event",
      "sourceType": "Событие",
      "description": "Тянуть карту события и выполнить выбор.",
      "buyable": false
    },
    {
      "id": "cell-4",
      "index": 4,
      "title": "Небольшая АЗС",
      "type": "client",
      "sourceType": "Клиент",
      "description": "Выбрать 1 из 2 контрактов АЗС.",
      "buyable": true
    },
    {
      "id": "cell-5",
      "index": 5,
      "title": "Автомаршрут",
      "type": "road",
      "sourceType": "Логистика",
      "description": "Снизить авто-поставку на 1 млн в этот ход или купить актив.",
      "buyable": true
    },
    {
      "id": "cell-6",
      "index": 6,
      "title": "СПбМТСБ: REG",
      "type": "market",
      "sourceType": "Биржа",
      "description": "Купить до 3 REG по текущей цене.",
      "buyable": false
    },
    {
      "id": "cell-7",
      "index": 7,
      "title": "Карта рынка",
      "type": "marketCard",
      "sourceType": "Рынок",
      "description": "Открыть карту рынка; применить ценовой блок до конца дня.",
      "buyable": false
    },
    {
      "id": "cell-8",
      "index": 8,
      "title": "СПбМТСБ: PRM",
      "type": "market",
      "sourceType": "Биржа",
      "description": "Купить до 3 PRM по текущей цене.",
      "buyable": false
    },
    {
      "id": "cell-9",
      "index": 9,
      "title": "Биржевой стакан",
      "type": "market",
      "sourceType": "Биржа",
      "description": "Купить до 3 любых ресурсов, но не более 2 одного типа.",
      "buyable": false
    },
    {
      "id": "cell-10",
      "index": 10,
      "title": "Претензионный блок",
      "type": "claim",
      "sourceType": "Угловая",
      "description": "Заплатить 2 млн или потерять одно бизнес-действие; можно продлить контракт за 2 млн.",
      "buyable": false
    },
    {
      "id": "cell-11",
      "index": 11,
      "title": "Газпром нефть",
      "type": "supplier",
      "sourceType": "Поставщик",
      "description": "Купить ресурс через поставщика; свободную клетку можно купить.",
      "buyable": true
    },
    {
      "id": "cell-12",
      "index": 12,
      "title": "ЖД-узел: станция отправления",
      "type": "rail",
      "sourceType": "ЖД",
      "description": "Скидка 1 млн на ЖД-поставку в этот ход или покупка актива.",
      "buyable": true
    },
    {
      "id": "cell-13",
      "index": 13,
      "title": "Роснефть",
      "type": "supplier",
      "sourceType": "Поставщик",
      "description": "Купить ресурс через поставщика; свободную клетку можно купить.",
      "buyable": true
    },
    {
      "id": "cell-14",
      "index": 14,
      "title": "ЛУКОЙЛ",
      "type": "supplier",
      "sourceType": "Поставщик",
      "description": "Купить ресурс через поставщика; свободную клетку можно купить.",
      "buyable": true
    },
    {
      "id": "cell-15",
      "index": 15,
      "title": "ЖД-узел: маршрутное окно",
      "type": "rail",
      "sourceType": "ЖД",
      "description": "Зарезервировать 1 ЖД-мощность до конца следующего хода или купить актив.",
      "buyable": true
    },
    {
      "id": "cell-16",
      "index": 16,
      "title": "Нефтебаза Московский узел",
      "type": "depot",
      "sourceType": "Нефтебаза",
      "description": "Использовать нефтебазовое действие или купить нефтебазу.",
      "buyable": true
    },
    {
      "id": "cell-17",
      "index": 17,
      "title": "Клиентская заявка",
      "type": "client",
      "sourceType": "Клиент",
      "description": "Взять любой малый контракт из ряда или верхний средний контракт.",
      "buyable": true
    },
    {
      "id": "cell-18",
      "index": 18,
      "title": "Нефтебаза Поволжье",
      "type": "depot",
      "sourceType": "Нефтебаза",
      "description": "Использовать нефтебазовое действие или купить нефтебазу.",
      "buyable": true
    },
    {
      "id": "cell-19",
      "index": 19,
      "title": "Операционное событие",
      "type": "event",
      "sourceType": "Событие",
      "description": "Тянуть карту события и выполнить выбор.",
      "buyable": false
    },
    {
      "id": "cell-20",
      "index": 20,
      "title": "Планерка участников рынка",
      "type": "meeting",
      "sourceType": "Угловая",
      "description": "Обменять карту, взять ПРОЛЕУМ, продлить дешевле на 1 млн или провести переговоры без траты коммерческого действия.",
      "buyable": false
    },
    {
      "id": "cell-21",
      "index": 21,
      "title": "Промышленное предприятие",
      "type": "client",
      "sourceType": "Клиент",
      "description": "Выбрать 1 из 2 средних/крупных промышленных контрактов.",
      "buyable": true
    },
    {
      "id": "cell-22",
      "index": 22,
      "title": "ПРОЛЕУМ: экспертное решение",
      "type": "proleum",
      "sourceType": "ПРОЛЕУМ",
      "description": "Взять 1 карту ПРОЛЕУМ.",
      "buyable": false
    },
    {
      "id": "cell-23",
      "index": 23,
      "title": "Агрохолдинг",
      "type": "client",
      "sourceType": "Клиент",
      "description": "Выбрать 1 из 2 аграрных DTL-ориентированных контрактов.",
      "buyable": true
    },
    {
      "id": "cell-24",
      "index": 24,
      "title": "Сеть АЗС",
      "type": "client",
      "sourceType": "Клиент",
      "description": "Выбрать 1 из 2 REG/PRM контрактов сети АЗС.",
      "buyable": true
    },
    {
      "id": "cell-25",
      "index": 25,
      "title": "ЖД-мощность дня",
      "type": "rail",
      "sourceType": "ЖД",
      "description": "Срочная ЖД в этот ход стоит +1 млн вместо +2 млн.",
      "buyable": true
    },
    {
      "id": "cell-26",
      "index": 26,
      "title": "Московская биржа: хедж REG",
      "type": "hedge",
      "sourceType": "Срочный рынок",
      "description": "Купить хедж REG за 1 млн: фикс цены до 2 REG для одного контракта.",
      "buyable": false
    },
    {
      "id": "cell-27",
      "index": 27,
      "title": "Московская биржа: хедж PRM",
      "type": "hedge",
      "sourceType": "Срочный рынок",
      "description": "Купить хедж PRM за 1 млн: фикс цены до 2 PRM.",
      "buyable": false
    },
    {
      "id": "cell-28",
      "index": 28,
      "title": "Рыночный шок",
      "type": "marketCard",
      "sourceType": "Рынок",
      "description": "Открыть карту рынка и применить ценовой/негативный блок до конца дня.",
      "buyable": false
    },
    {
      "id": "cell-29",
      "index": 29,
      "title": "Московская биржа: хедж DTL",
      "type": "hedge",
      "sourceType": "Срочный рынок",
      "description": "Купить хедж DTL за 1 млн: фикс цены до 2 DTL.",
      "buyable": false
    },
    {
      "id": "cell-30",
      "index": 30,
      "title": "Блокировка поставки",
      "type": "block",
      "sourceType": "Угловая",
      "description": "Если есть контракт: 2 млн или срок одного контракта -1. Если контрактов нет — 1 млн.",
      "buyable": false
    },
    {
      "id": "cell-31",
      "index": 31,
      "title": "Покупка кодами клиента",
      "type": "broker",
      "sourceType": "Брокерка",
      "description": "Передать контракт в брокерку или подготовить брокерскую сделку.",
      "buyable": true
    },
    {
      "id": "cell-32",
      "index": 32,
      "title": "Брокерский контур",
      "type": "broker",
      "sourceType": "Брокерка",
      "description": "Использовать/купить брокерский контур.",
      "buyable": true
    },
    {
      "id": "cell-33",
      "index": 33,
      "title": "Сервисная сделка ПРОЛЕУМ",
      "type": "proleum",
      "sourceType": "ПРОЛЕУМ",
      "description": "Взять карту ПРОЛЕУМ или снизить риск будущей поставки на 1 до конца следующего хода.",
      "buyable": false
    },
    {
      "id": "cell-34",
      "index": 34,
      "title": "Комиссия за сопровождение",
      "type": "broker",
      "sourceType": "Брокерка",
      "description": "Получить +1 млн при следующей брокерке или купить брокерский актив.",
      "buyable": true
    },
    {
      "id": "cell-35",
      "index": 35,
      "title": "ЖД-узел: станция назначения",
      "type": "rail",
      "sourceType": "ЖД",
      "description": "Снизить риск ЖД-поставки на 1 в этот ход или купить актив.",
      "buyable": true
    },
    {
      "id": "cell-36",
      "index": 36,
      "title": "Автопарк",
      "type": "client",
      "sourceType": "Клиент",
      "description": "Выбрать 1 из 2 DTL/REG контрактов автопарка.",
      "buyable": true
    },
    {
      "id": "cell-37",
      "index": 37,
      "title": "Карта рынка",
      "type": "marketCard",
      "sourceType": "Рынок",
      "description": "Открыть карту рынка; эффект действует со следующего торгового дня.",
      "buyable": false
    },
    {
      "id": "cell-38",
      "index": 38,
      "title": "Крупный клиент",
      "type": "client",
      "sourceType": "Клиент",
      "description": "Взять крупный контракт при Репутации 4+, иначе средний.",
      "buyable": true
    },
    {
      "id": "cell-39",
      "index": 39,
      "title": "Клиент просит отсрочку",
      "type": "event",
      "sourceType": "Событие",
      "description": "+1 срок к контракту, но доход -1 млн; или отказаться и взять событие.",
      "buyable": false
    },
    {
      "id": "cell-40",
      "index": 40,
      "title": "Премия к индексу",
      "type": "marketCard",
      "sourceType": "Рынок",
      "description": "Один закрытый контракт получает +1 млн дохода, если выполнен без события.",
      "buyable": false
    }
  ],
  "contracts": [
    {
      "id": "C-001",
      "title": "Небольшая АЗС: срочная дозаправка",
      "type": "малый",
      "size": "малый",
      "category": "АЗС",
      "description": "АЗС. Маршрут: Авто/ЖД. Брокерка: 3 млн.",
      "resource": {
        "REG": 2
      },
      "routes": [
        "Авто",
        "ЖД"
      ],
      "baseRoute": "Авто",
      "duration": 3,
      "income": 12,
      "risk": 0,
      "brokerFee": 3,
      "effect": "+1 Репутация",
      "requirement": ""
    },
    {
      "id": "C-002",
      "title": "АЗС у трассы: пополнение REG",
      "type": "малый",
      "size": "малый",
      "category": "АЗС",
      "description": "АЗС. Маршрут: Авто. Брокерка: 2 млн.",
      "resource": {
        "REG": 1
      },
      "routes": [
        "Авто"
      ],
      "baseRoute": "Авто",
      "duration": 2,
      "income": 7,
      "risk": 0,
      "brokerFee": 2,
      "effect": "+1 Репутация",
      "requirement": ""
    },
    {
      "id": "C-003",
      "title": "Премиальная колонка",
      "type": "малый",
      "size": "малый",
      "category": "Сеть АЗС",
      "description": "Сеть АЗС. Маршрут: Авто. Брокерка: 2 млн.",
      "resource": {
        "PRM": 1
      },
      "routes": [
        "Авто"
      ],
      "baseRoute": "Авто",
      "duration": 2,
      "income": 8,
      "risk": 0,
      "brokerFee": 2,
      "effect": "+1 Репутация",
      "requirement": ""
    },
    {
      "id": "C-004",
      "title": "PRM выходного дня",
      "type": "малый",
      "size": "малый",
      "category": "Сеть АЗС",
      "description": "Сеть АЗС. Маршрут: Авто/ЖД. Брокерка: 3 млн.",
      "resource": {
        "PRM": 2
      },
      "routes": [
        "Авто",
        "ЖД"
      ],
      "baseRoute": "Авто",
      "duration": 3,
      "income": 15,
      "risk": 1,
      "brokerFee": 3,
      "effect": "+1 Репутация",
      "requirement": ""
    },
    {
      "id": "C-005",
      "title": "Городской автопарк REG",
      "type": "малый",
      "size": "малый",
      "category": "Автопарк",
      "description": "Автопарк. Маршрут: Авто. Брокерка: 2 млн.",
      "resource": {
        "REG": 1
      },
      "routes": [
        "Авто"
      ],
      "baseRoute": "Авто",
      "duration": 2,
      "income": 7,
      "risk": 0,
      "brokerFee": 2,
      "effect": "+1 Эффективность",
      "requirement": ""
    },
    {
      "id": "C-006",
      "title": "Дежурная поставка DTL",
      "type": "малый",
      "size": "малый",
      "category": "Автопарк",
      "description": "Автопарк. Маршрут: Авто. Брокерка: 2 млн.",
      "resource": {
        "DTL": 1
      },
      "routes": [
        "Авто"
      ],
      "baseRoute": "Авто",
      "duration": 2,
      "income": 8,
      "risk": 0,
      "brokerFee": 2,
      "effect": "+1 Эффективность",
      "requirement": ""
    },
    {
      "id": "C-007",
      "title": "Посевная: малый дизель",
      "type": "малый",
      "size": "малый",
      "category": "Агрохолдинг",
      "description": "Агрохолдинг. Маршрут: Авто/ЖД. Брокерка: 3 млн.",
      "resource": {
        "DTL": 2
      },
      "routes": [
        "Авто",
        "ЖД"
      ],
      "baseRoute": "Авто",
      "duration": 3,
      "income": 15,
      "risk": 1,
      "brokerFee": 3,
      "effect": "+1 Влияние",
      "requirement": ""
    },
    {
      "id": "C-008",
      "title": "Сервисная поставка PRM+DTL",
      "type": "малый",
      "size": "малый",
      "category": "Промышленность",
      "description": "Промышленность. Маршрут: Авто/ЖД. Брокерка: 3 млн.",
      "resource": {
        "PRM": 1,
        "DTL": 1
      },
      "routes": [
        "Авто",
        "ЖД"
      ],
      "baseRoute": "Авто",
      "duration": 3,
      "income": 14,
      "risk": 0,
      "brokerFee": 3,
      "effect": "+1 Эффективность",
      "requirement": ""
    },
    {
      "id": "C-009",
      "title": "Региональная заявка REG",
      "type": "малый",
      "size": "малый",
      "category": "Региональный клиент",
      "description": "Региональный клиент. Маршрут: Авто. Брокерка: 2 млн.",
      "resource": {
        "REG": 1
      },
      "routes": [
        "Авто"
      ],
      "baseRoute": "Авто",
      "duration": 2,
      "income": 7,
      "risk": 0,
      "brokerFee": 2,
      "effect": "+1 Влияние",
      "requirement": ""
    },
    {
      "id": "C-010",
      "title": "Региональная заявка DTL",
      "type": "малый",
      "size": "малый",
      "category": "Региональный клиент",
      "description": "Региональный клиент. Маршрут: Авто. Брокерка: 2 млн.",
      "resource": {
        "DTL": 1
      },
      "routes": [
        "Авто"
      ],
      "baseRoute": "Авто",
      "duration": 2,
      "income": 8,
      "risk": 0,
      "brokerFee": 2,
      "effect": "+1 Влияние",
      "requirement": ""
    },
    {
      "id": "C-011",
      "title": "Партия дизеля на объект",
      "type": "малый",
      "size": "малый",
      "category": "Строительный сектор",
      "description": "Строительный сектор. Маршрут: Авто/ЖД. Брокерка: 3 млн.",
      "resource": {
        "DTL": 2
      },
      "routes": [
        "Авто",
        "ЖД"
      ],
      "baseRoute": "Авто",
      "duration": 3,
      "income": 15,
      "risk": 1,
      "brokerFee": 3,
      "effect": "+1 Эффективность",
      "requirement": ""
    },
    {
      "id": "C-012",
      "title": "Пусковая партия REG",
      "type": "малый",
      "size": "малый",
      "category": "Строительный сектор",
      "description": "Строительный сектор. Маршрут: Авто. Брокерка: 3 млн.",
      "resource": {
        "REG": 2
      },
      "routes": [
        "Авто"
      ],
      "baseRoute": "Авто",
      "duration": 3,
      "income": 12,
      "risk": 0,
      "brokerFee": 3,
      "effect": "+1 Эффективность",
      "requirement": ""
    },
    {
      "id": "C-013",
      "title": "Муниципальный транспорт",
      "type": "малый",
      "size": "малый",
      "category": "Муниципальный контракт",
      "description": "Муниципальный контракт. Маршрут: Авто/ЖД. Брокерка: 3 млн.",
      "resource": {
        "REG": 1,
        "DTL": 1
      },
      "routes": [
        "Авто",
        "ЖД"
      ],
      "baseRoute": "Авто",
      "duration": 3,
      "income": 14,
      "risk": 1,
      "brokerFee": 3,
      "effect": "+1 Репутация",
      "requirement": ""
    },
    {
      "id": "C-014",
      "title": "Сезонная дозаправка",
      "type": "малый",
      "size": "малый",
      "category": "Муниципальный контракт",
      "description": "Муниципальный контракт. Маршрут: Авто. Брокерка: 2 млн.",
      "resource": {
        "DTL": 1
      },
      "routes": [
        "Авто"
      ],
      "baseRoute": "Авто",
      "duration": 2,
      "income": 8,
      "risk": 0,
      "brokerFee": 2,
      "effect": "+1 Репутация",
      "requirement": ""
    },
    {
      "id": "C-015",
      "title": "Топливо для парка тягачей",
      "type": "малый",
      "size": "малый",
      "category": "Логистический оператор",
      "description": "Логистический оператор. Маршрут: Авто/ЖД. Брокерка: 3 млн.",
      "resource": {
        "REG": 1,
        "DTL": 1
      },
      "routes": [
        "Авто",
        "ЖД"
      ],
      "baseRoute": "Авто",
      "duration": 3,
      "income": 13,
      "risk": 0,
      "brokerFee": 3,
      "effect": "+1 Эффективность",
      "requirement": ""
    },
    {
      "id": "C-016",
      "title": "Срочный DTL для рейса",
      "type": "малый",
      "size": "малый",
      "category": "Логистический оператор",
      "description": "Логистический оператор. Маршрут: Авто. Брокерка: 3 млн.",
      "resource": {
        "DTL": 2
      },
      "routes": [
        "Авто"
      ],
      "baseRoute": "Авто",
      "duration": 2,
      "income": 15,
      "risk": 1,
      "brokerFee": 3,
      "effect": "+1 Эффективность",
      "requirement": ""
    },
    {
      "id": "C-017",
      "title": "Перепродажа REG",
      "type": "малый",
      "size": "малый",
      "category": "Трейдер",
      "description": "Трейдер. Маршрут: Авто/ЖД. Брокерка: 3 млн.",
      "resource": {
        "REG": 2
      },
      "routes": [
        "Авто",
        "ЖД"
      ],
      "baseRoute": "Авто",
      "duration": 3,
      "income": 13,
      "risk": 1,
      "brokerFee": 3,
      "effect": "+1 Влияние",
      "requirement": ""
    },
    {
      "id": "C-018",
      "title": "Перепродажа PRM",
      "type": "малый",
      "size": "малый",
      "category": "Трейдер",
      "description": "Трейдер. Маршрут: Авто/ЖД. Брокерка: 3 млн.",
      "resource": {
        "PRM": 2
      },
      "routes": [
        "Авто",
        "ЖД"
      ],
      "baseRoute": "Авто",
      "duration": 3,
      "income": 15,
      "risk": 1,
      "brokerFee": 3,
      "effect": "+1 Влияние",
      "requirement": ""
    },
    {
      "id": "C-019",
      "title": "Пробная поставка",
      "type": "малый",
      "size": "малый",
      "category": "Крупный клиент",
      "description": "Крупный клиент. Маршрут: Авто/ЖД. Брокерка: 3 млн.",
      "resource": {
        "REG": 1,
        "PRM": 1
      },
      "routes": [
        "Авто",
        "ЖД"
      ],
      "baseRoute": "Авто",
      "duration": 3,
      "income": 13,
      "risk": 0,
      "brokerFee": 3,
      "effect": "+1 Репутация",
      "requirement": "Репутация 3+"
    },
    {
      "id": "C-020",
      "title": "Тестовая партия DTL",
      "type": "малый",
      "size": "малый",
      "category": "Крупный клиент",
      "description": "Крупный клиент. Маршрут: Авто/ЖД. Брокерка: 3 млн.",
      "resource": {
        "DTL": 2
      },
      "routes": [
        "Авто",
        "ЖД"
      ],
      "baseRoute": "Авто",
      "duration": 3,
      "income": 14,
      "risk": 0,
      "brokerFee": 3,
      "effect": "+1 Репутация",
      "requirement": "Репутация 3+"
    },
    {
      "id": "C-021",
      "title": "Ночная дозаправка REG",
      "type": "малый",
      "size": "малый",
      "category": "АЗС",
      "description": "АЗС. Маршрут: Авто. Брокерка: 2 млн.",
      "resource": {
        "REG": 1
      },
      "routes": [
        "Авто"
      ],
      "baseRoute": "Авто",
      "duration": 2,
      "income": 9,
      "risk": 1,
      "brokerFee": 2,
      "effect": "+1 Репутация",
      "requirement": ""
    },
    {
      "id": "C-022",
      "title": "PRM под акцию",
      "type": "малый",
      "size": "малый",
      "category": "Сеть АЗС",
      "description": "Сеть АЗС. Маршрут: Авто. Брокерка: 2 млн.",
      "resource": {
        "PRM": 1
      },
      "routes": [
        "Авто"
      ],
      "baseRoute": "Авто",
      "duration": 2,
      "income": 10,
      "risk": 1,
      "brokerFee": 2,
      "effect": "+1 Репутация",
      "requirement": ""
    },
    {
      "id": "C-023",
      "title": "Резервная партия REG+DTL",
      "type": "малый",
      "size": "малый",
      "category": "Автопарк",
      "description": "Автопарк. Маршрут: Авто/ЖД. Брокерка: 3 млн.",
      "resource": {
        "REG": 1,
        "DTL": 1
      },
      "routes": [
        "Авто",
        "ЖД"
      ],
      "baseRoute": "Авто",
      "duration": 3,
      "income": 13,
      "risk": 0,
      "brokerFee": 3,
      "effect": "+1 Эффективность",
      "requirement": ""
    },
    {
      "id": "C-024",
      "title": "Дизель для фермы",
      "type": "малый",
      "size": "малый",
      "category": "Агрохолдинг",
      "description": "Агрохолдинг. Маршрут: Авто. Брокерка: 2 млн.",
      "resource": {
        "DTL": 1
      },
      "routes": [
        "Авто"
      ],
      "baseRoute": "Авто",
      "duration": 2,
      "income": 8,
      "risk": 0,
      "brokerFee": 2,
      "effect": "+1 Влияние",
      "requirement": ""
    },
    {
      "id": "C-025",
      "title": "Сеть АЗС: недельный REG",
      "type": "средний",
      "size": "средний",
      "category": "АЗС",
      "description": "АЗС. Маршрут: ЖД/Авто. Брокерка: 4 млн.",
      "resource": {
        "REG": 3
      },
      "routes": [
        "ЖД",
        "Авто"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 21,
      "risk": 1,
      "brokerFee": 4,
      "effect": "+1 Репутация",
      "requirement": ""
    },
    {
      "id": "C-026",
      "title": "АЗС: смешанный ассортимент",
      "type": "средний",
      "size": "средний",
      "category": "АЗС",
      "description": "АЗС. Маршрут: ЖД. Брокерка: 4 млн.",
      "resource": {
        "REG": 2,
        "PRM": 1
      },
      "routes": [
        "ЖД"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 22,
      "risk": 1,
      "brokerFee": 4,
      "effect": "+1 Репутация",
      "requirement": ""
    },
    {
      "id": "C-027",
      "title": "Премиальный ассортимент",
      "type": "средний",
      "size": "средний",
      "category": "Сеть АЗС",
      "description": "Сеть АЗС. Маршрут: ЖД. Брокерка: 5 млн.",
      "resource": {
        "REG": 1,
        "PRM": 2
      },
      "routes": [
        "ЖД"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 23,
      "risk": 1,
      "brokerFee": 5,
      "effect": "+1 Репутация",
      "requirement": ""
    },
    {
      "id": "C-028",
      "title": "PRM под сезон поездок",
      "type": "средний",
      "size": "средний",
      "category": "Сеть АЗС",
      "description": "Сеть АЗС. Маршрут: ЖД. Брокерка: 5 млн.",
      "resource": {
        "PRM": 3
      },
      "routes": [
        "ЖД"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 24,
      "risk": 1,
      "brokerFee": 5,
      "effect": "+1 Репутация",
      "requirement": ""
    },
    {
      "id": "C-029",
      "title": "Агрохолдинг: посевная DTL",
      "type": "средний",
      "size": "средний",
      "category": "Агрохолдинг",
      "description": "Агрохолдинг. Маршрут: ЖД. Брокерка: 5 млн.",
      "resource": {
        "DTL": 3
      },
      "routes": [
        "ЖД"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 24,
      "risk": 1,
      "brokerFee": 5,
      "effect": "+1 Влияние",
      "requirement": ""
    },
    {
      "id": "C-030",
      "title": "Смешанная поставка DTL+REG",
      "type": "средний",
      "size": "средний",
      "category": "Агрохолдинг",
      "description": "Агрохолдинг. Маршрут: ЖД. Брокерка: 5 млн.",
      "resource": {
        "REG": 1,
        "DTL": 2
      },
      "routes": [
        "ЖД"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 23,
      "risk": 1,
      "brokerFee": 5,
      "effect": "+1 Влияние",
      "requirement": ""
    },
    {
      "id": "C-031",
      "title": "Промышленная линия: DTL",
      "type": "средний",
      "size": "средний",
      "category": "Промышленность",
      "description": "Промышленность. Маршрут: ЖД. Брокерка: 5 млн.",
      "resource": {
        "DTL": 3
      },
      "routes": [
        "ЖД"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 25,
      "risk": 2,
      "brokerFee": 5,
      "effect": "+1 Эффективность",
      "requirement": ""
    },
    {
      "id": "C-032",
      "title": "Промышленность: REG+DTL",
      "type": "средний",
      "size": "средний",
      "category": "Промышленность",
      "description": "Промышленность. Маршрут: ЖД+Нефтебаза/ЖД. Брокерка: 5 млн.",
      "resource": {
        "REG": 1,
        "DTL": 2
      },
      "routes": [
        "ЖД + нефтебаза",
        "ЖД"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 4,
      "income": 23,
      "risk": 1,
      "brokerFee": 5,
      "effect": "+1 Эффективность",
      "requirement": ""
    },
    {
      "id": "C-033",
      "title": "Крупный автопарк: DTL",
      "type": "средний",
      "size": "средний",
      "category": "Автопарк",
      "description": "Автопарк. Маршрут: ЖД/Авто. Брокерка: 5 млн.",
      "resource": {
        "DTL": 3
      },
      "routes": [
        "ЖД",
        "Авто"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 24,
      "risk": 1,
      "brokerFee": 5,
      "effect": "+1 Эффективность",
      "requirement": ""
    },
    {
      "id": "C-034",
      "title": "Автопарк: REG+DTL",
      "type": "средний",
      "size": "средний",
      "category": "Автопарк",
      "description": "Автопарк. Маршрут: ЖД/Авто. Брокерка: 4 млн.",
      "resource": {
        "REG": 2,
        "DTL": 1
      },
      "routes": [
        "ЖД",
        "Авто"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 22,
      "risk": 1,
      "brokerFee": 4,
      "effect": "+1 Эффективность",
      "requirement": ""
    },
    {
      "id": "C-035",
      "title": "Объектная поставка DTL",
      "type": "средний",
      "size": "средний",
      "category": "Строительный сектор",
      "description": "Строительный сектор. Маршрут: ЖД+Нефтебаза/ЖД. Брокерка: 5 млн.",
      "resource": {
        "DTL": 3
      },
      "routes": [
        "ЖД + нефтебаза",
        "ЖД"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 4,
      "income": 24,
      "risk": 1,
      "brokerFee": 5,
      "effect": "+1 Эффективность",
      "requirement": ""
    },
    {
      "id": "C-036",
      "title": "REG+DTL на технику",
      "type": "средний",
      "size": "средний",
      "category": "Строительный сектор",
      "description": "Строительный сектор. Маршрут: ЖД. Брокерка: 5 млн.",
      "resource": {
        "REG": 1,
        "DTL": 2
      },
      "routes": [
        "ЖД"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 23,
      "risk": 1,
      "brokerFee": 5,
      "effect": "+1 Эффективность",
      "requirement": ""
    },
    {
      "id": "C-037",
      "title": "Муниципальный парк",
      "type": "средний",
      "size": "средний",
      "category": "Муниципальный контракт",
      "description": "Муниципальный контракт. Маршрут: ЖД. Брокерка: 5 млн.",
      "resource": {
        "REG": 1,
        "DTL": 2
      },
      "routes": [
        "ЖД"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 24,
      "risk": 2,
      "brokerFee": 5,
      "effect": "+1 Репутация",
      "requirement": ""
    },
    {
      "id": "C-038",
      "title": "Городской резерв топлива",
      "type": "средний",
      "size": "средний",
      "category": "Муниципальный контракт",
      "description": "Муниципальный контракт. Маршрут: ЖД. Брокерка: 4 млн.",
      "resource": {
        "REG": 2,
        "DTL": 1
      },
      "routes": [
        "ЖД"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 22,
      "risk": 1,
      "brokerFee": 4,
      "effect": "+1 Репутация",
      "requirement": ""
    },
    {
      "id": "C-039",
      "title": "Региональный трейдер REG",
      "type": "средний",
      "size": "средний",
      "category": "Региональный клиент",
      "description": "Региональный клиент. Маршрут: ЖД/Авто. Брокерка: 4 млн.",
      "resource": {
        "REG": 3
      },
      "routes": [
        "ЖД",
        "Авто"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 21,
      "risk": 1,
      "brokerFee": 4,
      "effect": "+1 Влияние",
      "requirement": ""
    },
    {
      "id": "C-040",
      "title": "Региональный трейдер PRM",
      "type": "средний",
      "size": "средний",
      "category": "Региональный клиент",
      "description": "Региональный клиент. Маршрут: ЖД. Брокерка: 5 млн.",
      "resource": {
        "PRM": 3
      },
      "routes": [
        "ЖД"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 24,
      "risk": 1,
      "brokerFee": 5,
      "effect": "+1 Влияние",
      "requirement": ""
    },
    {
      "id": "C-041",
      "title": "Топливо для логистического узла",
      "type": "средний",
      "size": "средний",
      "category": "Логистический оператор",
      "description": "Логистический оператор. Маршрут: ЖД. Брокерка: 5 млн.",
      "resource": {
        "REG": 1,
        "DTL": 2
      },
      "routes": [
        "ЖД"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 23,
      "risk": 1,
      "brokerFee": 5,
      "effect": "+1 Эффективность",
      "requirement": ""
    },
    {
      "id": "C-042",
      "title": "Партия под рейсовую сеть",
      "type": "средний",
      "size": "средний",
      "category": "Логистический оператор",
      "description": "Логистический оператор. Маршрут: ЖД/Авто. Брокерка: 4 млн.",
      "resource": {
        "REG": 2,
        "DTL": 1
      },
      "routes": [
        "ЖД",
        "Авто"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 22,
      "risk": 1,
      "brokerFee": 4,
      "effect": "+1 Эффективность",
      "requirement": ""
    },
    {
      "id": "C-043",
      "title": "Арбитраж REG",
      "type": "средний",
      "size": "средний",
      "category": "Трейдер",
      "description": "Трейдер. Маршрут: ЖД. Брокерка: 4 млн.",
      "resource": {
        "REG": 3
      },
      "routes": [
        "ЖД"
      ],
      "baseRoute": "ЖД",
      "duration": 3,
      "income": 22,
      "risk": 2,
      "brokerFee": 4,
      "effect": "+1 Влияние",
      "requirement": ""
    },
    {
      "id": "C-044",
      "title": "Арбитраж PRM",
      "type": "средний",
      "size": "средний",
      "category": "Трейдер",
      "description": "Трейдер. Маршрут: ЖД. Брокерка: 5 млн.",
      "resource": {
        "PRM": 3
      },
      "routes": [
        "ЖД"
      ],
      "baseRoute": "ЖД",
      "duration": 3,
      "income": 25,
      "risk": 2,
      "brokerFee": 5,
      "effect": "+1 Влияние",
      "requirement": ""
    },
    {
      "id": "C-045",
      "title": "Пилотная крупная поставка",
      "type": "средний",
      "size": "средний",
      "category": "Крупный клиент",
      "description": "Крупный клиент. Маршрут: ЖД+Нефтебаза/ЖД. Брокерка: 5 млн.",
      "resource": {
        "REG": 1,
        "PRM": 1,
        "DTL": 1
      },
      "routes": [
        "ЖД + нефтебаза",
        "ЖД"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 4,
      "income": 23,
      "risk": 1,
      "brokerFee": 5,
      "effect": "+1 Репутация",
      "requirement": "Репутация 4+"
    },
    {
      "id": "C-046",
      "title": "Клиентский пакет PRM+DTL",
      "type": "средний",
      "size": "средний",
      "category": "Крупный клиент",
      "description": "Крупный клиент. Маршрут: ЖД+Нефтебаза/ЖД. Брокерка: 5 млн.",
      "resource": {
        "PRM": 1,
        "DTL": 2
      },
      "routes": [
        "ЖД + нефтебаза",
        "ЖД"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 4,
      "income": 24,
      "risk": 1,
      "brokerFee": 5,
      "effect": "+1 Репутация",
      "requirement": "Репутация 4+"
    },
    {
      "id": "C-047",
      "title": "Сеть АЗС: REG+PRM",
      "type": "средний",
      "size": "средний",
      "category": "АЗС",
      "description": "АЗС. Маршрут: ЖД/Авто. Брокерка: 4 млн.",
      "resource": {
        "REG": 2,
        "PRM": 1
      },
      "routes": [
        "ЖД",
        "Авто"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 20,
      "risk": 0,
      "brokerFee": 4,
      "effect": "+1 Репутация",
      "requirement": ""
    },
    {
      "id": "C-048",
      "title": "Аграрная кампания DTL",
      "type": "средний",
      "size": "средний",
      "category": "Агрохолдинг",
      "description": "Агрохолдинг. Маршрут: ЖД. Брокерка: 5 млн.",
      "resource": {
        "DTL": 3
      },
      "routes": [
        "ЖД"
      ],
      "baseRoute": "ЖД",
      "duration": 3,
      "income": 25,
      "risk": 2,
      "brokerFee": 5,
      "effect": "+1 Влияние",
      "requirement": ""
    },
    {
      "id": "C-049",
      "title": "Смена поставщика",
      "type": "средний",
      "size": "средний",
      "category": "Промышленность",
      "description": "Промышленность. Маршрут: ЖД. Брокерка: 5 млн.",
      "resource": {
        "REG": 1,
        "PRM": 1,
        "DTL": 1
      },
      "routes": [
        "ЖД"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 23,
      "risk": 1,
      "brokerFee": 5,
      "effect": "+1 Эффективность",
      "requirement": ""
    },
    {
      "id": "C-050",
      "title": "Резерв на пик перевозок",
      "type": "средний",
      "size": "средний",
      "category": "Автопарк",
      "description": "Автопарк. Маршрут: ЖД/Авто. Брокерка: 5 млн.",
      "resource": {
        "REG": 1,
        "DTL": 2
      },
      "routes": [
        "ЖД",
        "Авто"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 23,
      "risk": 1,
      "brokerFee": 5,
      "effect": "+1 Эффективность",
      "requirement": ""
    },
    {
      "id": "C-051",
      "title": "Поставка на бетонный узел",
      "type": "средний",
      "size": "средний",
      "category": "Строительный сектор",
      "description": "Строительный сектор. Маршрут: ЖД+Нефтебаза/ЖД. Брокерка: 5 млн.",
      "resource": {
        "DTL": 3
      },
      "routes": [
        "ЖД + нефтебаза",
        "ЖД"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 4,
      "income": 24,
      "risk": 1,
      "brokerFee": 5,
      "effect": "+1 Эффективность",
      "requirement": ""
    },
    {
      "id": "C-052",
      "title": "Контракт с отсрочкой платежа",
      "type": "средний",
      "size": "средний",
      "category": "Муниципальный контракт",
      "description": "Муниципальный контракт. Маршрут: ЖД. Брокерка: 5 млн.",
      "resource": {
        "REG": 2,
        "DTL": 1
      },
      "routes": [
        "ЖД"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 22,
      "risk": 1,
      "brokerFee": 5,
      "effect": "+1 Репутация",
      "requirement": ""
    },
    {
      "id": "C-053",
      "title": "Региональный микс",
      "type": "средний",
      "size": "средний",
      "category": "Региональный клиент",
      "description": "Региональный клиент. Маршрут: ЖД/Авто. Брокерка: 5 млн.",
      "resource": {
        "REG": 1,
        "PRM": 1,
        "DTL": 1
      },
      "routes": [
        "ЖД",
        "Авто"
      ],
      "baseRoute": "ЖД",
      "duration": 4,
      "income": 23,
      "risk": 1,
      "brokerFee": 5,
      "effect": "+1 Влияние",
      "requirement": ""
    },
    {
      "id": "C-054",
      "title": "Терминальная поставка",
      "type": "средний",
      "size": "средний",
      "category": "Логистический оператор",
      "description": "Логистический оператор. Маршрут: ЖД+Нефтебаза/ЖД. Брокерка: 5 млн.",
      "resource": {
        "PRM": 1,
        "DTL": 2
      },
      "routes": [
        "ЖД + нефтебаза",
        "ЖД"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 4,
      "income": 24,
      "risk": 1,
      "brokerFee": 5,
      "effect": "+1 Эффективность",
      "requirement": ""
    },
    {
      "id": "C-055",
      "title": "Федеральная сеть АЗС: квартальный пакет",
      "type": "крупный",
      "size": "крупный",
      "category": "Крупный клиент",
      "description": "Крупный клиент. Маршрут: ЖД+Нефтебаза. Брокерка: 7 млн.",
      "resource": {
        "REG": 2,
        "PRM": 2
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 5,
      "income": 29,
      "risk": 2,
      "brokerFee": 7,
      "effect": "+2 Репутация",
      "requirement": "Репутация 4+"
    },
    {
      "id": "C-056",
      "title": "Промышленный холдинг: DTL+PRM",
      "type": "крупный",
      "size": "крупный",
      "category": "Крупный клиент",
      "description": "Крупный клиент. Маршрут: ЖД+Нефтебаза. Брокерка: 7 млн.",
      "resource": {
        "PRM": 1,
        "DTL": 3
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 5,
      "income": 31,
      "risk": 2,
      "brokerFee": 7,
      "effect": "+2 Репутация",
      "requirement": "Репутация 4+"
    },
    {
      "id": "C-057",
      "title": "Агросезон: большой DTL",
      "type": "крупный",
      "size": "крупный",
      "category": "Агрохолдинг",
      "description": "Агрохолдинг. Маршрут: ЖД+Нефтебаза. Брокерка: 7 млн.",
      "resource": {
        "DTL": 4
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 5,
      "income": 31,
      "risk": 2,
      "brokerFee": 7,
      "effect": "+2 Влияние",
      "requirement": "Репутация 4+"
    },
    {
      "id": "C-058",
      "title": "Непрерывное производство",
      "type": "крупный",
      "size": "крупный",
      "category": "Промышленность",
      "description": "Промышленность. Маршрут: ЖД+Нефтебаза. Брокерка: 7 млн.",
      "resource": {
        "REG": 1,
        "DTL": 3
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 5,
      "income": 30,
      "risk": 2,
      "brokerFee": 7,
      "effect": "+2 Эффективность",
      "requirement": "Эффективность 4+"
    },
    {
      "id": "C-059",
      "title": "Премиальный региональный запуск",
      "type": "крупный",
      "size": "крупный",
      "category": "Сеть АЗС",
      "description": "Сеть АЗС. Маршрут: ЖД+Нефтебаза. Брокерка: 8 млн.",
      "resource": {
        "REG": 1,
        "PRM": 3
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 5,
      "income": 30,
      "risk": 2,
      "brokerFee": 8,
      "effect": "+2 Репутация",
      "requirement": "Влияние 4+"
    },
    {
      "id": "C-060",
      "title": "Межрегиональный автопарк",
      "type": "крупный",
      "size": "крупный",
      "category": "Автопарк",
      "description": "Автопарк. Маршрут: ЖД+Нефтебаза/ЖД. Брокерка: 7 млн.",
      "resource": {
        "REG": 1,
        "DTL": 3
      },
      "routes": [
        "ЖД + нефтебаза",
        "ЖД"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 5,
      "income": 30,
      "risk": 2,
      "brokerFee": 7,
      "effect": "+2 Эффективность",
      "requirement": "Репутация 4+"
    },
    {
      "id": "C-061",
      "title": "Инфраструктурный проект",
      "type": "крупный",
      "size": "крупный",
      "category": "Строительный сектор",
      "description": "Строительный сектор. Маршрут: ЖД+Нефтебаза. Брокерка: 7 млн.",
      "resource": {
        "DTL": 4
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 5,
      "income": 31,
      "risk": 2,
      "brokerFee": 7,
      "effect": "+2 Эффективность",
      "requirement": "Репутация 4+"
    },
    {
      "id": "C-062",
      "title": "Городская топливная программа",
      "type": "крупный",
      "size": "крупный",
      "category": "Муниципальный контракт",
      "description": "Муниципальный контракт. Маршрут: ЖД+Нефтебаза. Брокерка: 7 млн.",
      "resource": {
        "REG": 2,
        "DTL": 2
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 5,
      "income": 29,
      "risk": 2,
      "brokerFee": 7,
      "effect": "+2 Репутация",
      "requirement": "Репутация 5+"
    },
    {
      "id": "C-063",
      "title": "Региональный оператор: полный пакет",
      "type": "крупный",
      "size": "крупный",
      "category": "Региональный клиент",
      "description": "Региональный клиент. Маршрут: ЖД+Нефтебаза. Брокерка: 7 млн.",
      "resource": {
        "REG": 2,
        "PRM": 1,
        "DTL": 1
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 5,
      "income": 29,
      "risk": 2,
      "brokerFee": 7,
      "effect": "+2 Влияние",
      "requirement": "Влияние 4+"
    },
    {
      "id": "C-064",
      "title": "Топливо для распределительной сети",
      "type": "крупный",
      "size": "крупный",
      "category": "Логистический оператор",
      "description": "Логистический оператор. Маршрут: ЖД+Нефтебаза. Брокерка: 7 млн.",
      "resource": {
        "REG": 1,
        "DTL": 3
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 5,
      "income": 30,
      "risk": 2,
      "brokerFee": 7,
      "effect": "+2 Эффективность",
      "requirement": "Эффективность 4+"
    },
    {
      "id": "C-065",
      "title": "Большой арбитраж REG/PRM",
      "type": "крупный",
      "size": "крупный",
      "category": "Трейдер",
      "description": "Трейдер. Маршрут: ЖД+Нефтебаза/ЖД. Брокерка: 7 млн.",
      "resource": {
        "REG": 2,
        "PRM": 2
      },
      "routes": [
        "ЖД + нефтебаза",
        "ЖД"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 4,
      "income": 29,
      "risk": 2,
      "brokerFee": 7,
      "effect": "+2 Влияние",
      "requirement": "Влияние 5+"
    },
    {
      "id": "C-066",
      "title": "Большой арбитраж DTL",
      "type": "крупный",
      "size": "крупный",
      "category": "Трейдер",
      "description": "Трейдер. Маршрут: ЖД+Нефтебаза/ЖД. Брокерка: 7 млн.",
      "resource": {
        "DTL": 4
      },
      "routes": [
        "ЖД + нефтебаза",
        "ЖД"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 4,
      "income": 31,
      "risk": 2,
      "brokerFee": 7,
      "effect": "+2 Влияние",
      "requirement": "Влияние 5+"
    },
    {
      "id": "C-067",
      "title": "Сложный смешанный контракт",
      "type": "крупный",
      "size": "крупный",
      "category": "Промышленность",
      "description": "Промышленность. Маршрут: ЖД+Нефтебаза. Брокерка: 7 млн.",
      "resource": {
        "REG": 1,
        "PRM": 1,
        "DTL": 2
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 5,
      "income": 30,
      "risk": 2,
      "brokerFee": 7,
      "effect": "+2 Эффективность",
      "requirement": "Репутация 4+"
    },
    {
      "id": "C-068",
      "title": "Крупная сеть АЗС: REG",
      "type": "крупный",
      "size": "крупный",
      "category": "АЗС",
      "description": "АЗС. Маршрут: ЖД+Нефтебаза/ЖД. Брокерка: 6 млн.",
      "resource": {
        "REG": 4
      },
      "routes": [
        "ЖД + нефтебаза",
        "ЖД"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 5,
      "income": 25,
      "risk": 1,
      "brokerFee": 6,
      "effect": "+2 Репутация",
      "requirement": "Репутация 4+"
    },
    {
      "id": "C-069",
      "title": "Сеть АЗС: PRM программа",
      "type": "крупный",
      "size": "крупный",
      "category": "Сеть АЗС",
      "description": "Сеть АЗС. Маршрут: ЖД+Нефтебаза. Брокерка: 8 млн.",
      "resource": {
        "PRM": 4
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 5,
      "income": 31,
      "risk": 2,
      "brokerFee": 8,
      "effect": "+2 Репутация",
      "requirement": "Влияние 4+"
    },
    {
      "id": "C-070",
      "title": "Агрохолдинг: пик уборочной",
      "type": "крупный",
      "size": "крупный",
      "category": "Агрохолдинг",
      "description": "Агрохолдинг. Маршрут: ЖД+Нефтебаза. Брокерка: 7 млн.",
      "resource": {
        "DTL": 4
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 4,
      "income": 31,
      "risk": 2,
      "brokerFee": 7,
      "effect": "+2 Влияние",
      "requirement": "Репутация 4+"
    },
    {
      "id": "C-071",
      "title": "Федеральный парк перевозчика",
      "type": "крупный",
      "size": "крупный",
      "category": "Автопарк",
      "description": "Автопарк. Маршрут: ЖД+Нефтебаза. Брокерка: 7 млн.",
      "resource": {
        "REG": 2,
        "DTL": 2
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 5,
      "income": 29,
      "risk": 2,
      "brokerFee": 7,
      "effect": "+2 Эффективность",
      "requirement": "Влияние 4+"
    },
    {
      "id": "C-072",
      "title": "Поставка на сезон работ",
      "type": "крупный",
      "size": "крупный",
      "category": "Строительный сектор",
      "description": "Строительный сектор. Маршрут: ЖД+Нефтебаза. Брокерка: 7 млн.",
      "resource": {
        "REG": 1,
        "DTL": 3
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 5,
      "income": 30,
      "risk": 2,
      "brokerFee": 7,
      "effect": "+2 Эффективность",
      "requirement": "Эффективность 4+"
    },
    {
      "id": "C-073",
      "title": "Региональный резерв топлива",
      "type": "крупный",
      "size": "крупный",
      "category": "Муниципальный контракт",
      "description": "Муниципальный контракт. Маршрут: ЖД+Нефтебаза. Брокерка: 7 млн.",
      "resource": {
        "REG": 2,
        "DTL": 2
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 5,
      "income": 29,
      "risk": 2,
      "brokerFee": 7,
      "effect": "+2 Репутация",
      "requirement": "Репутация 5+"
    },
    {
      "id": "C-074",
      "title": "VIP-клиент: комплексная поставка",
      "type": "крупный",
      "size": "крупный",
      "category": "Крупный клиент",
      "description": "Крупный клиент. Маршрут: ЖД+Нефтебаза. Брокерка: 7 млн.",
      "resource": {
        "REG": 1,
        "PRM": 1,
        "DTL": 2
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 5,
      "income": 30,
      "risk": 2,
      "brokerFee": 7,
      "effect": "+2 Репутация",
      "requirement": "Репутация 5+"
    },
    {
      "id": "C-075",
      "title": "Контракт под остановочный ремонт",
      "type": "крупный",
      "size": "крупный",
      "category": "Промышленность",
      "description": "Промышленность. Маршрут: ЖД+Нефтебаза. Брокерка: 7 млн.",
      "resource": {
        "PRM": 1,
        "DTL": 3
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 4,
      "income": 31,
      "risk": 2,
      "brokerFee": 7,
      "effect": "+2 Эффективность",
      "requirement": "Эффективность 5+"
    },
    {
      "id": "C-076",
      "title": "Региональная программа снабжения",
      "type": "крупный",
      "size": "крупный",
      "category": "Региональный клиент",
      "description": "Региональный клиент. Маршрут: ЖД+Нефтебаза/ЖД. Брокерка: 6 млн.",
      "resource": {
        "REG": 3,
        "DTL": 1
      },
      "routes": [
        "ЖД + нефтебаза",
        "ЖД"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 5,
      "income": 26,
      "risk": 1,
      "brokerFee": 6,
      "effect": "+2 Влияние",
      "requirement": "Влияние 4+"
    },
    {
      "id": "C-077",
      "title": "Сетевой логистический контракт",
      "type": "крупный",
      "size": "крупный",
      "category": "Логистический оператор",
      "description": "Логистический оператор. Маршрут: ЖД+Нефтебаза. Брокерка: 7 млн.",
      "resource": {
        "REG": 1,
        "PRM": 1,
        "DTL": 2
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 5,
      "income": 30,
      "risk": 2,
      "brokerFee": 7,
      "effect": "+2 Эффективность",
      "requirement": "Эффективность 4+"
    },
    {
      "id": "C-078",
      "title": "Премия к индексу: крупная партия",
      "type": "крупный",
      "size": "крупный",
      "category": "Трейдер",
      "description": "Трейдер. Маршрут: ЖД+Нефтебаза. Брокерка: 7 млн.",
      "resource": {
        "REG": 1,
        "PRM": 2,
        "DTL": 1
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "baseRoute": "ЖД+Нефтебаза",
      "duration": 5,
      "income": 30,
      "risk": 2,
      "brokerFee": 7,
      "effect": "+2 Влияние",
      "requirement": "Влияние 5+"
    }
  ],
  "tenders": [
    {
      "id": "T-01",
      "title": "Федеральная посевная кампания",
      "type": "тендер",
      "size": "тендер",
      "category": "Агрохолдинг",
      "description": "Тендер: Агрохолдинг. Требование допуска: Репутация 4+.",
      "resource": {
        "DTL": 4
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "duration": 2,
      "income": 32,
      "risk": 2,
      "victoryPoints": 4,
      "effect": "+2 Влияние",
      "requirement": "Репутация 4+"
    },
    {
      "id": "T-02",
      "title": "Премиальная сеть АЗС",
      "type": "тендер",
      "size": "тендер",
      "category": "Сеть АЗС",
      "description": "Тендер: Сеть АЗС. Требование допуска: Влияние 4+.",
      "resource": {
        "REG": 1,
        "PRM": 3
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "duration": 2,
      "income": 31,
      "risk": 2,
      "victoryPoints": 4,
      "effect": "+2 Репутация",
      "requirement": "Влияние 4+"
    },
    {
      "id": "T-03",
      "title": "Непрерывное снабжение завода",
      "type": "тендер",
      "size": "тендер",
      "category": "Промышленность",
      "description": "Тендер: Промышленность. Требование допуска: Эффективность 4+.",
      "resource": {
        "REG": 1,
        "DTL": 3
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "duration": 2,
      "income": 31,
      "risk": 2,
      "victoryPoints": 4,
      "effect": "+2 Эффективность",
      "requirement": "Эффективность 4+"
    },
    {
      "id": "T-04",
      "title": "Региональный топливный резерв",
      "type": "тендер",
      "size": "тендер",
      "category": "Муниципальный контракт",
      "description": "Тендер: Муниципальный контракт. Требование допуска: Репутация 5+.",
      "resource": {
        "REG": 2,
        "DTL": 2
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "duration": 2,
      "income": 30,
      "risk": 2,
      "victoryPoints": 4,
      "effect": "+2 Репутация",
      "requirement": "Репутация 5+"
    },
    {
      "id": "T-05",
      "title": "Распределительная сеть",
      "type": "тендер",
      "size": "тендер",
      "category": "Логистический оператор",
      "description": "Тендер: Логистический оператор. Требование допуска: Эффективность 4+.",
      "resource": {
        "REG": 1,
        "DTL": 3
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "duration": 2,
      "income": 31,
      "risk": 2,
      "victoryPoints": 4,
      "effect": "+2 Эффективность",
      "requirement": "Эффективность 4+"
    },
    {
      "id": "T-06",
      "title": "Комплексная VIP-поставка",
      "type": "тендер",
      "size": "тендер",
      "category": "Крупный клиент",
      "description": "Тендер: Крупный клиент. Требование допуска: Репутация 5+.",
      "resource": {
        "REG": 1,
        "PRM": 1,
        "DTL": 2
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "duration": 2,
      "income": 31,
      "risk": 2,
      "victoryPoints": 4,
      "effect": "+2 Репутация",
      "requirement": "Репутация 5+"
    },
    {
      "id": "T-07",
      "title": "Индексная премия REG",
      "type": "тендер",
      "size": "тендер",
      "category": "Трейдер",
      "description": "Тендер: Трейдер. Требование допуска: Влияние 5+.",
      "resource": {
        "REG": 4
      },
      "routes": [
        "ЖД"
      ],
      "duration": 2,
      "income": 28,
      "risk": 2,
      "victoryPoints": 4,
      "effect": "+2 Влияние",
      "requirement": "Влияние 5+"
    },
    {
      "id": "T-08",
      "title": "Индексная премия DTL",
      "type": "тендер",
      "size": "тендер",
      "category": "Трейдер",
      "description": "Тендер: Трейдер. Требование допуска: Влияние 5+.",
      "resource": {
        "DTL": 4
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "duration": 2,
      "income": 32,
      "risk": 2,
      "victoryPoints": 4,
      "effect": "+2 Влияние",
      "requirement": "Влияние 5+"
    },
    {
      "id": "T-09",
      "title": "Федеральный парк перевозчика",
      "type": "тендер",
      "size": "тендер",
      "category": "Автопарк",
      "description": "Тендер: Автопарк. Требование допуска: Репутация 4+.",
      "resource": {
        "REG": 2,
        "DTL": 2
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "duration": 2,
      "income": 30,
      "risk": 2,
      "victoryPoints": 4,
      "effect": "+2 Эффективность",
      "requirement": "Репутация 4+"
    },
    {
      "id": "T-10",
      "title": "Сезон инфраструктурных работ",
      "type": "тендер",
      "size": "тендер",
      "category": "Строительный сектор",
      "description": "Тендер: Строительный сектор. Требование допуска: Репутация 4+.",
      "resource": {
        "DTL": 4
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "duration": 2,
      "income": 32,
      "risk": 2,
      "victoryPoints": 4,
      "effect": "+2 Эффективность",
      "requirement": "Репутация 4+"
    },
    {
      "id": "T-11",
      "title": "Поставка REG на сеть",
      "type": "тендер",
      "size": "тендер",
      "category": "АЗС",
      "description": "Тендер: АЗС. Требование допуска: Репутация 4+.",
      "resource": {
        "REG": 4
      },
      "routes": [
        "ЖД"
      ],
      "duration": 2,
      "income": 26,
      "risk": 1,
      "victoryPoints": 4,
      "effect": "+2 Репутация",
      "requirement": "Репутация 4+"
    },
    {
      "id": "T-12",
      "title": "PRM на новый регион",
      "type": "тендер",
      "size": "тендер",
      "category": "Сеть АЗС",
      "description": "Тендер: Сеть АЗС. Требование допуска: Влияние 4+.",
      "resource": {
        "PRM": 4
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "duration": 2,
      "income": 33,
      "risk": 2,
      "victoryPoints": 4,
      "effect": "+2 Репутация",
      "requirement": "Влияние 4+"
    },
    {
      "id": "T-13",
      "title": "Ремонтный сезон",
      "type": "тендер",
      "size": "тендер",
      "category": "Промышленность",
      "description": "Тендер: Промышленность. Требование допуска: Эффективность 5+.",
      "resource": {
        "PRM": 1,
        "DTL": 3
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "duration": 2,
      "income": 33,
      "risk": 2,
      "victoryPoints": 4,
      "effect": "+2 Эффективность",
      "requirement": "Эффективность 5+"
    },
    {
      "id": "T-14",
      "title": "Региональный микс",
      "type": "тендер",
      "size": "тендер",
      "category": "Региональный клиент",
      "description": "Тендер: Региональный клиент. Требование допуска: Влияние 4+.",
      "resource": {
        "REG": 2,
        "PRM": 1,
        "DTL": 1
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "duration": 2,
      "income": 29,
      "risk": 1,
      "victoryPoints": 4,
      "effect": "+2 Влияние",
      "requirement": "Влияние 4+"
    },
    {
      "id": "T-15",
      "title": "Отопительный резерв",
      "type": "тендер",
      "size": "тендер",
      "category": "Муниципальный контракт",
      "description": "Тендер: Муниципальный контракт. Требование допуска: Репутация 5+.",
      "resource": {
        "REG": 1,
        "DTL": 3
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "duration": 2,
      "income": 31,
      "risk": 2,
      "victoryPoints": 4,
      "effect": "+2 Репутация",
      "requirement": "Репутация 5+"
    },
    {
      "id": "T-16",
      "title": "Уборочная кампания",
      "type": "тендер",
      "size": "тендер",
      "category": "Агрохолдинг",
      "description": "Тендер: Агрохолдинг. Требование допуска: Репутация 4+.",
      "resource": {
        "DTL": 4
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "duration": 2,
      "income": 33,
      "risk": 2,
      "victoryPoints": 4,
      "effect": "+2 Влияние",
      "requirement": "Репутация 4+"
    },
    {
      "id": "T-17",
      "title": "Стратегический партнер",
      "type": "тендер",
      "size": "тендер",
      "category": "Крупный клиент",
      "description": "Тендер: Крупный клиент. Требование допуска: Репутация 5+.",
      "resource": {
        "REG": 2,
        "PRM": 1,
        "DTL": 1
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "duration": 2,
      "income": 30,
      "risk": 2,
      "victoryPoints": 4,
      "effect": "+2 Репутация",
      "requirement": "Репутация 5+"
    },
    {
      "id": "T-18",
      "title": "Срочная сеть поставок",
      "type": "тендер",
      "size": "тендер",
      "category": "Логистический оператор",
      "description": "Тендер: Логистический оператор. Требование допуска: Эффективность 5+.",
      "resource": {
        "REG": 1,
        "PRM": 1,
        "DTL": 2
      },
      "routes": [
        "ЖД + нефтебаза"
      ],
      "duration": 2,
      "income": 32,
      "risk": 2,
      "victoryPoints": 4,
      "effect": "+2 Эффективность",
      "requirement": "Эффективность 5+"
    }
  ],
  "marketCards": [
    {
      "id": "M-01",
      "title": "Сезонный спрос на DTL",
      "type": "рынок",
      "description": "DTL +1 млн, объем DTL -1. Контракты агрохолдингов дают +2 млн при прямой поставке.",
      "effect": "Агрохолдинг +2 доход",
      "balanceNote": "Спрос компенсирован меньшим объемом.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 1
      },
      "stockDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": -1
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-02",
      "title": "Спокойный рынок REG",
      "type": "рынок",
      "description": "REG -1 млн, объем REG -1. Контракты АЗС дают -1 млн дохода.",
      "effect": "АЗС -1 доход",
      "balanceNote": "Цена ниже, но спрос слабее.",
      "priceDelta": {
        "REG": -1,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": -1,
        "PRM": 0,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-03",
      "title": "Премиальный спрос PRM",
      "type": "рынок",
      "description": "PRM +1 млн, объем PRM -1. Сеть АЗС +2 млн.",
      "effect": "Сеть АЗС +2 доход",
      "balanceNote": "PRM не становится авто-имбой.",
      "priceDelta": {
        "REG": 0,
        "PRM": 1,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 0,
        "PRM": -1,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-04",
      "title": "Избыток REG",
      "type": "рынок",
      "description": "REG -1 млн, объем REG +2.",
      "effect": "Нет",
      "balanceNote": "Позитив для старта.",
      "priceDelta": {
        "REG": -1,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 2,
        "PRM": 0,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-05",
      "title": "Дефицит DTL",
      "type": "рынок",
      "description": "DTL +1 млн, объем DTL -2. Автопарк +1 млн.",
      "effect": "Автопарк +1 доход",
      "balanceNote": "Негатив смягчен срочной закупкой.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 1
      },
      "stockDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": -2
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-06",
      "title": "Окно ЖД-перевозок",
      "type": "рынок",
      "description": "ЖД-мощность +1. Контракт через ЖД дает +1 млн.",
      "effect": "ЖД +1 доход",
      "balanceNote": "Ускоряет темп.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 1,
        "depot": 0
      }
    },
    {
      "id": "M-07",
      "title": "Перегрузка станций",
      "type": "рынок",
      "description": "ЖД-мощность -1. Срочная ЖД стоит +1 млн вместо +2.",
      "effect": "Срочная ЖД дешевле",
      "balanceNote": "Негатив с аварийным путем.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": -1,
        "depot": 0
      }
    },
    {
      "id": "M-08",
      "title": "Свободная нефтебаза",
      "type": "рынок",
      "description": "Нефтебазовая мощность +1. Крупные контракты через нефтебазу +1 млн.",
      "effect": "Крупные +1 доход",
      "balanceNote": "Поддерживает крупные сделки.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 1
      }
    },
    {
      "id": "M-09",
      "title": "Плановый ремонт нефтебазы",
      "type": "рынок",
      "description": "Нефтебазовая мощность -1. Крупные контракты +2 млн.",
      "effect": "Крупные +2 доход",
      "balanceNote": "Риск и награда вместе.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": -1
      }
    },
    {
      "id": "M-10",
      "title": "Региональные торги",
      "type": "рынок",
      "description": "Все ресурсы объем +1. Региональные клиенты +1 млн.",
      "effect": "Региональные +1 доход",
      "balanceNote": "Мягкий позитив.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 1,
        "PRM": 1,
        "DTL": 1
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-11",
      "title": "Сильный промышленный спрос",
      "type": "рынок",
      "description": "DTL +1, объем DTL -1. Промышленные контракты +2 млн.",
      "effect": "Промышленность +2 доход",
      "balanceNote": "Доход за дорогой ресурс.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 1
      },
      "stockDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": -1
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-12",
      "title": "Снижение премии PRM",
      "type": "рынок",
      "description": "PRM -1, объем +1. Контракты с 2+ PRM дают -1 млн.",
      "effect": "PRM-контракты -1 доход",
      "balanceNote": "Не делает PRM слишком выгодным.",
      "priceDelta": {
        "REG": 0,
        "PRM": -1,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 0,
        "PRM": 1,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-13",
      "title": "Биржевой штиль",
      "type": "рынок",
      "description": "Цены без изменений, все объемы +1.",
      "effect": "Нет",
      "balanceNote": "Передышка рынка.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 1,
        "PRM": 1,
        "DTL": 1
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-14",
      "title": "Маржинальное давление",
      "type": "рынок",
      "description": "Все прямые поставки -1 млн. Брокерка без изменений.",
      "effect": "Все контракты -1 доход",
      "balanceNote": "Стимулирует брокерку.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-15",
      "title": "Сервисная неделя ПРОЛЕУМ",
      "type": "рынок",
      "description": "Первый игрок, закрывший контракт без события, берет карту ПРОЛЕУМ.",
      "effect": "ПРОЛЕУМ чаще",
      "balanceNote": "Бонус не денежный.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-16",
      "title": "Высокая волатильность",
      "type": "рынок",
      "description": "REG и DTL +1, PRM -1. REG/DTL объем -1, PRM +1. Трейдеры +2 млн.",
      "effect": "Трейдеры +2 доход",
      "balanceNote": "Сдвиг стратегий.",
      "priceDelta": {
        "REG": 1,
        "PRM": -1,
        "DTL": 1
      },
      "stockDelta": {
        "REG": -1,
        "PRM": 1,
        "DTL": -1
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-17",
      "title": "Дешевая логистика",
      "type": "рынок",
      "description": "ЖД-мощность +1. Стоимость ЖД -1 млн для всех.",
      "effect": "ЖД -1 стоимость",
      "balanceNote": "Позитив темпа.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 1,
        "depot": 0
      }
    },
    {
      "id": "M-18",
      "title": "Документальная нагрузка",
      "type": "рынок",
      "description": "Муниципальные +2 млн, но их базовый риск +1 в этот день.",
      "effect": "Муниципальные +2 доход",
      "balanceNote": "Доход за риск.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-19",
      "title": "Стабильный спрос АЗС",
      "type": "рынок",
      "description": "REG объем +1. Контракты АЗС +1 млн.",
      "effect": "АЗС +1 доход",
      "balanceNote": "Легкий позитив.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 1,
        "PRM": 0,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-20",
      "title": "Ограничение PRM",
      "type": "рынок",
      "description": "PRM +1, объем PRM -2. Сеть АЗС +2 млн.",
      "effect": "Сеть АЗС +2 доход",
      "balanceNote": "Редкий ресурс — выше награда.",
      "priceDelta": {
        "REG": 0,
        "PRM": 1,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 0,
        "PRM": -2,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-21",
      "title": "Складская распродажа",
      "type": "рынок",
      "description": "REG +2 объема, PRM/DTL +1. Нефтебаза -1.",
      "effect": "Нет",
      "balanceNote": "Ресурс легче, перевалка сложнее.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 2,
        "PRM": 1,
        "DTL": 1
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": -1
      }
    },
    {
      "id": "M-22",
      "title": "Пик автоперевозок",
      "type": "рынок",
      "description": "Авто-поставка для малых контрактов стоит -1 млн.",
      "effect": "Авто -1 стоимость",
      "balanceNote": "Поддержка малых сделок.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-23",
      "title": "ЖД тариф вырос",
      "type": "рынок",
      "description": "ЖД-поставка +1 млн. Игрок с ЖД-активом игнорирует штраф.",
      "effect": "ЖД +1 стоимость",
      "balanceNote": "Ценность активов.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-24",
      "title": "Спрос на быстрые сделки",
      "type": "рынок",
      "description": "Все малые контракты +1 млн при прямой поставке.",
      "effect": "Малые +1 доход",
      "balanceNote": "Catch-up быстрых стратегий.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-25",
      "title": "Крупные клиенты на рынке",
      "type": "рынок",
      "description": "Откройте дополнительно 1 крупный контракт. Нефтебаза +1.",
      "effect": "Крупные +1 доход",
      "balanceNote": "Цель для середины партии.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 1
      }
    },
    {
      "id": "M-26",
      "title": "Сжатие маржи",
      "type": "рынок",
      "description": "Крупные -1 млн, малые +1 млн.",
      "effect": "Крупные -1, малые +1",
      "balanceNote": "Сдерживает крупную стратегию.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-27",
      "title": "Рынок покупателя",
      "type": "рынок",
      "description": "REG и PRM -1, объемы REG/PRM -1. Клиентские контракты -1 млн.",
      "effect": "Клиенты -1 доход",
      "balanceNote": "Дешевый ресурс, меньше выручка.",
      "priceDelta": {
        "REG": -1,
        "PRM": -1,
        "DTL": 0
      },
      "stockDelta": {
        "REG": -1,
        "PRM": -1,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-28",
      "title": "Рынок продавца",
      "type": "рынок",
      "description": "REG и PRM +1, объемы +1. АЗС/сеть АЗС +1 млн.",
      "effect": "АЗС +1 доход",
      "balanceNote": "Цена и доход растут вместе.",
      "priceDelta": {
        "REG": 1,
        "PRM": 1,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 1,
        "PRM": 1,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-29",
      "title": "Операционная неделя",
      "type": "рынок",
      "description": "Игроки с Эффективностью 5+ снижают риск одной сделки еще на 1.",
      "effect": "Эффективность снижает риск",
      "balanceNote": "Награда за шкалу.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": 0,
        "depot": 0
      }
    },
    {
      "id": "M-30",
      "title": "Конкурентный день",
      "type": "рынок",
      "description": "ЖД-мощность -1. Тендер дня +2 млн дохода.",
      "effect": "Тендер +2 доход",
      "balanceNote": "Толкает к тендеру.",
      "priceDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "stockDelta": {
        "REG": 0,
        "PRM": 0,
        "DTL": 0
      },
      "logisticsDelta": {
        "rail": -1,
        "depot": 0
      }
    }
  ],
  "events": [
    {
      "id": "E-01",
      "title": "Сбой ЭТРАН",
      "type": "операционное событие",
      "trigger": "ЖД",
      "severity": 2,
      "description": "Триггер: ЖД. Выберите один из вариантов решения.",
      "choices": [
        "2 млн и провести поставку",
        "Срок -1",
        "Потратить 1 Репутацию"
      ],
      "helps": "Документы закрыты",
      "expectedPenalty": 1,
      "effect": "2 млн и провести поставку / Срок -1 / Потратить 1 Репутацию",
      "balanceNote": "Деньги/срок/репутация"
    },
    {
      "id": "E-02",
      "title": "Станция перегружена",
      "type": "операционное событие",
      "trigger": "ЖД",
      "severity": 2,
      "description": "Триггер: ЖД. Выберите один из вариантов решения.",
      "choices": [
        "3 млн за альтернативный маршрут",
        "Нефтебаза +1 млн",
        "Отложить на ход"
      ],
      "helps": "ЖД-узел II+",
      "expectedPenalty": 2,
      "effect": "3 млн за альтернативный маршрут / Нефтебаза +1 млн / Отложить на ход",
      "balanceNote": "Не блокирует полностью"
    },
    {
      "id": "E-03",
      "title": "Клиент спорит по простою",
      "type": "операционное событие",
      "trigger": "Любая",
      "severity": 2,
      "description": "Триггер: Любая. Выберите один из вариантов решения.",
      "choices": [
        "2 млн",
        "-1 Репутация",
        "Доход -2 млн"
      ],
      "helps": "Команда удержала клиента",
      "expectedPenalty": 1,
      "effect": "2 млн / -1 Репутация / Доход -2 млн",
      "balanceNote": "Выбор наказания"
    },
    {
      "id": "E-04",
      "title": "Недостача документов",
      "type": "операционное событие",
      "trigger": "Муниципальный/крупный",
      "severity": 2,
      "description": "Триггер: Муниципальный/крупный. Выберите один из вариантов решения.",
      "choices": [
        "2 млн",
        "Срок -1",
        "ПРОЛЕУМ-карта без эффекта"
      ],
      "helps": "Документы закрыты",
      "expectedPenalty": 1,
      "effect": "2 млн / Срок -1 / ПРОЛЕУМ-карта без эффекта",
      "balanceNote": "Мягкий риск"
    },
    {
      "id": "E-05",
      "title": "Изменение окна отгрузки",
      "type": "операционное событие",
      "trigger": "Поставщик/ЖД",
      "severity": 1,
      "description": "Триггер: Поставщик/ЖД. Выберите один из вариантов решения.",
      "choices": [
        "1 млн",
        "Вернуть 1 ресурс на склад",
        "Срок -1"
      ],
      "helps": "Поставщик II+",
      "expectedPenalty": 1,
      "effect": "1 млн / Вернуть 1 ресурс на склад / Срок -1",
      "balanceNote": "Легкое событие"
    },
    {
      "id": "E-06",
      "title": "Качество партии проверяют",
      "type": "операционное событие",
      "trigger": "PRM/крупный",
      "severity": 2,
      "description": "Триггер: PRM/крупный. Выберите один из вариантов решения.",
      "choices": [
        "2 млн",
        "Доход -2 млн",
        "-1 Репутация"
      ],
      "helps": "Сервис спас маржу",
      "expectedPenalty": 1,
      "effect": "2 млн / Доход -2 млн / -1 Репутация",
      "balanceNote": "Не удаляет ресурс"
    },
    {
      "id": "E-07",
      "title": "Срочная заявка клиента",
      "type": "операционное событие",
      "trigger": "Клиент",
      "severity": 1,
      "description": "Триггер: Клиент. Выберите один из вариантов решения.",
      "choices": [
        "Закрыть сейчас: доход -2 млн",
        "Продлить за 1 млн",
        "Отказ без штрафа, если срок не 0"
      ],
      "helps": "Клиент принял задержку",
      "expectedPenalty": 1,
      "effect": "Закрыть сейчас: доход -2 млн / Продлить за 1 млн / Отказ без штрафа, если срок не 0",
      "balanceNote": "Ситуационный выбор"
    },
    {
      "id": "E-08",
      "title": "Биржевой гэп",
      "type": "операционное событие",
      "trigger": "Ресурс",
      "severity": 2,
      "description": "Триггер: Ресурс. Выберите один из вариантов решения.",
      "choices": [
        "Доплатить 2 млн",
        "Использовать хедж",
        "Сбросить 1 ресурс со склада"
      ],
      "helps": "Хедж",
      "expectedPenalty": 1,
      "effect": "Доплатить 2 млн / Использовать хедж / Сбросить 1 ресурс со склада",
      "balanceNote": "Страхует хедж"
    },
    {
      "id": "E-09",
      "title": "Проверка контрагента",
      "type": "операционное событие",
      "trigger": "Брокерка",
      "severity": 1,
      "description": "Триггер: Брокерка. Выберите один из вариантов решения.",
      "choices": [
        "1 млн",
        "Брокерская комиссия -1 млн",
        "Потратить 1 Влияние"
      ],
      "helps": "Брокерский контур",
      "expectedPenalty": 1,
      "effect": "1 млн / Брокерская комиссия -1 млн / Потратить 1 Влияние",
      "balanceNote": "Не душит брокерку"
    },
    {
      "id": "E-10",
      "title": "Перевозчик меняет тариф",
      "type": "операционное событие",
      "trigger": "Авто/ЖД",
      "severity": 2,
      "description": "Триггер: Авто/ЖД. Выберите один из вариантов решения.",
      "choices": [
        "2 млн",
        "Срок -1",
        "Использовать логистический актив"
      ],
      "helps": "Авто/ЖД актив",
      "expectedPenalty": 1,
      "effect": "2 млн / Срок -1 / Использовать логистический актив",
      "balanceNote": "Поддерживает активы"
    },
    {
      "id": "E-11",
      "title": "Клиент требует отсрочку",
      "type": "операционное событие",
      "trigger": "Клиент",
      "severity": 1,
      "description": "Триггер: Клиент. Выберите один из вариантов решения.",
      "choices": [
        "Доход -1 млн, при успехе +1 Репутация",
        "Без эффекта",
        "Карта ПРОЛЕУМ вместо бонуса"
      ],
      "helps": "Репутация",
      "expectedPenalty": 1,
      "effect": "Доход -1 млн, при успехе +1 Репутация / Без эффекта / Карта ПРОЛЕУМ вместо бонуса",
      "balanceNote": "Негатив с бонусом"
    },
    {
      "id": "E-12",
      "title": "Риск пересортицы",
      "type": "операционное событие",
      "trigger": "Смешанный ресурс",
      "severity": 2,
      "description": "Триггер: Смешанный ресурс. Выберите один из вариантов решения.",
      "choices": [
        "2 млн",
        "1 ресурс на склад, срок -1",
        "Потерять бонус контракта"
      ],
      "helps": "Эффективность 5+",
      "expectedPenalty": 1,
      "effect": "2 млн / 1 ресурс на склад, срок -1 / Потерять бонус контракта",
      "balanceNote": "Сдерживает миксы"
    },
    {
      "id": "E-13",
      "title": "Задержка акта",
      "type": "операционное событие",
      "trigger": "Любая",
      "severity": 1,
      "description": "Триггер: Любая. Выберите один из вариантов решения.",
      "choices": [
        "Доход -1 млн",
        "1 млн за ускорение",
        "-1 Влияние"
      ],
      "helps": "Сервис",
      "expectedPenalty": 1,
      "effect": "Доход -1 млн / 1 млн за ускорение / -1 Влияние",
      "balanceNote": "Малый риск"
    },
    {
      "id": "E-14",
      "title": "Пиковая нагрузка нефтебазы",
      "type": "операционное событие",
      "trigger": "Нефтебаза",
      "severity": 2,
      "description": "Триггер: Нефтебаза. Выберите один из вариантов решения.",
      "choices": [
        "2 млн",
        "-1 нефтебазовая мощность завтра",
        "Отложить поставку"
      ],
      "helps": "Нефтебаза II+",
      "expectedPenalty": 1,
      "effect": "2 млн / -1 нефтебазовая мощность завтра / Отложить поставку",
      "balanceNote": "Нефтебаза не всегда идеальна"
    },
    {
      "id": "E-15",
      "title": "Непредвиденный простой",
      "type": "операционное событие",
      "trigger": "Крупный/промышленный",
      "severity": 3,
      "description": "Триггер: Крупный/промышленный. Выберите один из вариантов решения.",
      "choices": [
        "3 млн",
        "-1 Репутация и срок -1",
        "Доход -3 млн"
      ],
      "helps": "Сервис спас маржу",
      "expectedPenalty": 2,
      "effect": "3 млн / -1 Репутация и срок -1 / Доход -3 млн",
      "balanceNote": "Тяжелая, но не фатальная"
    },
    {
      "id": "E-16",
      "title": "Поставщик меняет базис",
      "type": "операционное событие",
      "trigger": "Поставщик",
      "severity": 2,
      "description": "Триггер: Поставщик. Выберите один из вариантов решения.",
      "choices": [
        "2 млн",
        "Сменить канал: срок -1",
        "Поставщик II+ без штрафа"
      ],
      "helps": "Поставщик II+",
      "expectedPenalty": 1,
      "effect": "2 млн / Сменить канал: срок -1 / Поставщик II+ без штрафа",
      "balanceNote": "Усиливает поставщиков"
    },
    {
      "id": "E-17",
      "title": "Сбой связи с клиентом",
      "type": "операционное событие",
      "trigger": "Клиент",
      "severity": 1,
      "description": "Триггер: Клиент. Выберите один из вариантов решения.",
      "choices": [
        "Срок -1",
        "1 млн",
        "Карта ПРОЛЕУМ отменяет"
      ],
      "helps": "Команда удержала клиента",
      "expectedPenalty": 1,
      "effect": "Срок -1 / 1 млн / Карта ПРОЛЕУМ отменяет",
      "balanceNote": "Мягкий риск срока"
    },
    {
      "id": "E-18",
      "title": "Форс-мажор на маршруте",
      "type": "операционное событие",
      "trigger": "Логистика",
      "severity": 3,
      "description": "Триггер: Логистика. Выберите один из вариантов решения.",
      "choices": [
        "Срочная логистика +3 млн",
        "Отложить на ход",
        "Брокерка без бонуса"
      ],
      "helps": "Окно в логистике",
      "expectedPenalty": 2,
      "effect": "Срочная логистика +3 млн / Отложить на ход / Брокерка без бонуса",
      "balanceNote": "Дорогой выход"
    },
    {
      "id": "E-19",
      "title": "Двойная проверка оплаты",
      "type": "операционное событие",
      "trigger": "Муниципальный/крупный",
      "severity": 2,
      "description": "Триггер: Муниципальный/крупный. Выберите один из вариантов решения.",
      "choices": [
        "Доход -2 млн",
        "-1 Влияние",
        "2 млн и сохранить доход"
      ],
      "helps": "Репутация",
      "expectedPenalty": 1,
      "effect": "Доход -2 млн / -1 Влияние / 2 млн и сохранить доход",
      "balanceNote": "Не чистый минус"
    },
    {
      "id": "E-20",
      "title": "Терминал работает медленнее",
      "type": "операционное событие",
      "trigger": "Нефтебаза",
      "severity": 2,
      "description": "Триггер: Нефтебаза. Выберите один из вариантов решения.",
      "choices": [
        "2 млн",
        "Срок -1",
        "Чужая нефтебаза за 1 млн"
      ],
      "helps": "Нефтебаза II+",
      "expectedPenalty": 1,
      "effect": "2 млн / Срок -1 / Чужая нефтебаза за 1 млн",
      "balanceNote": "Создает взаимодействие"
    },
    {
      "id": "E-21",
      "title": "Покупатель просит замену продукта",
      "type": "операционное событие",
      "trigger": "Клиент",
      "severity": 2,
      "description": "Триггер: Клиент. Выберите один из вариантов решения.",
      "choices": [
        "Заменить 1 REG на PRM/DTL со склада",
        "2 млн",
        "Доход -2 млн"
      ],
      "helps": "Склад/нефтебаза",
      "expectedPenalty": 1,
      "effect": "Заменить 1 REG на PRM/DTL со склада / 2 млн / Доход -2 млн",
      "balanceNote": "Склад полезен"
    },
    {
      "id": "E-22",
      "title": "Объем не совпал с планом",
      "type": "операционное событие",
      "trigger": "Ресурс",
      "severity": 2,
      "description": "Триггер: Ресурс. Выберите один из вариантов решения.",
      "choices": [
        "Докупить 1 ресурс по цене +1 млн",
        "Доход -2 млн",
        "Отложить на ход"
      ],
      "helps": "Эффективность 5+",
      "expectedPenalty": 1,
      "effect": "Докупить 1 ресурс по цене +1 млн / Доход -2 млн / Отложить на ход",
      "balanceNote": "Не отнимает собранное"
    },
    {
      "id": "E-23",
      "title": "Переговоры с клиентом",
      "type": "операционное событие",
      "trigger": "Клиент",
      "severity": 1,
      "description": "Триггер: Клиент. Выберите один из вариантов решения.",
      "choices": [
        "Доход -1 млн",
        "Потратить 1 Влияние",
        "+1 Репутация, но срок -1"
      ],
      "helps": "Влияние 5+",
      "expectedPenalty": 1,
      "effect": "Доход -1 млн / Потратить 1 Влияние / +1 Репутация, но срок -1",
      "balanceNote": "Стратегический обмен"
    },
    {
      "id": "E-24",
      "title": "Ошибка в графике",
      "type": "операционное событие",
      "trigger": "Срок",
      "severity": 2,
      "description": "Триггер: Срок. Выберите один из вариантов решения.",
      "choices": [
        "Продлить за 2 млн даже повторно",
        "Сорвать без потери Репутации, штраф 2 млн",
        "Потерять бонус"
      ],
      "helps": "Клиент принял задержку",
      "expectedPenalty": 1,
      "effect": "Продлить за 2 млн даже повторно / Сорвать без потери Репутации, штраф 2 млн / Потерять бонус",
      "balanceNote": "Спасает тупик"
    },
    {
      "id": "E-25",
      "title": "Внеплановая комиссия",
      "type": "операционное событие",
      "trigger": "Актив/брокерка",
      "severity": 1,
      "description": "Триггер: Актив/брокерка. Выберите один из вариантов решения.",
      "choices": [
        "1 млн владельцу актива",
        "2 млн банку",
        "Потратить 1 Влияние"
      ],
      "helps": "Брокерский контур",
      "expectedPenalty": 1,
      "effect": "1 млн владельцу актива / 2 млн банку / Потратить 1 Влияние",
      "balanceNote": "Экономика активов"
    },
    {
      "id": "E-26",
      "title": "Скачок очереди на отгрузку",
      "type": "операционное событие",
      "trigger": "Поставщик",
      "severity": 2,
      "description": "Триггер: Поставщик. Выберите один из вариантов решения.",
      "choices": [
        "2 млн",
        "Купить ресурс на 1 меньше",
        "Срок -1"
      ],
      "helps": "Поставщик III",
      "expectedPenalty": 1,
      "effect": "2 млн / Купить ресурс на 1 меньше / Срок -1",
      "balanceNote": "Ограничивает закуп"
    },
    {
      "id": "E-27",
      "title": "Клиент просит частичную поставку",
      "type": "операционное событие",
      "trigger": "3+ ресурса",
      "severity": 1,
      "description": "Триггер: 3+ ресурса. Выберите один из вариантов решения.",
      "choices": [
        "Закрыть без 1 ресурса: доход -2 млн",
        "Ждать полный ресурс",
        "ПРОЛЕУМ-карта без штрафа"
      ],
      "helps": "Сделка с колес",
      "expectedPenalty": 1,
      "effect": "Закрыть без 1 ресурса: доход -2 млн / Ждать полный ресурс / ПРОЛЕУМ-карта без штрафа",
      "balanceNote": "Снижает тупики"
    },
    {
      "id": "E-28",
      "title": "Согласование тарифа затянулось",
      "type": "операционное событие",
      "trigger": "ЖД",
      "severity": 2,
      "description": "Триггер: ЖД. Выберите один из вариантов решения.",
      "choices": [
        "2 млн",
        "Срок -1",
        "Доход -2 млн, риск следующей сделки -1"
      ],
      "helps": "ЖД-узел",
      "expectedPenalty": 1,
      "effect": "2 млн / Срок -1 / Доход -2 млн, риск следующей сделки -1",
      "balanceNote": "Тактический обмен"
    },
    {
      "id": "E-29",
      "title": "Пересмотр премии к индексу",
      "type": "операционное событие",
      "trigger": "Рынок",
      "severity": 1,
      "description": "Триггер: Рынок. Выберите один из вариантов решения.",
      "choices": [
        "Доход -1 млн",
        "Хедж игнорирует",
        "Взять карту рынка вместо штрафа"
      ],
      "helps": "Хедж",
      "expectedPenalty": 1,
      "effect": "Доход -1 млн / Хедж игнорирует / Взять карту рынка вместо штрафа",
      "balanceNote": "Хедж имеет смысл"
    },
    {
      "id": "E-30",
      "title": "Поставщик дает встречную скидку",
      "type": "операционное событие",
      "trigger": "Поставщик",
      "severity": 1,
      "description": "Триггер: Поставщик. Выберите один из вариантов решения.",
      "choices": [
        "Скидка 1 млн",
        "1 ресурс по базовой цене",
        "+1 Влияние вместо скидки"
      ],
      "helps": "Поставщик II+",
      "expectedPenalty": -1,
      "effect": "Скидка 1 млн / 1 ресурс по базовой цене / +1 Влияние вместо скидки",
      "balanceNote": "Позитивное событие"
    },
    {
      "id": "E-31",
      "title": "Клиент подтверждает объем",
      "type": "операционное событие",
      "trigger": "Клиент",
      "severity": 1,
      "description": "Триггер: Клиент. Выберите один из вариантов решения.",
      "choices": [
        "Доход +1 млн",
        "+1 Репутация вместо денег",
        "Карта ПРОЛЕУМ, если риск был 0"
      ],
      "helps": "Репутация 5+",
      "expectedPenalty": -1,
      "effect": "Доход +1 млн / +1 Репутация вместо денег / Карта ПРОЛЕУМ, если риск был 0",
      "balanceNote": "Позитив для колоды"
    },
    {
      "id": "E-32",
      "title": "Свободное окно ЖД",
      "type": "операционное событие",
      "trigger": "ЖД",
      "severity": 1,
      "description": "Триггер: ЖД. Выберите один из вариантов решения.",
      "choices": [
        "ЖД -1 млн",
        "Риск ЖД -1",
        "Резерв ЖД до следующего хода"
      ],
      "helps": "ЖД-узел",
      "expectedPenalty": -1,
      "effect": "ЖД -1 млн / Риск ЖД -1 / Резерв ЖД до следующего хода",
      "balanceNote": "Позитивная логистика"
    },
    {
      "id": "E-33",
      "title": "Нефтебаза подтверждает слот",
      "type": "операционное событие",
      "trigger": "Нефтебаза",
      "severity": 1,
      "description": "Триггер: Нефтебаза. Выберите один из вариантов решения.",
      "choices": [
        "Перевалка бесплатно",
        "Риск -1",
        "+1 склад до конца дня"
      ],
      "helps": "Нефтебаза",
      "expectedPenalty": -1,
      "effect": "Перевалка бесплатно / Риск -1 / +1 склад до конца дня",
      "balanceNote": "Позитивная нефтебаза"
    },
    {
      "id": "E-34",
      "title": "Сервисная команда нашла решение",
      "type": "операционное событие",
      "trigger": "Любая",
      "severity": 1,
      "description": "Триггер: Любая. Выберите один из вариантов решения.",
      "choices": [
        "Отменить штраф до 2 млн",
        "Продлить за 1 млн",
        "Взять ПРОЛЕУМ и сбросить событие"
      ],
      "helps": "ПРОЛЕУМ-карта",
      "expectedPenalty": 0,
      "effect": "Отменить штраф до 2 млн / Продлить за 1 млн / Взять ПРОЛЕУМ и сбросить событие",
      "balanceNote": "Сервисная развилка"
    },
    {
      "id": "E-35",
      "title": "Репутация сыграла роль",
      "type": "операционное событие",
      "trigger": "Клиент",
      "severity": 1,
      "description": "Триггер: Клиент. Выберите один из вариантов решения.",
      "choices": [
        "Если Репутация 5+, игнорируйте; иначе 1 млн",
        "Потратить 1 Репутацию",
        "Доход -1 млн"
      ],
      "helps": "Репутация 5+",
      "expectedPenalty": 0,
      "effect": "Если Репутация 5+, игнорируйте; иначе 1 млн / Потратить 1 Репутацию / Доход -1 млн",
      "balanceNote": "Шкала имеет ценность"
    },
    {
      "id": "E-36",
      "title": "Операционная дисциплина",
      "type": "операционное событие",
      "trigger": "Любая",
      "severity": 1,
      "description": "Триггер: Любая. Выберите один из вариантов решения.",
      "choices": [
        "Если Эффективность 5+, +1 млн; иначе без эффекта",
        "Риск следующей сделки -1",
        "+1 Эффективность вместо бонуса"
      ],
      "helps": "Эффективность 5+",
      "expectedPenalty": 0,
      "effect": "Если Эффективность 5+, +1 млн; иначе без эффекта / Риск следующей сделки -1 / +1 Эффективность вместо бонуса",
      "balanceNote": "Позитив и развитие"
    }
  ],
  "proleumCards": [
    {
      "id": "P-01",
      "title": "Альтернативный базис найден",
      "type": "ПРОЛЕУМ",
      "description": "При закрытии контракта",
      "effect": "Снизьте риск сделки на 1 ИЛИ уменьшите стоимость логистики на 2 млн.",
      "limit": "Не более 1 карты ПРОЛЕУМ на контракт.",
      "balanceNote": "Выбор риск/деньги."
    },
    {
      "id": "P-02",
      "title": "Сервис спас маржу",
      "type": "ПРОЛЕУМ",
      "description": "После операционного события",
      "effect": "Отмените денежный штраф до 3 млн, но не отменяйте событие полностью.",
      "limit": "Не отменяет потерю срока/репутации.",
      "balanceNote": "Сильная, но не абсолютная."
    },
    {
      "id": "P-03",
      "title": "Клиент принял задержку",
      "type": "ПРОЛЕУМ",
      "description": "Когда срок стал 0",
      "effect": "Продлите контракт на 1 ход бесплатно и без потери Репутации.",
      "limit": "Не работает на тендеры.",
      "balanceNote": "Спасение срока."
    },
    {
      "id": "P-04",
      "title": "Окно в логистике",
      "type": "ПРОЛЕУМ",
      "description": "При закрытии через ЖД/нефтебазу",
      "effect": "Используйте нужную мощность даже если жетоны закончились. Доплатите 1 млн.",
      "limit": "Не создает жетон для рынка.",
      "balanceNote": "Аварийный выход."
    },
    {
      "id": "P-05",
      "title": "Команда удержала клиента",
      "type": "ПРОЛЕУМ",
      "description": "При срыве контракта",
      "effect": "Не теряйте Репутацию. Денежный штраф оплачивается.",
      "limit": "1 раз на контракт.",
      "balanceNote": "Срыв не становится выгодой."
    },
    {
      "id": "P-06",
      "title": "Сделка с колес",
      "type": "ПРОЛЕУМ",
      "description": "После взятия малого контракта",
      "effect": "Можно закрыть малый контракт в тот же ход, если ресурс был на складе. Доход -2 млн.",
      "limit": "Только малый контракт.",
      "balanceNote": "Темп вместо маржи."
    },
    {
      "id": "P-07",
      "title": "Документы закрыты",
      "type": "ПРОЛЕУМ",
      "description": "При событии документов",
      "effect": "Игнорируйте штраф/задержку по документальному событию до 2 млн или 1 хода.",
      "limit": "Не отменяет рыночные события.",
      "balanceNote": "Узкая защита."
    },
    {
      "id": "P-08",
      "title": "Резервный поставщик",
      "type": "ПРОЛЕУМ",
      "description": "При закупке ресурса",
      "effect": "Купите 1 дополнительный ресурс любого типа по текущей цене +1 млн.",
      "limit": "Не больше +1 сверх лимита действия.",
      "balanceNote": "Не ломает лимит закупки."
    },
    {
      "id": "P-09",
      "title": "Переговоры на уровне собственника",
      "type": "ПРОЛЕУМ",
      "description": "Перед выбором контракта",
      "effect": "Выберите 1 из 3 верхних контрактов нужной категории вместо 1 из 2.",
      "limit": "Не работает на тендеры.",
      "balanceNote": "Улучшает выбор."
    },
    {
      "id": "P-10",
      "title": "Экспресс-анализ риска",
      "type": "ПРОЛЕУМ",
      "description": "Перед проверкой риска",
      "effect": "Снизьте итоговый риск на 1. Если риск уже 0, получите +1 млн дохода.",
      "limit": "Не суммируется с другой картой риска.",
      "balanceNote": "Малый бонус при низком риске."
    },
    {
      "id": "P-11",
      "title": "Коммерческий компромисс",
      "type": "ПРОЛЕУМ",
      "description": "При закрытии контракта",
      "effect": "Доход -2 млн, но не проходите проверку риска, если итоговый риск был 1.",
      "limit": "Не работает при риске 2+.",
      "balanceNote": "Безопасность за цену."
    },
    {
      "id": "P-12",
      "title": "Клиентский приоритет",
      "type": "ПРОЛЕУМ",
      "description": "При взятии контракта",
      "effect": "Можно взять контракт с требованием Репутации на 1 выше вашей.",
      "limit": "После выполнения не получаете бонус Репутации по карте.",
      "balanceNote": "Доступ без двойной выгоды."
    },
    {
      "id": "P-13",
      "title": "Слот подтвержден",
      "type": "ПРОЛЕУМ",
      "description": "При ЖД-поставке",
      "effect": "Стоимость ЖД -1 млн и риск ЖД не добавляется.",
      "limit": "Только один маршрут.",
      "balanceNote": "Умеренная логистика."
    },
    {
      "id": "P-14",
      "title": "Нефтебаза нашла окно",
      "type": "ПРОЛЕУМ",
      "description": "При поставке через нефтебазу",
      "effect": "Перевалка бесплатно; если мощность закончилась, доплатите 1 млн и используйте внешнюю.",
      "limit": "Только ЖД+нефтебаза.",
      "balanceNote": "Нишевая карта."
    },
    {
      "id": "P-15",
      "title": "Сильная позиция на переговорах",
      "type": "ПРОЛЕУМ",
      "description": "Во время сделки с игроком",
      "effect": "+1 млн к продаже ресурса или -1 млн за доступ к чужому активу.",
      "limit": "Минимальная цена сделки 1 млн.",
      "balanceNote": "Поддерживает взаимодействие."
    },
    {
      "id": "P-16",
      "title": "Премия за надежность",
      "type": "ПРОЛЕУМ",
      "description": "После закрытия без события",
      "effect": "Получите +1 Репутацию вместо денежного бонуса +1 млн.",
      "limit": "Только без события.",
      "balanceNote": "Развитие вместо денег."
    },
    {
      "id": "P-17",
      "title": "Операционный штаб",
      "type": "ПРОЛЕУМ",
      "description": "После события",
      "effect": "Выберите второй вариант события, если первый невозможен, и снизьте его денежную стоимость на 1 млн.",
      "limit": "Не ниже 0.",
      "balanceNote": "Сглаживает жесткие ситуации."
    },
    {
      "id": "P-18",
      "title": "Сервисный коридор",
      "type": "ПРОЛЕУМ",
      "description": "В начале хода",
      "effect": "До конца хода одна поставка получает -1 риск и -1 млн логистики.",
      "limit": "Только если есть активный контракт.",
      "balanceNote": "Универсальный буст."
    },
    {
      "id": "P-19",
      "title": "Проверенный маршрут",
      "type": "ПРОЛЕУМ",
      "description": "При закрытии контракта",
      "effect": "Если используете ЖД, риск маршрута +0 вместо +1.",
      "limit": "Не влияет на базовый риск контракта.",
      "balanceNote": "Чистая логистика."
    },
    {
      "id": "P-20",
      "title": "Брокерское сопровождение ПРОЛЕУМ",
      "type": "ПРОЛЕУМ",
      "description": "При брокерке",
      "effect": "Брокерская комиссия +1 млн и сохраните +1 бонус шкалы по контракту.",
      "limit": "Не работает на бонус +2.",
      "balanceNote": "Брокерка как стратегия."
    },
    {
      "id": "P-21",
      "title": "Кредит доверия клиента",
      "type": "ПРОЛЕУМ",
      "description": "Когда не хватает 1 ресурса",
      "effect": "Можно закрыть контракт без 1 ресурса, но доход -3 млн.",
      "limit": "Только малый/средний контракт.",
      "balanceNote": "Спасает тупик ценой маржи."
    },
    {
      "id": "P-22",
      "title": "Складская оптимизация",
      "type": "ПРОЛЕУМ",
      "description": "При переносе ресурсов",
      "effect": "Переместите до 2 ресурсов между складом и контрактами без коммерческого действия.",
      "limit": "Не меняет требования контракта.",
      "balanceNote": "Убирает микроменеджмент."
    },
    {
      "id": "P-23",
      "title": "Рыночный инсайт",
      "type": "ПРОЛЕУМ",
      "description": "Перед открытием карты рынка",
      "effect": "Посмотрите верхнюю карту рынка. Оставьте сверху или положите вниз.",
      "limit": "1 раз в торговый день.",
      "balanceNote": "Контроль без денег."
    },
    {
      "id": "P-24",
      "title": "Защита маржи",
      "type": "ПРОЛЕУМ",
      "description": "При покупке ресурса",
      "effect": "Игнорируйте +1 к цене одного типа ресурса по карте рынка для 2 жетонов.",
      "limit": "Не снижает цену ниже базовой.",
      "balanceNote": "Малый hedge-эффект."
    },
    {
      "id": "P-25",
      "title": "Альтернативный покупатель",
      "type": "ПРОЛЕУМ",
      "description": "При угрозе срыва",
      "effect": "Вместо срыва переведите контракт в брокерку с комиссией -1 млн от указанной.",
      "limit": "Бонус не выдается.",
      "balanceNote": "Спасение без выигрыша."
    },
    {
      "id": "P-26",
      "title": "Фокус на крупного клиента",
      "type": "ПРОЛЕУМ",
      "description": "При взятии крупного контракта",
      "effect": "Срок крупного контракта +1 ход, но доход -1 млн.",
      "limit": "Только при взятии.",
      "balanceNote": "Темп за цену."
    },
    {
      "id": "P-27",
      "title": "Команда закрыла претензию",
      "type": "ПРОЛЕУМ",
      "description": "При попадании в претензионный блок",
      "effect": "Заплатите 1 млн вместо эффекта клетки или возьмите событие и выберите лучший вариант.",
      "limit": "Не отменяет уже активное событие.",
      "balanceNote": "Смягчает штрафные поля."
    },
    {
      "id": "P-28",
      "title": "Приоритетное окно поставки",
      "type": "ПРОЛЕУМ",
      "description": "В начале хода",
      "effect": "Зарезервируйте 1 ЖД-мощность до конца хода.",
      "limit": "Если не использовали, жетон возвращается.",
      "balanceNote": "Без блокировки рынка."
    },
    {
      "id": "P-29",
      "title": "Коммерческий пакет",
      "type": "ПРОЛЕУМ",
      "description": "После закрытия среднего контракта",
      "effect": "Получите +1 млн или +1 Влияние.",
      "limit": "Только средний контракт.",
      "balanceNote": "Средняя карта без перекоса."
    },
    {
      "id": "P-30",
      "title": "Премиальный сервис",
      "type": "ПРОЛЕУМ",
      "description": "После закрытия крупного контракта",
      "effect": "Если не было события, получите 1 карту ПРОЛЕУМ или +1 к любой шкале.",
      "limit": "Не дает денег.",
      "balanceNote": "Награда за чистую крупную сделку."
    }
  ],
  "assets": [
    {
      "id": "A-01",
      "title": "Поставщик REG",
      "type": "Поставщик REG",
      "cells": "11 Газпром нефть",
      "cost": 8,
      "levels": {
        "I": {
          "cost": 8,
          "effect": "1 REG со скидкой 1 млн раз в день"
        },
        "II": {
          "cost": 12,
          "effect": "+1 REG сверх лимита закупки"
        },
        "III": {
          "cost": 16,
          "effect": "Раз в день риск сделки с REG -1"
        }
      },
      "description": "1 REG со скидкой 1 млн раз в день",
      "effect": "I: 1 REG со скидкой 1 млн раз в день; II: +1 REG сверх лимита закупки; III: Раз в день риск сделки с REG -1",
      "commission": "1 млн при покупке через клетку",
      "balanceLimit": "Цена не ниже 1 млн"
    },
    {
      "id": "A-02",
      "title": "Поставщик PRM",
      "type": "Поставщик PRM",
      "cells": "13 Роснефть",
      "cost": 8,
      "levels": {
        "I": {
          "cost": 8,
          "effect": "1 PRM со скидкой 1 млн раз в день"
        },
        "II": {
          "cost": 12,
          "effect": "+1 PRM сверх лимита"
        },
        "III": {
          "cost": 16,
          "effect": "Раз в день игнор +1 к цене PRM"
        }
      },
      "description": "1 PRM со скидкой 1 млн раз в день",
      "effect": "I: 1 PRM со скидкой 1 млн раз в день; II: +1 PRM сверх лимита; III: Раз в день игнор +1 к цене PRM",
      "commission": "1 млн",
      "balanceLimit": "Не суммировать с хеджем"
    },
    {
      "id": "A-03",
      "title": "Поставщик DTL",
      "type": "Поставщик DTL",
      "cells": "14 ЛУКОЙЛ",
      "cost": 8,
      "levels": {
        "I": {
          "cost": 8,
          "effect": "1 DTL со скидкой 1 млн раз в день"
        },
        "II": {
          "cost": 12,
          "effect": "+1 DTL сверх лимита"
        },
        "III": {
          "cost": 16,
          "effect": "Раз в день игнор дефицита DTL на 1 жетон"
        }
      },
      "description": "1 DTL со скидкой 1 млн раз в день",
      "effect": "I: 1 DTL со скидкой 1 млн раз в день; II: +1 DTL сверх лимита; III: Раз в день игнор дефицита DTL на 1 жетон",
      "commission": "1 млн",
      "balanceLimit": "Не создает бесконечный объем"
    },
    {
      "id": "A-04",
      "title": "Автомаршрут",
      "type": "Автомаршрут",
      "cells": "5 Автомаршрут",
      "cost": 7,
      "levels": {
        "I": {
          "cost": 7,
          "effect": "Авто -1 млн раз в день"
        },
        "II": {
          "cost": 10,
          "effect": "Малый авто-контракт +1 срок бесплатно раз в день"
        },
        "III": {
          "cost": 14,
          "effect": "Малый авто без события +1 млн"
        }
      },
      "description": "Авто -1 млн раз в день",
      "effect": "I: Авто -1 млн раз в день; II: Малый авто-контракт +1 срок бесплатно раз в день; III: Малый авто без события +1 млн",
      "commission": "1 млн при использовании",
      "balanceLimit": "Только малые/авто"
    },
    {
      "id": "A-05",
      "title": "ЖД-узел отправления",
      "type": "ЖД-узел отправления",
      "cells": "12",
      "cost": 10,
      "levels": {
        "I": {
          "cost": 10,
          "effect": "ЖД -1 млн раз в день"
        },
        "II": {
          "cost": 14,
          "effect": "Резерв 1 ЖД до конца хода"
        },
        "III": {
          "cost": 18,
          "effect": "Риск ЖД -1 раз в день"
        }
      },
      "description": "ЖД -1 млн раз в день",
      "effect": "I: ЖД -1 млн раз в день; II: Резерв 1 ЖД до конца хода; III: Риск ЖД -1 раз в день",
      "commission": "1 млн I-II, 2 млн III",
      "balanceLimit": "Не запрещает доступ"
    },
    {
      "id": "A-06",
      "title": "ЖД-узел маршрутное окно",
      "type": "ЖД-узел маршрутное окно",
      "cells": "15",
      "cost": 10,
      "levels": {
        "I": {
          "cost": 10,
          "effect": "ЖД -1 млн раз в день"
        },
        "II": {
          "cost": 14,
          "effect": "Срочная ЖД +1 вместо +2"
        },
        "III": {
          "cost": 18,
          "effect": "Внешнее ЖД-окно за +1 млн"
        }
      },
      "description": "ЖД -1 млн раз в день",
      "effect": "I: ЖД -1 млн раз в день; II: Срочная ЖД +1 вместо +2; III: Внешнее ЖД-окно за +1 млн",
      "commission": "1/2 млн",
      "balanceLimit": "Внешнее окно не забирает жетон"
    },
    {
      "id": "A-07",
      "title": "ЖД-узел назначения",
      "type": "ЖД-узел назначения",
      "cells": "35",
      "cost": 10,
      "levels": {
        "I": {
          "cost": 10,
          "effect": "Риск ЖД -1 раз в день"
        },
        "II": {
          "cost": 14,
          "effect": "ЖД-событие: штраф -1 млн"
        },
        "III": {
          "cost": 18,
          "effect": "Отменить потерю срока по ЖД за 1 млн"
        }
      },
      "description": "Риск ЖД -1 раз в день",
      "effect": "I: Риск ЖД -1 раз в день; II: ЖД-событие: штраф -1 млн; III: Отменить потерю срока по ЖД за 1 млн",
      "commission": "1/2 млн",
      "balanceLimit": "Не отменяет репутацию"
    },
    {
      "id": "A-08",
      "title": "Нефтебаза Московский узел",
      "type": "Нефтебаза Московский узел",
      "cells": "16",
      "cost": 12,
      "levels": {
        "I": {
          "cost": 12,
          "effect": "Склад +2, перевалка -1 млн"
        },
        "II": {
          "cost": 16,
          "effect": "Склад +3, риск ЖД+база -1"
        },
        "III": {
          "cost": 21,
          "effect": "Добавляет +1 нефтебазовую мощность дня"
        }
      },
      "description": "Склад +2, перевалка -1 млн",
      "effect": "I: Склад +2, перевалка -1 млн; II: Склад +3, риск ЖД+база -1; III: Добавляет +1 нефтебазовую мощность дня",
      "commission": "1 млн",
      "balanceLimit": "Не больше +1 мощности от игрока"
    },
    {
      "id": "A-09",
      "title": "Нефтебаза Поволжье",
      "type": "Нефтебаза Поволжье",
      "cells": "18",
      "cost": 12,
      "levels": {
        "I": {
          "cost": 12,
          "effect": "Склад +2, перевалка -1 млн"
        },
        "II": {
          "cost": 16,
          "effect": "Склад +3, крупный контракт +1 срок при взятии"
        },
        "III": {
          "cost": 21,
          "effect": "+1 нефтебазовая мощность дня"
        }
      },
      "description": "Склад +2, перевалка -1 млн",
      "effect": "I: Склад +2, перевалка -1 млн; II: Склад +3, крупный контракт +1 срок при взятии; III: +1 нефтебазовая мощность дня",
      "commission": "1 млн",
      "balanceLimit": "Срок только при взятии"
    },
    {
      "id": "A-10",
      "title": "Клиентский сегмент АЗС",
      "type": "Клиентский сегмент АЗС",
      "cells": "4/24",
      "cost": 8,
      "levels": {
        "I": {
          "cost": 8,
          "effect": "АЗС контракт: выбрать 1 из 3"
        },
        "II": {
          "cost": 12,
          "effect": "АЗС контракт +1 млн раз в день"
        },
        "III": {
          "cost": 16,
          "effect": "Карта ПРОЛЕУМ после чистого АЗС"
        }
      },
      "description": "АЗС контракт: выбрать 1 из 3",
      "effect": "I: АЗС контракт: выбрать 1 из 3; II: АЗС контракт +1 млн раз в день; III: Карта ПРОЛЕУМ после чистого АЗС",
      "commission": "1 млн",
      "balanceLimit": "Бонус 1 раз в день"
    },
    {
      "id": "A-11",
      "title": "Клиентский сегмент Агро",
      "type": "Клиентский сегмент Агро",
      "cells": "23",
      "cost": 8,
      "levels": {
        "I": {
          "cost": 8,
          "effect": "Агро контракт: выбрать 1 из 3"
        },
        "II": {
          "cost": 12,
          "effect": "DTL контракт +1 млн раз в день"
        },
        "III": {
          "cost": 16,
          "effect": "Раз в день игнор -1 DTL объема"
        }
      },
      "description": "Агро контракт: выбрать 1 из 3",
      "effect": "I: Агро контракт: выбрать 1 из 3; II: DTL контракт +1 млн раз в день; III: Раз в день игнор -1 DTL объема",
      "commission": "1 млн",
      "balanceLimit": "Не создает ресурс"
    },
    {
      "id": "A-12",
      "title": "Клиентский сегмент Промышленность",
      "type": "Клиентский сегмент Промышленность",
      "cells": "21",
      "cost": 8,
      "levels": {
        "I": {
          "cost": 8,
          "effect": "Промышленный контракт: выбрать 1 из 3"
        },
        "II": {
          "cost": 12,
          "effect": "Промконтракт: +1 Эффективность вместо денег"
        },
        "III": {
          "cost": 16,
          "effect": "Риск промышленной сделки -1 раз в день"
        }
      },
      "description": "Промышленный контракт: выбрать 1 из 3",
      "effect": "I: Промышленный контракт: выбрать 1 из 3; II: Промконтракт: +1 Эффективность вместо денег; III: Риск промышленной сделки -1 раз в день",
      "commission": "1 млн",
      "balanceLimit": "Только категория"
    },
    {
      "id": "A-13",
      "title": "Клиентский сегмент Автопарк",
      "type": "Клиентский сегмент Автопарк",
      "cells": "36",
      "cost": 8,
      "levels": {
        "I": {
          "cost": 8,
          "effect": "Автопарк: выбрать 1 из 3"
        },
        "II": {
          "cost": 12,
          "effect": "Автопарк +1 млн раз в день"
        },
        "III": {
          "cost": 16,
          "effect": "Малый автопарк можно закрыть в ход взятия с доходом -2"
        }
      },
      "description": "Автопарк: выбрать 1 из 3",
      "effect": "I: Автопарк: выбрать 1 из 3; II: Автопарк +1 млн раз в день; III: Малый автопарк можно закрыть в ход взятия с доходом -2",
      "commission": "1 млн",
      "balanceLimit": "Не работает с крупными"
    },
    {
      "id": "A-14",
      "title": "Брокерский контур",
      "type": "Брокерский контур",
      "cells": "31/32/34",
      "cost": 9,
      "levels": {
        "I": {
          "cost": 9,
          "effect": "Брокерская комиссия +1 млн"
        },
        "II": {
          "cost": 13,
          "effect": "Чужая брокерка через вас: +1 млн"
        },
        "III": {
          "cost": 17,
          "effect": "Брокерка сохраняет +1 бонус шкалы раз в день"
        }
      },
      "description": "Брокерская комиссия +1 млн",
      "effect": "I: Брокерская комиссия +1 млн; II: Чужая брокерка через вас: +1 млн; III: Брокерка сохраняет +1 бонус шкалы раз в день",
      "commission": "1 млн",
      "balanceLimit": "Не сохраняет бонус +2"
    }
  ],
  "components": [
    {
      "id": "component-01",
      "title": "Игровое поле",
      "type": 1,
      "description": "40 клеток",
      "effect": "40×40 или 47×47 см"
    },
    {
      "id": "component-02",
      "title": "Планшет рынка",
      "type": 1,
      "description": "Цены, объемы, контракты, тендеры, логистика",
      "effect": "Центр экономики"
    },
    {
      "id": "component-03",
      "title": "Планшеты игроков",
      "type": 6,
      "description": "Склад, контракты, активы, шкалы",
      "effect": "Лучше с углублениями"
    },
    {
      "id": "component-04",
      "title": "Фишки игроков",
      "type": 6,
      "description": "Положение на поле",
      "effect": "Без детской пластмассы"
    },
    {
      "id": "component-05",
      "title": "Кубики D6",
      "type": 2,
      "description": "Движение и риск",
      "effect": "Отдельный кубик риска не нужен"
    },
    {
      "id": "component-06",
      "title": "Деньги / chips",
      "type": "набор",
      "description": "Расчеты",
      "effect": "Чипы ускоряют игру"
    },
    {
      "id": "component-07",
      "title": "REG жетоны",
      "type": 40,
      "description": "Ресурс",
      "effect": "Отдельная иконка"
    },
    {
      "id": "component-08",
      "title": "PRM жетоны",
      "type": 40,
      "description": "Ресурс",
      "effect": "Премиальный ресурс"
    },
    {
      "id": "component-09",
      "title": "DTL жетоны",
      "type": 40,
      "description": "Ресурс",
      "effect": "Дизель"
    },
    {
      "id": "component-10",
      "title": "Фишки срока",
      "type": 36,
      "description": "Сроки контрактов",
      "effect": "Читаемые цифры"
    },
    {
      "id": "component-11",
      "title": "ЖД-мощность",
      "type": 10,
      "description": "Общая логистика дня",
      "effect": "Планшет рынка"
    },
    {
      "id": "component-12",
      "title": "Нефтебазовая мощность",
      "type": 6,
      "description": "Мощность перевалки",
      "effect": "Планшет рынка"
    },
    {
      "id": "component-13",
      "title": "Карты контрактов",
      "type": 78,
      "description": "Основная колода",
      "effect": "Разделить по размерам"
    },
    {
      "id": "component-14",
      "title": "Карты тендеров",
      "type": 18,
      "description": "Конкурентные сделки",
      "effect": "Отдельная ниша"
    },
    {
      "id": "component-15",
      "title": "Карты рынка",
      "type": 30,
      "description": "Динамика рынка",
      "effect": "1 карта на торговый день"
    },
    {
      "id": "component-16",
      "title": "Операционные события",
      "type": 36,
      "description": "Риски",
      "effect": "Каждая с выбором"
    },
    {
      "id": "component-17",
      "title": "Карты ПРОЛЕУМ",
      "type": 30,
      "description": "Экспертные решения",
      "effect": "Лимит руки 3"
    },
    {
      "id": "component-18",
      "title": "Карты активов",
      "type": 14,
      "description": "Собственность",
      "effect": "Уровни I–III"
    },
    {
      "id": "component-19",
      "title": "Маркер ведущего рынка",
      "type": 1,
      "description": "Обновление дня",
      "effect": "Передается по кругу"
    },
    {
      "id": "component-20",
      "title": "Маркеры шкал",
      "type": 18,
      "description": "Репутация/Эффективность/Влияние",
      "effect": "3 шкалы × 6 игроков"
    },
    {
      "id": "component-21",
      "title": "Маркеры «Продлено»",
      "type": 12,
      "description": "Контракт продлен 1 раз",
      "effect": "Защита от повторного продления"
    },
    {
      "id": "component-22",
      "title": "Памятки игроков",
      "type": 6,
      "description": "Ход, риск, логистика, scoring",
      "effect": "Ускоряют обучение"
    }
  ]
};
