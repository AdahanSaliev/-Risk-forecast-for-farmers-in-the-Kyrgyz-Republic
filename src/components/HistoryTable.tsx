import React from 'react';
import { HistoryEntry } from '../types';
import { History, Download } from 'lucide-react';

interface HistoryTableProps {
  history: HistoryEntry[];
  onClear: () => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ history, onClear }) => {
  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getRiskColor = (color: string) => {
    switch (color) {
      case 'red': return 'text-red-500';
      case 'yellow': return 'text-yellow-500';
      case 'green': return 'text-green-500';
      default: return 'text-slate-500';
    }
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;

    const headers = ['Дата', 'Время', 'Регион', 'Культура', 'Уровень риска', 'Тип риска'];
    const rows = history.map(entry => [
      new Date(entry.prediction_date).toLocaleDateString(),
      new Date(entry.prediction_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      entry.region_name,
      entry.crop_name,
      entry.level,
      entry.type
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `agrorisk-history-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
          <History className="w-5 h-5 text-slate-800" />
          История
        </h3>
        {history.length > 0 && (
          <button 
            onClick={handleExportCSV}
            className="text-slate-400 hover:text-green-600 transition-colors p-1"
            title="Экспорт в CSV"
            aria-label="Экспорт в CSV"
          >
            <Download className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="space-y-3 overflow-y-auto flex-1 pb-2">
        {history.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            Нет записей
          </div>
        ) : (
          history.sort((a,b) => new Date(b.prediction_date).getTime() - new Date(a.prediction_date).getTime()).map(entry => (
            <div key={entry.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">{entry.region_name}</span>
                <span className="text-xs text-slate-400">{entry.crop_name} • {formatTime(entry.prediction_date)}</span>
              </div>
              <span className={`text-xs font-bold uppercase text-right leading-tight ${getRiskColor(entry.color)}`}>
                {entry.type ? entry.type.split(' ')[0] : entry.level}
              </span>
            </div>
          ))
        )}
      </div>

      {history.length > 0 && (
        <button 
          onClick={onClear}
          className="mt-4 text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest w-full py-3 border-t border-slate-100 transition-colors"
        >
          Очистить историю
        </button>
      )}
    </div>
  );
};
