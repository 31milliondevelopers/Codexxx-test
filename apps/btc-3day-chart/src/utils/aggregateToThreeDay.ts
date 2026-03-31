import type { DailyCandle } from '../types';

export const aggregateToThreeDayCandles = (dailyCandles: DailyCandle[]): DailyCandle[] => {
  const result: DailyCandle[] = [];

  for (let i = 0; i + 2 < dailyCandles.length; i += 3) {
    const group = dailyCandles.slice(i, i + 3);

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
