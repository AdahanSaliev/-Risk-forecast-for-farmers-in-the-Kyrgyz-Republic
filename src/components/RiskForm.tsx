import React, { useState } from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import { AgroData } from '../types';

interface RiskFormProps {
  onSubmit: (data: AgroData) => void;
}

export const RiskForm: React.FC<RiskFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<AgroData>({
    region: '',
    temperature: 20,
    humidity: 50,
    rainfall: 10,
    windSpeed: 5,
    cropType: 'Пшеница'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col h-full">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
        <FileText className="w-5 h-5 text-slate-800" />
        Ввод параметров
      </h2>
      
      <div className="space-y-4 flex-1">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex">Регион</label>
          <select 
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full bg-slate-100 border-none rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none appearance-none"
          >
            <option value="">Выберите регион</option>
            <option value="Чуйская область">Чуйская область</option>
            <option value="Ошская область">Ошская область</option>
            <option value="Иссык-Кульская область">Иссык-Кульская область</option>
            <option value="Нарынская область">Нарынская область</option>
            <option value="Таласская область">Таласская область</option>
            <option value="Баткенская область">Баткенская область</option>
            <option value="Джалал-Абадская область">Джалал-Абадская область</option>
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex">Температура (°C)</label>
            <input 
              type="number" 
              name="temperature" 
              required
              value={formData.temperature}
              onChange={handleChange}
              className="w-full bg-slate-100 border-none rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex">Влажность (%)</label>
            <input 
              type="number" 
              name="humidity" 
              min="0" max="100"
              required
              value={formData.humidity}
              onChange={handleChange}
              className="w-full bg-slate-100 border-none rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex">Осадки (мм)</label>
            <input 
              type="number" 
              name="rainfall" 
              min="0"
              required
              value={formData.rainfall}
              onChange={handleChange}
              className="w-full bg-slate-100 border-none rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex">Ветер (м/с)</label>
            <input 
              type="number" 
              name="windSpeed" 
              min="0"
              required
              value={formData.windSpeed}
              onChange={handleChange}
              className="w-full bg-slate-100 border-none rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex">Тип культуры</label>
          <select 
            name="cropType" 
            value={formData.cropType}
            onChange={handleChange}
            className="w-full bg-slate-100 border-none rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none appearance-none"
          >
            <option value="Пшеница">Пшеница</option>
            <option value="Кукуруза">Кукуруза</option>
            <option value="Ячмень">Ячмень</option>
            <option value="Картофель">Картофель</option>
            <option value="Подсолнечник">Подсолнечник</option>
          </select>
        </div>
      </div>

      <button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-200 transition-colors flex justify-center items-center gap-2 mt-6 text-lg"
      >
        Рассчитать риск
        <ArrowRight className="w-6 h-6" />
      </button>
    </form>
  );
};
