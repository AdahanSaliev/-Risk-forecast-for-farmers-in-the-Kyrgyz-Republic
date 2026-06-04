import { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';
import { RiskForm } from './components/RiskForm';
import { RiskResultCard } from './components/RiskResultCard';
import { HistoryTable } from './components/HistoryTable';
import { RiskChart } from './components/RiskChart';
import { AgroData, RiskResult, HistoryEntry } from './types';

export default function App() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentResult, setCurrentResult] = useState<RiskResult | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const handleCalculate = async (data: AgroData) => {
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        setCurrentResult(result);
        fetchHistory(); // Refresh history table
      }
    } catch (err) {
      console.error('Failed to calculate risk', err);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Вы уверены, что хотите очистить историю?')) {
      try {
        const res = await fetch('/api/history', { method: 'DELETE' });
        if (res.ok) {
          setHistory([]);
          setCurrentResult(null);
        }
      } catch (err) {
        console.error('Failed to clear history', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 text-slate-800 font-sans border-t-4 border-green-600 flex flex-col h-screen">
      <div className="max-w-[1400px] w-full mx-auto flex flex-col flex-1 h-full">
        {/* Header */}
        <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Leaf className="w-8 h-8 text-green-600" />
              AGRO<span className="text-green-600">RISK</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm sm:text-base">
              Система прогнозирования сельскохозяйственных рисков v2.4
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-slate-700">Датчики активны</span>
            </div>
          </div>
        </header>

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-6 gap-6 h-full pb-6 lg:overflow-hidden lg:min-h-[600px]">
          <div className="lg:col-span-4 lg:row-span-6 flex flex-col min-h-[500px] lg:min-h-0 lg:overflow-y-auto">
            <RiskForm onSubmit={handleCalculate} />
          </div>
          
          <div className="lg:col-span-5 lg:row-span-4 flex flex-col min-h-[400px] lg:min-h-0">
            <RiskResultCard result={currentResult} />
          </div>

          <div className="lg:col-span-5 lg:row-span-2 flex flex-col min-h-[250px] lg:min-h-0">
            <RiskChart data={history} />
          </div>

          <div className="lg:col-span-3 lg:row-span-6 flex flex-col min-h-[400px] lg:min-h-0">
            <HistoryTable history={history} onClear={handleClearHistory} />
          </div>
        </main>
      </div>
    </div>
  );
}
