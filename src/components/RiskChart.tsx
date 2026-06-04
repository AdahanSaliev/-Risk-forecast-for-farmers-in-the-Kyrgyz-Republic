import React from 'react';
import { HistoryEntry } from '../types';

interface RiskChartProps {
  data: HistoryEntry[];
}

const levelToScore = {
  'Низкий': 1,
  'Средний': 2,
  'Высокий': 3,
};

export const RiskChart: React.FC<RiskChartProps> = ({ data }) => {
  // Take up to 7 most recent entries and reverse to show chronological left-to-right
  const chartData = [...data]
    .sort((a, b) => new Date(b.prediction_date).getTime() - new Date(a.prediction_date).getTime())
    .slice(0, 7)
    .reverse();

  // If no data, fill with empty placeholders
  const displayData = chartData.length > 0 ? chartData : [];

  const getBarHeight = (level: string) => {
    switch (level) {
      case 'Высокий': return '85%';
      case 'Средний': return '50%';
      case 'Низкий': return '25%';
      default: return '10%';
    }
  };

  const getBarColor = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-400 border border-red-300 shadow-inner';
      case 'yellow': return 'bg-yellow-100';
      case 'green': return 'bg-green-100';
      default: return 'bg-slate-100';
    }
  };

  const formatDay = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', { weekday: 'short' });
  };

  return (
    <div className="w-full h-full bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col">
      <h3 className="text-lg font-bold mb-4 text-slate-900">Динамика рисков (посл. записи)</h3>
      
      {displayData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
          Нет данных
        </div>
      ) : (
        <div className="flex-1 w-full flex items-end justify-between gap-2 pb-6 px-1 mt-auto">
          {displayData.map((item, index) => (
            <div 
              key={item.id} 
              className={`w-full rounded-t-lg relative transition-all duration-500 ease-out ${getBarColor(item.color)}`} 
              style={{ height: getBarHeight(item.level), minHeight: '15%' }}
            >
              <div 
                className={`absolute -bottom-6 left-0 right-0 text-center text-[10px] ${
                  index === displayData.length - 1 ? 'text-slate-900 font-bold' : 'text-slate-400'
                }`}
              >
                {formatDay(item.prediction_date)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
