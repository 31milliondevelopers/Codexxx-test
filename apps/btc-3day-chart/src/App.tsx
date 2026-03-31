import { useEffect, useMemo, useState } from 'react';
import CandlesChart from './components/CandlesChart';
import { fetchDailyBtcUsdCandles } from './services/coinbase';
import type { DailyCandle } from './types';
import { aggregateToThreeDayCandles } from './utils/aggregateToThreeDay';

const DATA_START_DATE = '2017-11-01T00:00:00.000Z';
const START_OPTIONS = ['2017-11-01', '2017-11-02', '2017-11-03'] as const;
type StartOption = (typeof START_OPTIONS)[number];

const App = () => {
  const [dailyCandles, setDailyCandles] = useState<DailyCandle[]>([]);
  const [selectedStart, setSelectedStart] = useState<StartOption>('2017-11-01');

  useEffect(() => {
    let canceled = false;

    const load = async () => {
      const daily = await fetchDailyBtcUsdCandles(DATA_START_DATE);

      if (!canceled) {
        setDailyCandles(daily);
      }
    };

    load().catch((error) => {
      console.error('Failed to load BTC candles', error);
      if (!canceled) {
        setDailyCandles([]);
      }
    });

    return () => {
      canceled = true;
    };
  }, []);

  const candles = useMemo(
    () => aggregateToThreeDayCandles(dailyCandles, `${selectedStart}T00:00:00.000Z`),
    [dailyCandles, selectedStart],
  );

  return (
    <main className="app-shell">
      <div className="start-switcher" aria-label="3-day grouping start date selector">
        {START_OPTIONS.map((start, index) => (
          <button
            key={start}
            type="button"
            className={`start-switcher-btn${selectedStart === start ? ' is-active' : ''}`}
            onClick={() => setSelectedStart(start)}
            aria-pressed={selectedStart === start}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <CandlesChart data={candles} />
    </main>
  );
};

export default App;
