import React from 'react';
import { RiskResult } from '../types';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface RiskResultCardProps {
  result: RiskResult | null;
}

export const RiskResultCard: React.FC<RiskResultCardProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[300px]">
        <div className="mb-4 p-6 rounded-full bg-slate-50 text-slate-400 inline-block">
            <Info className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight text-balance">Ожидание данных</h3>
        <p className="text-slate-500 text-lg max-w-sm mb-8">Заполните форму параметров для получения прогноза.</p>
      </div>
    );
  }

  const { level, type, recommendation, color } = result;

  const badgeColors = {
    red: 'bg-red-50 text-red-600 border-red-100',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    green: 'bg-green-50 text-green-600 border-green-100',
  };

  const iconColors = {
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
  };

  const indicatorColors = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
  };

  const Icon = color === 'green' ? CheckCircle : AlertTriangle;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-center items-center relative overflow-hidden text-center h-full">
      <div className="absolute top-0 right-0 p-4">
        <div className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border ${badgeColors[color]}`}>
            Уровень: {level}
        </div>
      </div>
      <div className={`mb-4 p-6 rounded-full inline-block ${iconColors[color]}`}>
        <Icon className="w-12 h-12" />
      </div>
      <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight text-balance">{type}</h3>
      <p className="text-slate-500 text-lg max-w-sm mb-8">
        {color === 'red' ? 'Обнаружено опасное сочетание условий для выбранной культуры.' : 
        (color === 'yellow' ? 'Требуется внимание к текущим погодным условиям.' : 
        'Прогноз благоприятный, продолжайте уход.')}
      </p>
      
      <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 text-left mt-auto">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Рекомендации</h4>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-slate-700">
            <span className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${indicatorColors[color]}`}></span>
            <span>{recommendation}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
