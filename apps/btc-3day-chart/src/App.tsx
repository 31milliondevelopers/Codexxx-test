import { useEffect, useState } from 'react';
import CandlesChart from './components/CandlesChart';
import { fetchDailyBtcUsdCandles } from './services/coinbase';
import type { DailyCandle } from './types';
import { aggregateToThreeDayCandles } from './utils/aggregateToThreeDay';

const START_DATE = '2017-11-01T00:00:00.000Z';

const App = () => {
  const [candles, setCandles] = useState<DailyCandle[]>([]);

  useEffect(() => {
    let canceled = false;

    const load = async () => {
      const daily = await fetchDailyBtcUsdCandles(START_DATE);
      const threeDay = aggregateToThreeDayCandles(daily);

      if (!canceled) {
        setCandles(threeDay);
      }
    };

    load().catch((error) => {
      console.error('Failed to load BTC candles', error);
      if (!canceled) {
        setCandles([]);
      }
    });

    return () => {
      canceled = true;
    };
  }, []);

  return (
    <main className="app-shell">
      <CandlesChart data={candles} />
    </main>
  );
};

export default App;
