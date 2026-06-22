# PROLEUM Monopoly: схема БД

Сейчас Supabase используется как общий слой хранения комнат. Это сознательно простой вариант для быстрого тестирования правил и карточек. Игровое состояние лежит JSON-объектом в `game_rooms.state`, а не размазано по десяткам таблиц.

## Текущая live-схема Supabase

```sql
create table public.game_rooms (
  id text primary key,
  name text,
  state jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.game_events (
  id bigserial primary key,
  room_id text references public.game_rooms(id) on delete cascade,
  actor_name text,
  event_type text not null,
  payload jsonb default '{}',
  created_at timestamptz default now()
);
```

RLS включен. Для прототипа открыты политики на чтение/создание/обновление комнат публичным ключом. Перед реальным VIP-тестом нужно заменить это на авторизацию через Supabase Auth и права по участникам комнаты.

## JSON-состояние комнаты

```json
{
  "id": "room-xxxx",
  "name": "Тестовая партия PROLEUM",
  "config": { "version": "balance-v1" },
  "mode": "Standard",
  "maxDays": 6,
  "status": "active",
  "revision": 14,
  "updatedAt": "2026-06-22T00:00:00.000Z",
  "day": 1,
  "currentTurn": 0,
  "turnStartedAt": "2026-06-22T00:00:00.000Z",
  "turnDeadline": "2026-06-22T00:01:00.000Z",
  "contractMarketIds": ["C-001", "C-002", "C-003", "C-004"],
  "contractDeckCursor": 4,
  "tenderMarketIds": ["T-01"],
  "tenderDeckCursor": 1,
  "marketCardIndex": 0,
  "market": {
    "day": 1,
    "cardId": "market-dtl-season",
    "prices": { "REG": 3, "PRM": 4, "DTL": 5 },
    "stock": { "REG": 4, "PRM": 3, "DTL": 3 },
    "logistics": { "rail": 3, "depot": 1 },
    "usedLogistics": { "rail": 0, "depot": 0 }
  },
  "turnState": {
    "rolled": false,
    "promptDismissed": false,
    "commercialActionUsed": false,
    "cellActionUsed": false,
    "proleumPlayed": false,
    "negotiationUsed": false
  },
  "assetOwnership": {
    "cell-12": {
      "id": "asset-xxxx",
      "cellId": "cell-12",
      "title": "Нефтебаза Восток",
      "type": "depot",
      "cost": 12,
      "ownerId": "player-xxxx",
      "ownerName": "Игрок"
    }
  },
  "tradeOffers": [],
  "players": [],
  "log": []
}
```

Клиент увеличивает `revision` при каждом локальном игровом изменении. При синхронизации комната с большей ревизией побеждает; при равной ревизии используется `updatedAt`. Удаленные комнаты попадают в `deletedRoomIds`, чтобы устаревший серверный снимок не восстановил их на следующем polling-цикле.

## JSON-состояние игрока

```json
{
  "id": "player-xxxx",
  "name": "Игрок",
  "color": "#1f7a5a",
  "position": 0,
  "lap": 0,
  "assetPurchasedLap": -1,
  "money": 25,
  "reputation": 3,
  "efficiency": 3,
  "influence": 3,
  "warehouse": { "REG": 0, "PRM": 0, "DTL": 0 },
  "activeContracts": [],
  "completedContracts": [],
  "failedContracts": [],
  "brokeredContracts": [],
  "hedgeTokens": [],
  "assets": [],
  "proleumCards": []
}
```

`config.version` используется нормализацией клиента. Если сохраненная комната была создана на старом наборе правил, при загрузке она получает актуальный баланс `balance-v1` из `src/game-data.js`: 40 клеток, 78 контрактов, 18 тендеров, 30 карт рынка, 36 событий, 30 карт ПРОЛЕУМ и 14 активов.

## Следующая нормализация

Когда правила стабилизируются, лучше перейти на гибрид:

- `rooms`: метаданные комнаты;
- `room_players`: участники, роль, цвет, порядок хода;
- `room_snapshots`: периодические JSON-снимки для восстановления;
- `room_events`: append-only журнал действий;
- `cards`: редактируемые карточки админки;
- `board_cells`: редактируемые клетки поля;
- `room_assets`: владение активами в комнате;
- `room_contracts`: экземпляры контрактов и их статус.

Для тестирования карточек быстрее оставить JSON-состояние комнаты и append-only события. Для конкурентного мультиплеера надежнее будет серверный endpoint `POST /api/action`, который принимает действие, валидирует его на сервере и атомарно пишет новое состояние.
