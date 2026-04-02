import { useEffect, useRef } from 'react';
import { CandlestickSeries, ColorType, createChart, type CandlestickData, type IChartApi, type UTCTimestamp } from 'lightweight-charts';
import type { DailyCandle } from '../types';

type Props = {
  data: DailyCandle[];
};

const CandlesChart = ({ data }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0f1115' },
        textColor: '#c6c8cd',
      },
      grid: {
        vertLines: { color: '#1f232b' },
        horzLines: { color: '#1f232b' },
      },
      rightPriceScale: {
        borderColor: '#2f3340',
      },
      timeScale: {
        borderColor: '#2f3340',
        timeVisible: true,
      },
      crosshair: {
        vertLine: { color: '#6b7280', labelBackgroundColor: '#374151' },
        horzLine: { color: '#6b7280', labelBackgroundColor: '#374151' },
      },
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      priceLineVisible: false,
      lastValueVisible: true,
    });

    series.setData(data as CandlestickData<UTCTimestamp>[]);
    chart.timeScale().fitContent();

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || !chartRef.current) {
        return;
      }

      const { width, height } = entry.contentRect;
      chartRef.current.applyOptions({ width, height });
    });

    resizeObserver.observe(containerRef.current);
    chartRef.current = chart;

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [data]);

  return <div ref={containerRef} className="chart-root" />;
};

export default CandlesChart;
