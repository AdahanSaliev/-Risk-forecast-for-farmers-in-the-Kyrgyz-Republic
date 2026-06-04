export type RiskLevel = 'Высокий' | 'Средний' | 'Низкий';

export interface AgroData {
  region_id: number;
  crop_id: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  wind_speed: number;
}

export interface RiskResult {
  level: RiskLevel;
  type: string;
  recommendation: string;
  color: 'red' | 'yellow' | 'green';
}

export interface Region {
  id: number;
  name: string;
  code: string;
}

export interface Crop {
  id: number;
  name: string;
  category: string;
}

export interface HistoryEntry {
  id: string;
  prediction_date: string;
  region_name: string;
  crop_name: string;
  level: RiskLevel;
  type: string;
  color: 'red' | 'yellow' | 'green';
  recommendation: string;
}
