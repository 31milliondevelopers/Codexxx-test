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
- При каждом открытии страницы заново запрашивает свежие данные с Coinbase.

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

## Публикация (рекомендуется: Vercel)

Проект уже подготовлен для Vercel через `vercel.json`.

Минимальные шаги, чтобы получить постоянную ссылку:

1. Запушить ветку с папкой `apps/btc-3day-chart` в ваш приватный GitHub-репозиторий.
2. Войти в [vercel.com](https://vercel.com) и выбрать **Add New Project**.
3. Импортировать этот GitHub-репозиторий.
4. В настройках проекта указать **Root Directory** = `apps/btc-3day-chart`.
5. Нажать **Deploy**.

После этого Vercel выдаст постоянный URL вида:

- `https://<project-name>.vercel.app`

И будет автоматически пересобирать сайт при новых коммитах в репозиторий.

## Структура

- `src/services/coinbase.ts` — загрузка исторических дневных свечей с Coinbase чанками и с повторами.
- `src/utils/aggregateToThreeDay.ts` — агрегация дневных свечей в 3-дневные.
- `src/components/CandlesChart.tsx` — рендер графика через `lightweight-charts`.
