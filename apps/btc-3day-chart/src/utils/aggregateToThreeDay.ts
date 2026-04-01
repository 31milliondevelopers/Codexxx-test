import type { DailyCandle } from '../types';

export const aggregateToThreeDayCandles = (
  dailyCandles: DailyCandle[],
  startDateIso: string,
): DailyCandle[] => {
  const startTimestamp = Math.floor(new Date(startDateIso).getTime() / 1000);
  const alignedCandles = dailyCandles.filter((candle) => candle.time >= startTimestamp);
  const result: DailyCandle[] = [];

  for (let i = 0; i < alignedCandles.length; i += 3) {
    const group = alignedCandles.slice(i, i + 3);
    if (group.length === 0) {
      continue;
    }

    const highs = group.map((candle) => candle.high);
    const lows = group.map((candle) => candle.low);
    const lastDay = group[group.length - 1];

    const aggregated: DailyCandle = {
      time: group[0].time,
      open: group[0].open,
      high: Math.max(...highs),
      low: Math.min(...lows),
      close: lastDay.close,
    };

    result.push(aggregated);
  }

  return result;
};
