
import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, ISeriesApi } from 'lightweight-charts';

interface MarketChartProps {
  marketName: string;
}

const MarketChart: React.FC<MarketChartProps> = ({ marketName }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: 'rgba(30, 41, 59, 0.5)' },
        horzLines: { color: 'rgba(30, 41, 59, 0.5)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderVisible: false,
      },
      rightPriceScale: {
        borderVisible: false,
      },
      handleScroll: false,
      handleScale: false,
    });

    const areaSeries = chart.addAreaSeries({
      lineColor: '#6366f1',
      topColor: 'rgba(99, 102, 241, 0.3)',
      bottomColor: 'rgba(99, 102, 241, 0.0)',
      lineWidth: 2,
    });

    // Generate initial data
    let time = Math.floor(Date.now() / 1000) - 100 * 60;
    let value = 100;
    const data = [];
    for (let i = 0; i < 100; i++) {
      value = value + (Math.random() - 0.5) * 2;
      data.push({ time: time as any, value });
      time += 60;
    }
    areaSeries.setData(data);

    seriesRef.current = areaSeries;
    chartRef.current = chart;

    const interval = setInterval(() => {
      if (seriesRef.current) {
        const lastData = data[data.length - 1];
        const nextTime = (Math.floor(Date.now() / 1000)) as any;
        const nextValue = value + (Math.random() - 0.5) * 1.5;
        seriesRef.current.update({ time: nextTime, value: nextValue });
        value = nextValue;
      }
    }, 2000);

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  return (
    <div className="glass rounded-3xl p-6 border border-indigo-500/10 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            লাইভ মার্কেট গ্রাফ ({marketName || 'Global Feed'})
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">Real-time Node: NYC-SERVER-04</p>
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-0.5 bg-indigo-500/10 rounded text-[9px] font-bold text-indigo-400 border border-indigo-500/20">M1 LIVE</span>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
};

export default MarketChart;
