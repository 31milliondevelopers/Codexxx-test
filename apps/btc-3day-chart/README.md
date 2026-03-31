# BTC/USD 3-Day Candlestick Chart

Минималистичное React + Vite приложение, которое показывает только свечной график BTC/USD.

## Что делает

- Загружает дневные свечи BTC/USD из Coinbase (`granularity=86400`) начиная с `2017-11-01` до текущего момента.
- Учитывает лимит API на количество свечей в одном запросе и загружает историю чанками.
- Агрегирует дневные свечи в 3-дневные по правилам:
  - `open` первого дня,
  - `high` максимум из группы,
  - `low` минимум из группы,
  - `close` третьего дня.
- Показывает только завершённые 3-дневные свечи.

## Установка

```bash
cd apps/btc-3day-chart
npm install
```

## Локальный запуск

```bash
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Структура

- `src/services/coinbase.ts` — загрузка исторических дневных свечей с Coinbase чанками и с повторами.
- `src/utils/aggregateToThreeDay.ts` — агрегация дневных свечей в 3-дневные.
- `src/components/CandlesChart.tsx` — рендер графика через `lightweight-charts`.
