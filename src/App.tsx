import { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';
import { RiskForm } from './components/RiskForm';
import { RiskResultCard } from './components/RiskResultCard';
import { HistoryTable } from './components/HistoryTable';
import { RiskChart } from './components/RiskChart';
import { calculateRisk } from './lib/riskCalculator';
import { AgroData, RiskResult, HistoryEntry } from './types';
import initialData from './data.json';

export default function App() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentResult, setCurrentResult] = useState<RiskResult | null>(null);

  useEffect(() => {
    // Load from LocalStorage
    const saved = localStorage.getItem('agroRiskHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    } else {
      // Use initial demo data from data.json
      const demoData = initialData as HistoryEntry[];
      setHistory(demoData);
      localStorage.setItem('agroRiskHistory', JSON.stringify(demoData));
    }
  }, []);

  const handleCalculate = (data: AgroData) => {
    const risk = calculateRisk(data);
    setCurrentResult(risk);

    const newEntry: HistoryEntry = {
      ...data,
      ...risk,
      id: crypto.randomUUID(),
      date: new Date().toISOString()
    };

    const newHistory = [newEntry, ...history];
    setHistory(newHistory);
    localStorage.setItem('agroRiskHistory', JSON.stringify(newHistory));
  };

  const handleClearHistory = () => {
    if (window.confirm('Вы уверены, что хотите очистить историю?')) {
      setHistory([]);
      localStorage.removeItem('agroRiskHistory');
      setCurrentResult(null);
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
