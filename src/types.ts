export type RiskLevel = 'Высокий' | 'Средний' | 'Низкий';

export interface AgroData {
  region: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  cropType: string;
}

export interface RiskResult {
  level: RiskLevel;
  type: string;
  recommendation: string;
  color: 'red' | 'yellow' | 'green';
}

export interface HistoryEntry extends AgroData, RiskResult {
  id: string;
  date: string;
}
