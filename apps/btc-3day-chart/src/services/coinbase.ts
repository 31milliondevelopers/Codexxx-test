import type { UTCTimestamp } from 'lightweight-charts';
import type { CoinbaseCandle, DailyCandle } from '../types';

const COINBASE_API_BASE = 'https://api.exchange.coinbase.com';
const PRODUCT_ID = 'BTC-USD';
const DAY_IN_SECONDS = 86_400;
const MAX_CANDLES_PER_REQUEST = 300;
const MAX_RETRIES = 2;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const toIsoString = (timestampSec: number) => new Date(timestampSec * 1000).toISOString();

const chunkRanges = (startSec: number, endSec: number): Array<{ start: number; end: number }> => {
  const ranges: Array<{ start: number; end: number }> = [];
  const chunkSizeSec = MAX_CANDLES_PER_REQUEST * DAY_IN_SECONDS;

  let cursor = startSec;
  while (cursor < endSec) {
    const chunkEnd = Math.min(cursor + chunkSizeSec, endSec);
    ranges.push({ start: cursor, end: chunkEnd });
    cursor = chunkEnd;
  }

  return ranges;
};

const fetchChunk = async (startSec: number, endSec: number): Promise<CoinbaseCandle[]> => {
  const url = new URL(`${COINBASE_API_BASE}/products/${PRODUCT_ID}/candles`);
  url.searchParams.set('granularity', String(DAY_IN_SECONDS));
  url.searchParams.set('start', toIsoString(startSec));
  url.searchParams.set('end', toIsoString(endSec));

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Coinbase request failed: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as CoinbaseCandle[];
      if (!Array.isArray(data)) {
        throw new Error('Unexpected Coinbase response format');
      }

      return data;
    } catch (error) {
      if (attempt >= MAX_RETRIES) {
        console.warn('Failed candle chunk', {
          start: toIsoString(startSec),
          end: toIsoString(endSec),
          error,
        });
        return [];
      }
      await wait(500 * (attempt + 1));
    }
  }

  return [];
};

export const fetchDailyBtcUsdCandles = async (startDateIso: string): Promise<DailyCandle[]> => {
  const startSec = Math.floor(new Date(startDateIso).getTime() / 1000);
  const endSec = Math.floor(Date.now() / 1000);

  const ranges = chunkRanges(startSec, endSec);
  const allCandlesRaw: CoinbaseCandle[] = [];

  for (const range of ranges) {
    const chunk = await fetchChunk(range.start, range.end);
    allCandlesRaw.push(...chunk);
    await wait(120);
  }

  const uniqueByTime = new Map<number, DailyCandle>();

  for (const [time, low, high, open, close] of allCandlesRaw) {
    if (time < startSec || time > endSec) {
      continue;
    }

    uniqueByTime.set(time, {
      time: time as UTCTimestamp,
      open,
      high,
      low,
      close,
    });
  }

  return Array.from(uniqueByTime.values()).sort((a, b) => a.time - b.time);
};
