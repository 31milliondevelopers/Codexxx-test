import type { DailyCandle } from '../types';

export const aggregateToThreeDayCandles = (
  dailyCandles: DailyCandle[],
  startDateIso: string,
): DailyCandle[] => {
  const startTimestamp = Math.floor(new Date(startDateIso).getTime() / 1000);
  const alignedCandles = dailyCandles.filter((candle) => candle.time >= startTimestamp);
  const result: DailyCandle[] = [];

  for (let i = 0; i + 2 < alignedCandles.length; i += 3) {
    const group = alignedCandles.slice(i, i + 3);

    const aggregated: DailyCandle = {
      time: group[0].time,
      open: group[0].open,
      high: Math.max(group[0].high, group[1].high, group[2].high),
      low: Math.min(group[0].low, group[1].low, group[2].low),
      close: group[2].close,
    };

    result.push(aggregated);
  }

  return result;
};
